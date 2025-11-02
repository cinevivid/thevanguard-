import React, { useState, useCallback } from 'react';
import Card from './Card';
import { analyzeScript } from '../services/geminiService';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\n/g, '<br />') }} />;
};

const VisualStorytelling: React.FC = () => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const stream = analyzeScript('visual_motifs');
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
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Visual Storytelling</h1>
      <p className="text-vanguard-text-secondary">Identify recurring visual motifs, symbols, and cinematic language within the script to ensure a cohesive visual theme.</p>
      
      <Card title="Motif Analysis">
        <button onClick={handleAnalyze} disabled={isLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg mb-4">
          {isLoading ? 'Analyzing...' : `Analyze Visual Motifs`}
        </button>
        <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[200px] max-h-[60vh] overflow-y-auto">
          {isLoading && !analysis && <p>AI is analyzing the screenplay for visual motifs...</p>}
          {error && <p className="text-vanguard-red">{error}</p>}
          {analysis && <MarkdownRenderer content={analysis} />}
        </div>
      </Card>
    </div>
  );
};

export default VisualStorytelling;