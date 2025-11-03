
import React, { useState, useCallback, useMemo } from 'react';
import Card from './Card';
import { generateTrailerCutlist } from '../services/geminiService';
import { View, Shot, TimelineTrack, TimelineClip } from '../types';

interface TrailerGeneratorProps {
  shots: Shot[];
  generatedVideos: Record<string, string>;
  setTimeline: React.Dispatch<React.SetStateAction<TimelineTrack[]>>;
  setCurrentView: (view: View) => void;
}

const TrailerGenerator: React.FC<TrailerGeneratorProps> = ({ shots, generatedVideos, setTimeline, setCurrentView }) => {
  const [cutlist, setCutlist] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCutlist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCutlist('');
    try {
      const stream = generateTrailerCutlist();
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
      }
      setCutlist(fullResponse);
    } catch (err) {
      setError('Failed to generate cutlist from AI.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cutlistShotIds = useMemo(() => cutlist.match(/A\d{2}-S\d{3}-[A-Z]/g) || [], [cutlist]);

  const handleSendToEditBay = () => {
    const videoClips = cutlistShotIds
      .map(shotId => {
        const shot = shots.find(s => s.id === shotId);
        if (shot && generatedVideos[shot.id]) {
          const clip: TimelineClip = {
            id: `${shot.id}-trailer-${Date.now()}`,
            shot,
            url: generatedVideos[shot.id],
            type: 'Video' as 'Video',
            startTime: 0,
            duration: 4, 
            // FIX: Add missing 'name' property to conform to TimelineClip type.
            name: shot.shotNumber,
          };
          return clip;
        }
        return null;
      })
      // FIX: The type predicate `clip is TimelineClip` was incorrect because the inferred type of the mapped array's elements is narrower than `TimelineClip`. 
      // Using a boolean filter correctly narrows the type to the non-null object type, which is assignable to `TimelineClip`.
      .filter(Boolean);
      
    let currentTime = 0;
    const positionedClips = videoClips.map(clip => {
        const positionedClip = {...clip, startTime: currentTime};
        currentTime += clip.duration;
        return positionedClip;
    });

    const newVideoTrack: TimelineTrack = { id: 'video', name: 'Trailer Cut', clips: positionedClips };
    
    setTimeline([
        newVideoTrack,
        { id: 'dialogue', name: 'Dialogue', clips: [] },
        { id: 'sfx', name: 'SFX', clips: [] },
        { id: 'music', name: 'Music', clips: [] },
        { id: 'ambience', name: 'Ambience', clips: [] },
    ]);
    
    // FIX: Property 'EDIT_BAY' does not exist on type 'typeof View'. Navigate to POST_PRODUCTION_SUITE instead.
    setCurrentView(View.POST_PRODUCTION_SUITE);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-vanguard-text">AI Trailer Generator</h1>
      <p className="text-vanguard-text-secondary">Let the AI analyze your screenplay for high-impact moments and generate a suggested "cut list" for a 90-second trailer.</p>

      <Card title="Trailer Generation">
        <div className="flex justify-end gap-4 mb-4">
            <button onClick={handleGenerateCutlist} disabled={isLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg">
                {isLoading ? 'Analyzing...' : '✨ Generate Trailer Cut List'}
            </button>
            <button onClick={handleSendToEditBay} disabled={cutlistShotIds.length === 0} className="bg-vanguard-green hover:bg-vanguard-green/80 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                Send to Edit Bay
            </button>
        </div>
        <div className="p-4 bg-vanguard-bg rounded-md min-h-[200px] max-h-[60vh] overflow-y-auto prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap">
            {isLoading && <p>AI is analyzing the script for trailer moments...</p>}
            {!isLoading && !cutlist && <p>Generated trailer cut list will appear here.</p>}
            {error && <p className="text-vanguard-red">{error}</p>}
            {cutlist && <pre>{cutlist}</pre>}
        </div>
        {cutlistShotIds.length > 0 && 
          <div className="mt-4 text-sm text-vanguard-text-secondary">
              <p>AI has identified {cutlistShotIds.length} key shots for the trailer. {cutlistShotIds.filter(id => !generatedVideos[id]).length} of these shots do not have generated video yet. 'Send to Edit Bay' will assemble the available clips.</p>
          </div>
        }
      </Card>
    </div>
  );
};

export default TrailerGenerator;
