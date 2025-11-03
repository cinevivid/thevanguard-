
import React, { useState, useMemo } from 'react';
import { View, Shot } from '../types';
import DirectorDashboard from './DirectorDashboard';
import DirectorsApprovalQueue from './DirectorsApprovalQueue';

interface DirectorsRoomProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
  storyboardVariations: Record<string, string[]>;
  setLockedStoryboard: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCurrentView: (view: View) => void;
}

type Tab = 'Dashboard' | 'Approval Queue' | 'Previz Timeline';

const DirectorsRoom: React.FC<DirectorsRoomProps> = ({ shots, setShots, storyboardVariations, setLockedStoryboard, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');

  const lockedStoryboardShots = useMemo(() => {
    const lockedShotsMap = new Map<string, Shot>();
    shots.forEach(shot => {
        if (shot.status === 'Storyboard Locked' || shot.status === 'Video Generating' || shot.status === 'Video Complete') {
            lockedShotsMap.set(shot.id, shot);
        }
    });
    // Sort by ID to maintain a consistent timeline order
    return Array.from(lockedShotsMap.values()).sort((a, b) => a.id.localeCompare(b.id));
  }, [shots]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DirectorDashboard shots={shots} setCurrentView={setCurrentView} />;
      case 'Approval Queue':
        return <DirectorsApprovalQueue shots={shots} setShots={setShots} storyboardVariations={storyboardVariations} setLockedStoryboard={setLockedStoryboard} />;
      case 'Previz Timeline':
        return (
          <div className="bg-vanguard-bg p-4 rounded-lg border border-vanguard-bg-tertiary">
            <h2 className="text-xl font-bold mb-2">Pre-visualization Timeline</h2>
            <p className="text-sm text-vanguard-text-secondary mb-6">A full "paper edit" of your film. Review the visual flow of all locked storyboard shots in sequence. This allows you to check pacing and narrative structure before committing to the expensive video generation phase.</p>
            <div className="flex flex-nowrap overflow-x-auto gap-1 p-2 bg-vanguard-bg-tertiary rounded-md min-h-[200px] items-center">
              {lockedStoryboardShots.map((shot, index) => (
                <div key={shot.id} className="flex-shrink-0 w-48 bg-vanguard-bg rounded-md p-1 group relative">
                  <div className="absolute top-1 left-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded-full z-10">{index + 1}</div>
                  <img src={`data:image/png;base64,${storyboardVariations[shot.id]?.[0] || ''}`} alt={shot.description} className="w-full aspect-video object-cover rounded-sm bg-vanguard-bg-secondary"/>
                  <p className="text-xs font-semibold truncate mt-1">{shot.id}</p>
                   <p className="text-[10px] text-vanguard-text-secondary truncate">{shot.description}</p>
                </div>
              ))}
               {lockedStoryboardShots.length === 0 && <p className="text-center w-full p-8 text-vanguard-text-secondary">No storyboard shots have been locked yet. Approve shots in the 'Approval Queue' to see them here.</p>}
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex border-b border-vanguard-bg-tertiary mb-6">
        {(['Dashboard', 'Approval Queue', 'Previz Timeline'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 text-sm font-semibold ${activeTab === tab ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>
            {tab}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default DirectorsRoom;
