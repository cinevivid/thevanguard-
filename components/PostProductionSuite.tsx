import React, { useState } from 'react';
import { Shot, TimelineTrack, View } from '../types';
import EditBay from './EditBay';
import AudioProduction from './AudioProduction';
import ColorVFXHub from './ColorVFXHub';
import TrailerGenerator from './TrailerGenerator';
import VideoGenerator from './VideoGenerator';

interface PostProductionSuiteProps {
  shots: Shot[];
  lockedStoryboard: Record<string, string>;
  generatedVideos: Record<string, string>;
  audioUrls: Record<string, string>;
  setAudioUrls: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  timeline: TimelineTrack[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineTrack[]>>;
  setCurrentView: (view: View) => void;
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
  setGeneratedVideos: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

type Tab = 'Video Generation' | 'Audio' | 'Edit Bay' | 'Color & VFX' | 'Trailer';

const PostProductionSuite: React.FC<PostProductionSuiteProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('Video Generation');

  const renderContent = () => {
    switch (activeTab) {
        case 'Video Generation':
            return <VideoGenerator shots={props.shots} setShots={props.setShots} lockedStoryboard={props.lockedStoryboard} generatedVideos={props.generatedVideos} setGeneratedVideos={props.setGeneratedVideos} />;
        case 'Audio':
            return <AudioProduction audioUrls={props.audioUrls} setAudioUrls={props.setAudioUrls} />;
        case 'Edit Bay':
            return <EditBay shots={props.shots} generatedVideos={props.generatedVideos} audioUrls={props.audioUrls} timeline={props.timeline} setTimeline={props.setTimeline} />;
        case 'Color & VFX':
            return <ColorVFXHub shots={props.shots} lockedStoryboard={props.lockedStoryboard} />;
        case 'Trailer':
            return <TrailerGenerator shots={props.shots} generatedVideos={props.generatedVideos} setTimeline={props.setTimeline} setCurrentView={props.setCurrentView} />;
    }
  };

  return (
    <div>
      <div className="flex border-b border-vanguard-bg-tertiary mb-6">
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
