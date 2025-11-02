import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Shot, ShotStatus } from '../types';

interface ShotDatabaseManagerProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
}

const ShotDatabaseManager: React.FC<ShotDatabaseManagerProps> = ({ shots, setShots }) => {
  const [filter, setFilter] = useState<ShotStatus | 'All'>('All');
  const [sortColumn, setSortColumn] = useState<keyof Shot>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState('');
  
  const sceneNumbers = useMemo(() => [...new Set(shots.map(s => s.scene))], [shots]);
  const [selectedScene, setSelectedScene] = useState(sceneNumbers[0] || '');

  const filteredAndSortedShots = useMemo(() => {
    let filtered = filter === 'All' ? shots : shots.filter(s => s.status === filter);
    
    return filtered.sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [shots, filter, sortColumn, sortDirection]);
  
  const handleSort = (column: keyof Shot) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleBatchGenerate = async () => {
    const shotsToGenerate = shots.filter(s => s.scene === selectedScene && s.status === 'Not Started');
    if (shotsToGenerate.length === 0) {
      setBatchProgress('No shots to generate for this scene.');
      return;
    }
    setIsBatchGenerating(true);
    let generatedCount = 0;

    for (const shot of shotsToGenerate) {
      generatedCount++;
      setBatchProgress(`(${generatedCount}/${shotsToGenerate.length}) Generating prompt for ${shot.id}...`);
      
      await new Promise(res => setTimeout(res, 2000));
      
      setBatchProgress(`(${generatedCount}/${shotsToGenerate.length}) Generating images for ${shot.id}...`);
      await new Promise(res => setTimeout(res, 3000));

      setShots(prevShots => prevShots.map(s => s.id === shot.id ? { ...s, status: 'Storyboard Generated' } : s));
    }

    setBatchProgress(`Batch generation for ${selectedScene} complete!`);
    setTimeout(() => setIsBatchGenerating(false), 3000);
  };
  
  const getStatusColor = (status: ShotStatus) => {
     switch(status) {
      case 'Not Started': return 'bg-vanguard-text-secondary/20 text-vanguard-text-secondary';
      case 'Storyboard Generated': return 'bg-yellow-500/20 text-yellow-400';
      case 'Storyboard Locked': return 'bg-vanguard-green/20 text-vanguard-green';
      case 'Video Generating': return 'bg-blue-500/20 text-blue-400';
      case 'Video Complete': return 'bg-vanguard-accent/20 text-vanguard-accent';
      case 'Error': return 'bg-vanguard-red/20 text-vanguard-red';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }

  const statusOptions: (ShotStatus | 'All')[] = ['All', 'Not Started', 'Storyboard Generated', 'Storyboard Locked', 'Video Generating', 'Video Complete', 'Error'];
  const columns: (keyof Shot)[] = ['id', 'description', 'status', 'complexity', 'cameraAngle', 'vfxRequired', 'pipelineStage'];

  return (
    <div className="space-y-8 h-full flex flex-col">
       <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Shot Database Manager</h1>
        <p className="text-vanguard-text-secondary mt-2">The central nervous system for "THE VANGUARD". Track the status of all 430 shots from pre-production to final render.</p>
      </div>

      <Card title="Production Overview" className="flex-1 flex flex-col">
        <div className="p-4 flex flex-wrap items-center space-x-4 border-b border-vanguard-bg-tertiary gap-y-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="status-filter" className="text-sm font-medium">Filter by Status:</label>
              <select id="status-filter" value={filter} onChange={e => setFilter(e.target.value as ShotStatus | 'All')} className="bg-vanguard-bg-tertiary border border-vanguard-bg-tertiary rounded-md p-2 text-sm">
                  {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <span className="text-sm text-vanguard-text-secondary">Showing {filteredAndSortedShots.length} of {shots.length} shots</span>
            </div>
            <div className="flex items-center space-x-2">
               <label htmlFor="scene-select" className="text-sm font-medium">Scene for Batch:</label>
               <select id="scene-select" value={selectedScene} onChange={e => setSelectedScene(e.target.value)} className="bg-vanguard-bg-tertiary border border-vanguard-bg-tertiary rounded-md p-2 text-sm">
                {sceneNumbers.map(scene => <option key={scene}>{scene}</option>)}
               </select>
               <button onClick={handleBatchGenerate} disabled={isBatchGenerating} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-semibold py-2 px-3 rounded-lg text-sm disabled:opacity-50">
                {isBatchGenerating ? 'Generating...' : '🤖 Generate Storyboard for Scene'}
               </button>
            </div>
        </div>
        {isBatchGenerating && <div className="p-2 text-center text-sm bg-vanguard-accent/20 text-vanguard-accent">{batchProgress}</div>}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left text-sm table-fixed">
            <thead className="sticky top-0 bg-vanguard-bg-secondary z-10">
              <tr className="border-b border-vanguard-bg-tertiary">
                {columns.map(col => (
                    <th key={col} className={`py-3 px-4 uppercase tracking-wider text-xs text-vanguard-text-secondary cursor-pointer 
                      ${col === 'description' ? 'w-2/5' : 'w-auto'}`}
                      onClick={() => handleSort(col as keyof Shot)}>
                        {col.replace(/([A-Z])/g, ' $1').replace('shotNumber', 'Shot #')}
                        {sortColumn === col && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                    </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedShots.map(shot => (
                <tr key={shot.id} className="border-b border-vanguard-bg-tertiary hover:bg-vanguard-bg-tertiary/50">
                  <td className="py-3 px-4 font-mono text-xs truncate">{shot.id}</td>
                  <td className="py-3 px-4 truncate" title={shot.description}>{shot.description}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shot.status)}`}>
                        {shot.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 truncate">{shot.complexity}</td>
                  <td className="py-3 px-4 truncate">{shot.cameraAngle || 'N/A'}</td>
                  <td className="py-3 px-4 text-center">{shot.vfxRequired ? <span className="text-vanguard-orange">Yes</span> : '—'}</td>
                  <td className="py-3 px-4 truncate capitalize">{shot.pipelineStage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ShotDatabaseManager;
