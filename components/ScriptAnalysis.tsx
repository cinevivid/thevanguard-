
import React, { useState, useCallback } from 'react';
import Card from './Card';
import { analyzeScriptWithAI } from '../services/geminiService';

const defaultScript = `TITLE: THE CHRONOS KEY

LOGLINE: A disgraced historian discovers a device that can view the past, only to be hunted by a shadowy organization that will kill to protect history's deadliest secrets.

[SCENE START]

INT. UNIVERSITY ARCHIVES - NIGHT

Dust motes dance in the single beam of a flashlight. DR. ARIS THORNE (40s, sharp, but with the weary look of a man who's lost everything) carefully pries open a rotting crate.

Inside, nestled in straw, is a brass astrolabe, intricately carved with symbols he's never seen. He touches it.

A wave of vertigo hits him. The room SHIFTS. For a fleeting second, the dusty archive is replaced by a grand, sunlit Roman library. The scent of parchment and oil lamps is overwhelming. Then, it's gone.

Aris stumbles back, heart pounding.

                                ARIS
                     (whispering)
            It's real...

Suddenly, the heavy archive doors CREAK open. A SILHOUETTE stands there.

                                SILHOUETTE
            Dr. Thorne. You've found something
            that doesn't belong to you.

Aris grabs the astrolabe and runs.

[SCENE END]`;

const ScriptAnalysis: React.FC = () => {
  const [script, setScript] = useState<string>(defaultScript);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!script.trim()) {
      setError('Script content cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    try {
      const result = await analyzeScriptWithAI(script);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to get analysis from AI. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [script]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-vanguard-text">AI Script Analyst</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Screenplay Input">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your screenplay here..."
            className="w-full h-96 bg-vanguard-bg text-vanguard-text p-4 rounded-md border border-vanguard-bg-tertiary focus:ring-2 focus:ring-vanguard-accent focus:outline-none font-mono text-sm"
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="mt-4 w-full bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-vanguard-text-secondary disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : 'Analyze Script with AI'}
          </button>
        </Card>

        <Card title="AI Coverage Report">
          {error && <p className="text-vanguard-red">{error}</p>}
          {isLoading && !analysis && (
            <div className="flex flex-col items-center justify-center h-96 text-vanguard-text-secondary">
              <p>AI Analyst is reading your script...</p>
              <p className="text-sm">This may take a moment.</p>
            </div>
          )}
          {analysis && (
            <div className="prose prose-invert prose-sm max-w-none h-full max-h-[30rem] overflow-y-auto text-vanguard-text whitespace-pre-wrap p-4 bg-vanguard-bg rounded-md">
                {analysis}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ScriptAnalysis;
