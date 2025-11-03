import React, { useState } from 'react';
import { Shot } from '../types';
import ShotCompositionValidator from './ShotCompositionValidator';
import { visualLookbook } from '../data/visualLookbook';

interface CameraDeptProps {
  shots: Shot[];
  lockedStoryboard: Record<string, string>;
}

type Tab = "DP's Validator" | 'Visual Lookbook';

const CameraDept: React.FC<CameraDeptProps> = ({ shots, lockedStoryboard }) => {
  const [activeTab, setActiveTab] = useState<Tab>("DP's Validator");

  const renderContent = () => {
    switch (activeTab) {
      case "DP's Validator":
        return <ShotCompositionValidator shots={shots} lockedStoryboard={lockedStoryboard} />;
      case 'Visual Lookbook':
        return (
            <div className="prose prose-invert max-w-none p-4 bg-vanguard-bg-secondary rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{visualLookbook}</pre>
            </div>
        );
    }
  };

  return (
    <div>
      <div className="flex border-b border-vanguard-bg-tertiary mb-6">
        {(["DP's Validator", 'Visual Lookbook'] as Tab[]).map(tab => (
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
