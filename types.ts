
export enum View {
  // Department Hubs
  DIRECTORS_ROOM = "Director's Room",
  WRITERS_ROOM = "Writer's Room",
  ART_DEPT = 'Digital Art Dept.',
  CAMERA_DEPT = 'Camera & Lighting Dept.',
  POST_PRODUCTION_SUITE = 'Post-Production Suite',
  
  // Standalone Tools & Pages (accessible from hubs or Tools Hub)
  PRODUCTION_OFFICE = 'Production Office',
  SHOT_DATABASE = 'Shot Database',
  CONTINUITY_VERIFIER = 'Continuity Verifier',
  SHOT_COMPOSITION_VALIDATOR = "DP's Validator",
  ASSET_LIBRARY = 'Asset Library',
  PRODUCTION_AUDIT = 'Production Audit',
  TOOLS_HUB = 'Tools Hub',
  DIRECTORS_APPROVAL_QUEUE = "Director's Approval Queue",
  
  // Art Dept Tools
  LOOK_DEV_LAB = 'Look Dev Lab',
  AI_CASTING_STUDIO = 'AI Casting Studio',
  CANONICAL_ASSETS = 'Canonical Assets',
  STORYBOARD_GENERATOR = 'Storyboard Generator',
  
  // Post-Production Tools
  VIDEO_GENERATOR = 'Video Generation',
  AUDIO_PRODUCTION = 'Audio Production',
  EDIT_BAY = 'Edit Bay',
  COLOR_VFX_HUB = 'Color & VFX Hub',
  TRAILER_GENERATOR = 'Trailer Generator',

  // Analysis Tools (part of Writer's Room but directly accessible)
  SCRIPT_ANALYSIS = 'Script Analysis',
  SCRIPT_BREAKDOWN = 'Script Breakdown',
  EMOTIONAL_ARCHITECTURE = 'Emotional Architecture',
  PACING_RHYTHM = 'Pacing & Rhythm',
  
  // System
  API_KEYS = 'API Keys & Services',
}

// FIX: Add 'Storyboard Generated' as a valid shot status.
export type ShotStatus = 'Not Started' | 'Pending Approval' | 'Storyboard Generated' | 'Storyboard Locked' | 'Video Generating' | 'Video Complete' | 'Error';

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

export interface Act {
    id: number;
    title: string;
    logline: string;
}

export interface Scene {
    id: string;
    act: number;
    description: string;
}

export interface Shot {
  id: string; 
  act: number;
  scene: string; 
  shotNumber: string; 
  description: string;
  status: ShotStatus;
  complexity: ShotComplexity;
  characters: string[];
  location: string;
  tags?: string[];
  
  shotType?: 'storyboard' | 'vfx' | 'animation';
  cameraAngle?: string;
  cameraMovement?: string;
  lensType?: string;
  lightingSetup?: string;
  vfxRequired: boolean;
  animationRequired: boolean;
  audioNotes?: string;
  complexityScore?: number;
  
  prompts: ShotPrompt[];
  approvals: Record<Department, DepartmentApproval>;
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
  shot?: Shot;
  url: string;
  type: 'Video' | 'Dialogue' | 'SFX' | 'Music' | 'Ambience';
  startTime: number;
  duration: number;
  name: string;
}

export interface TimelineTrack {
  id: 'video' | 'dialogue' | 'sfx' | 'music' | 'ambience';
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

export type TaskStatus = 'Incomplete' | 'Complete';
export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Task {
  id: number;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface BudgetItem {
  category: string;
  planned: number;
  actual: number;
}
