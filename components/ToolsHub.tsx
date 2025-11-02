
import React from 'react';
import { View } from '../types';
import Card from './Card';

interface ToolsHubProps {
  setCurrentView: (view: View) => void;
}

const tools = [
  { view: View.SCRIPT_ANALYSIS, title: 'Script Analysis', description: 'Get loglines, themes, and summaries.' },
  { view: View.EMOTIONAL_ARCHITECTURE, title: 'Emotional Arcs', description: 'Trace character emotional journeys.' },
  { view: View.CONTINUITY_CHECKER, title: 'Continuity Checker', description: 'Find potential script inconsistencies.' },
  { view: View.SHOT_DATABASE, title: 'Shot Database', description: 'Manage and track all 430 shots.' },
  { view: View.CANONICAL_ASSETS, title: 'Canonical Assets', description: 'Generate and lock character DNA.' },
  { view: View.STORYBOARD_GENERATOR, title: 'Storyboard Generator', description: 'Create storyboard frames for scenes.' },
  { view: View.VIDEO_GENERATOR, title: 'Video Generation', description: 'Animate storyboards with Veo.'},
  { view: View.AUDIO_PRODUCTION, title: 'Audio Production', description: 'Generate dialogue with ElevenLabs.'},
  { view: View.EDIT_BAY, title: 'Edit Bay', description: 'Assemble sequences and export EDLs.'}
];

const ToolsHub: React.FC<ToolsHubProps> = ({ setCurrentView }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Vanguard AI Studio Tools</h1>
        <p className="text-vanguard-text-secondary mt-2">A complete suite of AI-powered tools for every stage of your filmmaking process.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <button key={tool.view} onClick={() => setCurrentView(tool.view)} className="text-left h-full">
            <Card title={tool.title} className="hover:bg-vanguard-bg-tertiary hover:border-vanguard-accent transition-all duration-200 h-full">
              <p className="text-sm text-vanguard-text-secondary">{tool.description}</p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolsHub;
