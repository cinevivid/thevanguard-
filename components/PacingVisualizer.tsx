import React, { useState, useCallback } from 'react';
import Card from './Card';
import { getPacingData } from '../services/geminiService';
import { PacingPoint } from '../types';

const PacingVisualizer: React.FC = () => {
  const [pacingData, setPacingData] = useState<PacingPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPacingData([]);
    try {
      const data = await getPacingData();
      setPacingData(data);
    } catch (err) {
      setError('Failed to get pacing data from AI.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const intensityColors = {
    'Low': 'bg-vanguard-accent/40',
    'Medium': 'bg-vanguard-yellow/40',
    'High': 'bg-vanguard-red/40',
  };

  const maxHeight = 200; // max height for bars in pixels

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Pacing & Rhythm Visualizer</h1>
      <p className="text-vanguard-text-secondary">Analyze the screenplay's tempo by visualizing the intensity and average shot length (ASL) of key sequences.</p>
      
      <Card title="Film Pacing Timeline">
        <button onClick={handleAnalyze} disabled={isLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg mb-6">
          {isLoading ? 'Analyzing...' : 'Visualize Film Pacing'}
        </button>

        <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[300px] flex items-end justify-center gap-2">
          {isLoading && <p>AI is analyzing the screenplay's pacing...</p>}
          {error && <p className="text-vanguard-red">{error}</p>}
          
          {pacingData.length > 0 && (
            pacingData.map((point, i) => (
                <div key={i} className="group relative flex-1 flex flex-col items-center justify-end" style={{height: `${maxHeight}px`}}>
                    <div className={`w-full transition-all duration-500 ${intensityColors[point.intensity]}`} 
                         style={{ height: `${(point.asl / 10) * 100}%`, maxHeight: '100%' }}>
                    </div>
                    <p className="text-xs text-vanguard-text-secondary mt-2 text-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{point.scene}</p>
                    <div className="absolute bottom-full mb-2 w-48 p-2 bg-vanguard-bg-tertiary rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <p className="font-bold">{point.scene}</p>
                        <p>ASL: {point.asl}s</p>
                        <p>Intensity: {point.intensity}</p>
                    </div>
                </div>
            ))
          )}
        </div>
        <div className="flex justify-center space-x-4 mt-4 text-xs">
            <div className="flex items-center"><span className="w-3 h-3 bg-vanguard-accent/40 mr-1"></span>Low</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-vanguard-yellow/40 mr-1"></span>Medium</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-vanguard-red/40 mr-1"></span>High</div>
        </div>
      </Card>
    </div>
  );
};

export default PacingVisualizer;
