import React, { useState, useCallback } from 'react';
import Card from './Card';
import { canonicalPrompts } from '../data/canonicalPrompts';
import { generateCharacterImages } from '../services/geminiService';

type CharacterName = keyof typeof canonicalPrompts;

interface CanonicalAssetsProps {
  lockedAssets: Record<string, string | null>;
  setLockedAssets: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
}

const CanonicalAssets: React.FC<CanonicalAssetsProps> = ({ lockedAssets, setLockedAssets }) => {
  const [selectedChar, setSelectedChar] = useState<CharacterName>(Object.keys(canonicalPrompts)[0] as CharacterName);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    const charData = canonicalPrompts[selectedChar];
    try {
      const images = await generateCharacterImages(charData.prompt, charData.aspectRatio);
      if (images.length === 0) {
        setError("Image generation failed. The request may have been blocked. Please check the console for details.");
      }
      setGeneratedImages(images);
    } catch (err) {
      setError("An error occurred during image generation.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChar]);

  const handleLockAsset = (imageBase64: string) => {
    setLockedAssets(prev => ({ ...prev, [selectedChar]: imageBase64 }));
  };

  const charData = canonicalPrompts[selectedChar];
  const lockedAsset = lockedAssets[selectedChar];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-vanguard-text">Canonical Asset Generator</h1>
      <p className="text-vanguard-text-secondary">Generate and lock the "perfect" canonical reference images for each character. This is the source code for your film's visual DNA, ensuring consistency across all 430 shots.</p>

      <div className="flex flex-wrap gap-2 pb-4 border-b border-vanguard-bg-tertiary">
        {Object.keys(canonicalPrompts).map(name => (
          <button
            key={name}
            onClick={() => setSelectedChar(name as CharacterName)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedChar === name ? 'bg-vanguard-accent text-white' : 'bg-vanguard-bg-tertiary text-vanguard-text-secondary hover:bg-vanguard-bg-tertiary/70'}`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <div className="space-y-8">
          <Card title={`Locked Canonical Asset: ${selectedChar}`}>
            <div className={`bg-vanguard-bg rounded-lg flex items-center justify-center ${charData.aspectRatio === '1:1' ? 'aspect-square' : 'aspect-video'}`}>
              {lockedAsset ? (
                <img src={`data:image/png;base64,${lockedAsset}`} alt={`Locked asset for ${selectedChar}`} className="max-h-full max-w-full object-contain rounded-md" />
              ) : (
                <p className="text-vanguard-text-secondary">No asset locked for this character yet.</p>
              )}
            </div>
          </Card>
          <Card title="Generation Prompt & Key Features">
            <pre className="text-sm bg-vanguard-bg p-3 rounded-md overflow-x-auto text-vanguard-text-secondary font-mono whitespace-pre-wrap">
              {charData.prompt}
            </pre>
            <h4 className="font-semibold mt-4 mb-2 text-vanguard-text">Key Features to Verify:</h4>
            <ul className="space-y-1 text-sm list-disc list-inside text-vanguard-text-secondary">
              {charData.keyFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
            </ul>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating... This may take a moment.
              </>
            ) : `Generate Images for ${selectedChar}`}
          </button>
          
          <Card title="Generated Images">
            {error && <p className="text-vanguard-red text-center">{error}</p>}
            {isLoading && (
              <div className="flex items-center justify-center h-64 text-vanguard-text-secondary">
                  <p>AI is generating concepts...</p>
              </div>
            )}
            {!isLoading && generatedImages.length === 0 && !error &&(
                 <div className="flex items-center justify-center h-64 text-vanguard-text-secondary">
                  <p>Click "Generate Images" to create concepts.</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((imgBase64, index) => (
                <div key={index} className="space-y-2 group relative">
                    <div className={`${charData.aspectRatio === '1:1' ? 'aspect-square' : 'aspect-video'}`}>
                        <img src={`data:image/png;base64,${imgBase64}`} alt={`Generated concept ${index + 1}`} className="w-full h-full object-cover rounded-md border border-vanguard-bg-tertiary" />
                    </div>
                    <button
                        onClick={() => handleLockAsset(imgBase64)}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 bg-vanguard-green/80 hover:bg-vanguard-green text-white font-bold py-2 px-3 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        Lock as Canonical
                    </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CanonicalAssets;