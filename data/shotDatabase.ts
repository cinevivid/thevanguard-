import { shotListDatabase as rawShotlist } from './shotListDatabase';
import { Shot, ShotStatus, ShotComplexity } from '../types';

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
            const [act, sceneNum, shotLetter] = id.split('-');
            const shot: Shot = {
                id: id,
                scene: `SCENE ${sceneNum.replace('S','')}`,
                shotNumber: `${sceneNum}-${shotLetter}`,
                description: parts[3],
                status: 'Not Started',
                complexity: parts[5].includes('EASY') ? 'EASY' : parts[5].includes('MEDIUM') ? 'MEDIUM' : 'HARD',
                characters: [], // placeholder
                location: '', // placeholder
                tags: [],
            };
            shots.push(shot);
        } catch (e) {
            // Ignore header or malformed lines
        }
      }
    }
  }
  return shots;
}

export const shotDatabase: Shot[] = parseShotlist();