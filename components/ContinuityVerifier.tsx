
import React, { useState, useMemo, useCallback } from 'react';
import Card from './Card';
import { Shot } from '../types';
import { verifyContinuity } from '../services/geminiService';

interface ContinuityVerifierProps {
  shots: Shot[];
  lockedStoryboard: Record<string, string>;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\n/g, '<br />').replace(/\* (.*?)\<br \/\>/g, '<li class="ml-4 list-disc">$1</li>') }} />;
};

const ContinuityVerifier: React.FC<ContinuityVerifierProps> = ({ shots, lockedStoryboard }) => {
  const lockedShots = useMemo(() => shots.filter(shot => lockedStoryboard[shot.id]), [shots, lockedStoryboard]);

  const [shot1Id, setShot1Id] = useState<string | null>(lockedShots[0]?.id || null);
  const [shot2Id, setShot2Id] = useState<string | null>(lockedShots[1]?.id || null);

  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shot1 = useMemo(() => shots.find(s => s.id === shot1Id), [shot1Id, shots]);
  const shot2 = useMemo(() => shots.find(s => s.id === shot2Id), [shot2Id, shots]);

  const handleVerify = useCallback(async () => {
    if (!shot1 || !shot2 || !lockedStoryboard[shot1.id] || !lockedStoryboard[shot2.id]) {
      setError("Please select two sequential locked shots to verify.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const stream = verifyContinuity(
        { shot: shot1, imageBase64: lockedStoryboard[shot1.id] },
        { shot: shot2, imageBase64: lockedStoryboard[shot2.id] }
      );
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setAnalysis(fullResponse);
      }
    } catch (err) {
      setError('Failed to get continuity analysis from AI.');
    } finally {
      setIsLoading(false);
    }
  }, [shot1, shot2, lockedStoryboard]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">AI Continuity Verifier</h1>
      <p className="text-vanguard-text-secondary">Your AI Script Supervisor. Select two sequential shots to analyze them for continuity errors in costume, props, lighting, and set dressing.</p>
      
      <Card title="Select Shots to Compare">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="shot1-select" className="text-sm font-medium">Shot A (Previous):</label>
            <select id="shot1-select" value={shot1Id || ''} onChange={e => setShot1Id(e.target.value)} className="w-full bg-vanguard-bg-tertiary p-2 rounded-md mt-1">
              {lockedShots.map(shot => <option key={shot.id} value={shot.id}>{shot.id}: {shot.description}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="shot2-select" className="text-sm font-medium">Shot B (Current):</label>
            <select id="shot2-select" value={shot2Id || ''} onChange={e => setShot2Id(e.target.value)} className="w-full bg-vanguard-bg-tertiary p-2 rounded-md mt-1">
              {lockedShots.map(shot => <option key={shot.id} value={shot.id}>{shot.id}: {shot.description}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleVerify} disabled={isLoading || !shot1Id || !shot2Id} className="w-full mt-4 bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
          {isLoading ? 'Verifying...' : 'Verify Continuity Between Shots'}
        </button>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card title="Shot Comparison">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2 text-center">{shot1?.shotNumber || 'Shot A'}</h4>
                    <div className="aspect-video bg-vanguard-bg rounded-lg flex items-center justify-center">
                        {shot1Id && lockedStoryboard[shot1Id] ? <img src={`data:image/png;base64,${lockedStoryboard[shot1Id]}`} className="max-h-full max-w-full" /> : <p>Select Shot</p>}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2 text-center">{shot2?.shotNumber || 'Shot B'}</h4>
                    <div className="aspect-video bg-vanguard-bg rounded-lg flex items-center justify-center">
                        {shot2Id && lockedStoryboard[shot2Id] ? <img src={`data:image/png;base64,${lockedStoryboard[shot2Id]}`} className="max-h-full max-w-full" /> : <p>Select Shot</p>}
                    </div>
                </div>
            </div>
        </Card>
        <Card title="AI Continuity Report">
          <div className="p-4 bg-vanguard-bg rounded-md min-h-[300px] max-h-[50vh] overflow-y-auto">
            {isLoading && <p>AI is analyzing the shots for inconsistencies...</p>}
            {error && <p className="text-vanguard-red">{error}</p>}
            {!isLoading && !analysis && <p>The continuity report will appear here.</p>}
            {analysis && <MarkdownRenderer content={analysis} />}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContinuityVerifier;
