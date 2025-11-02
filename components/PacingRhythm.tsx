
import React from 'react';
import Card from './Card';

const PacingSegment: React.FC<{ color: string; width: string; label: string }> = ({ color, width, label }) => (
  <div style={{ width }} className={`h-full flex items-center justify-center text-xs font-semibold text-white ${color} transition-all duration-300`}>
    <span className="opacity-75">{label}</span>
  </div>
);

const PacingRhythm: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-vanguard-text">Pacing & Rhythm Analysis</h1>
      
      <Card title="Pacing Timeline Visualizer">
        <p className="mb-4 text-vanguard-text-secondary">A color-coded timeline of the film's pacing. Red indicates high-intensity, fast-cut scenes, while blue represents slower, emotional moments.</p>
        <div className="w-full h-12 bg-vanguard-bg-tertiary rounded-lg flex overflow-hidden">
            <PacingSegment color="bg-blue-500" width="25%" label="Act 1: Setup" />
            <PacingSegment color="bg-yellow-500" width="15%" label="Midpoint Buildup" />
            <PacingSegment color="bg-blue-800" width="10%" label="Slow Section" />
            <PacingSegment color="bg-red-500" width="25%" label="Act 2 Climax" />
            <PacingSegment color="bg-blue-600" width="5%" label="Breather" />
            <PacingSegment color="bg-red-700" width="20%" label="Act 3: Finale" />
        </div>
        <div className="flex justify-center mt-4 space-x-6 text-sm">
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-red-500 mr-2"></div>High Intensity</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>Medium Intensity</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>Low Intensity</div>
        </div>
      </Card>

      <Card title="Pacing Alerts">
        <div className="space-y-4">
            <div className="p-4 bg-vanguard-bg-tertiary rounded-lg border-l-4 border-vanguard-yellow">
                <p><span className="font-bold">⚠️ Pacing Warning:</span> Act 2 contains a 15-minute slow section (scenes 25-30) that deviates significantly from the genre norm. Consider adding a B-plot cutaway or an element of rising tension.</p>
            </div>
             <div className="p-4 bg-vanguard-bg-tertiary rounded-lg border-l-4 border-vanguard-green">
                <p><span className="font-bold">✅ Pacing Strength:</span> The "Grandma's Death" sequence provides a perfect intensity spike at the midpoint, re-engaging the audience effectively.</p>
            </div>
             <div className="p-4 bg-vanguard-bg-tertiary rounded-lg border-l-4 border-vanguard-red">
                <p><span className="font-bold">❌ Pacing Issue:</span> The final 10 minutes of Act 3 cool down too quickly post-climax. The denouement feels rushed. Recommend extending the final emotional beats.</p>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default PacingRhythm;
