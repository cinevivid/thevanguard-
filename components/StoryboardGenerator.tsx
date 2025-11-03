
import React, { useState, useMemo, useCallback } from 'react';
import Card from './Card';
import { Shot, ShotStatus } from '../types';
import { generateStoryboardImages, generatePromptWithAIDirector, runQualityControl } from '../services/geminiService';

interface StoryboardGeneratorProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
  lockedAssets: Record<string, string | null>;
  setStoryboardVariations: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const StoryboardGenerator: React.FC<StoryboardGeneratorProps> = ({ shots, setShots, lockedAssets, setStoryboardVariations }) => {
  const sceneNumbers = useMemo(() => [...new Set(shots.map(s => s.scene))], [shots]);
  const [selectedScene, setSelectedScene] = useState<string>(sceneNumbers[0] || '');
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDirectorLoading, setIsDirectorLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  
  const [qcResults, setQcResults] = useState<Record<number, string>>({});
  const [isQcLoading, setIsQcLoading] = useState<Record<number, boolean>>({});

  const shotsForScene = useMemo(() => shots.filter(s => s.scene === selectedScene), [selectedScene, shots]);
  const selectedShot = useMemo(() => shots.find(s => s.id === selectedShotId), [selectedShotId, shots]);

  const handleSelectScene = (scene: string) => {
    setSelectedScene(scene);
    setSelectedShotId(null);
    setGeneratedImages([]);
    setError(null);
    setPrompt('');
    setQcResults({});
  };

  const handleSelectShot = useCallback((shot: Shot) => {
    setSelectedShotId(shot.id);
    setGeneratedImages([]);
    setError(null);
    const storyboardPrompt = shot.prompts.find(p => p.type === 'midjourney_storyboard')?.prompt;
    setPrompt(storyboardPrompt || shot.description);
    setQcResults({});
  }, []);
  
  const handleGenerateAIDirectorPrompt = async () => {
    if (!selectedShot) return;
    setIsDirectorLoading(true);
    setPrompt('');
    setError(null);
    try {
      const stream = generatePromptWithAIDirector(selectedShot.id, selectedShot.description);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setPrompt(fullResponse);
      }
    } catch (e) {
      setError("AI Director failed to generate a prompt.");
    } finally {
      setIsDirectorLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedShot) return;
    const missingAssets = selectedShot.characters.filter(charName => !lockedAssets[charName]);
    if (missingAssets.length > 0) {
      setError(`Missing locked assets for: ${missingAssets.join(', ')}. Please create them in 'Canonical Assets'.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setQcResults({});

    const characterRefs = selectedShot.characters.map(name => ({
      name,
      imageBase64: lockedAssets[name] as string,
    }));

    try {
      const images = await generateStoryboardImages(prompt, characterRefs);
      if (images.length === 0) setError("Image generation failed or returned no images.");
      setGeneratedImages(images);
    } catch (err) {
      setError("An error occurred during image generation.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitForReview = () => {
    if(!selectedShotId || generatedImages.length === 0) return;
    setStoryboardVariations(prev => ({ ...prev, [selectedShotId]: generatedImages }));
    setShots(prev => prev.map(s => s.id === selectedShotId ? { ...s, status: 'Pending Approval' } : s));
    setGeneratedImages([]);
    setQcResults({});
  };

  const handleRunQc = async (index: number, imageBase64: string) => {
    if (!selectedShot) return;
    setIsQcLoading(prev => ({...prev, [index]: true}));
    setQcResults(prev => ({...prev, [index]: ''}));
    
    const characterRefs = selectedShot.characters.map(name => ({
      name,
      imageBase64: lockedAssets[name] as string,
    }));
    
    try {
      const stream = runQualityControl(imageBase64, characterRefs, selectedShot);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setQcResults(prev => ({...prev, [index]: fullResponse}));
      }
    } catch (e) {
      setQcResults(prev => ({...prev, [index]: 'Error running QC analysis.'}));
    } finally {
      setIsQcLoading(prev => ({...prev, [index]: false}));
    }
  };

  const getStatusIcon = (status: ShotStatus) => {
    switch(status) {
      case 'Not Started': return <span className="text-vanguard-text-secondary opacity-50" title="Not Started">⚪</span>;
      case 'Storyboard Generated': return <span className="text-vanguard-yellow" title="Generated">🟡</span>; // This status is now transient
      case 'Pending Approval': return <span className="text-vanguard-orange" title="Pending Approval">🟠</span>;
      case 'Storyboard Locked': return <span className="text-vanguard-green" title="Locked">✅</span>;
      case 'Video Generating': return <span className="animate-spin" title="Video Generating">⏳</span>;
      case 'Video Complete': return <span className="text-vanguard-accent" title="Video Complete">▶️</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Storyboard Generator</h1>
        <p className="text-vanguard-text-secondary mt-2">Select a scene to generate storyboard frames. Use the AI Director to create detailed prompts automatically.</p>
      </div>
       <div className="flex items-center space-x-2">
        <label htmlFor="scene-select" className="text-sm font-medium">Scene:</label>
        <select id="scene-select" value={selectedScene} onChange={e => handleSelectScene(e.target.value)} className="bg-vanguard-bg-tertiary border border-vanguard-bg-tertiary rounded-md p-2 text-sm">
          {sceneNumbers.map(scene => <option key={scene} value={scene}>{scene.replace('SCENE ', 'Scene ')}</option>)}
        </select>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        <Card title={`Shot List: ${selectedScene}`} className="lg:col-span-1 flex flex-col">
          <div className="overflow-y-auto pr-2">
            <ul className="space-y-1">
              {shotsForScene.map(shot => (
                <li key={shot.id}>
                  <button onClick={() => handleSelectShot(shot)} className={`w-full text-left p-3 rounded-md transition-colors flex items-center space-x-3 ${selectedShotId === shot.id ? 'bg-vanguard-accent/20' : 'hover:bg-vanguard-bg-tertiary'}`}>
                    {getStatusIcon(shot.status)}
                    <div>
                      <p className="font-semibold text-sm text-vanguard-text">{shot.shotNumber}</p>
                      <p className="text-xs text-vanguard-text-secondary">{shot.description}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-y-auto pr-2">
          {selectedShot ? (
            <>
              <Card title={`Shot ${selectedShot.shotNumber}: Generation Canvas`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-vanguard-text">AI Prompt:</h4>
                    <button onClick={handleGenerateAIDirectorPrompt} disabled={isDirectorLoading} className="text-sm bg-vanguard-bg hover:bg-vanguard-bg-tertiary text-vanguard-accent font-semibold py-2 px-3 rounded-lg transition-colors disabled:opacity-50">
                      {isDirectorLoading ? 'Thinking...' : '✨ Generate with AI Director'}
                    </button>
                  </div>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-32 bg-vanguard-bg text-vanguard-text-secondary p-2 rounded-md border border-vanguard-bg-tertiary font-mono text-xs" />
                  <div>
                    <h4 className="font-semibold text-vanguard-text">Required Characters:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedShot.characters.map(char => (
                        <span key={char} className={`text-xs px-2 py-1 rounded-full ${lockedAssets[char] ? 'bg-vanguard-green/20 text-vanguard-green' : 'bg-vanguard-red/20 text-vanguard-red'}`}>
                          {char} {lockedAssets[char] ? ' (Locked)' : ' (Missing)'}
                        </span>
                      ))}
                    </div>
                  </div>
                   <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary disabled:cursor-not-allowed">
                     {isLoading ? 'Generating...' : 'Generate 4 Variations'}
                    </button>
                    {error && <p className="text-vanguard-red text-center text-sm">{error}</p>}
                </div>
              </Card>

              <Card title="Generated Variations & AI Quality Control">
                 {isLoading && <p className="text-center text-vanguard-text-secondary py-16">AI is generating storyboard frames...</p>}
                 {!isLoading && generatedImages.length === 0 && <p className="text-center text-vanguard-text-secondary py-16">Generated images will appear here for review.</p>}
                 <div className="grid grid-cols-2 gap-4">
                   {generatedImages.map((img, i) => (
                     <div key={i} className="relative group space-y-2">
                       <img src={`data:image/png;base64,${img}`} alt={`Variation ${i+1}`} className="w-full rounded-md border-2 border-transparent" />
                       <div className="flex gap-2">
                        <button onClick={() => handleRunQc(i, img)} disabled={isQcLoading[i]} className="flex-1 bg-vanguard-accent/80 hover:bg-vanguard-accent text-white font-bold py-2 px-3 rounded-lg text-xs transition-opacity duration-300">
                          {isQcLoading[i] ? '...' : 'Run AI QC'}
                        </button>
                       </div>
                       {qcResults[i] && <div className="text-xs p-2 bg-vanguard-bg rounded-md text-vanguard-text-secondary">{qcResults[i]}</div>}
                     </div>
                   ))}
                 </div>
                 {generatedImages.length > 0 && (
                    <button onClick={handleSubmitForReview} className="mt-4 w-full bg-vanguard-green hover:bg-vanguard-green/80 text-white font-bold py-3 px-4 rounded-lg">
                        Submit Variations for Approval
                    </button>
                 )}
              </Card>
            </>
          ) : <Card title="No Shot Selected"><p className="text-center text-vanguard-text-secondary py-16">Select a shot from the list to begin.</p></Card> }
        </div>
      </div>
    </div>
  );
};

export default StoryboardGenerator;
