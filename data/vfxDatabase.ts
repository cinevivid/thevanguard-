import { vfxSpecs } from './vfxSpecs';
import { VFXShot, VFXComplexity } from '../types';

function parseVFXSpecs(): VFXShot[] {
  const lines = vfxSpecs.split('\n');
  const shots: VFXShot[] = [];
  let currentScene = '';

  for (const line of lines) {
    if (line.startsWith('SCENE ')) {
      currentScene = line.substring(6).split(':')[0].trim();
      continue;
    }

    if (line.startsWith('SHOT ')) {
      const parts = line.split(' ');
      const id = parts[1];
      const description = line.substring(line.indexOf(':') + 1).trim().replace(/ 🔴.*/, '').replace(/ 🟡.*/, '').replace(/ 🟢.*/, '');
      
      let complexity: VFXComplexity = 'Simple';
      if (line.includes('🔴 COMPLEX')) complexity = 'Complex';
      else if (line.includes('🟡 MEDIUM')) complexity = 'Medium';
      
      const shot: VFXShot = {
        id: id,
        scene: currentScene,
        description: description,
        complexity: complexity,
        budget: 'N/A', // Placeholder, full parsing would be more complex
        timeline: 'N/A' // Placeholder
      };
      shots.push(shot);
    }
  }
  return shots;
}

export const vfxDatabase: VFXShot[] = parseVFXSpecs();
