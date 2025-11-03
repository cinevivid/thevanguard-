
import React from 'react';
import { View } from '../types';
import Card from './Card';

interface ToolsHubProps {
  setCurrentView: (view: View) => void;
}

const tools = [
  // FIX: Property 'SCRIPT_ANALYSIS' does not exist on type 'typeof View'. All script analysis tools are now consolidated under the 'WRITERS_ROOM' view.
  { view: View.WRITERS_ROOM, title: 'Script Analysis', description: 'Get loglines, themes, and summaries.' },
  // FIX: Property 'EMOTIONAL_ARCHITECTURE' does not exist on type 'typeof View'. This tool is now part of the 'WRITERS_ROOM' view.
  { view: View.WRITERS_ROOM, title: 'Emotional Arcs', description: 'Trace character emotional journeys.' },
  // FIX: Property 'CONTINUITY_CHECKER' does not exist on type 'typeof View'. This tool is now part of the 'WRITERS_ROOM' view.
  { view: View.WRITERS_ROOM, title: 'Continuity Checker', description: 'Find potential script inconsistencies.' },
  { view: View.SHOT_DATABASE, title: 'Shot Database', description: 'Manage and track all 430 shots.' },
  // FIX: Property 'CANONICAL_ASSETS' does not exist on type 'typeof View'. This tool is now part of the 'ART_DEPT' view.
  { view: View.ART_DEPT, title: 'Canonical Assets', description: 'Generate and lock character DNA.' },
  // FIX: Property 'STORYBOARD_GENERATOR' does not exist on type 'typeof View'. This tool is now part of the 'ART_DEPT' view.
  { view: View.ART_DEPT, title: 'Storyboard Generator', description: 'Create storyboard frames for scenes.' },
  // FIX: Property 'VIDEO_GENERATOR' does not exist on type 'typeof View'. This tool is now part of the 'POST_PRODUCTION_SUITE' view.
  { view: View.POST_PRODUCTION_SUITE, title: 'Video Generation', description: 'Animate storyboards with Veo.'},
  // FIX: Property 'AUDIO_PRODUCTION' does not exist on type 'typeof View'. This tool is now part of the 'POST_PRODUCTION_SUITE' view.
  { view: View.POST_PRODUCTION_SUITE, title: 'Audio Production', description: 'Generate dialogue with ElevenLabs.'},
  // FIX: Replaced View.SEQUENCE_ASSEMBLER with View.POST_PRODUCTION_SUITE. 'EDIT_BAY' is not a valid member of the View enum. The 'Post-Production Suite' view handles this functionality.
  { view: View.POST_PRODUCTION_SUITE, title: 'Sequence Assembler', description: 'Export EDLs for DaVinci Resolve.'}
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
          // FIX: Using tool.title as key to avoid duplicates since multiple tools now point to the same WRITERS_ROOM view.
          <button key={tool.title} onClick={() => setCurrentView(tool.view)} className="text-left h-full">
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