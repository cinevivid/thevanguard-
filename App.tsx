import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CorpusAssistant from './components/CorpusAssistant';
import CanonicalAssets from './components/CanonicalAssets';
import StoryboardGenerator from './components/StoryboardGenerator';
import VideoGenerator from './components/VideoGenerator';
import ShotDatabaseManager from './components/ShotDatabaseManager';
import ScriptBreakdown from './components/ScriptBreakdown';
import AudioProduction from './components/AudioProduction';
import EditBay from './components/EditBay';
import DirectorDashboard from './components/DirectorDashboard';
import ToolsHub from './components/ToolsHub';
import EmotionalArchitecture from './components/EmotionalArchitecture';
import VisualStorytelling from './components/VisualStorytelling';
import PacingRhythm from './components/PacingRhythm';
import ScriptAnalysis from './components/ScriptAnalysis';
import ContinuityChecker from './components/ContinuityChecker';
import DocumentManager from './components/DocumentManager';
import LookDevLab from './components/LookDevLab';
import ColorVFXHub from './components/ColorVFXHub';
import ProductionOffice from './components/ProductionOffice';
import AssetLibrary from './components/AssetLibrary';
import TrailerGenerator from './components/TrailerGenerator';


import { View, Shot, TimelineTrack } from './types';
import { shotDatabase } from './data/shotDatabase';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DIRECTOR_DASHBOARD);
  
  const [lockedAssets, setLockedAssets] = useState<Record<string, string | null>>(() => {
    const saved = localStorage.getItem('lockedAssets');
    return saved ? JSON.parse(saved) : {};
  });

  const [lockedStoryboard, setLockedStoryboard] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('lockedStoryboard');
    return saved ? JSON.parse(saved) : {};
  });

  const [generatedVideos, setGeneratedVideos] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('generatedVideos');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [shots, setShots] = useState<Shot[]>(() => {
    const saved = localStorage.getItem('shots');
    return saved ? JSON.parse(saved) : shotDatabase;
  });

  const [audioUrls, setAudioUrls] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('audioUrls');
    return saved ? JSON.parse(saved) : {};
  });

  const [timeline, setTimeline] = useState<TimelineTrack[]>(() => {
    const saved = localStorage.getItem('timeline');
    return saved ? JSON.parse(saved) : [
      { id: 'video', name: 'Video', clips: [] },
      { id: 'dialogue', name: 'Dialogue', clips: [] },
      { id: 'sfx', name: 'SFX', clips: [] },
      { id: 'music', name: 'Music', clips: [] },
    ];
  });


  useEffect(() => {
    localStorage.setItem('lockedAssets', JSON.stringify(lockedAssets));
  }, [lockedAssets]);

  useEffect(() => {
    localStorage.setItem('lockedStoryboard', JSON.stringify(lockedStoryboard));
  }, [lockedStoryboard]);

  useEffect(() => {
    localStorage.setItem('generatedVideos', JSON.stringify(generatedVideos));
  }, [generatedVideos]);
  
  useEffect(() => {
    localStorage.setItem('shots', JSON.stringify(shots));
  }, [shots]);

  useEffect(() => {
    localStorage.setItem('audioUrls', JSON.stringify(audioUrls));
  }, [audioUrls]);

  useEffect(() => {
    localStorage.setItem('timeline', JSON.stringify(timeline));
  }, [timeline]);


  const renderView = () => {
    switch (currentView) {
      case View.DIRECTOR_DASHBOARD:
        return <DirectorDashboard shots={shots} setCurrentView={setCurrentView} />;
      case View.TOOLS_HUB:
        return <ToolsHub setCurrentView={setCurrentView} />;
      case View.PRODUCTION_OFFICE:
        return <ProductionOffice shots={shots} />;
      case View.EMOTIONAL_ARCHITECTURE:
        return <EmotionalArchitecture />;
      case View.VISUAL_STORYTELLING:
        return <VisualStorytelling />;
      case View.PACING_RHYTHM:
        return <PacingRhythm />;
      case View.SCRIPT_ANALYSIS:
        return <ScriptAnalysis />;
      case View.CONTINUITY_CHECKER:
        return <ContinuityChecker />;
      case View.DOCUMENT_MANAGER:
        return <DocumentManager />;
      case View.SHOT_DATABASE:
        return <ShotDatabaseManager shots={shots} setShots={setShots} />;
      case View.SCRIPT_BREAKDOWN:
        return <ScriptBreakdown />;
      case View.LOOK_DEV_LAB:
        return <LookDevLab />;
      case View.CORPUS_ASSISTANT:
        return <CorpusAssistant />;
      case View.CANONICAL_ASSETS:
        return <CanonicalAssets lockedAssets={lockedAssets} setLockedAssets={setLockedAssets} />;
      case View.STORYBOARD_GENERATOR:
        return <StoryboardGenerator shots={shots} setShots={setShots} lockedAssets={lockedAssets} lockedStoryboard={lockedStoryboard} setLockedStoryboard={setLockedStoryboard} />;
      case View.VIDEO_GENERATOR:
        return <VideoGenerator shots={shots} setShots={setShots} lockedStoryboard={lockedStoryboard} generatedVideos={generatedVideos} setGeneratedVideos={setGeneratedVideos} />;
      case View.AUDIO_PRODUCTION:
        return <AudioProduction audioUrls={audioUrls} setAudioUrls={setAudioUrls} />;
      case View.COLOR_VFX_HUB:
        return <ColorVFXHub shots={shots} lockedStoryboard={lockedStoryboard} />;
      case View.EDIT_BAY:
        return <EditBay shots={shots} generatedVideos={generatedVideos} audioUrls={audioUrls} timeline={timeline} setTimeline={setTimeline} />;
      case View.ASSET_LIBRARY:
        return <AssetLibrary lockedStoryboard={lockedStoryboard} generatedVideos={generatedVideos} shots={shots} />;
      case View.TRAILER_GENERATOR:
        return <TrailerGenerator shots={shots} generatedVideos={generatedVideos} setTimeline={setTimeline} setCurrentView={setCurrentView} />;
      default:
        return <DirectorDashboard shots={shots} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-vanguard-bg text-vanguard-text font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-vanguard-bg p-4 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;