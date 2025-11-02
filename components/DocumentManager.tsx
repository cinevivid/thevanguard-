import React, { useState } from 'react';
import Card from './Card';
import { screenplay } from '../data/screenplay';
import { productionBible } from '../data/productionBible';
import { visualLookbook } from '../data/visualLookbook';
import { shotListDatabase } from '../data/shotListDatabase';
import { consistencyFormula } from '../data/consistencyFormula';
import { productionCalendar } from '../data/productionCalendar';


const documents: Record<string, string> = {
  "Screenplay": screenplay,
  "Production Bible": productionBible,
  "Visual Lookbook": visualLookbook,
  "Shot Database": shotListDatabase,
  "Consistency Formula": consistencyFormula,
  "Production Calendar": productionCalendar,
};

const DocumentManager: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<string>("Screenplay");

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">Document Manager</h1>
        <p className="text-vanguard-text-secondary">Browse the raw text of your core production documents.</p>
      </div>
      
       <div className="flex items-center space-x-2">
        <label htmlFor="doc-select" className="text-sm font-medium">Select Document:</label>
        <select id="doc-select" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)} className="bg-vanguard-bg-tertiary border border-vanguard-bg-tertiary rounded-md p-2 text-sm">
          {Object.keys(documents).map(doc => <option key={doc} value={doc}>{doc}</option>)}
        </select>
      </div>

      <Card title={selectedDoc} className="flex-1 flex flex-col">
        <div className="overflow-y-auto p-4 bg-vanguard-bg rounded-md">
          <pre className="text-xs text-vanguard-text-secondary whitespace-pre-wrap">
            {documents[selectedDoc]}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default DocumentManager;