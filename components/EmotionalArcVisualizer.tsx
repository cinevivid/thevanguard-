import React, { useState, useCallback, useMemo } from 'react';
import Card from './Card';
import { getEmotionalArcData } from '../services/geminiService';
import { EmotionalArcPoint } from '../types';

const EmotionalArcVisualizer: React.FC = () => {
  const [arcData, setArcData] = useState<EmotionalArcPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<string>('Jackson');

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setArcData([]);
    try {
      const data = await getEmotionalArcData(character);
      setArcData(data);
    } catch (err) {
      setError('Failed to get analysis from AI.');
    } finally {
      setIsLoading(false);
    }
  }, [character]);

  const { path, points, labels } = useMemo(() => {
    if (arcData.length === 0) return { path: '', points: [], labels: [] };

    const width = 800;
    const height = 400;
    const padding = 40;

    const yMax = 10;
    const yMin = -10;
    
    const getX = (index: number) => padding + (index * (width - 2 * padding)) / (arcData.length - 1);
    const getY = (intensity: number) => (height - padding) - ((intensity - yMin) / (yMax - yMin)) * (height - 2 * padding);
    
    const path = arcData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.intensity)}`).join(' ');
    
    const points = arcData.map((p, i) => ({
        cx: getX(i),
        cy: getY(p.intensity),
        ...p
    }));

    const labels = Array.from({length: 5}, (_, i) => {
        const intensity = yMax - i * 5;
        return { y: getY(intensity), label: intensity };
    });

    return { path, points, labels };
  }, [arcData]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Emotional Arc Visualizer</h1>
      <p className="text-vanguard-text-secondary">Visualize the emotional journey of each main character. Use these insights to guide performance, cinematography, and editing choices.</p>
      
      <Card title="Character Emotional Journey">
        <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="char-select">Select Character:</label>
            <select id="char-select" value={character} onChange={e => setCharacter(e.target.value)} className="bg-vanguard-bg-tertiary p-2 rounded-md">
                <option>Jackson</option>
                <option>Duncan</option>
                <option>Vanguard</option>
            </select>
             <button onClick={handleAnalyze} disabled={isLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg">
                {isLoading ? 'Analyzing...' : `Visualize ${character}'s Arc`}
            </button>
        </div>
        <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[450px]">
            {isLoading && <p>AI is analyzing the screenplay...</p>}
            {error && <p className="text-vanguard-red">{error}</p>}
            {arcData.length > 0 && (
                <svg viewBox="0 0 800 400" className="w-full h-full">
                    <g className="text-xs text-vanguard-text-secondary">
                        {labels.map(l => (
                            <g key={l.label}>
                                <line x1={40} x2={760} y1={l.y} y2={l.y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                                <text x="30" y={l.y + 4} textAnchor="end">{l.label}</text>
                            </g>
                        ))}
                    </g>
                     <path d={path} fill="none" stroke="url(#arcGradient)" strokeWidth="3" />
                     <defs>
                        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00aaff" />
                            <stop offset="100%" stopColor="#2ecc71" />
                        </linearGradient>
                     </defs>
                     {points.map((p, i) => (
                         <g key={i} className="group">
                             <circle cx={p.cx} cy={p.cy} r="5" fill="#00aaff" className="cursor-pointer" />
                             <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                 <rect x={p.cx + 10} y={p.cy - 30} width="200" height="50" fill="rgba(36, 44, 54, 0.9)" rx="5" />
                                 <text x={p.cx + 20} y={p.cy - 12} fill="#d0d8e0" className="font-semibold">{p.scene}</text>
                                 <text x={p.cx + 20} y={p.cy + 5} fill="#8a94a6" className="text-xs">{p.description}</text>
                             </g>
                         </g>
                     ))}
                </svg>
            )}
        </div>
      </Card>
    </div>
  );
};

export default EmotionalArcVisualizer;
