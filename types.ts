export interface OriginalImage {
  url: string;
  base64: string;
  mimeType: string;
}

export interface EditedImage {
  url: string;
}

export interface Adjustments {
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  grayscale: number;
}
