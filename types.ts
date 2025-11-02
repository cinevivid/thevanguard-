export enum View {
  DIRECTOR_DASHBOARD = "Director's Dashboard",
  TOOLS_HUB = 'Tools Hub',
  PRODUCTION_OFFICE = 'Production Office',
  EMOTIONAL_ARCHITECTURE = 'Emotional Architecture',
  VISUAL_STORYTELLING = 'Visual Storytelling',
  PACING_RHYTHM = 'Pacing & Rhythm',
  SCRIPT_ANALYSIS = 'Script Analysis',
  CONTINUITY_CHECKER = 'Continuity Checker',
  DOCUMENT_MANAGER = 'Document Manager',
  SHOT_DATABASE = 'Shot Database',
  SCRIPT_BREAKDOWN = 'AI Script Breakdown',
  LOOK_DEV_LAB = 'Look Dev Lab',
  CORPUS_ASSISTANT = 'Corpus Assistant',
  CANONICAL_ASSETS = 'Canonical Assets',
  STORYBOARD_GENERATOR = 'Storyboard Generator',
  VIDEO_GENERATOR = 'Video Generation',
  AUDIO_PRODUCTION = 'Audio Production',
  COLOR_VFX_HUB = 'Color & VFX Hub',
  EDIT_BAY = 'Edit Bay',
  ASSET_LIBRARY = 'Asset Library',
  TRAILER_GENERATOR = 'Trailer Generator',
}

export type ShotStatus = 'Not Started' | 'Storyboard Generated' | 'Storyboard Locked' | 'Video Generating' | 'Video Complete' | 'Error';

export type ShotComplexity = 'EASY' | 'MEDIUM' | 'HARD';

export interface Shot {
  id: string;
  scene: string;
  shotNumber: string;
  description: string;
  status: ShotStatus;
  complexity: ShotComplexity;
  prompt?: string;
  characters: string[];
  location: string;
  tags?: string[];
}

export type VFXComplexity = 'Simple' | 'Medium' | 'Complex';

export interface VFXShot {
  id: string;
  scene: string;
  description: string;
  complexity: VFXComplexity;
  budget: string;
  timeline: string;
}

export interface TimelineClip {
  id: string; // Unique ID for the clip on the timeline, e.g., `${shot.id}-${Date.now()}`
  shot: Shot;
  url: string;
  type: 'Video' | 'Dialogue' | 'SFX' | 'Music';
  startTime: number;
  duration: number;
}

export interface TimelineTrack {
  id: 'video' | 'dialogue' | 'sfx' | 'music';
  name: string;
  clips: TimelineClip[];
}

export interface FestivalEntry {
  id: number;
  name: string;
  deadline: string;
  status: 'Researching' | 'Submitted' | 'Accepted' | 'Rejected';
}