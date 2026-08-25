export interface GalleryItem {
  id: string;
  title: string;
  genre: 'Arcade' | 'Racing' | 'Action' | 'Thriller';
  creator: string;
  compilations: number;
  likes: number;
  prompt: string;
  imageUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  fpsLimit: number;
  tags: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    title: 'Neon Overdrive 2099',
    genre: 'Racing',
    creator: 'CipherRider',
    compilations: 12450,
    likes: 890,
    prompt: 'Build an HD cyberpunk racing game set in Neo-Tokyo with yellow lane markers and retro fast-moving nitro barriers.',
    imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400',
    difficulty: 'Intermediate',
    fpsLimit: 120,
    tags: ['cyberpunk', 'high-speed', 'nitro']
  },
  {
    id: '2',
    title: 'Abyss Hunter: Deep Carbon',
    genre: 'Thriller',
    creator: 'VoidWeaver',
    compilations: 8920,
    likes: 642,
    prompt: 'A low-gravity hazardous canyon runner in deep dark carbon caves with fluorescent green alien crystals.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=400',
    difficulty: 'Advanced',
    fpsLimit: 90,
    tags: ['alien', 'low-gravity', 'fluorescent']
  },
  {
    id: '3',
    title: 'Retro Grid City Sunset',
    genre: 'Arcade',
    creator: 'VectorAuteur',
    compilations: 24300,
    likes: 1820,
    prompt: 'Build a neon 80s synthwave horizon racer with magenta lasers and a retro light-tail car moving indefinitely.',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400',
    difficulty: 'Beginner',
    fpsLimit: 144,
    tags: ['synthwave', '80s', 'retro']
  },
  {
    id: '4',
    title: 'Mecha Hangar: Crimson Shield',
    genre: 'Action',
    creator: 'AegisTector',
    compilations: 6400,
    likes: 420,
    prompt: 'Construct a gritty futuristic weaponized hovertank gauntlet with glowing red energy barricades and toxic streams.',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400',
    difficulty: 'Advanced',
    fpsLimit: 120,
    tags: ['mecha', 'laser-gates', 'tactical']
  }
];
