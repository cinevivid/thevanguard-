
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DirectorsRoom from './components/DirectorsRoom';
import WritersRoom from './components/WritersRoom';
import ArtDept from './components/ArtDept';
import CameraDept from './components/CameraDept';
import PostProductionSuite from './components/PostProductionSuite';
import ProductionOffice from './components/ProductionOffice';
import ShotDatabaseManager from './components/ShotDatabaseManager';
import ContinuityVerifier from './components/ContinuityVerifier';
import AssetLibrary from './components/AssetLibrary';
import ToolsHub from './components/ToolsHub';
import ProductionAudit from './components/ProductionAudit';
import Departments from './components/Departments';

import { View, Shot, TimelineTrack, Task, BudgetItem, Act, Scene } from './types';
import { tasks as initialTasks } from './data/tasks';
import { productionData } from './data/productionData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DIRECTORS_ROOM);
  
  const [lockedAssets, setLockedAssets] = useState<Record<string, string | null>>(() => {
    const saved = localStorage.getItem('lockedAssets');
    return saved ? JSON.parse(saved) : {};
  });

  const [storyboardVariations, setStoryboardVariations] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('storyboardVariations');
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
  
  const [acts, setActs] = useState<Act[]>(() => {
    const saved = localStorage.getItem('acts');
    return saved ? JSON.parse(saved) : productionData.acts;
  });
  
  const [scenes, setScenes] = useState<Scene[]>(() => {
    const saved = localStorage.getItem('scenes');
    return saved ? JSON.parse(saved) : productionData.scenes;
  });

  const [shots, setShots] = useState<Shot[]>(() => {
    const saved = localStorage.getItem('shots');
    return saved ? JSON.parse(saved) : productionData.shots;
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
      { id: 'ambience', name: 'Ambience', clips: [] },
      { id: 'music', name: 'Music', clips: [] },
    ];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [budget, setBudget] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem('budget');
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => { localStorage.setItem('lockedAssets', JSON.stringify(lockedAssets)); }, [lockedAssets]);
  useEffect(() => { localStorage.setItem('storyboardVariations', JSON.stringify(storyboardVariations)); }, [storyboardVariations]);
  useEffect(() => { localStorage.setItem('lockedStoryboard', JSON.stringify(lockedStoryboard)); }, [lockedStoryboard]);
  useEffect(() => { localStorage.setItem('generatedVideos', JSON.stringify(generatedVideos)); }, [generatedVideos]);
  useEffect(() => { localStorage.setItem('acts', JSON.stringify(acts)); }, [acts]);
  useEffect(() => { localStorage.setItem('scenes', JSON.stringify(scenes)); }, [scenes]);
  useEffect(() => { localStorage.setItem('shots', JSON.stringify(shots)); }, [shots]);
  useEffect(() => { localStorage.setItem('audioUrls', JSON.stringify(audioUrls)); }, [audioUrls]);
  useEffect(() => { localStorage.setItem('timeline', JSON.stringify(timeline)); }, [timeline]);
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('budget', JSON.stringify(budget)); }, [budget]);


  const renderView = () => {
    // FIX: Removed generic `commonProps` and now pass specific props to each component
    // to ensure type safety and prevent passing unnecessary data.
    switch (currentView) {
      case View.DIRECTORS_ROOM:
        return <DirectorsRoom shots={shots} setShots={setShots} storyboardVariations={storyboardVariations} setLockedStoryboard={setLockedStoryboard} setCurrentView={setCurrentView} />;
      case View.WRITERS_ROOM:
        return <WritersRoom />;
      case View.ART_DEPT:
        return <ArtDept shots={shots} setShots={setShots} lockedAssets={lockedAssets} setLockedAssets={setLockedAssets} storyboardVariations={storyboardVariations} setStoryboardVariations={setStoryboardVariations} setLockedStoryboard={setLockedStoryboard} setCurrentView={setCurrentView} />;
      case View.CAMERA_DEPT:
        return <CameraDept shots={shots} lockedStoryboard={lockedStoryboard} />;
      case View.POST_PRODUCTION_SUITE:
        return <PostProductionSuite shots={shots} setShots={setShots} lockedStoryboard={lockedStoryboard} generatedVideos={generatedVideos} setGeneratedVideos={setGeneratedVideos} audioUrls={audioUrls} setAudioUrls={setAudioUrls} timeline={timeline} setTimeline={setTimeline} setCurrentView={setCurrentView} />;
      case View.PRODUCTION_OFFICE:
        return <ProductionOffice tasks={tasks} setTasks={setTasks} budget={budget} setBudget={setBudget} />;
      case View.SHOT_DATABASE:
        return <ShotDatabaseManager shots={shots} setShots={setShots} />;
      case View.DEPARTMENTS:
        return <Departments shots={shots} setShots={setShots} />;
      case View.CONTINUITY_VERIFIER:
        return <ContinuityVerifier shots={shots} lockedStoryboard={lockedStoryboard} />;
      case View.ASSET_LIBRARY:
        return <AssetLibrary shots={shots} lockedStoryboard={lockedStoryboard} generatedVideos={generatedVideos} />;
       case View.TOOLS_HUB:
        return <ToolsHub setCurrentView={setCurrentView} />;
      case View.PRODUCTION_AUDIT:
        return <ProductionAudit acts={acts} scenes={scenes} shots={shots} />;
      default:
        return <DirectorsRoom shots={shots} setShots={setShots} storyboardVariations={storyboardVariations} setLockedStoryboard={setLockedStoryboard} setCurrentView={setCurrentView} />;
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
