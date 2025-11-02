import React, { useState, useCallback } from 'react';
import Card from './Card';
import { generateMoodboardImages } from '../services/geminiService';

const LookDevLab: React.FC = () => {
  const [prompt, setPrompt] = useState('a lonely, rain-soaked cyberpunk street at night, neon signs reflecting on wet pavement');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    try {
      const images = await generateMoodboardImages(prompt);
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
      <h1 className="text-3xl font-bold text-vanguard-text">Look Development Lab</h1>
      <p className="text-vanguard-text-secondary">Your creative sandbox for brainstorming and concept art. Use the AI Mood Board Creator to generate visual ideas for scenes, characters, and props before locking them in as canonical assets.</p>

      <Card title="AI Mood Board Creator">
        <div className="space-y-4">
          <label htmlFor="moodboard-prompt" className="font-semibold">Describe the mood or concept:</label>
          <textarea
            id="moodboard-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 bg-vanguard-bg text-vanguard-text-secondary p-2 rounded-md border border-vanguard-bg-tertiary font-mono text-sm"
            placeholder="e.g., 'a tense interrogation room, single overhead light, deep shadows'"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary"
          >
            {isLoading ? 'Generating Concepts...' : '✨ Generate Mood Board'}
          </button>
        </div>
      </Card>

      <Card title="Generated Concepts">
        {isLoading && <p className="text-center py-16 text-vanguard-text-secondary">AI is generating visual concepts...</p>}
        {error && <p className="text-center py-16 text-vanguard-red">{error}</p>}
        {!isLoading && generatedImages.length === 0 && (
          <p className="text-center py-16 text-vanguard-text-secondary">Your generated mood board images will appear here.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generatedImages.map((imgBase64, index) => (
            <div key={index} className="aspect-video bg-vanguard-bg rounded-lg">
              <img src={`data:image/png;base64,${imgBase64}`} alt={`Concept ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LookDevLab;
