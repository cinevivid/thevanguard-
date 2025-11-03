
import React, { useState } from 'react';
import ScriptAnalysis from './ScriptAnalysis';
import EmotionalArcVisualizer from './EmotionalArcVisualizer';
import PacingVisualizer from './PacingVisualizer';
import Card from './Card';
import { analyzeScript } from '../services/geminiService';
// FIX: Import Act and Scene types for component props.
import { Act, Scene } from '../types';

type Tab = 'Analysis' | 'Emotional Arc' | 'Pacing' | 'Story DNA';

// FIX: Define props interface to accept `acts` and `scenes` passed from App.tsx.
interface WritersRoomProps {
    acts: Act[];
    scenes: Scene[];
}

const StoryDNAComponent = () => {
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis('');
        // This is a placeholder for a new analysis type we would add
        // to `analyzeScript` in `geminiService.ts` called 'story_dna'.
        try {
            const stream = analyzeScript('full_analysis'); // Using 'full_analysis' as a proxy for now
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                setAnalysis(fullResponse);
            }
        } catch(e) {
            setAnalysis('Error generating Story DNA analysis.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card title="Story DNA Engine">
             <button onClick={handleAnalyze} disabled={isLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg mb-4">
                {isLoading ? 'Analyzing...' : 'Analyze Story DNA'}
            </button>
            <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[200px] max-h-[60vh] overflow-y-auto">
              <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap">{analysis || 'Click button to analyze the script\'s core themes, motifs, and causal physics.'}</div>
            </div>
        </Card>
    );
}

const WritersRoom: React.FC<WritersRoomProps> = ({ acts, scenes }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Analysis');

  const renderContent = () => {
    switch(activeTab) {
      case 'Analysis': return <ScriptAnalysis />;
      case 'Emotional Arc': return <EmotionalArcVisualizer />;
      case 'Pacing': return <PacingVisualizer />;
      case 'Story DNA': return <StoryDNAComponent />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">The Writer's Room</h1>
      <p className="text-vanguard-text-secondary">Your central hub for all script and narrative analysis. Use these tools to ensure your story is structurally sound, emotionally resonant, and properly paced.</p>
      
      <div className="flex border-b border-vanguard-bg-tertiary">
        {(['Analysis', 'Emotional Arc', 'Pacing', 'Story DNA'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 text-sm font-semibold ${activeTab === tab ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>
                {tab}
            </button>
        ))}
      </div>
      
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default WritersRoom;
