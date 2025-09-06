import React from 'react';
import type { OriginalImage, EditedImage } from '../types';
import Spinner from './Spinner';

interface ImageViewerProps {
  originalImage: OriginalImage | null;
  editedImage: EditedImage | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  isComparing: boolean;
  setIsComparing: (isComparing: boolean) => void;
  style: React.CSSProperties;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  originalImage,
  editedImage,
  onImageUpload,
  isLoading,
  isComparing,
  setIsComparing,
  style
}) => {
  const displayUrl = isComparing ? originalImage?.url : editedImage?.url;

  return (
    <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700 shadow-lg flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-300">
            {isComparing ? 'Original' : 'Edited'}
        </h2>
        {editedImage && originalImage && editedImage.url !== originalImage.url && (
          <button
            onMouseDown={() => setIsComparing(true)}
            onMouseUp={() => setIsComparing(false)}
            onTouchStart={() => setIsComparing(true)}
            onTouchEnd={() => setIsComparing(false)}
            onMouseLeave={() => setIsComparing(false)}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            Hold to Compare
          </button>
        )}
      </div>
      <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-dashed border-gray-600 flex-grow">
        {isLoading ? (
          <Spinner />
        ) : displayUrl ? (
          <img 
            src={displayUrl} 
            alt={isComparing ? 'Original' : 'Edited'} 
            className="object-contain w-full h-full transition-all duration-300"
            style={isComparing ? {} : style} 
            id="editable-image"
          />
        ) : (
          <div className="text-center text-gray-500">
            <input
              type="file"
              id="imageUpload"
              className="hidden"
              accept="image/*"
              onChange={onImageUpload}
            />
            <label htmlFor="imageUpload" className="cursor-pointer p-8 flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Click to upload an image</span>
              <span className="text-xs">Start your masterpiece</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
