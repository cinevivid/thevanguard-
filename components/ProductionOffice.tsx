import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';
// FIX: Add BudgetItem to import to support budget tracking props.
import { FestivalEntry, Task, TaskPriority, TaskStatus, BudgetItem } from '../types';
import { generatePressKitContent } from '../services/geminiService';

// FIX: Add budget and setBudget to the component's props interface.
interface ProductionOfficeProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  budget: BudgetItem[];
  setBudget: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
}

const ProductionOffice: React.FC<ProductionOfficeProps> = ({ tasks, setTasks, budget, setBudget }) => {
  // FIX: Add 'budget' as a possible active tab.
  const [activeTab, setActiveTab] = useState<'calendar' | 'festivals' | 'presskit' | 'budget'>('calendar');
  const [festivals, setFestivals] = useState<FestivalEntry[]>(() => {
    const saved = localStorage.getItem('festivals');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Sundance', deadline: '2026-09-15', status: 'Researching' },
      { id: 2, name: 'SXSW', deadline: '2026-11-01', status: 'Researching' },
    ];
  });
  const [pressKitContent, setPressKitContent] = useState('');
  const [isPressKitLoading, setIsPressKitLoading] = useState(false);

  // Task management state
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'All'>('All');
  const [sortKey, setSortKey] = useState<'dueDate' | 'priority'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  useEffect(() => {
    localStorage.setItem('festivals', JSON.stringify(festivals));
  }, [festivals]);

  const priorityOrder: Record<TaskPriority, number> = {
    'Critical': 4,
    'High': 3,
    'Medium': 2,
    'Low': 1,
  };

  const sortedAndFilteredTasks = useMemo(() => {
    return tasks
      .filter(task => filterStatus === 'All' || task.status === filterStatus)
      .filter(task => filterPriority === 'All' || task.priority === filterPriority)
      .sort((a, b) => {
        let comparison = 0;
        if (sortKey === 'dueDate') {
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else { // priority
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [tasks, filterStatus, filterPriority, sortKey, sortDirection]);

  const toggleTaskStatus = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'Complete' ? 'Incomplete' : 'Complete' }
          : task
      )
    );
  };

  const handleGenerateEPK = async () => {
    setIsPressKitLoading(true);
    setPressKitContent('');
    try {
        const stream = generatePressKitContent();
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
        }
        setPressKitContent(fullResponse);
    } catch (e) {
        setPressKitContent("Failed to generate Press Kit content.");
    } finally {
        setIsPressKitLoading(false);
    }
  };

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

  const priorityColors: Record<TaskPriority, string> = {
    Critical: 'border-vanguard-red',
    High: 'border-vanguard-orange',
    Medium: 'border-vanguard-yellow',
    Low: 'border-vanguard-accent',
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Production Office</h1>
        <p className="text-vanguard-text-secondary mt-2">The logistical, financial, and marketing command center for your film.</p>
      </div>

      <div className="flex border-b border-vanguard-bg-tertiary">
        <button onClick={() => setActiveTab('calendar')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'calendar' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Production Tasks</button>
        <button onClick={() => setActiveTab('festivals')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'festivals' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Festival Tracker</button>
        <button onClick={() => setActiveTab('presskit')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'presskit' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Press Kit</button>
        {/* FIX: Add 'Budget & Finance' tab. */}
        <button onClick={() => setActiveTab('budget')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'budget' ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>Budget & Finance</button>
      </div>

      {activeTab === 'calendar' && (
        <Card title="Production Task Manager" className="flex-1 flex flex-col">
          <div className="p-4 flex flex-wrap items-center gap-4 border-b border-vanguard-bg-tertiary">
            {/* Filtering Controls */}
            <div className="flex items-center space-x-2">
              <label className="text-sm">Status:</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-vanguard-bg-tertiary p-2 rounded-md text-sm">
                <option>All</option><option>Incomplete</option><option>Complete</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm">Priority:</label>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as any)} className="bg-vanguard-bg-tertiary p-2 rounded-md text-sm">
                <option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            {/* Sorting Controls */}
            <div className="flex items-center space-x-2">
              <label className="text-sm">Sort by:</label>
              <select value={sortKey} onChange={e => setSortKey(e.target.value as any)} className="bg-vanguard-bg-tertiary p-2 rounded-md text-sm">
                <option value="dueDate">Due Date</option><option value="priority">Priority</option>
              </select>
              <select value={sortDirection} onChange={e => setSortDirection(e.target.value as any)} className="bg-vanguard-bg-tertiary p-2 rounded-md text-sm">
                <option value="asc">Asc</option><option value="desc">Desc</option>
              </select>
            </div>
          </div>
          <div className="overflow-y-auto pr-2">
            <ul className="space-y-2 p-4">
              {sortedAndFilteredTasks.map((task) => (
                <li key={task.id} className={`flex items-center space-x-3 p-3 bg-vanguard-bg-tertiary rounded-md border-l-4 ${priorityColors[task.priority]} transition-all duration-300 ${task.status === 'Complete' ? 'opacity-50' : ''}`}>
                  <input type="checkbox" checked={task.status === 'Complete'} onChange={() => toggleTaskStatus(task.id)} className="form-checkbox h-5 w-5 bg-vanguard-bg border-vanguard-bg-tertiary text-vanguard-accent rounded focus:ring-vanguard-accent" />
                  <div className="flex-1">
                    <p className={`text-sm ${task.status === 'Complete' ? 'line-through' : ''}`}>{task.description}</p>
                    <p className="text-xs text-vanguard-text-secondary">{task.dueDate}</p>
                  </div>
                   <span className={`text-xs font-bold px-2 py-1 rounded-full ${Object.values(priorityColors).find(c => c.includes(priorityColors[task.priority].split('-')[2]))?.replace('border-', 'bg-').replace('/20', '')}/20`}>{task.priority}</span>
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
              <pre>{pressKitContent}</pre>
          </div>
        </Card>
      )}

      {/* FIX: Add budget tab content to display budget data passed in props. */}
      {activeTab === 'budget' && (
        <Card title="Film Budget Tracker" className="flex-1 flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-vanguard-bg-secondary">
                <tr className="border-b border-vanguard-bg-tertiary">
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3 text-right">Planned Cost</th>
                  <th className="py-2 px-3 text-right">Actual Cost</th>
                  <th className="py-2 px-3 text-right">Variance</th>
                </tr>
              </thead>
              <tbody>
                {budget.map((item, index) => (
                  <tr key={index} className="border-b border-vanguard-bg-tertiary">
                    <td className="py-2 px-3 font-semibold">{item.category}</td>
                    <td className="py-2 px-3 text-right">${item.planned.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">${item.actual.toLocaleString()}</td>
                    <td className={`py-2 px-3 text-right ${item.actual > item.planned ? 'text-vanguard-red' : 'text-vanguard-green'}`}>
                      ${(item.actual - item.planned).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-vanguard-bg-tertiary font-bold bg-vanguard-bg-tertiary">
                    <td className="py-3 px-3">TOTALS</td>
                    <td className="py-3 px-3 text-right">${budget.reduce((sum, i) => sum + i.planned, 0).toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">${budget.reduce((sum, i) => sum + i.actual, 0).toLocaleString()}</td>
                    <td className={`py-3 px-3 text-right ${budget.reduce((sum, i) => sum + i.actual, 0) > budget.reduce((sum, i) => sum + i.planned, 0) ? 'text-vanguard-red' : 'text-vanguard-green'}`}>
                      ${(budget.reduce((sum, i) => sum + i.actual, 0) - budget.reduce((sum, i) => sum + i.planned, 0)).toLocaleString()}
                    </td>
                </tr>
              </tbody>
            </table>
            {budget.length === 0 && <p className="p-4 text-center text-vanguard-text-secondary">No budget items have been added yet.</p>}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductionOffice;
