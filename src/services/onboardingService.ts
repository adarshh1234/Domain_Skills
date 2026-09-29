import {
  CandidateProfile,
  OnboardingProgress,
  OnboardingDocument,
  ChecklistTask,
  OnboardingStage
} from '../types/onboarding';

const CANDIDATE_KEY = 'onboarding_candidate';
const PROGRESS_KEY = 'onboarding_progress';
const DOCUMENTS_KEY = 'onboarding_documents';
const CHECKLIST_KEY = 'onboarding_checklist';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_CANDIDATE: CandidateProfile = {
  id: 'cand-98421',
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@enterprise-ai.internal',
  personalEmail: 'sarah.chen.ml@gmail.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA (Hybrid)',
  department: 'Core AI Platform & Infrastructure',
  role: 'Senior ML Systems Engineer',
  level: 'L5 / Senior Staff',
  joiningDate: '2026-10-15',
  managerName: 'David Zhang (Director of AI Systems)',
  managerEmail: 'david.zhang@enterprise-ai.internal',
  emergencyContact: {
    name: 'Michael Chen',
    relationship: 'Spouse',
    phone: '+1 (555) 876-5432'
  },
  linkedinUrl: 'https://linkedin.com/in/sarah-chen-ml',
  githubUrl: 'https://github.com/sarahchen-ai',
  bio: 'Staff/Senior ML Systems Engineer with 6+ years of experience optimizing distributed training pipelines, PyTorch/Kubeflow clusters, and high-throughput model inference microservices.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'Pre-boarding'
};

const DEFAULT_DOCUMENTS: OnboardingDocument[] = [
  {
    id: 'doc-01',
    name: 'Government ID / Passport',
    category: 'Identity',
    fileName: 'sarah_chen_passport_scan.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-09-24',
    status: 'AI Verified',
    aiConfidence: 98,
    verificationTimestamp: '2026-09-24 14:32 UTC',
    remarks: 'Passport MRZ checksum and biometric photo validated with high confidence.',
    isMandatory: true,
    extractedFields: {
      'Document Number': 'USA-P9832104',
      'Full Name': 'Sarah Chen',
      'Expiry Date': '2032-04-18',
      'Issuer': 'US Department of State'
    }
  },
  {
    id: 'doc-02',
    name: 'Highest Educational Degree Certificate',
    category: 'Education',
    fileName: 'stanford_ms_cs_diploma.pdf',
    fileSize: '3.1 MB',
    uploadDate: '2026-09-24',
    status: 'AI Verified',
    aiConfidence: 96,
    verificationTimestamp: '2026-09-24 14:35 UTC',
    remarks: 'Stanford University MS in Computer Science verified via institutional registry ledger.',
    isMandatory: true,
    extractedFields: {
      'Degree': 'Master of Science in Computer Science (AI Track)',
      'Institution': 'Stanford University',
      'Graduation Year': '2020',
      'GPA / Honors': 'Distinction in Machine Learning'
    }
  },
  {
    id: 'doc-03',
    name: 'Previous Experience & Relieving Letter',
    category: 'Experience',
    fileName: 'experience_letter_vertex_ai.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2026-09-25',
    status: 'AI Verified',
    aiConfidence: 94,
    verificationTimestamp: '2026-09-25 09:12 UTC',
    remarks: 'Employment dates, designation and company seal authentic. Zero discrepancies found.',
    isMandatory: true,
    extractedFields: {
      'Previous Employer': 'Vertex AI Systems Inc.',
      'Designation': 'ML Infrastructure Engineer',
      'Tenure': 'Jan 2022 - Aug 2026',
      'Clearance': 'Full Resignation & Relieving Confirmed'
    }
  },
  {
    id: 'doc-04',
    name: 'W-4 Tax Withholding & Direct Deposit Form',
    category: 'Legal & Tax',
    fileName: 'w4_signed_direct_deposit.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-09-26',
    status: 'Needs Manual Review',
    aiConfidence: 82,
    verificationTimestamp: '2026-09-26 11:05 UTC',
    remarks: 'Routing transit check digit valid; payroll coordinator signature pending.',
    isMandatory: true,
    extractedFields: {
      'Form Type': 'Federal W-4 (2026)',
      'Filing Status': 'Married Filing Jointly',
      'Direct Deposit Bank': 'Silicon Valley Federal Credit Union'
    }
  },
  {
    id: 'doc-05',
    name: 'AWS Certified Machine Learning Specialty',
    category: 'Certifications',
    fileName: 'aws_ml_specialty_cert.pdf',
    fileSize: '890 KB',
    uploadDate: '2026-09-27',
    status: 'AI Verified',
    aiConfidence: 99,
    verificationTimestamp: '2026-09-27 16:40 UTC',
    remarks: 'Digital badge cryptographic signature verified directly on Credly.',
    isMandatory: false,
    extractedFields: {
      'Certification': 'AWS Certified Machine Learning - Specialty',
      'Badge ID': 'AWS-MLS-8941032',
      'Valid Until': '2029-09-20'
    }
  }
];

const DEFAULT_CHECKLIST: ChecklistTask[] = [
  {
    id: 'chk-01',
    title: 'Activate Corporate SSO & Email Security Keys',
    category: 'Setup',
    description: 'Set up Okta 2FA and configure hardware YubiKey for secure corporate single sign-on.',
    dueDate: '2026-10-15',
    isCompleted: true,
    completedAt: '2026-09-26 10:00 UTC',
    priority: 'High',
    actionText: 'SSO Portal',
    assignedBy: 'IT Security Operations',
    estimatedMinutes: 15
  },
  {
    id: 'chk-02',
    title: 'Review & Sign Digital Offer & IP Agreement',
    category: 'HR & Compliance',
    description: 'Sign proprietary information, invention assignment, and confidential disclosure policies.',
    dueDate: '2026-10-15',
    isCompleted: true,
    completedAt: '2026-09-25 15:30 UTC',
    priority: 'High',
    actionText: 'DocuSign Hub',
    assignedBy: 'People Operations',
    estimatedMinutes: 20
  },
  {
    id: 'chk-03',
    title: 'Complete Personal Information & Emergency Contacts',
    category: 'Administrative',
    description: 'Fill in address, tax identifiers, work authorization, and next-of-kin emergency contact details.',
    dueDate: '2026-10-14',
    isCompleted: true,
    completedAt: '2026-09-27 11:20 UTC',
    priority: 'High',
    actionUrl: '/onboarding/personal',
    actionText: 'Edit Details',
    assignedBy: 'HR Onboarding Team',
    estimatedMinutes: 10
  },
  {
    id: 'chk-04',
    title: 'Upload Mandatory Onboarding Documents',
    category: 'HR & Compliance',
    description: 'Provide Government ID, Highest Degree, Experience Letter, and Tax Forms for AI validation.',
    dueDate: '2026-10-14',
    isCompleted: true,
    completedAt: '2026-09-27 16:45 UTC',
    priority: 'High',
    actionUrl: '/onboarding/documents',
    actionText: 'View Documents',
    assignedBy: 'Compliance & Verification AI',
    estimatedMinutes: 15
  },
  {
    id: 'chk-05',
    title: 'Review ML Skills Intelligence Benchmark',
    category: 'Technical Skills',
    description: 'Inspect AI-generated skill radar, detected competency gaps, and recommended onboarding tracks.',
    dueDate: '2026-10-15',
    isCompleted: false,
    priority: 'Medium',
    actionUrl: '/onboarding/ml-analysis',
    actionText: 'Review Skills',
    assignedBy: 'AI Skills Engine',
    estimatedMinutes: 25
  },
  {
    id: 'chk-06',
    title: 'Collect & Provision High-Spec ML Dev Station',
    category: 'Setup',
    description: 'Configure Apple Silicon M3 Max / Linux workstation, GPU container drivers, and local SSH keys.',
    dueDate: '2026-10-15',
    isCompleted: false,
    priority: 'High',
    actionText: 'IT Hardware Desk',
    assignedBy: 'Engineering IT',
    estimatedMinutes: 45
  },
  {
    id: 'chk-07',
    title: '1:1 Welcome & Roadmap Sync with Manager (David Zhang)',
    category: 'Team & Culture',
    description: 'First day 45-minute orientation on team OKRs, sprint cadences, and 30-60-90 day milestones.',
    dueDate: '2026-10-15',
    isCompleted: false,
    priority: 'High',
    actionText: 'Calendar Invite',
    assignedBy: 'David Zhang',
    estimatedMinutes: 45
  },
  {
    id: 'chk-08',
    title: 'Complete First Domain Technical Assessment / Baseline',
    category: 'Technical Skills',
    description: 'Launch an interactive Live Coding or System Design evaluation track to calibrate peer alignment.',
    dueDate: '2026-10-18',
    isCompleted: false,
    priority: 'Medium',
    actionUrl: '/coding',
    actionText: 'Start Assessment',
    assignedBy: 'Skills Assessment Team',
    estimatedMinutes: 30
  }
];

export const onboardingService = {
  /**
   * Get Candidate Profile
   */
  async getCandidate(): Promise<CandidateProfile> {
    await delay(350);
    try {
      const stored = localStorage.getItem(CANDIDATE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load candidate from storage', e);
    }
    this.saveCandidate(DEFAULT_CANDIDATE);
    return DEFAULT_CANDIDATE;
  },

  /**
   * Save Candidate Profile
   */
  saveCandidate(profile: CandidateProfile): void {
    try {
      localStorage.setItem(CANDIDATE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save candidate to storage', e);
    }
  },

  /**
   * Update Candidate Profile
   */
  async updatePersonalInfo(updates: Partial<CandidateProfile>): Promise<CandidateProfile> {
    await delay(500);
    const current = await this.getCandidate();
    const updated: CandidateProfile = { ...current, ...updates };
    this.saveCandidate(updated);
    return updated;
  },

  /**
   * Get Onboarding Progress metrics
   */
  async getProgress(): Promise<OnboardingProgress> {
    await delay(250);
    const docs = await this.getDocuments();
    const checklist = await this.getChecklist();

    const docsVerified = docs.filter((d) => d.status === 'AI Verified').length;
    const tasksDone = checklist.filter((t) => t.isCompleted).length;

    // Calculate dynamic percentage
    const docProgress = docs.length > 0 ? (docsVerified / docs.length) * 35 : 0;
    const taskProgress = checklist.length > 0 ? (tasksDone / checklist.length) * 45 : 0;
    const personalProgress = 20; // 20% for completed profile

    const overall = Math.min(100, Math.round(docProgress + taskProgress + personalProgress));

    const completedStages: OnboardingStage[] = ['welcome', 'personal'];
    if (docsVerified >= 3) completedStages.push('documents');
    if (tasksDone >= 3) completedStages.push('approvals');
    if (overall >= 75) completedStages.push('ml-analysis');
    if (overall >= 90) completedStages.push('checklist');
    if (overall === 100) completedStages.push('completed');

    const progress: OnboardingProgress = {
      overallPercentage: overall,
      currentStage: overall >= 80 ? 'checklist' : overall >= 60 ? 'ml-analysis' : 'documents',
      completedStages,
      pendingStages: ['welcome', 'personal', 'documents', 'approvals', 'ml-analysis', 'checklist', 'completed'].filter(
        (s) => !completedStages.includes(s as OnboardingStage)
      ) as OnboardingStage[],
      daysToJoining: 16,
      tasksCompleted: tasksDone,
      tasksTotal: checklist.length,
      documentsVerified: docsVerified,
      documentsTotal: docs.length,
      approvalsCompleted: 3,
      approvalsTotal: 4,
      lastUpdated: new Date().toISOString()
    };

    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }

    return progress;
  },

  /**
   * Get all uploaded documents
   */
  async getDocuments(): Promise<OnboardingDocument[]> {
    await delay(300);
    try {
      const stored = localStorage.getItem(DOCUMENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load documents from storage', e);
    }
    this.saveDocuments(DEFAULT_DOCUMENTS);
    return DEFAULT_DOCUMENTS;
  },

  /**
   * Save documents array
   */
  saveDocuments(docs: OnboardingDocument[]): void {
    try {
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save documents to storage', e);
    }
  },

  /**
   * Upload & simulate document addition
   */
  async uploadDocument(
    name: string,
    category: OnboardingDocument['category'],
    fileName: string,
    fileSize: string
  ): Promise<OnboardingDocument> {
    await delay(800);
    const docs = await this.getDocuments();

    const newDoc: OnboardingDocument = {
      id: `doc-${Date.now().toString(36)}`,
      name,
      category,
      fileName,
      fileSize,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Processing',
      aiConfidence: 0,
      isMandatory: false,
      remarks: 'Undergoing AI optical character recognition and cryptographic verification...'
    };

    const updated = [newDoc, ...docs];
    this.saveDocuments(updated);
    return newDoc;
  },

  /**
   * Re-verify or manual review request for document
   */
  async updateDocumentStatus(
    docId: string,
    status: OnboardingDocument['status'],
    confidence: number,
    remarks?: string
  ): Promise<OnboardingDocument | null> {
    await delay(600);
    const docs = await this.getDocuments();
    const index = docs.findIndex((d) => d.id === docId);
    if (index === -1) return null;

    docs[index] = {
      ...docs[index],
      status,
      aiConfidence: confidence,
      verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      remarks: remarks || docs[index].remarks
    };

    this.saveDocuments(docs);
    return docs[index];
  },

  /**
   * Get Day-1 Checklist tasks
   */
  async getChecklist(): Promise<ChecklistTask[]> {
    await delay(300);
    try {
      const stored = localStorage.getItem(CHECKLIST_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load checklist from storage', e);
    }
    this.saveChecklist(DEFAULT_CHECKLIST);
    return DEFAULT_CHECKLIST;
  },

  /**
   * Save checklist array
   */
  saveChecklist(tasks: ChecklistTask[]): void {
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save checklist', e);
    }
  },

  /**
   * Toggle checklist task completion status
   */
  async toggleTaskCompletion(taskId: string): Promise<ChecklistTask | null> {
    await delay(200);
    const tasks = await this.getChecklist();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return null;

    const current = tasks[index];
    const isCompleted = !current.isCompleted;

    tasks[index] = {
      ...current,
      isCompleted,
      completedAt: isCompleted ? new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : undefined
    };

    this.saveChecklist(tasks);
    return tasks[index];
  },

  /**
   * Add a custom checklist task
   */
  async addTask(
    title: string,
    category: ChecklistTask['category'],
    description: string,
    priority: ChecklistTask['priority'],
    dueDate: string
  ): Promise<ChecklistTask> {
    await delay(300);
    const tasks = await this.getChecklist();
    const newTask: ChecklistTask = {
      id: `chk-${Date.now().toString(36)}`,
      title,
      category,
      description,
      priority,
      dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      isCompleted: false,
      assignedBy: 'Candidate Added',
      estimatedMinutes: 15
    };

    const updated = [newTask, ...tasks];
    this.saveChecklist(updated);
    return newTask;
  }
};
