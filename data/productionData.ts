
import { shotListDatabase as rawShotlist } from './shotListDatabase';
import { screenplay } from './screenplay';
import { Shot, Act, Scene, Department } from '../types';

function parseProductionData(): { acts: Act[], scenes: Scene[], shots: Shot[] } {
  const acts: Act[] = [
    { id: 1, title: 'Act One', logline: 'Setup & Discovery' },
    { id: 2, title: 'Act Two', logline: 'Escalation & Crisis' },
    { id: 3, title: 'Act Three', logline: 'Resolution' },
  ];

  const sceneRegex = /SCENE (\d{3}[A-Z]?):/g;
  const screenplayScenes = screenplay.split(sceneRegex);
  const scenes: Scene[] = [];
  for (let i = 1; i < screenplayScenes.length; i += 2) {
    const sceneNum = screenplayScenes[i];
    const act = sceneNum.startsWith('A01') ? 1 : sceneNum.startsWith('A02') ? 2 : 3;
    scenes.push({
      id: `SCENE ${sceneNum}`,
      act,
      description: screenplayScenes[i+1].split('\n')[1] || `Scene ${sceneNum}`
    });
  }

  const lines = rawShotlist.split('\n');
  const shots: Shot[] = [];

  for (const line of lines) {
    if (line.startsWith('|')) {
      const parts = line.split('|').map(s => s.trim());
      if (parts.length > 5 && parts[1] !== '' && !parts[1].startsWith(' # ')) {
        try {
            const id = parts[2];
            if (!id || !id.includes('-S')) continue;

            const [actStr, sceneStr, shotLetter] = id.split('-');
            const actNum = parseInt(actStr.replace('A', ''), 10);
            const sceneNum = sceneStr.replace('S', '');
            
            const vfxRequired = parts[3].toLowerCase().includes('vfx') || parts[7].toLowerCase().includes('vfx');

            const allDepartments: Department[] = ['director', 'cinematography', 'vfx', 'sound'];
            const approvals = allDepartments.reduce((acc, dept) => {
              acc[dept] = { department: dept, status: 'pending' };
              return acc;
            }, {} as Record<Department, { department: Department, status: 'pending' }>);


            const shot: Shot = {
                id: id,
                act: actNum,
                scene: `SCENE ${sceneNum}`,
                shotNumber: `${sceneStr}-${shotLetter}`,
                description: parts[3],
                status: 'Not Started',
                complexity: parts[5].includes('EASY') ? 'EASY' : (parts[5].includes('MEDIUM') ? 'MEDIUM' : 'HARD'),
                characters: [],
                location: '', 
                tags: [],
                vfxRequired: vfxRequired,
                animationRequired: parts[3].toLowerCase().includes('animation'),
                pipelineStage: 'script',
                prompts: [],
                approvals,
                cameraAngle: parts[3].match(/wide|close-up|medium/i)?.[0].toLowerCase() || 'medium',
                lensType: '35mm',
                shotType: vfxRequired ? 'vfx' : 'storyboard',
                notes: parts[7] || '',
            };
            shots.push(shot);
        } catch (e) {
             console.warn("Could not parse shot line:", line, e);
        }
      }
    }
  }
  return { acts, scenes, shots };
}

export const productionData = parseProductionData();
