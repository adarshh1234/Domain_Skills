import { AssessmentConfig, AssessmentMode } from './assessment';

export interface ScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface AssessmentResult {
  id: string;
  sessionId: string;
  mode: AssessmentMode;
  modeTitle?: string;
  score: number;
  status: 'passed' | 'review' | 'needs-improvement';
  breakdown: ScoreBreakdown[];
  submittedAt: number;
  timeSpent: number; // in seconds
  totalDuration: number; // in minutes
  config?: AssessmentConfig;
  answersSummary?: Record<string, unknown>;
  generalFeedback?: string;
}
