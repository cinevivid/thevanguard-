
import React, { useState, useCallback } from 'react';
import Card from './Card';
import { runProductionAudit } from '../services/geminiService';
import { Shot } from '../types';

interface ProductionAuditProps {
    shots: Shot[];
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\n/g, '<br />').replace(/\* (.*?)\<br \/\>/g, '<li class="ml-4 list-disc">$1</li>') }} />;
};

const ProductionAudit: React.FC<ProductionAuditProps> = ({ shots }) => {
  const [auditResult, setAuditResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAudit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAuditResult('');
    try {
      const stream = runProductionAudit(shots);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setAuditResult(fullResponse);
      }
    } catch (err) {
      setError('Failed to get audit from AI.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [shots]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">AI Production Audit</h1>
      <p className="text-vanguard-text-secondary">Your AI Executive Producer. Scan the entire production to identify critical blockers, missing resources, and potential inconsistencies in your workflow.</p>
      
      <Card title="Production Health Check">
        <button onClick={handleRunAudit} disabled={isLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg mb-4">
          {isLoading ? 'Auditing...' : 'Run Full Production Audit'}
        </button>
        <div className="mt-4 p-4 bg-vanguard-bg rounded-md min-h-[200px] max-h-[60vh] overflow-y-auto">
          {isLoading && !auditResult && <p>AI is scanning all 430 shots for issues...</p>}
          {!isLoading && !auditResult && <p>Click the button above to start a full production audit.</p>}
          {error && <p className="text-vanguard-red">{error}</p>}
          {auditResult && <MarkdownRenderer content={auditResult} />}
        </div>
      </Card>
    </div>
  );
};

export default ProductionAudit;
