
import React, { useState, useMemo, useCallback } from 'react';
import { Shot } from '../types';
import ShotCompositionValidator from './ShotCompositionValidator';
import Card from './Card';
import { visualLookbook } from '../data/visualLookbook';
import { generateLightingDiagram, suggestLensPackage } from '../services/geminiService';

interface CameraDeptProps {
  shots: Shot[];
  lockedStoryboard: Record<string, string>;
}

type Tab = "DP's Validator" | 'AI Lighting Designer' | 'AI Lens Package' | 'Visual Lookbook';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\n/g, '<br />').replace(/\* (.*?)\<br \/\>/g, '<li class="ml-4 list-disc">$1</li>') }} />;
};

const CameraDept: React.FC<CameraDeptProps> = ({ shots, lockedStoryboard }) => {
  const [activeTab, setActiveTab] = useState<Tab>("DP's Validator");
  
  const [selectedShotId, setSelectedShotId] = useState<string | null>(shots[0]?.id || null);
  const selectedShot = useMemo(() => shots.find(s => s.id === selectedShotId), [selectedShotId, shots]);
  
  const [lightingResult, setLightingResult] = useState('');
  const [isLightingLoading, setIsLightingLoading] = useState(false);
  const [lensResult, setLensResult] = useState('');
  const [isLensLoading, setIsLensLoading] = useState(false);

  const handleGenerateLighting = useCallback(async () => {
    if (!selectedShot) return;
    setIsLightingLoading(true);
    setLightingResult('');
    try {
        const stream = generateLightingDiagram(selectedShot.description);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setLightingResult(fullResponse);
        }
    } catch(e) { setLightingResult("Error generating lighting diagram."); }
    finally { setIsLightingLoading(false); }
  }, [selectedShot]);
  
  const handleSuggestLens = useCallback(async () => {
    if (!selectedShot) return;
    setIsLensLoading(true);
    setLensResult('');
    try {
        const stream = suggestLensPackage(selectedShot.description);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setLensResult(fullResponse);
        }
    } catch(e) { setLensResult("Error suggesting lens package."); }
    finally { setIsLensLoading(false); }
  }, [selectedShot]);

  const renderContent = () => {
    const shotSelector = (
        <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="shot-select" className="text-sm font-medium">Select Shot:</label>
            <select id="shot-select" value={selectedShotId || ''} onChange={e => setSelectedShotId(e.target.value)} className="bg-vanguard-bg-tertiary p-2 rounded-md flex-1">
                <option value="">-- Select a Shot --</option>
                {shots.map(shot => (
                    <option key={shot.id} value={shot.id}>{shot.id}: {shot.description}</option>
                ))}
            </select>
        </div>
    );

    switch (activeTab) {
      case "DP's Validator":
        return <ShotCompositionValidator shots={shots} lockedStoryboard={lockedStoryboard} />;
      case 'AI Lighting Designer':
        return (
            <Card title="AI Lighting Designer">
                {shotSelector}
                <button onClick={handleGenerateLighting} disabled={isLightingLoading || !selectedShot} className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                    {isLightingLoading ? 'Designing...' : 'Generate Lighting Diagram'}
                </button>
                <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[200px]"><MarkdownRenderer content={lightingResult} /></div>
            </Card>
        );
      case 'AI Lens Package':
        return (
            <Card title="AI Lens & Camera Package Suggester">
                {shotSelector}
                <button onClick={handleSuggestLens} disabled={isLensLoading || !selectedShot} className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                    {isLensLoading ? 'Analyzing...' : 'Suggest Lens & Movement'}
                </button>
                <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[200px]"><MarkdownRenderer content={lensResult} /></div>
            </Card>
        );
      case 'Visual Lookbook':
        return (
            <div className="prose prose-invert max-w-none p-4 bg-vanguard-bg-secondary rounded-lg max-h-[75vh] overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">{visualLookbook}</pre>
            </div>
        );
    }
  };

  return (
    <div>
        <h1 className="text-3xl font-bold">Camera & Lighting Dept. (DP's Room)</h1>
        <p className="text-vanguard-text-secondary mb-6">Your dedicated hub for crafting the film's visual language, from composition and lighting to lens selection.</p>
      <div className="flex border-b border-vanguard-bg-tertiary mb-6">
        {(["DP's Validator", 'AI Lighting Designer', 'AI Lens Package', 'Visual Lookbook'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 text-sm font-semibold ${activeTab === tab ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>
            {tab}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default CameraDept;
