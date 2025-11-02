import React, { useState, useCallback } from 'react';
import Card from './Card';
import { analyzeScript } from '../services/geminiService';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\n/g, '<br />') }} />;
};

const ScriptAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const stream = analyzeScript('full_analysis');
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
      <h1 className="text-3xl font-bold">Full Script Analysis</h1>
      <p className="text-vanguard-text-secondary">Get a comprehensive, AI-powered script coverage report, including loglines, summaries, theme analysis, and character breakdowns.</p>
      
      <Card title="Generate Script Report">
        <button onClick={handleAnalyze} disabled={isLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg mb-4">
          {isLoading ? 'Analyzing...' : `Generate Full Analysis`}
        </button>
        <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[200px] max-h-[60vh] overflow-y-auto">
          {isLoading && !analysis && <p>AI is performing a full analysis of the screenplay...</p>}
          {error && <p className="text-vanguard-red">{error}</p>}
          {analysis && <MarkdownRenderer content={analysis} />}
        </div>
      </Card>
    </div>
  );
};

export default ScriptAnalysis;