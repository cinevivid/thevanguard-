import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Card from './Card';
import { vfxDatabase } from '../data/vfxDatabase';
import { productionCalendar } from '../data/productionCalendar';
import { FestivalEntry, Shot } from '../types';
import { generatePressKitContent } from '../services/geminiService';

interface ProductionOfficeProps {
  shots: Shot[];
}

const ProductionOffice: React.FC<ProductionOfficeProps> = ({ shots }) => {
  const [activeTab, setActiveTab] = useState<'budget' | 'calendar' | 'festivals' | 'presskit'>('budget');
  const [festivals, setFestivals] = useState<FestivalEntry[]>(() => {
    const saved = localStorage.getItem('festivals');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Sundance', deadline: '2026-09-15', status: 'Researching' },
      { id: 2, name: 'SXSW', deadline: '2026-11-01', status: 'Researching' },
    ];
  });
  const [pressKitContent, setPressKitContent] = useState('');
  const [isPressKitLoading, setIsPressKitLoading] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('festivals', JSON.stringify(festivals));
  }, [festivals]);

  const budgetStats = useMemo(() => {
    const totalVFXBudget = vfxDatabase.reduce((sum, shot) => {
        const budgetValue = parseInt(shot.budget.replace('$', ''));
        return sum + (isNaN(budgetValue) ? 0 : budgetValue);
    }, 4900); // Start with base from docs as parser is simple
    const completedShots = shots.filter(s => s.status === 'Video Complete').length;
    const estimatedApiCost = completedShots * 0.15; // Rough estimate
    return { totalVFXBudget, estimatedApiCost };
  }, [shots]);

  const calendarTasks = useMemo(() => {
      return productionCalendar.split('\n').filter(line => line.startsWith('- [ ]') || line.startsWith('- [x]'));
  }, []);
  
  const handleGenerateEPK = useCallback(async () => {
    setIsPressKitLoading(true);
    setPressKitContent('');
    try {
        const stream = generatePressKitContent();
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setPressKitContent(fullResponse);
        }
    } catch (e) {
        setPressKitContent("Failed to generate Press Kit content.");
    } finally {
        setIsPressKitLoading(false);
    }
  }, []);

  const handleDownloadEPK = () => {
    const blob = new Blob([pressKitContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VANGUARD_EPK.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Production Office</h1>
        <p className="text-vanguard-text-secondary mt-2">The logistical, financial, and marketing command center for your film.</p>
      </div>

      <div className="flex border-b border-vanguard-bg-tertiary">
        <button onClick={() => setActiveTab('budget')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'budget' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Budget Tracker</button>
        <button onClick={() => setActiveTab('calendar')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'calendar' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Production Calendar</button>
        <button onClick={() => setActiveTab('festivals')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'festivals' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Festival Tracker</button>
        <button onClick={() => setActiveTab('presskit')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'presskit' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Press Kit</button>
      </div>

      {activeTab === 'budget' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="VFX Budget Overview">
            <p className="text-4xl font-bold text-vanguard-accent">${budgetStats.totalVFXBudget.toLocaleString()}</p>
            <p className="text-vanguard-text-secondary">Total Planned VFX Spend</p>
          </Card>
          <Card title="Estimated API Costs">
            <p className="text-4xl font-bold text-vanguard-accent">${budgetStats.estimatedApiCost.toFixed(2)}</p>
            <p className="text-vanguard-text-secondary">Based on completed video shots. (Est. $0.15/shot)</p>
          </Card>
        </div>
      )}

      {activeTab === 'calendar' && (
        <Card title="Interactive Production Calendar" className="flex-1 flex flex-col">
          <div className="overflow-y-auto pr-2">
            <ul className="space-y-2">
              {calendarTasks.map((task, i) => (
                <li key={i} className="flex items-center space-x-3 p-2 bg-vanguard-bg-tertiary rounded-md">
                  <input type="checkbox" checked={task.startsWith('- [x]')} readOnly className="form-checkbox h-5 w-5 bg-vanguard-bg border-vanguard-bg-tertiary text-vanguard-accent" />
                  <span className="text-sm">{task.substring(6)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {activeTab === 'festivals' && (
        <Card title="Festival & Distribution Tracker" className="flex-1 flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-vanguard-bg-secondary">
                <tr>
                  <th className="py-2 px-3">Festival</th>
                  <th className="py-2 px-3">Deadline</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {festivals.map(f => (
                  <tr key={f.id} className="border-b border-vanguard-bg-tertiary">
                    <td className="py-2 px-3 font-semibold">{f.name}</td>
                    <td className="py-2 px-3">{f.deadline}</td>
                    <td className="py-2 px-3">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

       {activeTab === 'presskit' && (
        <Card title="AI Press Kit (EPK) Generator">
          <div className="flex justify-end gap-4 mb-4">
            <button onClick={handleGenerateEPK} disabled={isPressKitLoading} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg">
              {isPressKitLoading ? 'Generating...' : '✨ Generate EPK Content'}
            </button>
             <button onClick={handleDownloadEPK} disabled={!pressKitContent} className="bg-vanguard-bg-tertiary hover:bg-vanguard-bg-secondary text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
              Download .md
            </button>
          </div>
          <div className="p-4 bg-vanguard-bg rounded-md min-h-[200px] max-h-[60vh] overflow-y-auto prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap">
              {isPressKitLoading && <p>AI is assembling your press kit...</p>}
              {!isPressKitLoading && !pressKitContent && <p>Generated press kit content will appear here.</p>}
              {pressKitContent}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductionOffice;