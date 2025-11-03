import React, { useState } from 'react';
import ScriptAnalysis from './ScriptAnalysis';
import EmotionalArcVisualizer from './EmotionalArcVisualizer';
import PacingVisualizer from './PacingVisualizer';

type Tab = 'Analysis' | 'Emotional Arc' | 'Pacing';

const WritersRoom: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Analysis');

  const renderContent = () => {
    switch(activeTab) {
      case 'Analysis': return <ScriptAnalysis />;
      case 'Emotional Arc': return <EmotionalArcVisualizer />;
      case 'Pacing': return <PacingVisualizer />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">The Writer's Room</h1>
      <p className="text-vanguard-text-secondary">Your central hub for all script and narrative analysis. Use these tools to ensure your story is structurally sound, emotionally resonant, and properly paced.</p>
      
      <div className="flex border-b border-vanguard-bg-tertiary">
        {(['Analysis', 'Emotional Arc', 'Pacing'] as Tab[]).map(tab => (
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
