import type { Adjustments } from '../types';

export const exportImage = (
  imageUrl: string,
  adjustments: Adjustments,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.92
) => {
  const img = new Image();
  img.crossOrigin = 'anonymous'; // Important for tainted canvas
  img.src = imageUrl;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply filters
    ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturate}%) sepia(${adjustments.sepia}%) grayscale(${adjustments.grayscale}%)`;

    // Draw the image
    ctx.drawImage(img, 0, 0);

    // Get data URL
    const dataUrl = canvas.toDataURL(`image/${format}`, quality);

    // Trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `edited-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  img.onerror = () => {
    console.error('Failed to load image for exporting.');
    alert('Could not export the image. It might be due to cross-origin restrictions.');
  };
};
