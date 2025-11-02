
import React from 'react';
import Card from './Card';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-vanguard-text">Project Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card title="Project Progress">
          <div className="w-full bg-vanguard-bg-tertiary rounded-full h-4 mb-2">
            <div className="bg-vanguard-accent h-4 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-center text-vanguard-text-secondary">45% Complete</p>
        </Card>
        <Card title="Script Analysis">
          <p className="text-2xl font-bold text-vanguard-green">PASS</p>
          <p className="text-vanguard-text-secondary">Coverage v2</p>
        </Card>
        <Card title="Continuity Check">
          <p className="text-2xl font-bold text-vanguard-green">99.8%</p>
          <p className="text-vanguard-text-secondary">2 minor issues detected</p>
        </Card>
        <Card title="Budget ROI Score">
          <p className="text-2xl font-bold text-vanguard-yellow">B+</p>
          <p className="text-vanguard-text-secondary">High-value shots on track</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Active Tasks">
            <ul className="space-y-3">
                <li className="flex justify-between items-center"><span>Grade Scene 12 Color Palette</span> <span className="text-xs bg-vanguard-yellow text-vanguard-bg font-bold py-1 px-2 rounded">In Progress</span></li>
                <li className="flex justify-between items-center"><span>Finalize Sound Mix for Act 1</span> <span className="text-xs bg-vanguard-yellow text-vanguard-bg font-bold py-1 px-2 rounded">In Progress</span></li>
                <li className="flex justify-between items-center"><span>Generate Dailies for Scene 15</span> <span className="text-xs bg-vanguard-green text-white font-bold py-1 px-2 rounded">Completed</span></li>
                <li className="flex justify-between items-center"><span>Script Coverage for v3</span> <span className="text-xs bg-vanguard-red text-white font-bold py-1 px-2 rounded">Blocked</span></li>
            </ul>
        </Card>
        <Card title="Recent Activity">
            <p className="text-sm text-vanguard-text-secondary">
                <span className="font-bold text-vanguard-accent">AI Continuity Checker</span> found a prop mismatch in Shot 112b.
            </p>
            <p className="text-sm text-vanguard-text-secondary mt-2">
                <span className="font-bold text-vanguard-accent">Pacing Analysis</span> flagged Scene 22 as 15% slower than genre norm.
            </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
