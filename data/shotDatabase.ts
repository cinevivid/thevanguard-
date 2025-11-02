import { shotListDatabase as rawShotlist } from './shotListDatabase';
import { Shot, ShotStatus, ShotComplexity, PipelineStage } from '../types';

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
            
            const vfxRequired = parts[3].toLowerCase().includes('vfx') || parts[6].toLowerCase().includes('vfx');

            const shot: Shot = {
                id: id,
                scene: `SCENE ${sceneNum.replace('S','')}`,
                shotNumber: `${sceneNum}-${shotLetter}`,
                description: parts[3],
                status: 'Not Started',
                complexity: parts[5].includes('EASY') ? 'EASY' : (parts[5].includes('MEDIUM') ? 'MEDIUM' : 'HARD'),
                characters: [], // Placeholder, could be parsed from description
                location: '', // Placeholder, would need scene-level data
                tags: [],
                
                // New Enhanced Fields
                vfxRequired: vfxRequired,
                animationRequired: parts[3].toLowerCase().includes('animation'),
                pipelineStage: 'script',
                prompts: [],
                approvals: [],
                
                // Placeholder cinematography
                cameraAngle: 'Medium',
                lensType: '35mm',
                shotType: 'storyboard',
                cameraMovement: 'static',
                lightingSetup: 'standard',
                audioNotes: '',
                complexityScore: 5,
                estimatedCost: 0,
                notes: '',
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
