
import React, { useState, useMemo } from 'react';
import { Shot, Department, ApprovalStatus } from '../types';
import Card from './Card';

interface DepartmentsProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
}

const Departments: React.FC<DepartmentsProps> = ({ shots, setShots }) => {
  const [activeDept, setActiveDept] = useState<Department>('director');

  const shotsForDept = useMemo(() => {
    return shots.filter(shot => {
      if (activeDept === 'vfx') return shot.vfxRequired;
      return true; // Director and Cinematography see all shots
    });
  }, [shots, activeDept]);
  
  const handleSetApproval = (shotId: string, status: ApprovalStatus) => {
    setShots(prevShots => prevShots.map(shot => {
      if (shot.id === shotId) {
        return {
          ...shot,
          approvals: {
            ...shot.approvals,
            [activeDept]: { department: activeDept, status: status }
          }
        };
      }
      return shot;
    }));
  };

  const getStatusColor = (status: ApprovalStatus) => {
    switch(status) {
      case 'approved': return 'bg-vanguard-green/20 text-vanguard-green';
      case 'pending': return 'bg-vanguard-yellow/20 text-yellow-400';
      case 'needs_revision': return 'bg-vanguard-orange/20 text-vanguard-orange';
      default: return 'bg-vanguard-text-secondary/20';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Department Hubs</h1>
        <p className="text-vanguard-text-secondary mt-2">Manage departmental reviews and approvals. Each department head can view their relevant shots and sign off on them.</p>
      </div>

      <div className="flex border-b border-vanguard-bg-tertiary">
        {(['director', 'cinematography', 'vfx'] as Department[]).map(dept => (
          <button key={dept} onClick={() => setActiveDept(dept)} className={`py-2 px-4 text-sm font-semibold capitalize ${activeDept === dept ? 'text-vanguard-accent border-b-2 border-vanguard-accent' : 'text-vanguard-text-secondary'}`}>
            {dept}
          </button>
        ))}
      </div>

      <Card title={`${activeDept.charAt(0).toUpperCase() + activeDept.slice(1)} Department View (${shotsForDept.length} shots)`} className="flex-1 flex flex-col">
        <div className="overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-vanguard-bg-secondary">
              <tr>
                <th className="py-2 px-3">Shot ID</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shotsForDept.map(shot => {
                const approval = shot.approvals[activeDept];
                return (
                  <tr key={shot.id} className="border-b border-vanguard-bg-tertiary">
                    <td className="py-2 px-3 font-mono text-xs">{shot.id}</td>
                    <td className="py-2 px-3">{shot.description}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(approval?.status || 'pending')}`}>
                        {approval?.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleSetApproval(shot.id, 'approved')} className="text-vanguard-green" title="Approve">✅</button>
                        <button onClick={() => handleSetApproval(shot.id, 'needs_revision')} className="text-vanguard-orange" title="Needs Revision">🔄</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Departments;
