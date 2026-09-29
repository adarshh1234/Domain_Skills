export type OnboardingStage =
  | 'welcome'
  | 'personal'
  | 'documents'
  | 'approvals'
  | 'ml-analysis'
  | 'checklist'
  | 'completed';

export interface CandidateProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail: string;
  phone: string;
  location: string;
  department: string;
  role: string;
  level: string;
  joiningDate: string;
  managerName: string;
  managerEmail: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  linkedinUrl?: string;
  githubUrl?: string;
  bio?: string;
  avatarUrl?: string;
  status: 'Pre-boarding' | 'Day 1 in Progress' | 'Active Onboarded';
}

export interface OnboardingProgress {
  overallPercentage: number;
  currentStage: OnboardingStage;
  completedStages: OnboardingStage[];
  pendingStages: OnboardingStage[];
  daysToJoining: number;
  tasksCompleted: number;
  tasksTotal: number;
  documentsVerified: number;
  documentsTotal: number;
  approvalsCompleted: number;
  approvalsTotal: number;
  lastUpdated: string;
}

export type DocumentVerificationStatus = 'AI Verified' | 'Needs Manual Review' | 'Processing' | 'Rejected';

export interface OnboardingDocument {
  id: string;
  name: string;
  category: 'Identity' | 'Education' | 'Experience' | 'Legal & Tax' | 'Certifications';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: DocumentVerificationStatus;
  aiConfidence: number; // e.g. 94%
  verificationTimestamp?: string;
  remarks?: string;
  extractedFields?: Record<string, string>;
  isMandatory: boolean;
  fileUrl?: string;
}

export interface SkillRadarItem {
  skill: string;
  currentLevel: number; // 0-100
  requiredLevel: number; // 0-100
  benchmark: number; // 0-100
}

export interface SkillGapItem {
  skill: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  actionablePlan: string;
  relatedAssessmentTrack?: string;
}

export interface CareerMilestone {
  title: string;
  level: string;
  timeframe: string;
  description: string;
  keySkills: string[];
  isCurrent?: boolean;
}

export interface LearningRecommendation {
  id: string;
  title: string;
  provider: string;
  duration: string;
  matchScore: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsCovered: string[];
  url?: string;
  isEnrolled?: boolean;
}

export interface SkillAnalysis {
  candidateId: string;
  performanceScore: number;
  predictedTenureYears: number;
  roleFitPercentage: number;
  aiConfidencePercentage: number;
  radarData: SkillRadarItem[];
  skillGaps: SkillGapItem[];
  careerPath: CareerMilestone[];
  recommendations: LearningRecommendation[];
  keyStrengths: string[];
  growthAreas: string[];
  riskIndicators: {
    level: 'Low' | 'Medium' | 'High';
    summary: string;
    details: string;
  };
  analyzedAt: string;
}

export interface HiringFunnelStage {
  stage: string;
  count: number;
  conversionRate: number; // percentage
  dropOffRate: number;
}

export interface MonthlyTrend {
  month: string;
  hires: number;
  offers: number;
  target: number;
}

export interface SkillDistributionItem {
  skill: string;
  headcount: number;
  percentage: number;
  color: string;
}

export interface AnalyticsKPI {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
  period: string;
}

export interface AIAnalyticsInsight {
  id: string;
  category: 'Velocity' | 'Retention' | 'Skill Gap' | 'Efficiency';
  title: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  metric: string;
  actionRecommendation: string;
}

export interface AnalyticsData {
  kpis: AnalyticsKPI[];
  funnel: HiringFunnelStage[];
  monthlyTrends: MonthlyTrend[];
  skillDistribution: SkillDistributionItem[];
  departmentStats: {
    department: string;
    activeOnboarding: number;
    completionRate: number;
    avgDaysToProductive: number;
  }[];
  aiInsights: AIAnalyticsInsight[];
  lastUpdated: string;
}

export type ApprovalType =
  | 'Document Approval'
  | 'Role Assignment'
  | 'Final Onboarding Approval'
  | 'Budget Approval';

export type ApprovalPriority = 'High' | 'Medium' | 'Low';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ApprovalRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  candidateAvatar?: string;
  department: string;
  requestType: ApprovalType;
  priority: ApprovalPriority;
  submittedAt: string;
  status: ApprovalStatus;
  details: string;
  documents?: { name: string; url?: string }[];
  comments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
  category: 'Setup' | 'HR & Compliance' | 'Team & Culture' | 'Technical Skills' | 'Administrative';
  description: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
  priority: 'High' | 'Medium' | 'Low';
  actionUrl?: string;
  actionText?: string;
  assignedBy: string;
  estimatedMinutes?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestions?: string[];
  category?: string;
}
