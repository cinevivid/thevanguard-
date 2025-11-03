

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Card from './Card';
import { Shot, ShotStatus } from '../types';

interface DirectorsApprovalQueueProps {
  shots: Shot[];
  setShots: (updatedShots: Shot[]) => void;
  storyboardVariations: Record<string, string[]>;
  setLockedStoryboard: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const DirectorsApprovalQueue: React.FC<DirectorsApprovalQueueProps> = ({ shots, setShots, storyboardVariations, setLockedStoryboard }) => {
  const shotsForReview = useMemo(() => {
    return shots.filter(shot => shot.status === 'Pending Approval');
  }, [shots]);

  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
  const [selectedTake, setSelectedTake] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedShot && shotsForReview.length > 0) {
      setSelectedShot(shotsForReview[0]);
    } else if (selectedShot && !shotsForReview.find(s => s.id === selectedShot.id)) {
        setSelectedShot(shotsForReview[0] || null);
    }
    setSelectedTake(null);
  }, [shotsForReview, selectedShot]);
  
  const handleSelectTake = (imageBase64: string) => {
    setSelectedTake(imageBase64);
  };

  const handleApprove = () => {
    if (!selectedShot || !selectedTake) return;
    setLockedStoryboard(prev => ({ ...prev, [selectedShot.id]: selectedTake! }));
    // FIX: The status property must be of type ShotStatus. Cast the string literal to ShotStatus to satisfy TypeScript's type checker.
    setShots(shots.map(s => s.id === selectedShot.id ? { ...s, status: 'Storyboard Locked' as ShotStatus } : s));
  };
  
  const handleRevision = () => {
    if (!selectedShot) return;
    // FIX: The status property must be of type ShotStatus. Cast the string literal to ShotStatus to satisfy TypeScript's type checker.
    setShots(shots.map(s => s.id === selectedShot.id ? { ...s, status: 'Not Started' as ShotStatus } : s));
  };
  
  const variations = selectedShot ? storyboardVariations[selectedShot.id] || [] : [];

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">Director's Approval Queue</h1>
        <p className="text-vanguard-text-secondary mt-2">Review and approve storyboard shots. This is the quality gate before assets move to video generation.</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        <Card title="Shots Pending Approval" className="lg:col-span-1 flex flex-col">
          <div className="overflow-y-auto pr-2">
            {shotsForReview.length > 0 ? (
              <ul className="space-y-1">
                {shotsForReview.map(shot => (
                  <li key={shot.id}>
                    <button onClick={() => setSelectedShot(shot)} className={`w-full text-left p-3 rounded-md transition-colors ${selectedShot?.id === shot.id ? 'bg-vanguard-accent/20' : 'hover:bg-vanguard-bg-tertiary'}`}>
                      <p className="font-semibold text-sm">{shot.shotNumber}</p>
                      <p className="text-xs text-vanguard-text-secondary">{shot.description}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-vanguard-text-secondary text-center py-16">No shots are currently pending review.</p>}
          </div>
        </Card>

        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-y-auto pr-2">
          {selectedShot ? (
            <>
              <Card title={`Reviewing: ${selectedShot.shotNumber} - ${selectedShot.description}`}>
                <div className="grid grid-cols-2 gap-4">
                  {variations.map((img, i) => (
                    <div key={i} className="relative group cursor-pointer" onClick={() => handleSelectTake(img)}>
                      <img src={`data:image/png;base64,${img}`} alt={`Variation ${i+1}`} className={`w-full rounded-md border-4 ${selectedTake === img ? 'border-vanguard-accent' : 'border-transparent'}`} />
                      <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">Take {i+1}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="flex gap-4">
                <button onClick={handleApprove} disabled={!selectedTake} className="flex-1 bg-vanguard-green hover:bg-vanguard-green/80 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50">✅ Approve Selected Take</button>
                <button onClick={handleRevision} className="flex-1 bg-vanguard-orange hover:bg-vanguard-orange/80 text-white font-bold py-3 px-4 rounded-lg">🔄 Request Revision</button>
              </div>
            </>
          ) : <Card title="No Shot Selected"><p className="text-center text-vanguard-text-secondary py-16">Select a shot from the queue to begin review.</p></Card>}
        </div>
      </div>
    </div>
  );
};

export default DirectorsApprovalQueue;