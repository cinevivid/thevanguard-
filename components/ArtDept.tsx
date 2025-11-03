import React, { useState } from 'react';
import { Shot } from '../types';
import LookDevLab from './LookDevLab';
import AICastingStudio from './AICastingStudio';
import CanonicalAssets from './CanonicalAssets';
import StoryboardGenerator from './StoryboardGenerator';

interface ArtDeptProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
  lockedAssets: Record<string, string | null>;
  setLockedAssets: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
  setStoryboardVariations: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

type Tab = 'Look Dev' | 'Casting' | 'Canonical Assets' | 'Storyboarding';

const ArtDept: React.FC<ArtDeptProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('Look Dev');

  const renderContent = () => {
    switch (activeTab) {
      case 'Look Dev':
        return <LookDevLab />;
      case 'Casting':
        return <AICastingStudio />;
      case 'Canonical Assets':
        return <CanonicalAssets lockedAssets={props.lockedAssets} setLockedAssets={props.setLockedAssets} />;
      case 'Storyboarding':
        return <StoryboardGenerator shots={props.shots} setShots={props.setShots} lockedAssets={props.lockedAssets} setStoryboardVariations={props.setStoryboardVariations} />;
    }
  };

  return (
    <div>
      <div className="flex border-b border-vanguard-bg-tertiary mb-6">
        {(['Look Dev', 'Casting', 'Canonical Assets', 'Storyboarding'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 text-sm font-semibold ${activeTab === tab ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>
            {tab}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default ArtDept;
