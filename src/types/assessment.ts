export type AssessmentMode =
  | 'coding'
  | 'architecture'
  | 'system'
  | 'debugging'
  | 'database'
  | 'security';

export interface AssessmentConfig {
  domain: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: number; // in minutes
  allowCompile: boolean;
  aiHints: boolean;
  recordScreen: boolean;
  autoEval: boolean;
}

export interface ModeInfo {
  id: AssessmentMode;
  name: string;
  route: string;
  tagline: string;
  description: string;
  icon: string;
  badge: string;
  accent: string;
}
