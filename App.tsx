
import React, { useState, useEffect, useCallback } from 'react';
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
import APIKeys from './components/APIKeys';
import EmotionalArcVisualizer from './components/EmotionalArcVisualizer';
import PacingVisualizer from './components/PacingVisualizer';
import ShotCompositionValidator from './components/ShotCompositionValidator';
import ScriptBreakdown from './components/ScriptBreakdown';
import DirectorsApprovalQueue from './components/DirectorsApprovalQueue';
// FIX: Cannot find name 'ScriptAnalysis'. Import the component.
import ScriptAnalysis from './components/ScriptAnalysis';


import { View, Shot, TimelineTrack, Task, BudgetItem, Act, Scene } from './types';
import { productionData as fallbackData } from './data/productionData';
import { tasks as initialTasks } from './data/tasks';
import { onShotsUpdate, onTasksUpdate, onBudgetUpdate, updateShot, updateTask, updateBudget } from './services/productionService';
import { getFirebaseDb } from './services/firebaseClient';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DIRECTORS_ROOM);

  // --- LOCAL UI STATE (Not persisted to DB) ---
  const [lockedAssets, setLockedAssets] = useState<Record<string, string | null>>(() => JSON.parse(localStorage.getItem('lockedAssets') || '{}'));
  const [storyboardVariations, setStoryboardVariations] = useState<Record<string, string[]>>(() => JSON.parse(localStorage.getItem('storyboardVariations') || '{}'));
  const [lockedStoryboard, setLockedStoryboard] = useState<Record<string, string>>(() => JSON.parse(localStorage.getItem('lockedStoryboard') || '{}'));
  const [generatedVideos, setGeneratedVideos] = useState<Record<string, string>>(() => JSON.parse(localStorage.getItem('generatedVideos') || '{}'));
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>(() => JSON.parse(localStorage.getItem('audioUrls') || '{}'));
  const [timeline, setTimeline] = useState<TimelineTrack[]>(() => JSON.parse(localStorage.getItem('timeline') || JSON.stringify([
    { id: 'video', name: 'Video', clips: [] }, { id: 'dialogue', name: 'Dialogue', clips: [] },
    { id: 'sfx', name: 'SFX', clips: [] }, { id: 'ambience', name: 'Ambience', clips: [] },
    { id: 'music', name: 'Music', clips: [] }
  ])));


  // --- DATABASE-PERSISTED STATE ---
  const [acts] = useState<Act[]>(fallbackData.acts);
  const [scenes] = useState<Scene[]>(fallbackData.scenes);
  const [shots, setShots] = useState<Shot[]>(fallbackData.shots);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [budget, setBudget] = useState<BudgetItem[]>(() => {
      const savedBudget = localStorage.getItem('budget');
      return savedBudget ? JSON.parse(savedBudget) : [
        { category: 'VFX', planned: 6850, actual: 0 }, { category: 'Subscriptions', planned: 770, actual: 0 },
        { category: 'Marketing', planned: 880, actual: 0 }
      ];
  });

  const [dbError, setDbError] = useState<string | null>(null);

  // Set up real-time listeners for Firebase data
  useEffect(() => {
    if (!getFirebaseDb()) {
      console.warn("Firebase not configured. Falling back to local data.");
      // Load from local storage as fallback
      const localShots = localStorage.getItem('shots');
      if(localShots) setShots(JSON.parse(localShots));
      const localTasks = localStorage.getItem('tasks');
      if(localTasks) setTasks(JSON.parse(localTasks));
      return;
    }
    const unsubscribers = [
      onShotsUpdate(setShots, (err) => setDbError(`Shots: ${err.message}`)),
      onTasksUpdate(setTasks, (err) => setDbError(`Tasks: ${err.message}`)),
      onBudgetUpdate(setBudget, (err) => setDbError(`Budget: ${err.message}`)),
    ];
    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  // Save local UI state to localStorage
  useEffect(() => { localStorage.setItem('lockedAssets', JSON.stringify(lockedAssets)); }, [lockedAssets]);
  useEffect(() => { localStorage.setItem('storyboardVariations', JSON.stringify(storyboardVariations)); }, [storyboardVariations]);
  useEffect(() => { localStorage.setItem('lockedStoryboard', JSON.stringify(lockedStoryboard)); }, [lockedStoryboard]);
  useEffect(() => { localStorage.setItem('generatedVideos', JSON.stringify(generatedVideos)); }, [generatedVideos]);
  useEffect(() => { localStorage.setItem('audioUrls', JSON.stringify(audioUrls)); }, [audioUrls]);
  useEffect(() => { localStorage.setItem('timeline', JSON.stringify(timeline)); }, [timeline]);
   // Fallback saving for DB state if firebase is not connected
  useEffect(() => { if (!getFirebaseDb()) localStorage.setItem('shots', JSON.stringify(shots)); }, [shots]);
  useEffect(() => { if (!getFirebaseDb()) localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { if (!getFirebaseDb()) localStorage.setItem('budget', JSON.stringify(budget)); }, [budget]);


  const handleUpdateShot = useCallback((updatedShot: Shot) => {
    // This provides optimistic UI update, the real-time listener will sync from DB
    // FIX: Use functional update to avoid stale state issues when this function is called in a loop.
    setShots(prevShots => prevShots.map(s => s.id === updatedShot.id ? updatedShot : s));
    updateShot(updatedShot);
  }, []);
  
  const handleUpdateTask = useCallback((updatedTask: Task) => {
    const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(newTasks);
    updateTask(updatedTask);
  }, [tasks]);

  const handleUpdateBudget = useCallback((updatedBudgetItem: BudgetItem) => {
    const newBudget = budget.map(b => b.category === updatedBudgetItem.category ? updatedBudgetItem : b);
    setBudget(newBudget);
    updateBudget(updatedBudgetItem);
  }, [budget]);

  const renderView = () => {
    // FIX: Add setShots to commonProps for components that need to update the shots array.
    // The implementation mirrors what's used for standalone views, ensuring consistency.
    const commonProps = { shots, setShots, acts, scenes, lockedAssets, setLockedAssets, storyboardVariations, setStoryboardVariations, lockedStoryboard, setLockedStoryboard, generatedVideos, setGeneratedVideos, audioUrls, setAudioUrls, timeline, setTimeline, setCurrentView, updateShot };
    
    switch (currentView) {
      // Department Hubs
      case View.DIRECTORS_ROOM: return <DirectorsRoom {...commonProps} />;
      case View.WRITERS_ROOM: return <WritersRoom acts={acts} scenes={scenes} />;
      case View.ART_DEPT: return <ArtDept {...commonProps} />;
      case View.CAMERA_DEPT: return <CameraDept {...commonProps} />;
      case View.POST_PRODUCTION_SUITE: return <PostProductionSuite {...commonProps} />;
      
      // Standalone Tools (accessible via Tools Hub)
      case View.PRODUCTION_OFFICE: return <ProductionOffice tasks={tasks} updateTask={handleUpdateTask} budget={budget} updateBudget={handleUpdateBudget} />;
      case View.SHOT_DATABASE: return <ShotDatabaseManager shots={shots} setShots={(updatedShots) => updatedShots.forEach(handleUpdateShot)} />;
      case View.CONTINUITY_VERIFIER: return <ContinuityVerifier shots={shots} lockedStoryboard={lockedStoryboard} />;
      case View.SHOT_COMPOSITION_VALIDATOR: return <ShotCompositionValidator shots={shots} lockedStoryboard={lockedStoryboard} />;
      case View.ASSET_LIBRARY: return <AssetLibrary shots={shots} lockedStoryboard={lockedStoryboard} generatedVideos={generatedVideos} />;
      case View.PRODUCTION_AUDIT: return <ProductionAudit acts={acts} scenes={scenes} shots={shots} />;
      case View.TOOLS_HUB: return <ToolsHub setCurrentView={setCurrentView} />;
      case View.API_KEYS: return <APIKeys />;
      case View.DIRECTORS_APPROVAL_QUEUE: return <DirectorsApprovalQueue shots={shots} setShots={(updatedShots) => updatedShots.forEach(handleUpdateShot)} storyboardVariations={storyboardVariations} setLockedStoryboard={setLockedStoryboard} />;
      
      // Analysis Tools (Now part of hubs, but directly accessible)
      case View.EMOTIONAL_ARCHITECTURE: return <EmotionalArcVisualizer />;
      case View.PACING_RHYTHM: return <PacingVisualizer />;
      case View.SCRIPT_ANALYSIS: return <ScriptAnalysis />;
      case View.SCRIPT_BREAKDOWN: return <ScriptBreakdown />;

      default: return <DirectorsRoom {...commonProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-vanguard-bg text-vanguard-text font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-vanguard-bg p-4 md:p-8">
          {dbError && <div className="bg-vanguard-red/20 text-vanguard-red p-2 rounded-md mb-4 text-center text-sm">DB Connection Error: {dbError}</div>}
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
