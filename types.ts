
export enum AppMode {
  EDIT = 'EDIT',
  GENERATE = 'GENERATE'
}

export enum GeminiModel {
  FLASH_2_5 = 'gemini-2.5-flash-image',
  PRO_3 = 'gemini-3-pro-image-preview'
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type ImageSize = '1K' | '2K' | '4K';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface EditorState {
  image: string | null;
  mask: string | null;
  prompt: string;
  loading: boolean;
  error: string | null;
  history: GeneratedImage[];
  imageHistory: string[];
  historyIndex: number;
  activeAspectRatio: AspectRatio;
  activeImageSize: ImageSize;
  activeModel: GeminiModel;
  mode: AppMode;
}

export interface StyleFilter {
  id: string;
  name: string;
  prompt: string;
  icon: string;
}

export const PREDEFINED_FILTERS: StyleFilter[] = [
  { id: 'vintage', name: 'Vintage', prompt: 'Apply a vintage, retro 70s film look with warm tones and slight grain.', icon: '🎞️' },
  { id: 'noir', name: 'Noir', prompt: 'Convert to high-contrast black and white noir style with dramatic lighting.', icon: '🌑' },
  { id: 'cartoon', name: 'Cartoon', prompt: 'Transform into a vibrant, clean-lined cartoon or cel-shaded illustration.', icon: '🎨' },
  { id: 'oil', name: 'Oil Painting', prompt: 'Turn into a rich, textured classical oil painting with visible brushstrokes.', icon: '🖌️' },
  { id: 'cyberpunk', name: 'Cyberpunk', prompt: 'Apply a cyberpunk aesthetic with neon pink and cyan lights and futuristic vibes.', icon: '🧪' },
  { id: 'sketch', name: 'Sketch', prompt: 'Convert into a detailed pencil sketch or charcoal drawing.', icon: '✏️' },
];
