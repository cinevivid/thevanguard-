
import React, { useState, useCallback } from 'react';
import Card from './Card';
import { generateCharacterConcepts } from '../services/geminiService';

const AICastingStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('a weary, cynical detective in his late 40s, reminiscent of a young Harrison Ford, with the intensity of a young Al Pacino');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a character description.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    try {
      const images = await generateCharacterConcepts(prompt);
      setGeneratedImages(images);
      if (images.length === 0) {
        setError("Generation failed. The model may have refused the prompt. Check the console for safety feedback.");
      }
    } catch (err) {
      setError("An error occurred during image generation.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-vanguard-text">AI Casting Studio</h1>
      <p className="text-vanguard-text-secondary">Your digital casting director. Describe a character's look, feel, and influences, and the AI will generate a lineup of potential "actors" for your roles.</p>

      <Card title="Casting Call">
        <div className="space-y-4">
          <label htmlFor="casting-prompt" className="font-semibold">Character Description:</label>
          <textarea
            id="casting-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 bg-vanguard-bg text-vanguard-text-secondary p-2 rounded-md border border-vanguard-bg-tertiary font-mono text-sm"
            placeholder="e.g., 'A young, determined recruit with the eyes of a veteran...'"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary"
          >
            {isLoading ? 'Casting...' : '✨ Generate Headshots'}
          </button>
        </div>
      </Card>

      <Card title="Generated Actor Headshots">
        {isLoading && <p className="text-center py-16 text-vanguard-text-secondary">AI is searching for your character...</p>}
        {error && <p className="text-center py-16 text-vanguard-red">{error}</p>}
        {!isLoading && generatedImages.length === 0 && (
          <p className="text-center py-16 text-vanguard-text-secondary">Generated "actor" headshots will appear here.</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {generatedImages.map((imgBase64, index) => (
            <div key={index} className="aspect-[3/4] bg-vanguard-bg rounded-lg">
              <img src={`data:image/png;base64,${imgBase64}`} alt={`Headshot ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AICastingStudio;
