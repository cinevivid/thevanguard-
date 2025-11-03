
import React, { useState, useCallback } from 'react';
import { Shot, View } from '../types';
import LookDevLab from './LookDevLab';
import AICastingStudio from './AICastingStudio';
import CanonicalAssets from './CanonicalAssets';
import StoryboardGenerator from './StoryboardGenerator';
import Card from './Card';
import { generatePropConcept } from '../services/geminiService';

interface ArtDeptProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
  lockedAssets: Record<string, string | null>;
  setLockedAssets: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
  storyboardVariations: Record<string, string[]>;
  setStoryboardVariations: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setLockedStoryboard: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCurrentView: (view: View) => void;
}

type Tab = 'Look Dev' | 'Casting' | 'Canonical Assets' | 'Storyboarding' | 'Prop Design' | 'Location Scout';

const ArtDept: React.FC<ArtDeptProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('Look Dev');
  
  const [propPrompt, setPropPrompt] = useState('a futuristic disk bomb with three glowing red concentric rings');
  const [propImages, setPropImages] = useState<string[]>([]);
  const [isPropLoading, setIsPropLoading] = useState(false);
  
  const handleGenerateProps = useCallback(async () => {
    setIsPropLoading(true);
    setPropImages([]);
    try {
      const images = await generatePropConcept(propPrompt);
      setPropImages(images);
    } catch (e) { console.error(e); }
    finally { setIsPropLoading(false); }
  }, [propPrompt]);

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
      case 'Prop Design':
        return (
            <Card title="AI Prop Generator">
                <div className="space-y-4">
                  <label className="font-semibold">Describe a key prop:</label>
                  <input type="text" value={propPrompt} onChange={e => setPropPrompt(e.target.value)} className="w-full bg-vanguard-bg p-2 rounded-md border border-vanguard-bg-tertiary" />
                  <button onClick={handleGenerateProps} disabled={isPropLoading} className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                      {isPropLoading ? 'Generating...' : 'Generate Prop Concepts'}
                  </button>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 min-h-[100px]">
                      {propImages.map((img, i) => <img key={i} src={`data:image/png;base64,${img}`} className="w-full rounded-md" />)}
                  </div>
                </div>
            </Card>
        );
      case 'Location Scout':
        return (
            <Card title="AI Virtual Location Scout">
                <p className="text-vanguard-text-secondary">This tool will use Google Search grounding to find real-world architectural references for your scenes.</p>
                <p className="text-vanguard-yellow text-sm mt-4">Feature coming soon.</p>
            </Card>
        );
    }
  };

  return (
    <div>
        <h1 className="text-3xl font-bold">Digital Art Department</h1>
        <p className="text-vanguard-text-secondary mb-6">The hub for all world-building, character design, and asset creation.</p>
      <div className="flex border-b border-vanguard-bg-tertiary mb-6 flex-wrap">
        {(['Look Dev', 'Casting', 'Canonical Assets', 'Storyboarding', 'Prop Design', 'Location Scout'] as Tab[]).map(tab => (
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
