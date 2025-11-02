import React, { useState, useMemo, useCallback } from 'react';
import Card from './Card';
import { screenplay } from '../data/screenplay';
import { generateDialogueAudio } from '../services/elevenLabsService';
import { generateMusicIdeas } from '../services/geminiService';

interface DialogueLine {
  character: string;
  line: string;
  key: string;
}

interface Scene {
  name: string;
  dialogue: DialogueLine[];
}

interface AudioProductionProps {
  audioUrls: Record<string, string>;
  setAudioUrls: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const AudioProduction: React.FC<AudioProductionProps> = ({ audioUrls, setAudioUrls }) => {
  const [apiKey, setApiKey] = useState('');
  const [isKeyProvided, setIsKeyProvided] = useState(false);
  const [activeTab, setActiveTab] = useState<'dialogue' | 'music'>('dialogue');
  const [loadingAudio, setLoadingAudio] = useState<Record<string, boolean>>({});
  
  const [musicPrompt, setMusicPrompt] = useState('a tense, low-drone sci-fi track for an interrogation scene');
  const [musicIdeas, setMusicIdeas] = useState('');
  const [isMusicLoading, setIsMusicLoading] = useState(false);


  const scenes = useMemo<Scene[]>(() => {
    const sceneRegex = /(INT\.|EXT\.)(.*?)\n/g;
    const dialogueRegex = /^([A-Z\s]+(?:\(V\.O\.\))?)\n(.*?)(?=\n[A-Z\s]+(?:\(V\.O\.\))?\n|\n\n)/gms;
    
    const parsedScenes: Scene[] = [];
    const scriptScenes = screenplay.split(sceneRegex);
    
    for (let i = 1; i < scriptScenes.length; i += 3) {
        const sceneName = `${scriptScenes[i].trim()} ${scriptScenes[i+1]}`.trim();
        const sceneContent = scriptScenes[i+2];
        const dialogue: DialogueLine[] = [];
        let match;
        let lineIndex = 0;
        while ((match = dialogueRegex.exec(sceneContent)) !== null) {
            const key = `${sceneName}-${match[1].trim()}-${lineIndex++}`;
            dialogue.push({
                character: match[1].trim(),
                line: match[2].replace(/\n/g, ' ').trim(),
                key: key,
            });
        }
        if (dialogue.length > 0) {
            parsedScenes.push({ name: sceneName, dialogue });
        }
    }
    return parsedScenes;
  }, []);

  const [selectedScene, setSelectedScene] = useState<Scene>(scenes[0]);

  const handleGenerateDialogue = async (line: DialogueLine) => {
    setLoadingAudio(prev => ({...prev, [line.key]: true}));
    try {
        const audioUrl = await generateDialogueAudio(line.line, line.character, apiKey);
        setAudioUrls(prev => ({...prev, [line.key]: audioUrl}));
    } catch (e) {
        console.error("Audio generation failed", e);
    } finally {
        setLoadingAudio(prev => ({...prev, [line.key]: false}));
    }
  };

  const handleGenerateMusic = useCallback(async () => {
    setIsMusicLoading(true);
    setMusicIdeas('');
    try {
        const stream = generateMusicIdeas(musicPrompt);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setMusicIdeas(fullResponse);
        }
    } catch (e) {
        setMusicIdeas("Failed to generate music ideas.");
    } finally {
        setIsMusicLoading(false);
    }
  }, [musicPrompt]);

  if (!isKeyProvided) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-3xl font-bold text-vanguard-text">Audio Production Suite</h1>
        <p className="text-vanguard-text-secondary mt-4 max-w-prose">This module uses the ElevenLabs API to generate high-quality, AI-powered dialogue for your characters. To enable this feature, please provide your ElevenLabs API key.</p>
        <div className="mt-8 w-full max-w-md">
            <input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your ElevenLabs API Key"
                className="w-full bg-vanguard-bg-tertiary text-vanguard-text p-3 rounded-md border border-vanguard-bg-tertiary focus:ring-2 focus:ring-vanguard-accent focus:outline-none"
            />
            <button onClick={() => { if(apiKey) setIsKeyProvided(true) }} disabled={!apiKey} className="mt-4 w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary">
            Save Key & Continue
            </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Audio Production</h1>
        <p className="text-vanguard-text-secondary mt-2">Generate dialogue and musical ideas for your film.</p>
      </div>
      
       <div className="flex border-b border-vanguard-bg-tertiary">
        <button onClick={() => setActiveTab('dialogue')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'dialogue' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>AI Dialogue Generation</button>
        <button onClick={() => setActiveTab('music')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'music' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>AI Music Composer</button>
      </div>
      
      {activeTab === 'dialogue' && (<>
      <div className="flex items-center space-x-2">
        <label htmlFor="scene-select" className="text-sm font-medium">Scene:</label>
        <select id="scene-select" value={selectedScene.name} onChange={e => setSelectedScene(scenes.find(s => s.name === e.target.value)!)} className="bg-vanguard-bg-tertiary border border-vanguard-bg-tertiary rounded-md p-2 text-sm max-w-md">
          {scenes.map(scene => <option key={scene.name} value={scene.name}>{scene.name}</option>)}
        </select>
      </div>
      <Card title={`Dialogue for: ${selectedScene.name}`} className="flex-1 flex flex-col">
        <div className="overflow-y-auto pr-2">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-vanguard-bg-secondary">
                    <tr className="border-b border-vanguard-bg-tertiary">
                        <th className="py-3 px-4 w-1/4">Character</th>
                        <th className="py-3 px-4 w-2/4">Dialogue</th>
                        <th className="py-3 px-4 w-1/4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedScene.dialogue.map((line) => (
                        <tr key={line.key} className="border-b border-vanguard-bg-tertiary hover:bg-vanguard-bg-tertiary/50">
                            <td className="py-3 px-4 font-semibold">{line.character}</td>
                            <td className="py-3 px-4 italic">"{line.line}"</td>
                            <td className="py-3 px-4 text-center">
                                {audioUrls[line.key] ? <audio controls src={audioUrls[line.key]} className="h-8 w-full"></audio> : 
                                    <button onClick={() => handleGenerateDialogue(line)} disabled={loadingAudio[line.key]} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors duration-200 disabled:opacity-50">
                                        {loadingAudio[line.key] ? '...' : 'Generate'}
                                    </button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
      </>)}

      {activeTab === 'music' && (
          <Card title="AI Music Composer">
               <div className="space-y-4">
                  <label htmlFor="music-prompt" className="font-semibold">Describe the musical theme or mood:</label>
                  <textarea
                    id="music-prompt"
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    className="w-full h-24 bg-vanguard-bg text-vanguard-text-secondary p-2 rounded-md border border-vanguard-bg-tertiary font-mono text-sm"
                    placeholder="e.g., 'A hopeful but melancholic piano theme for the epilogue'"
                  />
                  <button
                    onClick={handleGenerateMusic}
                    disabled={isMusicLoading}
                    className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary"
                  >
                    {isMusicLoading ? 'Composing...' : '✨ Generate Musical Ideas'}
                  </button>
                </div>
                <div className="mt-6 p-4 bg-vanguard-bg rounded-md min-h-[200px]">
                    {isMusicLoading && !musicIdeas && <p>AI Composer is thinking...</p>}
                    {!isMusicLoading && !musicIdeas && <p>Generated musical concepts will appear here.</p>}
                    {musicIdeas}
                </div>
          </Card>
      )}
    </div>
  );
};

export default AudioProduction;