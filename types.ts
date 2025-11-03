export enum View {
  DIRECTORS_ROOM = "Director's Room",
  WRITERS_ROOM = "Writer's Room",
  ART_DEPT = 'Digital Art Dept.',
  CAMERA_DEPT = 'Camera & Lighting',
  POST_PRODUCTION_SUITE = 'Post-Production Suite',

  // Standalone tools
  PRODUCTION_OFFICE = 'Production Office',
  SHOT_DATABASE = 'Shot Database',
  CONTINUITY_VERIFIER = 'Continuity Verifier',
  ASSET_LIBRARY = 'Asset Library',
  // FIX: Add PRODUCTION_AUDIT to the View enum
  PRODUCTION_AUDIT = 'Production Audit',
  
  // Keep for internal routing if needed, but not in sidebar
  TOOLS_HUB = 'Tools Hub',
}

// FIX: Add 'Storyboard Generated' to ShotStatus type
export type ShotStatus = 'Not Started' | 'Pending Approval' | 'Storyboard Locked' | 'Video Generating' | 'Video Complete' | 'Error' | 'Storyboard Generated';

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