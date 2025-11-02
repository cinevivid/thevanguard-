
import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Shot } from '../types';

interface AssetLibraryProps {
  shots: Shot[];
  lockedStoryboard: Record<string, string>;
  generatedVideos: Record<string, string>;
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({ shots, lockedStoryboard, generatedVideos }) => {
  const [activeTab, setActiveTab] = useState<'storyboards' | 'videos'>('storyboards');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    shots.forEach(shot => {
      shot.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [shots]);

  const filteredAssets = useMemo(() => {
    const sourceAssets = activeTab === 'storyboards' ? lockedStoryboard : generatedVideos;
    return shots.filter(shot => 
      sourceAssets[shot.id] &&
      (shot.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
       shot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       shot.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (!selectedTag || shot.tags?.includes(selectedTag))
    );
  }, [shots, lockedStoryboard, generatedVideos, searchTerm, activeTab, selectedTag]);

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Smart Asset Library</h1>
        <p className="text-vanguard-text-secondary mt-2">A central, searchable library for all your generated visual assets, now with AI-powered smart tags.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex border-b border-vanguard-bg-tertiary">
            <button onClick={() => setActiveTab('storyboards')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'storyboards' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Locked Storyboards ({Object.keys(lockedStoryboard).length})</button>
            <button onClick={() => setActiveTab('videos')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'videos' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Generated Videos ({Object.keys(generatedVideos).length})</button>
        </div>
        <div className="flex items-center gap-2">
           <select value={selectedTag || ''} onChange={(e) => setSelectedTag(e.target.value || null)} className="bg-vanguard-bg-tertiary p-2 rounded-md text-sm border border-vanguard-bg-tertiary">
            <option value="">Filter by tag...</option>
            {allTags.map(tag => <option key={tag}>{tag}</option>)}
           </select>
            <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, description, or tag..."
                className="bg-vanguard-bg-tertiary text-vanguard-text p-2 rounded-md border border-vanguard-bg-tertiary focus:ring-1 focus:ring-vanguard-accent focus:outline-none text-sm w-64"
            />
        </div>
      </div>
      
      <Card title={`Asset Grid (${filteredAssets.length} results)`} className="flex-1 flex flex-col">
        <div className="overflow-y-auto flex-1 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredAssets.map(shot => (
                    <div key={shot.id} className="space-y-1 group relative">
                        {activeTab === 'storyboards' ? 
                          <img src={`data:image/png;base64,${lockedStoryboard[shot.id]}`} alt={shot.description} className="w-full aspect-video object-cover rounded-md bg-vanguard-bg"/>
                          :
                          <video src={generatedVideos[shot.id]} className="w-full aspect-video object-cover rounded-md bg-vanguard-bg" muted loop autoPlay />
                        }
                        <p className="text-xs font-semibold truncate">{shot.shotNumber}</p>
                        <p className="text-xs text-vanguard-text-secondary truncate">{shot.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {shot.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] bg-vanguard-bg-tertiary px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                    </div>
                ))}
            </div>
             {filteredAssets.length === 0 && <p className="text-center text-vanguard-text-secondary py-16">No assets match your search criteria.</p>}
        </div>
      </Card>
    </div>
  );
};

export default AssetLibrary;
