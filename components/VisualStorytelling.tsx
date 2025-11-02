
import React from 'react';
import Card from './Card';

const ValidationItem: React.FC<{ status: 'pass' | 'warn' | 'fail'; label: string; description: string }> = ({ status, label, description }) => {
    const statusInfo = {
        pass: { icon: '✅', color: 'text-vanguard-green' },
        warn: { icon: '⚠️', color: 'text-vanguard-yellow' },
        fail: { icon: '❌', color: 'text-vanguard-red' },
    };
    
    return (
        <li className="flex items-start space-x-3">
            <span className={`mt-1 ${statusInfo[status].color}`}>{statusInfo[status].icon}</span>
            <div>
                <p className={`${statusInfo[status].color} font-semibold`}>{label}: {status.toUpperCase()}</p>
                <p className="text-sm text-vanguard-text-secondary">{description}</p>
            </div>
        </li>
    )
}

const VisualStorytelling: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-vanguard-text">Visual Storytelling</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
            <Card title="Shot Preview: SC_14_SH_03">
                <div className="aspect-video bg-vanguard-bg-tertiary rounded-lg flex items-center justify-center">
                    <img src="https://picsum.photos/seed/vanguard1/1280/720" alt="Shot Preview" className="w-full h-full object-cover rounded-lg"/>
                </div>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title="Shot Composition Validator">
                <ul className="space-y-4">
                    <ValidationItem status="pass" label="Rule of Thirds" description="Subject is positioned on the left third, drawing focus."/>
                    <ValidationItem status="warn" label="Eye-line Match" description="Duncan is looking off-screen. A corresponding reverse shot is recommended."/>
                    <ValidationItem status="fail" label="Power Dynamics" description="Jackson (protagonist) is framed in a subservient, low-power position relative to Duncan."/>
                    <ValidationItem status="pass" label="Negative Space" description="Excellent use of negative space communicates the character's isolation."/>
                </ul>
            </Card>
             <Card title="AI Suggestions" className="mt-8">
                <ul className="space-y-2 text-sm list-disc list-inside">
                    <li>Consider a slight low-angle shot on Jackson to restore narrative power.</li>
                    <li>Add an over-the-shoulder shot from Jackson's POV to complete the eye-line match.</li>
                </ul>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default VisualStorytelling;
