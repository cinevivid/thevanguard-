
import React, { useState, useMemo } from 'react';
import { View, Shot } from '../types';
import DirectorDashboard from './DirectorDashboard';
import DirectorsApprovalQueue from './DirectorsApprovalQueue';
import { getAIBrainTrustReview } from '../services/geminiService';
import Card from './Card';

interface DirectorsRoomProps {
  shots: Shot[];
  setShots: (updatedShots: Shot[]) => void;
  storyboardVariations: Record<string, string[]>;
  lockedStoryboard: Record<string, string>;
  setLockedStoryboard: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCurrentView: (view: View) => void;
}

type Tab = 'Dashboard' | 'Approval Queue' | 'Previz Timeline' | 'Brain Trust';

const BrainTrustComponent: React.FC<{shots: Shot[], lockedStoryboard: Record<string, string>}> = ({shots, lockedStoryboard}) => {
    const lockedShots = useMemo(() => shots.filter(shot => lockedStoryboard[shot.id]), [shots, lockedStoryboard]);
    const [selectedShotId, setSelectedShotId] = useState<string | null>(lockedShots[0]?.id || null);
    const selectedShot = useMemo(() => shots.find(s => s.id === selectedShotId), [selectedShotId, shots]);
    
    const [reviews, setReviews] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleRunReview = async () => {
        if (!selectedShot || !lockedStoryboard[selectedShot.id]) return;
        setIsLoading(true);
        setReviews({});
        try {
            const stream = getAIBrainTrustReview(selectedShot, lockedStoryboard[selectedShot.id]);
            for await (const review of stream) {
                setReviews(prev => ({ ...prev, [review.expert]: review.review }));
            }
        } catch(e) { console.error(e) }
        finally { setIsLoading(false); }
    };
    
    return (
        <Card title="AI Creative Brain Trust">
            <div className="flex items-center space-x-4 mb-4">
                <select value={selectedShotId || ''} onChange={e => setSelectedShotId(e.target.value)} className="bg-vanguard-bg-tertiary p-2 rounded-md flex-1">
                    <option value="">-- Select a Locked Shot --</option>
                    {lockedShots.map(shot => <option key={shot.id} value={shot.id}>{shot.id}: {shot.description}</option>)}
                </select>
                <button onClick={handleRunReview} disabled={isLoading || !selectedShotId} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                    {isLoading ? 'Reviewing...' : 'Run Brain Trust Review'}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {Object.entries(reviews).map(([expert, review]) => (
                    <div key={expert} className="p-4 bg-vanguard-bg rounded-lg">
                        <h4 className="font-bold capitalize text-vanguard-accent">{expert}</h4>
                        <p className="text-sm mt-2">{review}</p>
                    </div>
                ))}
            </div>
        </Card>
    )
}

const DirectorsRoom: React.FC<DirectorsRoomProps> = ({ shots, setShots, storyboardVariations, lockedStoryboard, setLockedStoryboard, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');

  const lockedStoryboardShots = useMemo(() => {
    return shots.filter(shot => lockedStoryboard[shot.id]).sort((a, b) => a.id.localeCompare(b.id));
  }, [shots, lockedStoryboard]);

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
            <p className="text-sm text-vanguard-text-secondary mb-6">A full "paper edit" of your film. Review the visual flow of all locked storyboard shots in sequence.</p>
            <div className="flex flex-nowrap overflow-x-auto gap-1 p-2 bg-vanguard-bg-tertiary rounded-md min-h-[200px] items-center">
              {lockedStoryboardShots.map((shot, index) => (
                <div key={shot.id} className="flex-shrink-0 w-48 bg-vanguard-bg rounded-md p-1 group relative">
                  <div className="absolute top-1 left-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded-full z-10">{index + 1}</div>
                  <img src={`data:image/png;base64,${lockedStoryboard[shot.id]}`} alt={shot.description} className="w-full aspect-video object-cover rounded-sm bg-vanguard-bg-secondary"/>
                  <p className="text-xs font-semibold truncate mt-1">{shot.id}</p>
                   <p className="text-[10px] text-vanguard-text-secondary truncate">{shot.description}</p>
                </div>
              ))}
               {lockedStoryboardShots.length === 0 && <p className="text-center w-full p-8 text-vanguard-text-secondary">No storyboard shots have been locked yet.</p>}
            </div>
          </div>
        );
       case 'Brain Trust':
        return <BrainTrustComponent shots={shots} lockedStoryboard={lockedStoryboard} />;
    }
  };

  return (
    <div>
      <div className="flex border-b border-vanguard-bg-tertiary mb-6">
        {(['Dashboard', 'Approval Queue', 'Previz Timeline', 'Brain Trust'] as Tab[]).map(tab => (
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
