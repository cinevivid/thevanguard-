import React, { useState, useCallback } from 'react';
import Card from './Card';
import { analyzeScript } from '../services/geminiService';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\n/g, '<br />') }} />;
};

const EmotionalArchitecture: React.FC = () => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<string>('Jackson');

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const stream = analyzeScript('emotional_arc', character);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setAnalysis(fullResponse);
      }
    } catch (err) {
      setError('Failed to get analysis from AI.');
    } finally {
      setIsLoading(false);
    }
  }, [character]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Emotional Architecture</h1>
      <p className="text-vanguard-text-secondary">Analyze the emotional journey of each main character. Use these insights to guide performance, cinematography, and editing choices.</p>
      
      <Card title="Character Arc Analysis">
        <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="char-select">Select Character:</label>
            <select id="char-select" value={character} onChange={e => setCharacter(e.target.value)} className="bg-vanguard-bg-tertiary p-2 rounded-md">
                <option>Jackson</option>
                <option>Duncan</option>
                <option>Vanguard</option>
            </select>
             <button onClick={handleAnalyze} disabled={isLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg">
                {isLoading ? 'Analyzing...' : `Analyze ${character}'s Arc`}
            </button>
        </div>
        <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[200px] max-h-[60vh] overflow-y-auto">
            {isLoading && !analysis && <p>AI is analyzing the emotional journey...</p>}
            {error && <p className="text-vanguard-red">{error}</p>}
            {analysis && <MarkdownRenderer content={analysis} />}
        </div>
      </Card>
    </div>
  );
};

export default EmotionalArchitecture;