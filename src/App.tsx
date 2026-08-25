import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Gamepad2, 
  Download, 
  Cpu, 
  Tv, 
  Check, 
  ChevronRight, 
  Code, 
  Terminal, 
  Music, 
  Gauge, 
  Flame, 
  TrendingUp,
  Monitor,
  Smartphone,
  Info,
  Heart,
  ExternalLink,
  Search,
  Zap
} from 'lucide-react';
import { GameGenre, GraphicsQuality } from './types';
import GamePreview from './components/GamePreview';
import { GALLERY_ITEMS, GalleryItem } from './data/gallery';

export default function App() {
  // Current prompt state
  const [promptInput, setPromptInput] = useState<string>(
    "Build an HD cyberpunk racing game set in Neo-Tokyo with yellow lane markers and retro fast-moving nitro barriers."
  );

  // Active states
  const [selectedGenre, setSelectedGenre] = useState<GameGenre>('Arcade');
  const [quality, setQuality] = useState<GraphicsQuality>('HD');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genProgress, setGenProgress] = useState<number>(0);
  const [genStatus, setGenStatus] = useState<string>("");
  const [logsList, setLogsList] = useState<string[]>([]);
  
  // Custom states for downloads simulation
  const [downloadingPlatform, setDownloadingPlatform] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Showcase Gallery states
  const [gallerySearch, setGallerySearch] = useState<string>("");
  const [galleryGenreFilter, setGalleryGenreFilter] = useState<string>("All");
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [activeDetailItem, setActiveDetailItem] = useState<GalleryItem | null>(null);

  // Suggested starting prompts per genre selection
  const genrePrompts: Record<GameGenre, string> = {
    Arcade: "Build a neon 80s synthwave horizon racer with magenta lasers and a retro light-tail car moving indefinitely.",
    Racing: "Build an HD cyberpunk racing game set in Neo-Tokyo with yellow lane markers and retro fast-moving nitro barriers.",
    Action: "Construct a gritty futuristic weaponized hovertank gauntlet with glowing red energy barricades and toxic streams.",
    Thriller: "A low-gravity hazardous canyon runner in deep dark carbon caves with fluorescent green alien crystals."
  };

  const handleGenreChange = (genre: GameGenre) => {
    setSelectedGenre(genre);
    setPromptInput(genrePrompts[genre]);
  };

  // Simulated AI Game generation flow
  const triggerGeneration = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenProgress(0);
    setLogsList([]);
    
    const logs = [
      "Connecting to deep neural graphics node...",
      "Compiling 3D volumetric cloud pipelines...",
      "Injecting third-person following distance matrices (Z: -120)...",
      "Validating camera dampening parameter physics [0.085 LERP]...",
      "Allocating HD resolution textures & shaders...",
      "Synthesizing ambient synthwave tracker channels...",
      "Generating environment obstacles & collectible crystals...",
      "3D Universe successfully baked!"
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setGenProgress(prev => {
        const next = prev + 4;
        
        // Stagger log entries based on progress milestone
        const expectedLogIdx = Math.min(
          logs.length - 1, 
          Math.floor((next / 100) * logs.length)
        );
        if (expectedLogIdx !== currentLogIndex) {
          currentLogIndex = expectedLogIdx;
          setGenStatus(logs[expectedLogIdx]);
          setLogsList(old => [...old, logs[expectedLogIdx]]);
        }

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            // Smoothly scroll down to preview
            const element = document.getElementById("game-preview-section");
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
          return 100;
        }
        return next;
      });
    }, 100);
  };

  // Download trigger mockup
  const startDownloadSimulation = (platform: string) => {
    setDownloadingPlatform(platform);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingPlatform(null);
            alert(`Marth Builds 3DGame compiled client package generated! Download complete for ${platform}.`);
          }, 500);
          return 100;
        }
        return p + 10;
      });
    }, 120);
  };

  // Gallery handlers
  const handleSelectGalleryItem = (item: GalleryItem) => {
    setPromptInput(item.prompt);
    setSelectedGenre(item.genre);
    
    // Smoothly scroll back to editor
    const element = document.getElementById("editor-console");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleLikeItem = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Avoid triggering details popup
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredGalleryItems = GALLERY_ITEMS.filter(item => {
    const matchesGenre = galleryGenreFilter === 'All' || item.genre === galleryGenreFilter;
    const matchesSearch = item.title.toLowerCase().includes(gallerySearch.toLowerCase()) || 
                          item.prompt.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                          item.creator.toLowerCase().includes(gallerySearch.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans relative flex flex-col overflow-x-hidden cyber-grid antialiased selection:bg-cyan-500 selection:text-black">
      
      {/* Decorative blurred background elements from the design */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      {/* FIXED VIEWPORT COMPANION: Subtle Attribution in Bottom-Right for desktop */}
      <div className="hidden lg:block fixed bottom-4 right-4 z-50 bg-slate-950/85 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-lg text-[10px] font-mono tracking-wider text-slate-400 select-none pointer-events-none hover:border-cyan-500/30 transition-all duration-300">
        Created by <span className="text-white border-b border-cyan-500 pb-0.5">Zain Marth</span>
      </div>

      {/* HEADER NAVBAR (Extracted styling from design) */}
      <nav className="h-20 border-b border-cyan-500/20 sticky top-0 z-40 w-full flex items-center justify-between px-4 sm:px-10 bg-slate-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {/* Glowing brand launcher block */}
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <div className="w-6 h-6 border-2 border-white rotate-45"></div>
          </div>
          <div className="flex flex-col">
            {/* Website Name prominently displayed in bold, futuristic sci-fi font */}
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500 leading-none">
              Marth Builds 3DGame
            </h1>
            <span className="text-[8px] font-mono tracking-[0.25em] text-[#a78bfa] block uppercase opacity-80 mt-1 leading-none">
              AI ENGINE LABS
            </span>
          </div>
        </div>

        {/* Center menu */}
        <div className="hidden lg:flex items-center gap-6">
          <a href="#editor-console" className="text-xs font-mono text-slate-400 hover:text-white transition-all uppercase">
            [01] Sandbox Console
          </a>
          <a href="#preview-viewport" className="text-xs font-mono text-[#cbd5e1] hover:text-cyan-400 transition-all uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            [02] 3D Follow Viewport
          </a>
          <a href="#showcase-gallery" className="text-xs font-mono text-slate-400 hover:text-fuchsia-400 transition-all uppercase">
            [03] Showcase Gallery
          </a>
          <a href="#downloads-section" className="text-xs font-mono text-slate-400 hover:text-white transition-all uppercase">
            [04] Play Anywhere
          </a>
        </div>

        {/* Action / latency stats */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex bg-black/40 p-1 rounded-full border border-white/10">
            <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-cyan-500 text-black rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]">
              ACTIVE EDITOR
            </button>
            <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
              EXPLORE HUB
            </button>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-cyan-400 uppercase tracking-tighter font-mono">NEURAL_STREAM</p>
            <p className="text-xs font-mono text-slate-200">LATENCY_9.5ms</p>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        
        {/* Core value header introduction */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-cyan-400 select-none">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span>NEXT-GEN AI ENGINE STABLE RELEASE 2.4</span>
          </div>
          
          <h2 className="text-4xl sm:text-7xl font-extrabold leading-none tracking-tight text-white font-sans uppercase">
            Dream it. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 glow-cyan">
              Generate it.
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-400 font-mono leading-relaxed max-w-2xl mx-auto">
            Build interactive game models instantly using natural language prompts. Our engine automatically structures coordinate bounding maps to follow target objects cleanly.
          </p>
        </section>

        {/* CORE TOOL CONSOLE MODULE */}
        <section id="editor-console" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Core Input tool, placeholders, styles */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-500">
                PROMPT INTERPOLATOR
              </span>
              <p className="text-[11px] text-slate-400 font-mono">
                Model aligns parameters with real-time vector constraints.
              </p>
            </div>

            {/* Glowing Textarea Box with glow-blur effects matching Artistic Flair */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black border border-white/10 rounded-xl p-4 flex flex-col gap-3 shadow-2xl">
                
                <textarea 
                  id="prompt-textbox"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g., Build an HD cyberpunk racing game set in Neo-Tokyo with yellow lane markers and retro fast-moving nitro barriers..."
                  className="bg-transparent border-none resize-none text-xs sm:text-sm text-slate-200 focus:outline-none placeholder:text-slate-600 h-28 leading-relaxed font-sans"
                  maxLength={400}
                />

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-white/5 pt-2">
                  <span>INPUT DECK</span>
                  <span>{promptInput.length}/400 characters</span>
                </div>

                {/* Submitting Trigger Button with beautiful premium style */}
                <button 
                  id="generate-3d-button"
                  onClick={triggerGeneration}
                  disabled={isGenerating || !promptInput}
                  className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 py-3.5 rounded-lg font-black uppercase tracking-widest text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 text-white"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span>{isGenerating ? `Generating (${genProgress}%)` : "Generate 3D Game"}</span>
                </button>
              </div>
            </div>

            {/* Quality toggles and optimization switches right below prompt box */}
            <div className="flex flex-col gap-3 bg-slate-950/70 p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Quality Settings Mode
                </span>
                <span className="text-[9px] font-mono text-cyan-400">Target Level</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  id="quality-toggle-hd"
                  type="button"
                  onClick={() => setQuality('HD')}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${quality === 'HD' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  HD Quality
                </button>
                <button 
                  id="quality-toggle-4k"
                  type="button"
                  onClick={() => setQuality('4K')}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${quality === '4K' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  4K Rendering
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Auto-Optimize Frames</span>
                  <span className="text-[8px] font-mono text-emerald-400 font-bold">M2 STABLE</span>
                </div>
                {/* Simulated high-tech custom toggle switch */}
                <div className="w-8 h-4 bg-cyan-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Genre Archetype selection buttons */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Supported Engine Archetypes
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Arcade Switch Card */}
                <button 
                  id="genre-arcade-card"
                  onClick={() => handleGenreChange('Arcade')}
                  className={`p-3 rounded-lg text-center transition-all cursor-pointer ${selectedGenre === 'Arcade' ? 'bg-cyan-500/10 border border-cyan-500/50 text-cyan-400' : 'bg-white/5 border border-white/10 text-slate-400 hover:border-cyan-500/50 hover:text-white'}`}
                >
                  <div className="text-xl mb-1 select-none">🕹️</div>
                  <div className="text-[9px] font-black uppercase font-mono leading-none">Arcade</div>
                </button>

                {/* Racing Switch Card */}
                <button 
                  id="genre-racing-card"
                  onClick={() => handleGenreChange('Racing')}
                  className={`p-3 rounded-lg text-center transition-all cursor-pointer ${selectedGenre === 'Racing' ? 'bg-cyan-500/10 border border-cyan-500/50 text-cyan-400' : 'bg-white/5 border border-white/10 text-slate-400 hover:border-cyan-500/50 hover:text-white'}`}
                >
                  <div className="text-xl mb-1 select-none">🏎️</div>
                  <div className="text-[9px] font-black uppercase font-mono leading-none">Racing</div>
                </button>

                {/* Action Switch Card */}
                <button 
                  id="genre-action-card"
                  onClick={() => handleGenreChange('Action')}
                  className={`p-3 rounded-lg text-center transition-all cursor-pointer ${selectedGenre === 'Action' ? 'bg-cyan-500/10 border border-cyan-500/50 text-cyan-400' : 'bg-white/5 border border-white/10 text-slate-400 hover:border-cyan-500/50 hover:text-white'}`}
                >
                  <div className="text-xl mb-1 select-none">⚔️</div>
                  <div className="text-[9px] font-black uppercase font-mono leading-none">Action</div>
                </button>

                {/* Thriller Switch Card */}
                <button 
                  id="genre-thriller-card"
                  onClick={() => handleGenreChange('Thriller')}
                  className={`p-3 rounded-lg text-center transition-all cursor-pointer ${selectedGenre === 'Thriller' ? 'bg-cyan-500/10 border border-cyan-500/50 text-cyan-400' : 'bg-white/5 border border-white/10 text-slate-400 hover:border-cyan-500/50 hover:text-white'}`}
                >
                  <div className="text-xl mb-1 select-none">🎭</div>
                  <div className="text-[9px] font-black uppercase font-mono leading-none">Thriller</div>
                </button>
              </div>
            </div>

          </div>

          {/* Right panel: Active live compilation logger & summary details */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-slate-950/70 p-4 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-300">
                    Live Diagnostics Console
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  {isGenerating 
                    ? `Generating high-fidelity mesh templates configured under ${quality} target specifications...` 
                    : `Engine is idling. Ready to compile custom vertex datasets for layout type: ${selectedGenre}.`
                  }
                </p>
              </div>

              {isGenerating ? (
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between font-mono text-[9px] text-[#22d3ee]">
                    <span>LINKING ASSETS...</span>
                    <span>{genProgress}% COMPLETE</span>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-150"
                      style={{ width: `${genProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500">
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-fuchsia-400 border border-white/5">O(LOG N) CAMERA LERP</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-cyan-400 border border-white/5">WEBGL 2D SIMULATION</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 border border-white/5">PC/ANDROID EXPORT</span>
                </div>
              )}
            </div>

            {/* Diagnostic Logs Stream box */}
            <div className="bg-black/80 border border-white/10 p-4 rounded-xl font-mono text-[10px] text-slate-400 space-y-1.5 max-h-[180px] overflow-y-auto">
              <div className="text-[9px] text-slate-500 uppercase pb-1 border-b border-white/5 mb-1 flex items-center justify-between">
                <span>SYSTEM TRACKER_LOGS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              
              <div>&gt; INIT COMPILE WITH CONFIG CLASS: target {quality}</div>
              <div>&gt; CHASSIS ALIGNED: [{selectedGenre.toUpperCase()}_MODEL]</div>
              <div>&gt; RESOLUTION_VECTOR: Rear third person lock view angle</div>
              
              {logsList.map((log, i) => (
                <div key={i} className="text-cyan-400">&gt; {log}</div>
              ))}

              {isGenerating && (
                <div className="text-fuchsia-400 animate-pulse">&gt; {genStatus}</div>
              )}
            </div>

          </div>

        </section>

        {/* LIVE VIEWPORT PREVIEW SECTION */}
        <section id="preview-viewport" className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#a78bfa]">
              [VIEWPORT ENVIRONMENT]
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold uppercase text-white font-sans">
              Dynamic Visual Sandbox
            </h3>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Demonstrates our premium third-person follow camera tracking. Rotate vehicle coordinates below using keyboard inputs to view real-time lag alignment.
            </p>
          </div>

          {/* Canvas simulation container mapped in custom component */}
          <GamePreview 
            selectedGenre={selectedGenre} 
            quality={quality} 
            isGeneratingNow={isGenerating}
            onManualGenerate={triggerGeneration}
            promptText={promptInput}
          />
        </section>

        {/* SHOWCASE GALLERY SECTION */}
        <section id="showcase-gallery" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-fuchsia-950/40 text-fuchsia-400 border border-fuchsia-500/20 text-[10px] font-mono uppercase tracking-[0.2em]">
                <Zap className="w-3 h-3 text-fuchsia-400" />
                <span>[Gallery Registry]</span>
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold uppercase text-white font-sans tracking-tight">
                Showcase Gallery
              </h3>
              <p className="text-xs font-mono text-slate-400 max-w-xl">
                Curated immersive 3D simulations compiled by our users. Use prompts as instant template blueprints.
              </p>
            </div>

            {/* Interactive Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
              {/* Search text input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Query prompt or creator..."
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 font-sans"
                />
              </div>

              {/* Reset search helper */}
              {gallerySearch && (
                <button 
                  onClick={() => setGallerySearch("")}
                  className="text-[10px] font-mono text-slate-400 hover:text-white underline cursor-pointer self-center"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Genre Category chips */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Arcade', 'Racing', 'Action', 'Thriller'].map((genre) => (
              <button
                key={genre}
                onClick={() => setGalleryGenreFilter(genre)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${galleryGenreFilter === genre ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]' : 'bg-slate-950/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'}`}
              >
                {genre}
              </button>
            ))}

            <span className="ml-auto text-[10px] font-mono text-slate-500">
              Showing {filteredGalleryItems.length} of {GALLERY_ITEMS.length} models
            </span>
          </div>

          {/* Gallery Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGalleryItems.map((item) => {
              const hasLiked = !!likedItems[item.id];
              return (
                <div 
                  key={item.id}
                  onClick={() => setActiveDetailItem(item)}
                  className="group relative bg-slate-950/40 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl"
                >
                  {/* Card Background / Thumbnail with futuristic grid overlay */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/40"></div>
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase font-mono tracking-wider text-cyan-400">
                        {item.genre}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase font-mono tracking-wider text-slate-400">
                        {item.difficulty}
                      </span>
                    </div>

                    {/* Like Action Toggle directly on Image hover */}
                    <button
                      onClick={(e) => toggleLikeItem(item.id, e)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${hasLiked ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-black/60 border-white/10 text-slate-400 hover:text-white'}`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Curated Meta Contents */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                        <span>By @{item.creator}</span>
                        <span className="text-cyan-400">{item.fpsLimit} FPS LIMIT</span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors uppercase font-sans tracking-tight">
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 font-mono line-clamp-2 leading-relaxed mt-1.5 bg-black/30 p-2 rounded border border-white/5">
                        "{item.prompt}"
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5 mt-auto">
                      {/* Technical Tags */}
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-[8px] font-mono uppercase bg-slate-900 px-2 py-0.5 rounded text-fuchsia-400 border border-white/5">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Compilation stats and quick inject action */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>{item.compilations.toLocaleString()} Runs</span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectGalleryItem(item);
                          }}
                          className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-black rounded font-bold uppercase tracking-wider text-[9px] cursor-pointer flex items-center gap-1 transition-all"
                        >
                          <span>Inject</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredGalleryItems.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 py-16 bg-slate-950/20 border border-dashed border-white/10 rounded-2xl text-center space-y-2">
                <p className="text-sm text-slate-400 font-mono">No community blueprints match your filter criteria.</p>
                <button 
                  onClick={() => { setGalleryGenreFilter('All'); setGallerySearch(''); }}
                  className="text-xs uppercase text-cyan-400 underline font-bold cursor-pointer"
                >
                  Reset parameters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* DETAILED COMMUNITY MODEL POPUP MODAL */}
        {activeDetailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-[#090d1f] border border-cyan-500/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative glow-cyan animate-in fade-in zoom-in duration-200">
              
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setActiveDetailItem(null)}
                  className="bg-black/80 hover:bg-slate-900 border border-white/15 text-white/80 hover:text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Cover Banner */}
              <div className="relative h-48 bg-slate-900">
                <img 
                  src={activeDetailItem.imageUrl} 
                  alt={activeDetailItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d1f] via-transparent to-black/30"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-0.5 rounded bg-[#090d1f] border border-cyan-400/50 text-[10px] font-bold font-mono text-cyan-400 mr-2 uppercase">
                    {activeDetailItem.genre}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-bold font-mono text-slate-300 uppercase">
                    {activeDetailItem.difficulty}
                  </span>
                </div>
              </div>

              {/* Body details */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-black uppercase text-white font-sans tracking-tight">
                      {activeDetailItem.title}
                    </h4>
                    <span className="text-xs font-mono text-slate-400 block">
                      Engineered by @{activeDetailItem.creator}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-fuchsia-400 block uppercase">
                      LINK ACCREDITED
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      ID: {activeDetailItem.id}-SYN
                    </span>
                  </div>
                </div>

                <div className="bg-black/50 p-4 border border-white/15 rounded-xl space-y-1.5">
                  <span className="text-[9px] uppercase tracking-widest text-[#a78bfa] font-black font-mono block">
                    NEURAL BLUEPRINT PROMPT
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono">
                    "{activeDetailItem.prompt}"
                  </p>
                </div>

                {/* Additional simulated compiler spec readouts in modal for flavor */}
                <div className="grid grid-cols-2 gap-3 bg-slate-950/50 p-3 rounded-lg border border-white/5 text-[10px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500 block">RENDER PIPELINE TYPE</span>
                    <span className="text-white font-bold font-mono">WebGL2 Volumetric</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">MAX COMPILATIONS FRAME</span>
                    <span className="text-white font-bold font-mono">{activeDetailItem.fpsLimit} FPS CAP</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">TOTAL VECTOR REPEATS</span>
                    <span className="text-white font-bold font-mono">{activeDetailItem.compilations.toLocaleString()} times</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">COMMUNITY RATING</span>
                    <span className="text-cyan-400 font-bold font-mono">{activeDetailItem.likes} Approved Likes</span>
                  </div>
                </div>

                {/* CTA actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveDetailItem(null);
                      handleSelectGalleryItem(activeDetailItem);
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:brightness-115 text-white font-extrabold uppercase py-3 rounded-xl tracking-wider text-xs cursor-pointer text-center"
                  >
                    Load into Sandbox
                  </button>
                  <button
                    onClick={() => {
                      setActiveDetailItem(null);
                      handleSelectGalleryItem(activeDetailItem);
                      setTimeout(() => {
                        triggerGeneration();
                      }, 400);
                    }}
                    className="w-full bg-[#111827] border border-white/10 hover:border-white/20 text-slate-200 font-bold uppercase py-3 rounded-xl tracking-wider text-xs cursor-pointer text-center"
                  >
                    Direct Compile
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* PLAY ANYWHERE CROSS-PLATFORM & EXPORT SECTION */}
        <section id="downloads-section" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
                Play Anywhere
              </p>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white uppercase font-sans">
                Export natively to all major platforms
              </h4>
            </div>

            <div className="flex gap-4 text-right font-mono text-[10px] text-slate-500">
              <div>
                <span>COMPILED PIPELINES</span>
                <span className="text-white block font-bold text-xs uppercase">WebAssembly Stable</span>
              </div>
            </div>
          </div>

          {/* Grid matching the downloads styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Windows PC Download card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:bg-white hover:text-black transition-all duration-300 h-56 group cursor-pointer relative">
              <div className="absolute top-3 right-3 text-[9px] font-mono opacity-60 uppercase text-slate-400 group-hover:text-black">
                STABLE WIN
              </div>
              
              <div className="space-y-2">
                <span className="text-2xl">🪟</span>
                <h5 className="text-sm font-bold uppercase font-sans tracking-wide">Windows PC</h5>
                <p className="text-[11px] opacity-75 leading-relaxed font-mono">
                  Direct64 launcher targeting standalone Windows clients with custom key map bindings.
                </p>
              </div>

              <div>
                <button 
                  id="download-btn-windows"
                  onClick={() => startDownloadSimulation('Windows PC')}
                  disabled={downloadingPlatform !== null}
                  className="w-full bg-[#111827] text-slate-200 py-2 rounded-lg text-xs font-mono transition-all group-hover:bg-[#030712] group-hover:text-white font-bold uppercase"
                >
                  {downloadingPlatform === 'Windows PC' ? `Building (${downloadProgress}%)` : "Export Client"}
                </button>
              </div>
            </div>

            {/* Laptop Download card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:bg-white hover:text-black transition-all duration-300 h-56 group cursor-pointer relative1">
              <div className="absolute top-3 right-3 text-[9px] font-mono opacity-60 uppercase text-slate-400 group-hover:text-black">
                INTEGRATED GPU
              </div>
              
              <div className="space-y-2">
                <span className="text-2xl">💻</span>
                <h5 className="text-sm font-bold uppercase font-sans tracking-wide">Laptops</h5>
                <p className="text-[11px] opacity-75 leading-relaxed font-mono">
                  Low battery profile optimized for Intel Iris, AMD Radeon mobile, or native Apple Silicon M-Series.
                </p>
              </div>

              <div>
                <button 
                  id="download-btn-laptops"
                  onClick={() => startDownloadSimulation('Laptops')}
                  disabled={downloadingPlatform !== null}
                  className="w-full bg-[#111827] text-slate-200 py-2 rounded-lg text-xs font-mono transition-all group-hover:bg-[#030712] group-hover:text-white font-bold uppercase"
                >
                  {downloadingPlatform === 'Laptops' ? `Building (${downloadProgress}%)` : "Export Client"}
                </button>
              </div>
            </div>

            {/* Android Mobile Download card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:bg-white hover:text-black transition-all duration-300 h-56 group cursor-pointer relative">
              <div className="absolute top-3 right-3 text-[9px] font-mono opacity-60 uppercase text-slate-400 group-hover:text-black">
                ARM64 APK
              </div>
              
              <div className="space-y-2">
                <span className="text-2xl">📱</span>
                <h5 className="text-sm font-bold uppercase font-sans tracking-wide">Android Mobile</h5>
                <p className="text-[11px] opacity-75 leading-relaxed font-mono">
                  Directly compiled APK bundle supporting dynamic touch controls on vertical aspect targets.
                </p>
              </div>

              <div>
                <button 
                  id="download-btn-android"
                  onClick={() => startDownloadSimulation('Android (Mobile)')}
                  disabled={downloadingPlatform !== null}
                  className="w-full bg-[#111827] text-slate-200 py-2 rounded-lg text-xs font-mono transition-all group-hover:bg-[#030712] group-hover:text-white font-bold uppercase"
                >
                  {downloadingPlatform === 'Android (Mobile)' ? `Building (${downloadProgress}%)` : "Export Client"}
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER / ATTRIBUTION SECTION */}
      <footer className="h-16 border-t border-white/5 px-4 sm:px-10 flex flex-col sm:flex-row items-center justify-between bg-black/80 gap-4 py-3 text-[10px] text-slate-500 font-mono tracking-wider mt-12 w-full">
        <div className="flex gap-6 text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">
          <span>© 2026 Marth Builds</span>
          <span>•</span>
          <span>Terms of Synthesis</span>
          <span>•</span>
          <span>Neural Privacy</span>
        </div>
        
        {/* Attribution prominently displayed on footer as requested */}
        <p className="text-[10px] font-medium text-slate-400 italic uppercase tracking-widest text-center">
          Created by <span className="text-white border-b border-cyan-500 pb-0.5 font-bold">Zain Marth</span>
        </p>
      </footer>

    </div>
  );
}
