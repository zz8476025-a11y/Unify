export type GameGenre = 'Arcade' | 'Racing' | 'Action' | 'Thriller';
export type GraphicsQuality = 'HD' | '4K';
export type DeviceLayout = 'Android' | 'Windows' | 'Laptop';

export interface GameGenreDetails {
  id: GameGenre;
  name: string;
  description: string;
  defaultPrompt: string;
  color: string; // Tailwind hex or class color
  accentBg: string; // glass background glow
  hudColor: string; // canvas draw hud color
  speedLabel: string;
  unit: string;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  statusText: string;
  prompt: string;
  selectedGenre: GameGenre;
  quality: GraphicsQuality;
}
