import React, { useState, useCallback } from 'react';
import Card from './Card';
import { generateScriptBreakdown } from '../services/geminiService';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap p-4 bg-vanguard-bg rounded-md"
      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} // Simple renderer for this use case
    />
  );
};


const ScriptBreakdown: React.FC = () => {
  const [breakdown, setBreakdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setBreakdown('');
    try {
      const stream = generateScriptBreakdown();
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setBreakdown(fullResponse);
      }
    } catch (err) {
      setError('Failed to get breakdown from AI. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-vanguard-text">AI Script Breakdown</h1>
      <p className="text-vanguard-text-secondary">Use Gemini 2.5 Pro to analyze the final screenplay and automatically generate a preliminary shot list. This provides a powerful starting point for organizing your production in the Shot Database.</p>
      
      <Card title="Screenplay Analysis">
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? 'Analyzing Screenplay...' : '✨ Generate Shot List with AI'}
        </button>

        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Generated Shot List:</h3>
             {error && <p className="text-vanguard-red">{error}</p>}
              {isLoading && !breakdown && (
                <div className="flex flex-col items-center justify-center h-64 text-vanguard-text-secondary">
                  <p>AI is reading your screenplay and suggesting shots...</p>
                  <p className="text-sm">This may take a minute.</p>
                </div>
              )}
              {breakdown && (
                <div className="max-h-[60vh] overflow-y-auto">
                    <MarkdownRenderer content={breakdown} />
                </div>
              )}
        </div>

      </Card>
    </div>
  );
};

export default ScriptBreakdown;
