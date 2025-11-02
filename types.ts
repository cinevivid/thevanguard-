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
  AI_CASTING_STUDIO = 'AI Casting Studio',
  CORPUS_ASSISTANT = 'Corpus Assistant',
  CANONICAL_ASSETS = 'Canonical Assets',
  STORYBOARD_GENERATOR = 'Storyboard Generator',
  SHOT_COMPOSITION_VALIDATOR = 'Shot Composition Validator',
  VIDEO_GENERATOR = 'Video Generation',
  AUDIO_PRODUCTION = 'Audio Production',
  COLOR_VFX_HUB = 'Color & VFX Hub',
  EDIT_BAY = 'Edit Bay',
  ASSET_LIBRARY = 'Asset Library',
  TRAILER_GENERATOR = 'Trailer Generator',
  EMOTIONAL_ARC_VISUALIZER = 'Emotional Arc Visualizer',
  PACING_VISUALIZER = 'Pacing Visualizer',
}

export type ShotStatus = 'Not Started' | 'Storyboard Generated' | 'Storyboard Locked' | 'Video Generating' | 'Video Complete' | 'Error';

export type ShotComplexity = 'EASY' | 'MEDIUM' | 'HARD';
export type Department = 'director' | 'cinematography' | 'vfx' | 'sound';
export type ApprovalStatus = 'pending' | 'approved' | 'needs_revision';
export type PipelineStage = 'script' | 'storyboard' | 'previz' | 'production' | 'vfx' | 'post';


export interface ShotPrompt {
  type: 'midjourney_storyboard' | 'vfx' | 'animation' | 'character_ref';
  prompt: string;
  version: number;
  status: 'draft' | 'ready' | 'approved' | 'rejected';
  generatedImageUrl?: string;
  consistencyScore?: number;
}

export interface DepartmentApproval {
  department: Department;
  status: ApprovalStatus;
  notes?: string;
}

export interface Shot {
  id: string; // e.g., A01-S001-A
  scene: string; // e.g., SCENE 001
  shotNumber: string; // e.g., S001-A
  description: string;
  status: ShotStatus;
  complexity: ShotComplexity;
  characters: string[];
  location: string;
  tags?: string[];
  
  // Enhanced Fields from Prompt
  shotType?: 'storyboard' | 'vfx' | 'animation';
  cameraAngle?: string;
  cameraMovement?: string;
  lensType?: string;
  lightingSetup?: string;
  vfxRequired: boolean;
  animationRequired: boolean;
  audioNotes?: string;
  complexityScore?: number; // 1-10
  
  prompts: ShotPrompt[];
  approvals: DepartmentApproval[];
  pipelineStage: PipelineStage;
  estimatedCost?: number;
  notes?: string;
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
  id: string; 
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

export interface EmotionalArcPoint {
  scene: string;
  intensity: number; // -10 to 10
  description: string;
}

export interface PacingPoint {
  scene: string;
  asl: number; // Average Shot Length
  intensity: 'Low' | 'Medium' | 'High';
}