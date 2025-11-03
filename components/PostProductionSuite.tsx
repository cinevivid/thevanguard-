
import React, { useState, useCallback } from 'react';
import { Shot, TimelineTrack, View, TimelineClip } from '../types';
import EditBay from './EditBay';
import AudioProduction from './AudioProduction';
import ColorVFXHub from './ColorVFXHub';
import TrailerGenerator from './TrailerGenerator';
import VideoGenerator from './VideoGenerator';
import { generateAmbientAudio, analyzePacingOfClips } from '../services/geminiService';
import Card from './Card';


interface PostProductionSuiteProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
  lockedStoryboard: Record<string, string>;
  generatedVideos: Record<string, string>;
  setGeneratedVideos: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  audioUrls: Record<string, string>;
  setAudioUrls: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  timeline: TimelineTrack[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineTrack[]>>;
  setCurrentView: (view: View) => void;
}

type Tab = 'Video Generation' | 'Audio' | 'Edit Bay' | 'Color & VFX' | 'Trailer';

const PostProductionSuite: React.FC<PostProductionSuiteProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('Video Generation');
  const [ambiencePrompt, setAmbiencePrompt] = useState('a 60-second seamless loop of an underground military base with a low electrical hum, distant machinery, and occasional metallic echoes');
  const [ambienceResult, setAmbienceResult] = useState('');
  const [isAmbienceLoading, setIsAmbienceLoading] = useState(false);
  
  const [pacingResult, setPacingResult] = useState('');
  const [isPacingLoading, setIsPacingLoading] = useState(false);

  const handleGenerateAmbience = useCallback(async () => {
    setIsAmbienceLoading(true);
    setAmbienceResult('');
    try {
        const stream = generateAmbientAudio(ambiencePrompt);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setAmbienceResult(fullResponse);
        }
    } catch(e) { setAmbienceResult("Error generating ambient audio description."); }
    finally { setIsAmbienceLoading(false); }
  }, [ambiencePrompt]);

  const handlePacingAnalysis = useCallback(async () => {
    const videoClips = props.timeline.find(t => t.id === 'video')?.clips;
    if (!videoClips || videoClips.length === 0) {
      setPacingResult("No video clips on the timeline to analyze.");
      return;
    }
    setIsPacingLoading(true);
    setPacingResult('');
    try {
        const stream = analyzePacingOfClips(videoClips);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setPacingResult(fullResponse);
        }
    } catch(e) { setPacingResult("Error analyzing pacing."); }
    finally { setIsPacingLoading(false); }
  }, [props.timeline]);

  const renderContent = () => {
    switch (activeTab) {
        case 'Video Generation':
            return <VideoGenerator {...props} />;
        case 'Audio':
            return (
                <div className="space-y-6">
                    <AudioProduction audioUrls={props.audioUrls} setAudioUrls={props.setAudioUrls} />
                    <Card title="AI Ambience Generator">
                        <label className="font-semibold">Describe the ambient soundscape:</label>
                        <input type="text" value={ambiencePrompt} onChange={e => setAmbiencePrompt(e.target.value)} className="w-full bg-vanguard-bg p-2 rounded-md border border-vanguard-bg-tertiary mt-2"/>
                        <button onClick={handleGenerateAmbience} disabled={isAmbienceLoading} className="w-full mt-4 bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                            {isAmbienceLoading ? 'Generating...' : 'Generate Ambience Description'}
                        </button>
                        <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[100px]">{ambienceResult}</div>
                    </Card>
                </div>
            );
        case 'Edit Bay':
            return (
                <div className="space-y-6">
                    <EditBay {...props} />
                     <Card title="AI Pacing Assistant">
                        <button onClick={handlePacingAnalysis} disabled={isPacingLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                            {isPacingLoading ? 'Analyzing...' : 'Analyze Timeline Pacing'}
                        </button>
                        <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[100px]">{pacingResult}</div>
                    </Card>
                </div>
            );
        case 'Color & VFX':
            return <ColorVFXHub shots={props.shots} lockedStoryboard={props.lockedStoryboard} />;
        case 'Trailer':
            return <TrailerGenerator {...props} />;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Post-Production Suite</h1>
      <p className="text-vanguard-text-secondary mb-6">A unified hub for all post-production activities, from editing and sound design to final color and marketing.</p>
      <div className="flex border-b border-vanguard-bg-tertiary mb-6 flex-wrap">
        {(['Video Generation', 'Audio', 'Edit Bay', 'Color & VFX', 'Trailer'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-4 text-sm font-semibold ${activeTab === tab ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>
            {tab}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default PostProductionSuite;
