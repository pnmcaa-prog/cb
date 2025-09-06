
import React, { useState, useCallback, useMemo } from 'react';
import type { OriginalImage, EditedImage, Adjustments } from './types';
import { editImageWithGemini } from './services/geminiService';
import { exportImage } from './utils/exportImage';
import Header from './components/Header';
import EditorPanel from './components/EditorPanel';
import ImageViewer from './components/ImageViewer';
import AIPromptPanel from './components/AIPromptPanel';

const initialAdjustments: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  grayscale: 0,
};

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [editedImage, setEditedImage] = useState<EditedImage | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<Adjustments>(initialAdjustments);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPEG, etc.).');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const imageUrl = URL.createObjectURL(file);
        setOriginalImage({
          url: imageUrl,
          base64: base64Data,
          mimeType: file.type,
        });
        setEditedImage({ url: imageUrl });
        setError(null);
        setResponseText(null);
        setAdjustments(initialAdjustments);
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
      };
      // Fix: Corrected typo from readDataURL to readAsDataURL
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateClick = useCallback(async (customPrompt?: string) => {
    const currentPrompt = customPrompt || prompt;
    // Use the original image's base64 for the first AI edit, 
    // or fetch the base64 from the currently edited image for subsequent edits.
    if (!originalImage || !currentPrompt.trim()) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponseText(null);
    
    // To chain AI edits, we need the base64 of the *current* edited image.
    // This requires converting the editedImage.url (which could be a blob URL) back to base64.
    const imageToSend = editedImage?.url ? editedImage.url : originalImage.url;

    // A simple way for this app: we always base edits on the original image to keep it simple.
    // For a more advanced app, you would convert the editedImage URL to base64.
    const base64Data = originalImage.base64;
    const mimeType = originalImage.mimeType;


    try {
      const result = await editImageWithGemini(base64Data, mimeType, currentPrompt);
      
      if (result.base64Image && result.mimeType) {
        const newImageUrl = `data:${result.mimeType};base64,${result.base64Image}`;
        setEditedImage({ url: newImageUrl });
      } else {
        setError("The AI didn't return an image. It might have only provided a text response.");
      }

      if(result.text) {
        setResponseText(result.text);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, editedImage, prompt]);

  const handleReset = () => {
    if (originalImage) {
      setEditedImage({ url: originalImage.url });
      setAdjustments(initialAdjustments);
      setPrompt('');
      setError(null);
      setResponseText(null);
    }
  };
  
  const handleSave = async (format: 'png' | 'jpeg' | 'webp', quality?: number) => {
    if (editedImage?.url) {
      exportImage(editedImage.url, adjustments, format, quality);
    }
  };

  const imageStyle = useMemo(() => ({
    filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturate}%) sepia(${adjustments.sepia}%) grayscale(${adjustments.grayscale}%)`,
  }), [adjustments]);

  const canEdit = originalImage !== null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Tools */}
          <div className="lg:col-span-3">
            <EditorPanel
              adjustments={adjustments}
              onAdjustmentChange={setAdjustments}
              onPresetFilterApply={(newAdjustments) => setAdjustments(prev => ({...prev, ...newAdjustments}))}
              onReset={handleReset}
              onSave={handleSave}
              disabled={!canEdit}
              onQuickEdit={handleGenerateClick}
            />
          </div>

          {/* Center Panel: Image */}
          <div className="lg:col-span-6 flex flex-col gap-4">
             <ImageViewer
                originalImage={originalImage}
                editedImage={editedImage}
                onImageUpload={handleImageUpload}
                isLoading={isLoading}
                isComparing={isComparing}
                setIsComparing={setIsComparing}
                style={imageStyle}
             />
          </div>
          
          {/* Right Panel: AI Prompt */}
          <div className="lg:col-span-3">
            <AIPromptPanel
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerateClick}
              isLoading={isLoading}
              canGenerate={canEdit && prompt.trim().length > 0 && !isLoading}
              responseText={responseText}
              disabled={!canEdit}
            />
          </div>
          
        </div>
      </main>
       {error && (
            <div className="fixed bottom-5 right-5 bg-red-600 text-white py-3 px-5 rounded-lg shadow-xl animate-pulse z-50">
              <button onClick={() => setError(null)} className="absolute -top-2 -right-2 bg-red-800 rounded-full p-0.5">&times;</button>
              <p><span className="font-bold">Error:</span> {error}</p>
            </div>
          )}
    </div>
  );
};

export default App;
