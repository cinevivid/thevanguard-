import React, { useState, useMemo, useCallback } from 'react';
import Card from './Card';
import { Shot } from '../types';
import { analyzeShotComposition } from '../services/geminiService';

interface ShotCompositionValidatorProps {
  shots: Shot[];
  lockedStoryboard: Record<string, string>;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\n/g, '<br />').replace(/\* (.*?)\<br \/\>/g, '<li class="ml-4 list-disc">$1</li>') }} />;
};

const ShotCompositionValidator: React.FC<ShotCompositionValidatorProps> = ({ shots, lockedStoryboard }) => {
  const lockedShots = useMemo(() => shots.filter(shot => lockedStoryboard[shot.id]), [shots, lockedStoryboard]);
  
  const [selectedShotId, setSelectedShotId] = useState<string | null>(lockedShots[0]?.id || null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedShot = useMemo(() => shots.find(s => s.id === selectedShotId), [selectedShotId, shots]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedShot || !lockedStoryboard[selectedShot.id]) {
        setError("Please select a shot with a locked storyboard image.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult('');

    try {
        const imageBase64 = lockedStoryboard[selectedShot.id];
        const stream = analyzeShotComposition(selectedShot, imageBase64);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setAnalysisResult(fullResponse);
        }
    } catch(err) {
        setError("Failed to get analysis from AI.");
    } finally {
        setIsLoading(false);
    }
  }, [selectedShot, lockedStoryboard]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">AI Shot Composition Validator</h1>
      <p className="text-vanguard-text-secondary">Your AI Director of Photography. Get an expert critique on composition, lighting, and visual storytelling for your locked shots.</p>
      
      <Card title="Select Shot for Analysis">
        <div className="flex items-center space-x-4">
            <label htmlFor="shot-select">Select Locked Shot:</label>
            <select id="shot-select" value={selectedShotId || ''} onChange={e => setSelectedShotId(e.target.value)} className="bg-vanguard-bg-tertiary p-2 rounded-md flex-1">
                <option value="">-- Select a Shot --</option>
                {lockedShots.map(shot => (
                    <option key={shot.id} value={shot.id}>{shot.id}: {shot.description}</option>
                ))}
            </select>
            <button onClick={handleAnalyze} disabled={isLoading || !selectedShotId} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                {isLoading ? 'Analyzing...' : 'Run Composition Analysis'}
            </button>
        </div>
      </Card>
      
      {selectedShot && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title={`Image: ${selectedShot.id}`}>
                <div className="aspect-video bg-vanguard-bg rounded-lg flex items-center justify-center">
                    {lockedStoryboard[selectedShot.id] ? (
                        <img src={`data:image/png;base64,${lockedStoryboard[selectedShot.id]}`} alt={selectedShot.description} className="max-h-full max-w-full object-contain"/>
                    ) : (
                        <p className="text-vanguard-text-secondary">No image locked for this shot.</p>
                    )}
                </div>
                <div className="mt-4 text-xs space-y-1 text-vanguard-text-secondary">
                    <p><strong>Description:</strong> {selectedShot.description}</p>
                    <p><strong>Camera Angle:</strong> {selectedShot.cameraAngle || 'N/A'}</p>
                    <p><strong>Lens Type:</strong> {selectedShot.lensType || 'N/A'}</p>
                </div>
            </Card>
            <Card title="AI Cinematographer Analysis">
                 <div className="p-4 bg-vanguard-bg rounded-md min-h-[300px] max-h-[60vh] overflow-y-auto">
                    {isLoading && <p>AI is analyzing the shot composition...</p>}
                    {error && <p className="text-vanguard-red">{error}</p>}
                    {!isLoading && !analysisResult && <p>Click "Run Analysis" to get a professional critique.</p>}
                    {analysisResult && <MarkdownRenderer content={analysisResult} />}
                </div>
            </Card>
        </div>
      )}

    </div>
  );
};

export default ShotCompositionValidator;