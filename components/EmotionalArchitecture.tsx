
import React from 'react';
import Card from './Card';
// We cannot import recharts, so we'll mock the chart with a placeholder image.
// A real implementation would use a library like recharts.

const EmotionalArchitecture: React.FC = () => {

  const emotionalBeats = [
    { type: 'Revelation', target: 'Hope', intensity: 8 },
    { type: 'Reversal', target: 'Dread', intensity: 9 },
    { type: 'Escalation', target: 'Tension', intensity: 7 },
  ];

  const characterArcs = [
    { name: 'Jackson', state: 'Broken -> Confident -> Vindicated', type: 'Hero Journey', complete: true },
    { name: 'Duncan', state: 'Obsessed -> Unraveled -> Tragic', type: 'Fall from Grace', complete: true },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-vanguard-text">Emotional Architecture</h1>
      
      <Card title="Character Emotional Arc Graph">
        <p className="mb-4 text-vanguard-text-secondary">Visualizes the emotional journey of key characters throughout the film's timeline. This helps ensure compelling and complete character arcs.</p>
        <div className="w-full h-96 bg-vanguard-bg-tertiary rounded-lg flex items-center justify-center">
            <img src="https://i.imgur.com/G5g2fAm.png" alt="Emotional Arc Graph Placeholder" className="object-contain"/>
        </div>
         <div className="flex justify-center mt-4 space-x-6 text-sm">
            <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-vanguard-accent mr-2"></div>
                <span>Jackson (Protagonist)</span>
            </div>
             <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-vanguard-red mr-2"></div>
                <span>Duncan (Antagonist)</span>
            </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Emotional Beat Tracking">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-vanguard-bg-tertiary">
                <th className="py-2">Beat Type</th>
                <th className="py-2">Target</th>
                <th className="py-2 text-right">Intensity (1-10)</th>
              </tr>
            </thead>
            <tbody>
              {emotionalBeats.map((beat, index) => (
                <tr key={index} className="border-b border-vanguard-bg-tertiary last:border-b-0">
                  <td className="py-2">{beat.type}</td>
                  <td className="py-2">{beat.target}</td>
                  <td className="py-2 text-right font-mono">{beat.intensity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        
        <Card title="Character Arc Analysis">
            {characterArcs.map((arc, index) => (
                <div key={index} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-semibold text-vanguard-accent">{arc.name}</h4>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${arc.complete ? 'bg-vanguard-green text-white' : 'bg-vanguard-yellow text-vanguard-bg'}`}>
                            {arc.complete ? 'Complete' : 'Incomplete'}
                        </span>
                    </div>
                    <p className="text-sm text-vanguard-text-secondary">{arc.type}</p>
                    <p className="text-sm mt-1">{arc.state}</p>
                </div>
            ))}
        </Card>
      </div>
    </div>
  );
};

export default EmotionalArchitecture;
