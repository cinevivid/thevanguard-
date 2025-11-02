
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EmotionalArchitecture from './components/EmotionalArchitecture';
import VisualStorytelling from './components/VisualStorytelling';
import PacingRhythm from './components/PacingRhythm';
import ScriptAnalysis from './components/ScriptAnalysis';
import ContinuityChecker from './components/ContinuityChecker';
import DocumentManager from './components/DocumentManager';
import CorpusAssistant from './components/CorpusAssistant';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.CORPUS_ASSISTANT);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.DOCUMENT_MANAGEMENT:
        return <DocumentManager />;
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
      case View.CORPUS_ASSISTANT:
        return <CorpusAssistant />;
      default:
        return <Dashboard />;
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
