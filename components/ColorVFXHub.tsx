import React, { useState, useMemo, useCallback } from 'react';
import Card from './Card';
import { vfxDatabase } from '../data/vfxDatabase';
import { VFXShot, Shot } from '../types';
import { shotDatabase } from '../data/shotDatabase';
import { getColorBibleAnalysis } from '../services/geminiService';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\n/g, '<br />') }} />;
};

// FIX: Added props interface to accept `shots` and `lockedStoryboard` from App.tsx.
interface ColorVFXHubProps {
  shots: Shot[];
  lockedStoryboard: Record<string, string>;
}

const ColorVFXHub: React.FC<ColorVFXHubProps> = ({ shots, lockedStoryboard }) => {
  const [activeTab, setActiveTab] = useState<'vfx' | 'color'>('vfx');

  const sceneNumbers = useMemo(() => [...new Set(shotDatabase.map(s => s.scene))], []);
  const [selectedScene, setSelectedScene] = useState<string>(sceneNumbers[0] || '');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeColor = useCallback(async () => {
    setIsLoading(true);
    setAnalysis('');
    try {
        const stream = getColorBibleAnalysis(selectedScene);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setAnalysis(fullResponse);
        }
    } catch (e) {
        setAnalysis("Failed to get color analysis.");
    } finally {
        setIsLoading(false);
    }
  }, [selectedScene]);

  const complexityColor = {
    'Simple': 'bg-vanguard-green/20 text-vanguard-green',
    'Medium': 'bg-vanguard-yellow/20 text-yellow-400',
    'Complex': 'bg-vanguard-red/20 text-vanguard-red',
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Color & VFX Hub</h1>
        <p className="text-vanguard-text-secondary mt-2">Manage your film's visual effects pipeline and develop the color grading strategy for each scene.</p>
      </div>

      <div className="flex border-b border-vanguard-bg-tertiary">
        <button onClick={() => setActiveTab('vfx')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'vfx' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>VFX Shot Tracker</button>
        <button onClick={() => setActiveTab('color')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'color' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>AI Color Bible</button>
      </div>

      {activeTab === 'vfx' && (
        <Card title="VFX Shot Database" className="flex-1 flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-vanguard-bg-secondary">
                <tr className="border-b border-vanguard-bg-tertiary">
                  {['id', 'scene', 'description', 'complexity', 'budget', 'timeline'].map(col => (
                    <th key={col} className="py-3 px-4 uppercase tracking-wider text-xs text-vanguard-text-secondary">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vfxDatabase.map(shot => (
                  <tr key={shot.id} className="border-b border-vanguard-bg-tertiary hover:bg-vanguard-bg-tertiary/50">
                    <td className="py-3 px-4 font-mono text-xs">{shot.id}</td>
                    <td className="py-3 px-4">{shot.scene}</td>
                    <td className="py-3 px-4 max-w-sm truncate">{shot.description}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${complexityColor[shot.complexity]}`}>{shot.complexity}</span>
                    </td>
                    <td className="py-3 px-4">{shot.budget}</td>
                    <td className="py-3 px-4">{shot.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'color' && (
        <Card title="AI Color Bible Analysis">
           <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="scene-select">Select Scene:</label>
            <select id="scene-select" value={selectedScene} onChange={e => setSelectedScene(e.target.value)} className="bg-vanguard-bg-tertiary p-2 rounded-md">
              {sceneNumbers.map(scene => <option key={scene}>{scene}</option>)}
            </select>
            <button onClick={handleAnalyzeColor} disabled={isLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg">
                {isLoading ? 'Analyzing...' : `Analyze Color for ${selectedScene}`}
            </button>
          </div>
          <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[200px] max-h-[60vh] overflow-y-auto">
              {isLoading && <p>AI Colorist is analyzing the lookbook...</p>}
              {!isLoading && !analysis && <p>Select a scene and click Analyze to get color grading guidance.</p>}
              {analysis && <MarkdownRenderer content={analysis} />}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ColorVFXHub;