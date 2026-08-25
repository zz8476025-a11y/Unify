import { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Laptop as LaptopIcon, 
  Tv as MonitorIcon, 
  Smartphone as PhoneIcon, 
  Play, 
  RotateCcw, 
  Eye, 
  Zap, 
  Shield, 
  Compass, 
  Cpu 
} from 'lucide-react';
import { DeviceLayout, GameGenre, GraphicsQuality } from '../types';

interface GamePreviewProps {
  selectedGenre: GameGenre;
  quality: GraphicsQuality;
  isGeneratingNow: boolean;
  onManualGenerate: () => void;
  promptText: string;
}

export default function GamePreview({ 
  selectedGenre, 
  quality, 
  isGeneratingNow, 
  onManualGenerate,
  promptText 
}: GamePreviewProps) {
  const [deviceLayout, setDeviceLayout] = useState<DeviceLayout>('Laptop');
  
  // Game state held mostly in refs for 60fps canvas performance
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(120);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraShowFrustum, setCameraShowFrustum] = useState(true);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  
  // Controls overlay trigger for Android
  const steerLeft = () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event);
    setTimeout(() => {
      const release = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
      window.dispatchEvent(release);
    }, 150);
  };

  const steerRight = () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(event);
    setTimeout(() => {
      const release = new KeyboardEvent('keyup', { key: 'ArrowRight' });
      window.dispatchEvent(release);
    }, 150);
  };

  // Genre parameters constant
  const genreSettings = useMemo(() => {
    const config: Record<GameGenre, {
      skyColor: string;
      gridColor: string;
      playerColor: string;
      obstacleColor: string;
      crystalColor: string;
      bgStyle: string;
      vehicleName: string;
      metric: string;
    }> = {
      Arcade: {
        skyColor: '#0a051d',
        gridColor: '#d946ef', // Neon Purple
        playerColor: '#38bdf8', // Light Blue
        obstacleColor: '#f43f5e', // Hot Pink
        crystalColor: '#a78bfa', // Purple Aura
        bgStyle: 'from-pink-900/40 to-purple-950/40',
        vehicleName: 'LIGHTRUNNER-86',
        metric: 'GRID-FLUX',
      },
      Racing: {
        skyColor: '#020617',
        gridColor: '#06b6d4', // Neon Cyan
        playerColor: '#fbbf24', // Yellow Gold
        obstacleColor: '#ef4444', // Red Alert
        crystalColor: '#34d399', // Emerald Green
        bgStyle: 'from-cyan-950/40 to-slate-950/40',
        vehicleName: 'T-NEXUS COUPE',
        metric: 'NPH',
      },
      Action: {
        skyColor: '#090504',
        gridColor: '#ef4444', // Neon Red
        playerColor: '#10b981', // Emerald Laser
        obstacleColor: '#f97316', // Orange Flame
        crystalColor: '#06b6d4', // Ice Cyan
        bgStyle: 'from-red-950/40 to-neutral-950/40',
        vehicleName: 'C-HAZARD TANK',
        metric: 'WARP-FACTOR',
      },
      Thriller: {
        skyColor: '#050a0a',
        gridColor: '#10b981', // Eerie Neon Green
        playerColor: '#a855f7', // Mystic Violet
        obstacleColor: '#020617', // Darkness Core
        crystalColor: '#f43f5e', // Blood Serum
        bgStyle: 'from-emerald-950/30 to-zinc-950/40',
        vehicleName: 'GRAV-CYCLE REAPER',
        metric: 'RPM CORE',
      }
    };
    return config;
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'a', 'd', 'w', 's'].includes(e.key)) {
        // Prevent default browser scrolling when within preview context
        e.preventDefault();
      }
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Animation Loop setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localScore = 0;
    
    // Player values
    let playerX = 0; // -1 to 1 steering range
    let playerY = 0; // elevation/bounce
    let rollAngle = 0; // steering visual tilt
    let cameraYOffset = 50; // Follow distance dynamics
    let cameraZOffset = -120;
    
    // Generated Game Objects
    interface Ob {
      x: number; // -1.2 to 1.2 lane coordinates
      z: number; // distance 0 (horizon) to 500 (viewport front)
      type: 'obstacle' | 'crystal';
      color: string;
      size: number;
      width: number;
      collected: boolean;
    }

    let obstacles: Ob[] = [];
    const maxObstacles = 7;
    
    // Grid animation offset
    let gridOffset = 0;

    // Build initial obstacles
    const resetObstacles = () => {
      obstacles = [];
      for (let i = 0; i < maxObstacles; i++) {
        obstacles.push({
          x: (Math.random() * 2.2 - 1.1),
          z: 100 + (i * 120) + Math.random() * 60,
          type: Math.random() > 0.4 ? 'obstacle' : 'crystal',
          color: '',
          size: 15,
          width: 25,
          collected: false
        });
      }
    };
    resetObstacles();

    // Reset when genre changes
    localScore = 0;
    setScore(0);
    const activeSetting = genreSettings[selectedGenre];

    const render = () => {
      // Background and context sizing
      const width = canvas.width = canvas.parentElement?.clientWidth || 600;
      const height = canvas.height = canvas.parentElement?.clientHeight || 360;

      // Quality rendering presets
      const pixelRatio = quality === '4K' ? 1.5 : 1.0;
      if (quality === '4K') {
        canvas.style.filter = 'contrast(1.05) saturate(1.1)';
      } else {
        canvas.style.filter = 'none';
      }

      // 1. Draw Space background gradient
      const bgGrad = ctx.createLinearGradient(width/2, 0, width/2, height);
      bgGrad.addColorStop(0, activeSetting.skyColor);
      bgGrad.addColorStop(0.6, '#040209');
      bgGrad.addColorStop(1, '#0e0b16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render cosmic horizon distant stars
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      for (let i = 0; i < 30; i++) {
        const starX = (Math.sin(i * 148.2) * 0.5 + 0.5) * width;
        const starY = (Math.cos(i * 72.1) * 0.5 + 0.5) * (height * 0.45);
        ctx.fillRect(starX, starY, (i % 3 === 0) ? 2 : 1, (i % 3 === 0) ? 2 : 1);
      }

      // Draw futuristic neon horizon aura
      const horiGrad = ctx.createRadialGradient(width/2, height * 0.45, 10, width/2, height * 0.45, width/2);
      horiGrad.addColorStop(0, activeSetting.gridColor + '30');
      horiGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = horiGrad;
      ctx.beginPath();
      ctx.arc(width/2, height * 0.45, width/2, 0, Math.PI, true);
      ctx.fill();

      // Draw massive sun or futuristic city silhouette
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#06040d';
      ctx.beginPath();
      // Neon towers
      ctx.fillRect(width * 0.1, height * 0.35, 12, height * 0.1);
      ctx.fillRect(width * 0.15, height * 0.32, 20, height * 0.13);
      ctx.fillRect(width * 0.22, height * 0.38, 15, height * 0.07);
      ctx.fillRect(width * 0.75, height * 0.33, 24, height * 0.12);
      ctx.fillRect(width * 0.82, height * 0.36, 14, height * 0.09);
      
      // Giant neon grid wireframe sun in arcade mode
      if (selectedGenre === 'Arcade') {
        ctx.strokeStyle = activeSetting.gridColor + '25';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(width/2, height * 0.45, 60, Math.PI, 0, false);
        ctx.stroke();
        for (let sunLine = 1; sunLine < 6; sunLine++) {
          const sunY = height * 0.45 - (sunLine * 10);
          ctx.beginPath();
          ctx.moveTo(width/2 - 58, sunY);
          ctx.lineTo(width/2 + 58, sunY);
          ctx.stroke();
        }
      }

      // 2. Draw Simulated 3D Plane Grid Perspective
      const horizonY = height * 0.45;
      const fov = 160;
      const roadWidth = width * 1.4;

      // Handle Inputs & Steering with smooth damping
      if (keys['arrowleft'] || keys['a']) {
        playerX -= 0.045;
        rollAngle = Math.max(-0.25, rollAngle - 0.05);
      } else if (keys['arrowright'] || keys['d']) {
        playerX += 0.045;
        rollAngle = Math.min(0.25, rollAngle + 0.05);
      } else {
        // Return to center
        playerX *= 0.94;
        rollAngle *= 0.88;
      }

      // Clamp player within road limits
      playerX = Math.max(-1.1, Math.min(1.1, playerX));

      // Simulate movement speed and score accumulation
      if (isPlaying && !isGeneratingNow) {
        gridOffset = (gridOffset + 7.5) % 40;
        localScore += 1;
        
        // Randomly wobble player slightly to simulate futuristic turbulence/hovering displacement
        playerY = Math.sin(Date.now() / 150) * 1.5;
      }

      // 3D Grid drawing
      // Draw horizontal distance lines converging at the horizon
      ctx.lineWidth = 1.5;
      const gridCount = 14;
      for (let i = 0; i < gridCount; i++) {
        // Logarithmic spacing to look 3D perspective
        const norm = i / gridCount;
        const perspectiveZ = Math.pow(norm, 2.5); // non-linear distribution
        const lineY = horizonY + (height - horizonY) * perspectiveZ;
        
        ctx.strokeStyle = activeSetting.gridColor + Math.floor((perspectiveZ * 0.7 + 0.05) * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }

      // Draw perspective vanishing rays
      const perspectiveLines = 18;
      for (let i = 0; i <= perspectiveLines; i++) {
        const xOffset = (i / perspectiveLines - 0.5) * 2; // -1 to 1
        const xStart = width / 2 + xOffset * 10; // converge near center at horizon
        const xEnd = width / 2 + xOffset * roadWidth - (playerX * 180 * (1 - Math.abs(xOffset/3))); // steer moves the road perspective
        
        ctx.strokeStyle = activeSetting.gridColor + '20';
        ctx.beginPath();
        ctx.moveTo(xStart, horizonY);
        ctx.lineTo(xEnd, height);
        ctx.stroke();

        // Highlight main left/right road borders with stronger neon glow
        if (i === 4 || i === perspectiveLines - 4) {
          ctx.strokeStyle = activeSetting.gridColor + '90';
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = height > 300 ? 6 : 0;
          ctx.shadowColor = activeSetting.gridColor;
          ctx.beginPath();
          ctx.moveTo(xStart, horizonY);
          ctx.lineTo(xEnd, height);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // 3. Render Simulated 3D Game Obstacles and Crystals
      obstacles.forEach((ob, idx) => {
        if (isPlaying && !isGeneratingNow) {
          ob.z -= (5 + selectedGenre.length * 0.5); // move toward camera
        }

        // Generate color if unspecified
        if (!ob.color) {
          ob.color = ob.type === 'obstacle' ? activeSetting.obstacleColor : activeSetting.crystalColor;
        }

        // Wrap around horizon if passed viewport bottom
        if (ob.z < 10) {
          ob.z = 500 + Math.random() * 80;
          ob.x = (Math.random() * 2.2 - 1.1);
          ob.collected = false;
        }

        // Projection mapping calculations relative to vanishing point
        const zNorm = 180 / Math.max(10, ob.z); // Perspective projection ratio
        const relativeX = ob.x - (playerX * 1.2); // steering shifts items relative to us
        const obX = width / 2 + (relativeX * roadWidth * zNorm);
        const obY = horizonY + ((height - horizonY) * zNorm * 0.8) + (zNorm * 10);
        const scaledWidth = ob.width * zNorm * 2.5;
        const scaledHeight = ob.size * zNorm * 3.5;

        // Draw only if it is ahead of camera and inside sensible screen bounds
        if (ob.z > 0 && obY > horizonY && obX > -100 && obX < width + 100) {
          if (!ob.collected) {
            ctx.shadowBlur = zNorm > 0.4 ? 12 : 0;
            ctx.shadowColor = ob.color;

            if (ob.type === 'obstacle') {
              // Draw an futuristic glowing voxel obstacle/laser gate
              ctx.fillStyle = ob.color + '40';
              ctx.strokeStyle = ob.color;
              ctx.lineWidth = Math.max(1, 3 * zNorm);
              ctx.beginPath();
              // Box foundation
              ctx.rect(obX - scaledWidth/2, obY - scaledHeight, scaledWidth, scaledHeight);
              ctx.fill();
              ctx.stroke();

              // Laser line indicator
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(obX - scaledWidth / 4, obY - scaledHeight * 0.8, scaledWidth / 2, 2);

            } else {
              // Draw a brilliant spinning hovering core crystal (rhombus)
              const pulse = Math.sin(Date.now() / 80 + idx * 4.2) * 2;
              const crystalH = scaledHeight * 0.7 + pulse;
              ctx.fillStyle = ob.color + 'aa';
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(obX, obY - crystalH); // Top
              ctx.lineTo(obX + scaledWidth * 0.4, obY - crystalH * 0.5); // Right
              ctx.lineTo(obX, obY); // Bottom
              ctx.lineTo(obX - scaledWidth * 0.4, obY - crystalH * 0.5); // Left
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
            ctx.shadowBlur = 0;

            // Simple collision check when dynamic objects approach closest third-person coordinate (z ≈ 30-45)
            if (ob.z > 30 && ob.z < 52) {
              const distanceX = Math.abs(ob.x - playerX);
              if (distanceX < 0.22) {
                if (ob.type === 'crystal') {
                  ob.collected = true;
                  localScore += 500;
                  setScore(s => s + 500);
                  // Glow flash indicator on score hud
                } else {
                  // Hit obstacle! Bounce player and dock points
                  localScore = Math.max(0, localScore - 80);
                  playerX += (playerX > ob.x ? 0.35 : -0.35); // push away
                  ob.collected = true; // prevent repeated triggers
                }
              }
            }
          }
        }
      });

      // 4. Render the Player Vehicle in Third Person
      // Render coordinate values: located in center-bottom, slightly hovering
      const pX = width / 2;
      const pY = height - 45 + playerY;
      const pSize = 34;

      ctx.save();
      // Apply kinetic roll rotation to match dynamic steering trajectory
      ctx.translate(pX, pY);
      ctx.rotate(rollAngle);

      // Add intense rocket exhaust trail glow emanating from behind the cyber yacht
      const trailGlow = ctx.createLinearGradient(0, 0, 0, 35);
      trailGlow.addColorStop(0, '#ffffff');
      trailGlow.addColorStop(0.35, '#38bdf8');
      trailGlow.addColorStop(0.8, activeSetting.gridColor + '50');
      trailGlow.addColorStop(1, 'transparent');
      
      ctx.fillStyle = trailGlow;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(-7, 3);
      ctx.lineTo(7, 3);
      ctx.lineTo(12, 38 + Math.abs(playerY) * 2);
      ctx.lineTo(0, 16);
      ctx.lineTo(-12, 38 + Math.abs(playerY) * 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Main Chassis (Cyberpunk Jet / Hover Car)
      ctx.shadowBlur = 10;
      ctx.shadowColor = activeSetting.playerColor;
      
      // Secondary wings
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = activeSetting.playerColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-25, 10);
      ctx.lineTo(-12, -2);
      ctx.lineTo(12, -2);
      ctx.lineTo(25, 10);
      ctx.lineTo(0, 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Core Fuselage
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-10, 8);
      ctx.lineTo(-8, -14);
      ctx.lineTo(0, -22); // pointed cockpit
      ctx.lineTo(8, -14);
      ctx.lineTo(10, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing Cockpit Dome
      const canopyGrad = ctx.createLinearGradient(0, -14, 0, -2);
      canopyGrad.addColorStop(0, '#ffffff');
      canopyGrad.addColorStop(1, activeSetting.playerColor);
      ctx.fillStyle = canopyGrad;
      ctx.beginPath();
      ctx.moveTo(-5, -6);
      ctx.lineTo(0, -17);
      ctx.lineTo(5, -6);
      ctx.closePath();
      ctx.fill();

      // Dual side neon thrusters / stabilization vector fins
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-14, 2); ctx.lineTo(-18, -4);
      ctx.moveTo(14, 2); ctx.lineTo(18, -4);
      ctx.stroke();

      ctx.restore();
      ctx.shadowBlur = 0;

      // 5. INTENTIONAL MECHANIC VISUAL: Draw the Interactive "Third-Person Follow Camera Frustum" Indicator!
      // This displays explicitly how the camera coordinates project from behind of the player model
      if (cameraShowFrustum) {
        ctx.save();
        ctx.strokeStyle = '#22c55e'; // Bright active green indicator
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);

        // Draw camera position icon symbol strictly behind the player
        const camAnchorX = width / 2;
        const camAnchorY = height - 5;
        
        // Draw dotted sight rays shooting from camera node to the player vehicle and horizon limits
        ctx.beginPath();
        // Camera source point
        ctx.arc(camAnchorX, camAnchorY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();

        // Right bounding frustum line
        ctx.moveTo(camAnchorX, camAnchorY);
        ctx.lineTo(width / 2 + 120 + (playerX * 30), horizonY + 30);
        // Left bounding frustum line
        ctx.moveTo(camAnchorX, camAnchorY);
        ctx.lineTo(width / 2 - 120 + (playerX * 30), horizonY + 30);
        
        ctx.stroke();

        // Label annotation
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#22c55e';
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        
        const labelBoxW = 210;
        const labelBoxH = 20;
        const labelX = width / 2 - labelBoxW / 2;
        const labelY = pY + 28;

        ctx.fillRect(labelX, labelY, labelBoxW, labelBoxH);
        ctx.strokeRect(labelX, labelY, labelBoxW, labelBoxH);

        ctx.font = 'bold 9px "JetBrains Mono", Courier, monospace';
        ctx.fillStyle = '#4ade80';
        ctx.textAlign = 'center';
        ctx.fillText("CAM_LOCK: THIRD-PERSON FOLLOW VECTOR", width / 2, labelY + 13);

        ctx.restore();
      }

      // 6. Draw HUD overlays inside the simulator
      ctx.font = '9px "JetBrains Mono", Courier, monospace';
      ctx.textAlign = 'left';

      // Live metrics readout
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText(`ENGINE: AI_GEN_ALPHA_4`, 12, 18);
      ctx.fillText(`API REND: EX_STREAM_v2`, 12, 28);
      ctx.fillText(`SYS DETECT: ${deviceLayout.toUpperCase()}_VIEW`, 12, 38);

      ctx.fillStyle = activeSetting.gridColor;
      ctx.fillText(`QUALITY TARGET: ${quality} MODE`, 12, 54);

      // Top Right - Camera Coordinates panel
      ctx.textAlign = 'right';
      ctx.fillStyle = '#4ade80';
      ctx.fillText(`CAM_Y: [${(cameraYOffset + playerY).toFixed(1)}m]`, width - 12, 18);
      ctx.fillText(`CAM_Z: [${(cameraZOffset - Math.abs(rollAngle) * 20).toFixed(1)}m]`, width - 12, 28);
      ctx.fillText(`CAM_LERP: [0.085 DAMP]`, width - 12, 38);

      // Interactive score board
      ctx.font = '11px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`SCORE: ${score + Math.floor(localScore/10)} PTS`, width - 12, 58);

      // Realtime speed readout on dynamic telemetry
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = activeSetting.playerColor;
      ctx.fillText(`VELOCITY: ${Math.floor(speed + rollAngle * 40)} ${activeSetting.metric}`, width - 12, 74);

      // Playback Pause sign
      if (!isPlaying) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = 'bold 16px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText("SIMULATION PAUSED", width/2, height/2);
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = activeSetting.gridColor;
        ctx.fillText("Click play state to resume mechanics tracking", width/2, height/2 + 20);
      }

      // 7. Simulated Diagnostic Overlay if "Generating"
      if (isGeneratingNow) {
        ctx.fillStyle = 'rgba(5, 4, 15, 0.95)';
        ctx.fillRect(0, 0, width, height);

        const activeLineCount = Math.floor(Date.now() / 350) % 5;
        const generatorLogs = [
          `>> CLONING DIRECT DECK FOR Genre: ${selectedGenre.toUpperCase()}`,
          `>> RESOLVING GEOMETRY BUFFER FOR ${activeSetting.vehicleName}`,
          `>> CO-ALIGNING COMPASS TO THIRD-PERSON SIGHT AXIS`,
          `>> RE-STRICTING PERSPECTIVE MAP FOR ${quality} SHADERS`,
          `>> BOOTSTRAPPING NEON GRAPHICS INTERPOLATOR...`
        ];

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("AI GAME GENERATOR ACTIVE", width / 2, height / 2 - 45);

        // Rotating ring glow
        ctx.save();
        ctx.translate(width / 2, height / 2 - 15);
        ctx.rotate(Date.now() / 200);
        ctx.strokeStyle = activeSetting.gridColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.restore();

        // Output lines
        ctx.font = '10px "JetBrains Mono", Courier, monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#a78bfa';
        
        const logStartY = height / 2 + 18;
        for (let idx = 0; idx <= activeLineCount; idx++) {
          ctx.fillText(generatorLogs[idx], width * 0.1, logStartY + (idx * 16));
        }

        ctx.font = 'bold 9px "JetBrains Mono", Courier, monospace';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.fillText("CAMERA RE-ORIENTED AT [Z: -120, ROT: 180°]", width / 2, height - 15);
      }

      // Continue frame request
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedGenre, quality, isPlaying, isGeneratingNow, cameraShowFrustum, deviceLayout, genreSettings]);

  // Clean prompt label for mockup reference display
  const cleanPrompt = promptText.length > 55 ? promptText.slice(0, 52) + '...' : promptText;

  return (
    <div id="game-preview-section" className="w-full flex flex-col items-center py-4">
      
      {/* Visual Mode Selector Pills */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-4xl gap-4 bg-slate-900/60 p-3 rounded-2xl border border-violet-900/40 backdrop-blur-md mb-6">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-violet-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-300 font-medium">PREVIEW VIEWPORT ENVIRONMENT:</span>
        </div>
        
        {/* Responsive layout toggle buttons */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button 
            id="layout-btn-android"
            onClick={() => setDeviceLayout('Android')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 ${deviceLayout === 'Android' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
            title="Switch state to Mobile Layout"
          >
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>Android (Mobile)</span>
          </button>
          
          <button 
            id="layout-btn-laptop"
            onClick={() => setDeviceLayout('Laptop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 ${deviceLayout === 'Laptop' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
            title="Switch state to Laptop Viewport"
          >
            <LaptopIcon className="w-3.5 h-3.5" />
            <span>Laptop Screen</span>
          </button>
          
          <button 
            id="layout-btn-windows"
            onClick={() => setDeviceLayout('Windows')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 ${deviceLayout === 'Windows' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
            title="Switch state to Windows Desktop Screen"
          >
            <MonitorIcon className="w-3.5 h-3.5" />
            <span>Windows Desktop</span>
          </button>
        </div>

        {/* Diagnostic Toggle Options */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCameraShowFrustum(!cameraShowFrustum)}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono transition-all border ${cameraShowFrustum ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
          >
            Frustum Radar: {cameraShowFrustum ? 'ON' : 'OFF'}
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-850 hover:text-white transition-all"
            title={isPlaying ? "Pause simulated loop" : "Play simulated loop"}
          >
            {isPlaying ? (
              <span className="block w-2.5 h-2.5 bg-yellow-500 rounded-sm"></span>
            ) : (
              <Play className="w-2.5 h-2.5 text-emerald-400 fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* Main Container rendering based on DeviceLayout */}
      <div className="w-full flex justify-center items-center py-4 h-[440px] px-2">
        {deviceLayout === 'Android' && (
          <div className="bg-slate-900 border-[8px] border-slate-800 rounded-[38px] w-[260px] h-[430px] flex flex-col overflow-hidden relative shadow-2xl shadow-indigo-950/40 border-glow-purple">
            {/* Speaker & notch */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-b-xl z-20 flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
            </div>
            
            {/* Screen Inner Viewport */}
            <div className="flex-1 w-full bg-slate-950 relative flex flex-col pt-5">
              <canvas ref={canvasRef} className="absolute inset-x-0 bottom-0 top-6 block w-full h-[calc(100%-110px)]" />

              {/* Simulated Mobile Status bar */}
              <div className="h-4 absolute top-1 inset-x-0 flex justify-between items-center px-4 font-mono text-[8px] text-slate-400 z-10 bg-gradient-to-b from-slate-950 to-transparent">
                <span>08:42</span>
                <span className="text-[7px] text-emerald-400 bg-emerald-950/60 px-1 rounded-sm border border-emerald-500/20 font-bold">5G READY</span>
                <div className="flex items-center gap-1">
                  <span>88%</span>
                </div>
              </div>

              {/* HUD Target Badge inside phone */}
              <div className="absolute top-7 left-3 bg-indigo-950/85 backdrop-blur-md px-2 py-0.5 rounded border border-indigo-400/30 text-[8px] text-slate-200 uppercase font-mono tracking-wider z-10">
                AI ACTIVE TARGET: {selectedGenre}
              </div>

              {/* On-Screen Mobile Controller D-Pad targeting simple 44px minimum touch sizes */}
              <div className="absolute bottom-1 inset-x-0 h-24 bg-slate-950/90 border-t border-slate-800/80 p-2 flex items-center justify-between z-10 backdrop-blur-sm">
                <button 
                  onTouchStart={steerLeft}
                  onClick={steerLeft}
                  className="w-14 h-14 bg-slate-900 active:bg-indigo-600 rounded-full flex items-center justify-center text-slate-100 border border-slate-800 shadow-md touch-none select-none hover:text-white"
                  aria-label="Steer Left"
                  id="mobile-steer-left"
                >
                  ◀
                </button>

                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[7px] font-mono text-slate-400 select-none">TACO CONTROLS</span>
                  <span className="text-[8px] font-mono font-bold text-indigo-400 animate-pulse select-none">3P CAMERA</span>
                  <div className="flex items-center gap-0.5 mt-1 bg-indigo-950/50 px-1 rounded border border-indigo-500/20 text-[6px] text-slate-400">
                    <Compass className="w-2 h-2 text-indigo-400" />
                    <span>FOLLOW LOCK</span>
                  </div>
                </div>

                <button 
                  onTouchStart={steerRight}
                  onClick={steerRight}
                  className="w-14 h-14 bg-slate-900 active:bg-indigo-600 rounded-full flex items-center justify-center text-slate-100 border border-slate-800 shadow-md touch-none select-none hover:text-white"
                  aria-label="Steer Right"
                  id="mobile-steer-right"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        )}

        {deviceLayout === 'Laptop' && (
          <div className="w-full max-w-2xl flex flex-col items-center scale-95 sm:scale-100 transition-all">
            {/* Bezel frame of laptop */}
            <div className="bg-slate-900 border-[10px] border-slate-800 rounded-t-2xl w-full h-[320px] relative overflow-hidden shadow-2xl flex flex-col border-glow-blue">
              
              {/* Camera Notch at top center */}
              <div className="absolute top-0 inset-x-0 h-3 flex justify-center z-10">
                <div className="w-16 h-2 bg-slate-800 rounded-b-md flex items-center justify-center">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
              </div>

              {/* Viewport Screen canvas */}
              <div className="flex-1 w-full bg-slate-950 relative">
                <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
                
                {/* Visual Label overlays */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <div className="bg-slate-900/90 backdrop-blur border border-indigo-400/30 px-2 py-1 rounded inline-flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
                    <span className="text-[9px] font-mono font-semibold text-slate-100">AI PROTOTYPER ACTIVE</span>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] text-slate-400 font-mono italic">
                    Prompt Input: "{cleanPrompt || 'Untitled Game Model'}"
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop lower keyboard deck deck mockup */}
            <div className="bg-slate-800 w-[105%] h-4 rounded-b-xl relative shadow-md">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-[3px] bg-slate-950 rounded-b"></div>
            </div>
          </div>
        )}

        {deviceLayout === 'Windows' && (
          <div className="flex flex-col items-center w-full max-w-2xl transition-all h-full justify-center">
            {/* Monitor Bezel Frame */}
            <div className="bg-slate-900 border-[12px] border-slate-800 rounded-xl w-full h-[310px] relative overflow-hidden shadow-2xl flex flex-col border-glow-purple">
              
              {/* Viewport canvas */}
              <div className="flex-1 w-full bg-slate-950 relative">
                <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
                
                <div className="absolute top-3 left-3 bg-purple-950/80 backdrop-blur border border-purple-400/30 px-3 py-1 rounded z-10 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span className="text-[9px] font-mono text-slate-100 font-bold uppercase tracking-wider">{selectedGenre} RUNTIME (PC RECON)</span>
                </div>
              </div>
            </div>

            {/* Monitor Stand */}
            <div className="w-16 h-10 bg-slate-700 shadow-inner"></div>
            {/* Monitor Stand Base */}
            <div className="bg-slate-800 w-44 h-2.5 rounded-t-lg"></div>
          </div>
        )}
      </div>

      {/* Under-simulator control instructions and info */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 px-2">
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/70 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] text-slate-100 font-bold font-mono">DAMPENED LERP SYSTEM</h4>
            <p className="text-[10px] text-slate-400 leading-tight">The follow vector features dynamic lag tracking, keeping action perfectly centered.</p>
          </div>
        </div>

        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/70 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] text-slate-100 font-bold font-mono">3P LOCK ALIGNMENT</h4>
            <p className="text-[10px] text-slate-400 leading-tight">Camera strictly follows the vehicle's yaw rotation to maintain real-time orientation.</p>
          </div>
        </div>

        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/70 flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 text-violet-400 rounded-lg">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-[11px] text-slate-100 font-bold font-mono">KEYBOARD TRIGGERS</h4>
            <p className="text-[10px] text-slate-[#a5b4fc] font-bold leading-tight">Press [←] / [A] or [→] / [D]</p>
            <p className="text-[9px] text-slate-400 leading-none mt-1">to steer left and right manually.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
