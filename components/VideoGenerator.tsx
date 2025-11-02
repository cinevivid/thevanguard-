import React, { useState, useMemo, useEffect, useRef } from 'react';
import Card from './Card';
import { Shot, ShotStatus } from '../types';
import { generateVideoFromImage, getVideoOperationStatus, fetchGeneratedVideo, generateAssetTags } from '../services/geminiService';

interface VideoGeneratorProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
  lockedStoryboard: Record<string, string>;
  generatedVideos: Record<string, string>;
  setGeneratedVideos: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ shots, setShots, lockedStoryboard, generatedVideos, setGeneratedVideos }) => {
  const [statuses, setStatuses] = useState<Record<string, ShotStatus>>({});
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  const pollingInterval = useRef<number | null>(null);

  const shotsWithImages = useMemo(() => {
    return shots.filter(shot => shot.status === 'Storyboard Locked' || shot.status === 'Video Generating' || shot.status === 'Video Complete' || shot.status === 'Error');
  }, [shots]);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const keySelected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(keySelected);
      }
    };
    checkApiKey();
    if (!selectedShotId && shotsWithImages.length > 0) {
      setSelectedShotId(shotsWithImages[0].id);
    }
  }, [shotsWithImages, selectedShotId]);

  const selectedShot = useMemo(() => shots.find(shot => shot.id === selectedShotId), [selectedShotId, shots]);

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };
  
  useEffect(() => () => stopPolling(), []);

  const handleOpenSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedShotId || !selectedShot || !lockedStoryboard[selectedShotId]) return;

    setIsLoading(true);
    setError(null);
    setStatusMessage('Initializing video model...');
    setStatuses(prev => ({ ...prev, [selectedShotId]: 'Video Generating' }));

    try {
      let operation = await generateVideoFromImage(selectedShot.prompt || selectedShot.description, lockedStoryboard[selectedShotId]);
      setStatusMessage('Processing source image... this can take a few minutes.');
      
      pollingInterval.current = window.setInterval(async () => {
        try {
          setStatusMessage('Checking generation status...');
          operation = await getVideoOperationStatus(operation);

          if (operation.done) {
            stopPolling();
            setStatusMessage('Finalizing video...');
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
              const videoBlob = await fetchGeneratedVideo(downloadLink);
              const videoUrl = URL.createObjectURL(videoBlob);
              setGeneratedVideos(prev => ({ ...prev, [selectedShotId]: videoUrl }));
              setStatuses(prev => ({ ...prev, [selectedShotId]: 'Video Complete' }));

              // Auto-tag asset
              const tags = await generateAssetTags(selectedShot);
              setShots(prev => prev.map(s => s.id === selectedShotId ? { ...s, status: 'Video Complete', tags } : s));

              setIsLoading(false);
              setStatusMessage('Video generated successfully!');
            } else {
              throw new Error('Operation finished but no video link found.');
            }
          }
        } catch (pollError: any) {
          if (pollError?.message?.includes('Requested entity was not found')) setError('API key error. Please re-select your API key.');
          else setError(`An error occurred while checking status: ${pollError.message}`);
          setHasApiKey(false);
          stopPolling();
          setIsLoading(false);
          setStatuses(prev => ({ ...prev, [selectedShotId]: 'Error' }));
        }
      }, 10000);

    } catch (initialError: any) {
      if (initialError?.message?.includes('API key not valid')) {
        setError('API key is not valid. Please select a valid key.');
        setHasApiKey(false);
      } else {
        setError(`Failed to start video generation: ${initialError.message}`);
      }
      setIsLoading(false);
      setStatuses(prev => ({ ...prev, [selectedShotId]: 'Error' }));
    }
  };
  
  const getStatusIcon = (shot: Shot) => {
    const status = statuses[shot.id] || shot.status;
    switch (status) {
      case 'Storyboard Locked': return <span title="Ready to Generate">⚪</span>;
      case 'Video Generating': return <span className="animate-spin" title="Generating">⏳</span>;
      case 'Video Complete': return <span className="text-vanguard-accent" title="Generated">▶️</span>;
      case 'Error': return <span className="text-vanguard-red" title="Error">❌</span>;
      default: return null;
    }
  };

  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-3xl font-bold text-vanguard-text">API Key Required for Video Generation</h1>
        <p className="text-vanguard-text-secondary mt-4 max-w-prose">The Veo video generation model requires you to select a personal API key. Generating videos will incur costs on your Google Cloud project.</p>
        <p className="text-sm text-vanguard-text-secondary mt-2">For more information on billing, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-vanguard-accent hover:underline">ai.google.dev/gemini-api/docs/billing</a>.</p>
        <button onClick={handleOpenSelectKey} className="mt-8 bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-6 rounded-lg">Select API Key</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Video Generation</h1>
        <p className="text-vanguard-text-secondary mt-2">Bring your storyboard to life. Select a locked shot and use the Veo AI model to generate a video clip.</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        <Card title="Locked Storyboard Shots" className="lg:col-span-1 flex flex-col">
          <div className="overflow-y-auto pr-2">
            {shotsWithImages.length > 0 ? (
              <ul className="space-y-1">
                {shotsWithImages.map(shot => (
                  <li key={shot.id}>
                    <button onClick={() => setSelectedShotId(shot.id)} className={`w-full text-left p-2 rounded-md flex items-center space-x-3 ${selectedShotId === shot.id ? 'bg-vanguard-accent/20' : 'hover:bg-vanguard-bg-tertiary'}`}>
                      <img src={`data:image/png;base64,${lockedStoryboard[shot.id]}`} alt={shot.description} className="w-20 h-11 object-cover rounded-sm bg-vanguard-bg" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-vanguard-text">{shot.shotNumber}</p>
                        <p className="text-xs text-vanguard-text-secondary">{shot.description}</p>
                      </div>
                      {getStatusIcon(shot)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-center text-vanguard-text-secondary py-16">No storyboard frames locked yet. Go to the 'Storyboard Generator' to lock shots.</p>}
          </div>
        </Card>

        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-y-auto pr-2">
          {selectedShot ? (
            <>
              <Card title={`Source Image: ${selectedShot.shotNumber}`}>
                 <div className="aspect-video bg-vanguard-bg rounded-lg flex items-center justify-center">
                    <img src={`data:image/png;base64,${lockedStoryboard[selectedShot.id]}`} alt={`Locked frame for ${selectedShot.description}`} className="max-h-full max-w-full object-contain rounded-md" />
                 </div>
              </Card>

              {/* FIX: The disabled prop expects a boolean. Coerce the string/undefined from generatedVideos to a boolean. */}
              <button onClick={handleGenerateVideo} disabled={isLoading || !!generatedVideos[selectedShot.id]} className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary disabled:cursor-not-allowed">
                {isLoading ? 'Generating...' : generatedVideos[selectedShot.id] ? 'Video Already Generated' : `Generate Video for ${selectedShot.shotNumber}`}
              </button>

              <Card title="Generation Status & Preview">
                <div className="aspect-video bg-vanguard-bg rounded-lg flex items-center justify-center">
                  {isLoading && (
                    <div className="text-center text-vanguard-text-secondary p-4">
                      <svg className="animate-spin mx-auto h-10 w-10 text-vanguard-accent mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <p className="font-semibold">{statusMessage}</p>
                      <p className="text-xs mt-1">Please keep this tab open. Video generation can take several minutes.</p>
                    </div>
                  )}
                  {!isLoading && generatedVideos[selectedShot.id] && <video src={generatedVideos[selectedShot.id]} controls autoPlay loop className="w-full h-full rounded-md" />}
                  {!isLoading && !generatedVideos[selectedShot.id] && (<div className="text-center text-vanguard-text-secondary"><p>{error ? `Generation failed: ${error}` : 'Generated video will appear here.'}</p></div>)}
                </div>
              </Card>
            </>
          ) : <Card title="No Shot Selected"><p className="text-center text-vanguard-text-secondary py-16">Select a shot from the list to begin video generation.</p></Card> }
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;