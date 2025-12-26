
export enum AppMode {
  EDIT = 'EDIT',
  GENERATE = 'GENERATE'
}

export enum DrawTool {
  NONE = 'NONE',
  AI_EDIT = 'AI_EDIT',
  CROP = 'CROP',
  ERASER = 'ERASER',
  RECT_SELECT = 'RECT_SELECT',
  ELLIPSE_SELECT = 'ELLIPSE_SELECT',
  ROTATE = 'ROTATE',
  RESIZE = 'RESIZE',
  COLOR_BRUSH = 'COLOR_BRUSH'
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
  referenceImage: string | null;
  apiKeyInput: string;
  passwordInput: string;
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
  activeTool: DrawTool;
  brushColor: string;
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
  { id: 'cyberpunk', name: 'Cyberpunk', prompt: 'Apply a cyberpunk aesthetic with neon pink and cyan lights.', icon: '🧪' },
];
