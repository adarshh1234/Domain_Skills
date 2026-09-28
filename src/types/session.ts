import { AssessmentConfig, AssessmentMode } from './assessment';

export type SessionStatus = 'active' | 'submitted' | 'expired';

export interface AssessmentSession {
  id: string;
  mode: AssessmentMode;
  startedAt: number; // millisecond timestamp
  duration: number; // minutes
  currentQuestion: number;
  answers: Record<string, unknown>;
  config: AssessmentConfig;
  status: SessionStatus;
  lastSavedAt?: number;
}
