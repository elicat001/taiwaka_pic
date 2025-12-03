export interface ProcessedImage {
  original: string; // Base64 or URL
  generated: string | null; // Base64 or URL
  prompt: string;
}

export enum EditorStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
