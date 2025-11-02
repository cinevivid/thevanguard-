import React, { useState, useEffect, useMemo } from 'react';
import { Shot, ShotStatus, View } from '../types';
import Card from './Card';
import { getDailyShootList, getAIDirectorNotes, runProductionAudit } from '../services/geminiService';

interface DirectorDashboardProps {
  shots: Shot[];
  setCurrentView: (view: View) => void;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    return <div className="prose prose-invert prose-sm max-w-none text-vanguard-text whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/### (.*?)\n/g, '<h3>$1</h3>').replace(/\n/g, '<br />').replace(/\* (.*?)\<br \/\>/g, '<li class="ml-4 list-disc">$1</li>') }} />;
};

const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ shots, setCurrentView }) => {
  const [shootList, setShootList] = useState('');
  const [directorNotes, setDirectorNotes] = useState('');
  const [auditResult, setAuditResult] = useState('');
  const [isLoadingShootList, setIsLoadingShootList] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingShootList(true);
      try {
        const shootListStream = getDailyShootList(shots);
        let fullResponse = '';
        for await (const chunk of shootListStream) {
          fullResponse += chunk;
        }
        setShootList(fullResponse);
      } catch (e) {
        setShootList("Error fetching shoot list.");
      } finally {
        setIsLoadingShootList(false);
      }

      setIsLoadingNotes(true);
      try {
        const notesStream = getAIDirectorNotes(shots);
        let fullResponse = '';
        for await (const chunk of notesStream) {
          fullResponse += chunk;
        }
        setDirectorNotes(fullResponse);
      } catch (e) {
        setDirectorNotes("Error fetching director notes.");
      } finally {
        setIsLoadingNotes(false);
      }
    };
    fetchDashboardData();
  }, [shots]);
  
  const handleRunAudit = async () => {
    setIsLoadingAudit(true);
    setAuditResult('');
     try {
        const auditStream = runProductionAudit(shots);
        let fullResponse = '';
        for await (const chunk of auditStream) {
          fullResponse += chunk;
        }
        setAuditResult(fullResponse);
      } catch (e) {
        setAuditResult("Error running production audit.");
      } finally {
        setIsLoadingAudit(false);
      }
  };

  const stats = useMemo(() => {
    const total = shots.length;
    const completed = shots.filter(s => s.status === 'Video Complete').length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    const statusCounts = shots.reduce((acc, shot) => {
        acc[shot.status] = (acc[shot.status] || 0) + 1;
        return acc;
    }, {} as Record<ShotStatus, number>);
    return { total, completed, percentage, statusCounts };
  }, [shots]);

  const statusColors: Record<ShotStatus, string> = {
    'Not Started': 'bg-vanguard-text-secondary',
    'Storyboard Generated': 'bg-yellow-500',
    'Storyboard Locked': 'bg-vanguard-green',
    'Video Generating': 'bg-blue-500',
    'Video Complete': 'bg-vanguard-accent',
    'Error': 'bg-vanguard-red',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-vanguard-text">Director's Dashboard</h1>
        <p className="text-vanguard-text-secondary mt-2">Your command center for "THE VANGUARD." Here's the project overview and your tasks for today.</p>
      </div>

      <Card title="Production Overview">
        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">Overall Film Completion</h4>
                    <span className="text-sm font-bold text-vanguard-accent">{stats.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-vanguard-bg-tertiary rounded-full h-4">
                    <div className="bg-vanguard-accent h-4 rounded-full" style={{ width: `${stats.percentage}%` }}></div>
                </div>
                 <p className="text-xs text-vanguard-text-secondary text-right mt-1">{stats.completed} of {stats.total} shots have completed video generation.</p>
            </div>
             <div>
                <h4 className="font-semibold mb-2">Shot Status Breakdown</h4>
                <div className="flex rounded-full overflow-hidden h-3">
                    {Object.entries(stats.statusCounts).map(([status, count]) => (
                        <div key={status} className={`${statusColors[status as ShotStatus]}`} style={{width: `${(count / stats.total) * 100}%`}} title={`${status}: ${count} shots`}></div>
                    ))}
                </div>
            </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="AI Daily Shoot List">
            <div className="min-h-[200px]">
                {isLoadingShootList ? <p className="text-vanguard-text-secondary">AI First Assistant Director is preparing your tasks...</p> : <MarkdownRenderer content={shootList} />}
            </div>
        </Card>
        <Card title="AI Director's Notes">
             <div className="min-h-[200px]">
                {isLoadingNotes ? <p className="text-vanguard-text-secondary">AI Director is analyzing your progress...</p> : <MarkdownRenderer content={directorNotes} />}
            </div>
        </Card>
      </div>

      <Card title="AI Production Audit">
        <div className="flex justify-end mb-4">
            <button onClick={handleRunAudit} disabled={isLoadingAudit} className="bg-vanguard-accent hover:bg-vanguard-accent-hover text-white font-bold py-2 px-4 rounded-lg">
                {isLoadingAudit ? 'Auditing...' : 'Run Full Production Audit'}
            </button>
        </div>
        <div className="p-4 bg-vanguard-bg rounded-md min-h-[150px] max-h-[50vh] overflow-y-auto">
            {isLoadingAudit && <p>AI is scanning all 430 shots for issues...</p>}
            {!isLoadingAudit && !auditResult && <p>Click "Run Audit" to have the AI identify critical production blockers and inconsistencies.</p>}
            {auditResult && <MarkdownRenderer content={auditResult} />}
        </div>
      </Card>
    </div>
  );
};

export default DirectorDashboard;
