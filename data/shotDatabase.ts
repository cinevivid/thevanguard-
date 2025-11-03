
import { shotListDatabase as rawShotlist } from './shotListDatabase';
import { Shot, ShotStatus, ShotComplexity, PipelineStage, DepartmentApproval, ShotPrompt, Department } from '../types';

function parseShotlist(): Shot[] {
  const lines = rawShotlist.split('\n');
  const shots: Shot[] = [];
  let currentScene = '';

  for (const line of lines) {
    if (line.startsWith('### SCENE')) {
      currentScene = line.substring(4).split(':')[0].trim();
      continue;
    }

    if (line.startsWith('|')) {
      const parts = line.split('|').map(s => s.trim());
      if (parts.length > 5 && parts[1] !== '' && !parts[1].startsWith(' # ')) {
        try {
            const id = parts[2];
            if (!id || !id.includes('-S')) continue; // Skip header/malformed lines

            const [_act, sceneNum, shotLetter] = id.split('-');
            const status = parts[4] === '✅ DETAILED' ? 'Not Started' : 'Not Started'; // Default status
            const vfxRequired = parts[3].toLowerCase().includes('vfx') || parts[6].toLowerCase().includes('vfx');
            const animationRequired = parts[3].toLowerCase().includes('animation');

            // FIX: Correctly initialize approvals as an object instead of an array to match the 'Record<Department, DepartmentApproval>' type.
            const allDepartments: Department[] = ['director', 'cinematography', 'vfx', 'sound'];
            const approvals = allDepartments.reduce((acc, dept) => {
              acc[dept] = { department: dept, status: 'pending' };
              return acc;
            }, {} as Record<Department, DepartmentApproval>);


            const shot: Shot = {
                id: id,
                scene: `SCENE ${sceneNum.replace('S','')}`,
                shotNumber: `${sceneNum}-${shotLetter}`,
                description: parts[3],
                status: status as ShotStatus,
                complexity: parts[5].includes('EASY') ? 'EASY' : (parts[5].includes('MEDIUM') ? 'MEDIUM' : 'HARD'),
                characters: [], // Placeholder, could be parsed from description
                location: '', // Placeholder, would need scene-level data
                tags: [],
                
                vfxRequired: vfxRequired,
                animationRequired: animationRequired,
                pipelineStage: 'script',
                prompts: [] as ShotPrompt[],
                approvals: approvals,
                
                // Placeholder cinematography, can be filled by AI Director later
                cameraAngle: parts[3].match(/wide|close-up|medium/i)?.[0].toLowerCase() || 'medium',
                lensType: '35mm',
                shotType: vfxRequired ? 'vfx' : 'storyboard',
                cameraMovement: 'static',
                lightingSetup: 'standard',
                audioNotes: '',
                complexityScore: parts[5].includes('EASY') ? 3 : (parts[5].includes('MEDIUM') ? 5 : 8),
                estimatedCost: 0.12,
                notes: parts[7] || '',
            };
            shots.push(shot);
        } catch (e) {
             console.warn("Could not parse shot line:", line, e);
        }
      }
    }
  }
  return shots;
}

export const shotDatabase: Shot[] = parseShotlist();
