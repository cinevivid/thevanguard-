
import React, { useState, useMemo, useCallback } from 'react';
import Card from './Card';
import { Shot, TimelineTrack, TimelineClip } from '../types';
import { generateSoundEffect } from '../services/geminiService';
import { screenplay } from '../data/screenplay';

const decode = (base64: string): Uint8Array => {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error("Failed to decode base64 string:", e);
    return new Uint8Array();
  }
};

interface EditBayProps {
  shots: Shot[];
  generatedVideos: Record<string, string>;
  audioUrls: Record<string, string>;
  timeline: TimelineTrack[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineTrack[]>>;
}

const EditBay: React.FC<EditBayProps> = ({ shots, generatedVideos, audioUrls, timeline, setTimeline }) => {
  const scenesWithVideo = useMemo(() => {
    const sceneIds = new Set<string>();
    shots.forEach(shot => {
      if (generatedVideos[shot.id]) sceneIds.add(shot.scene);
    });
    return Array.from(sceneIds);
  }, [shots, generatedVideos]);

  const [selectedScene, setSelectedScene] = useState<string>(scenesWithVideo[0] || '');
  const [sfxPrompt, setSfxPrompt] = useState('heavy armored boot stepping on broken glass');
  const [isSfxLoading, setIsSfxLoading] = useState(false);

  const clipsForScene = useMemo(() => {
    return shots.filter(shot => shot.scene === selectedScene && generatedVideos[shot.id]);
  }, [selectedScene, shots, generatedVideos]);

  const handleAddToTimeline = (shot: Shot) => {
    setTimeline(prev => prev.map(track => {
      if (track.id === 'video') {
        const newClip: TimelineClip = {
          id: `${shot.id}-${Date.now()}`,
          shot,
          url: generatedVideos[shot.id],
          type: 'Video',
          startTime: track.clips.reduce((max, c) => Math.max(max, c.startTime + c.duration), 0),
          duration: 4, // Assume 4s for now
          // FIX: Add missing 'name' property to conform to TimelineClip type.
          name: shot.shotNumber,
        };
        return { ...track, clips: [...track.clips, newClip] };
      }
      return track;
    }));
  };
  
  const handleGenerateFoley = async (shot: Shot) => {
    setIsSfxLoading(true);
    try {
      const sfxBase64 = await generateSoundEffect(shot.description); // Use shot description for foley
      if (sfxBase64) {
        const audioBytes = decode(sfxBase64);
        const audioBlob = new Blob([audioBytes], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const videoTrack = timeline.find(t => t.id === 'video');
        const correspondingVideo = videoTrack?.clips.find(c => c.shot?.id === shot.id);

        const newClip: TimelineClip = {
          id: `foley-${shot.id}-${Date.now()}`,
          shot: shot,
          url: audioUrl,
          type: 'SFX',
          startTime: correspondingVideo?.startTime || 0,
          duration: 2,
          // FIX: Add missing 'name' property to conform to TimelineClip type.
          name: `Foley: ${shot.shotNumber}`,
        };

        setTimeline(prev => prev.map(track => track.id === 'sfx' ? { ...track, clips: [...track.clips, newClip] } : track));
      }
    } catch (e) {
      console.error("Foley generation failed", e);
    } finally {
      setIsSfxLoading(false);
    }
  };


  const handleExportEDL = () => {
    let edlContent = `TITLE: THE VANGUARD - ${selectedScene}\nFCM: NON-DROP FRAME\n\n`;
    let timecodeOut = 3600 * 30; // 01:00:00:00 at 30fps
    
    timeline.find(t => t.id === 'video')?.clips.forEach((clip, index) => {
      const eventNum = (index + 1).toString().padStart(3, '0');
      const clipName = clip.shot?.id;
      const startTc = new Date(timecodeOut * 1000 / 30).toISOString().substr(11, 11).replace('.', ':');
      const endTc = new Date((timecodeOut + clip.duration * 30) * 1000 / 30).toISOString().substr(11, 11).replace('.', ':');
      
      edlContent += `${eventNum}  AX       V     C        ${startTc} ${endTc} ${startTc} ${endTc}\n`;
      edlContent += `* FROM CLIP NAME: ${clipName}.mp4\n\n`;
      timecodeOut += clip.duration * 30;
    });

    const blob = new Blob([edlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedScene.replace(/ /g, '_')}.edl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">The Edit Bay</h1>
        <p className="text-vanguard-text-secondary mt-2">Assemble a rough cut with video, dialogue, and AI-generated SFX. Export an EDL for professional editing software.</p>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="scene-select" className="text-sm font-medium">Scene:</label>
        <select id="scene-select" value={selectedScene} onChange={e => setSelectedScene(e.target.value)} className="bg-vanguard-bg-tertiary p-2 rounded-md">
          {scenesWithVideo.map(scene => <option key={scene} value={scene}>{scene}</option>)}
        </select>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <Card title="Generated Clips" className="flex-1 flex flex-col">
            <div className="overflow-y-auto pr-2 space-y-2">
                {clipsForScene.map(shot => (
                    <div key={shot.id} className="p-2 rounded-md bg-vanguard-bg-tertiary flex items-center space-x-3">
                        <video src={generatedVideos[shot.id]} className="w-20 h-11 object-cover rounded-sm bg-vanguard-bg" muted loop autoPlay />
                        <div className="flex-1"><p className="font-semibold text-sm">{shot.shotNumber}</p></div>
                        <button onClick={() => handleAddToTimeline(shot)} className="text-2xl hover:text-vanguard-accent" title="Add video to timeline">+</button>
                    </div>
                ))}
            </div>
          </Card>
        </div>
        <Card title="Timeline & Export" className="lg:col-span-2 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 bg-vanguard-bg p-2 rounded-md space-y-2">
                 {timeline.map(track => (
                   <div key={track.id}>
                     <h4 className="text-xs uppercase font-bold text-vanguard-text-secondary mb-1">{track.name}</h4>
                     <div className="relative bg-vanguard-bg-tertiary h-12 rounded-md w-full overflow-hidden">
                       {track.clips.map(clip => (
                         <div key={clip.id} className="absolute h-full bg-vanguard-accent/50 border-l-2 border-vanguard-accent p-1 group" style={{left: `${(clip.startTime / 60) * 100}%`, width: `${(clip.duration / 60) * 100}%`}}>
                           <p className="text-xs truncate text-white">{clip.type === 'Video' ? clip.shot?.shotNumber : 'SFX'}</p>
                           {clip.type === 'Video' && clip.shot && (
                             <button onClick={() => handleGenerateFoley(clip.shot!)} disabled={isSfxLoading} className="absolute top-0 right-0 text-xs bg-black/50 p-0.5 rounded-bl-md opacity-0 group-hover:opacity-100">
                               {isSfxLoading ? '...' : '🔊'}
                            </button>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>
                 ))}
            </div>
             <button onClick={handleExportEDL} disabled={timeline.find(t=>t.id === 'video')?.clips.length === 0} className="mt-4 w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg disabled:bg-vanguard-text-secondary">
                Export EDL for DaVinci Resolve
            </button>
        </Card>
      </div>
    </div>
  );
};

export default EditBay;
