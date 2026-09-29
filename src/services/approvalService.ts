import { ApprovalRequest, ApprovalStatus } from '../types/onboarding';

const APPROVALS_KEY = 'onboarding_approvals';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_APPROVALS: ApprovalRequest[] = [
  {
    id: 'appr-01',
    candidateId: 'cand-98421',
    candidateName: 'Sarah Chen',
    candidateRole: 'Senior ML Systems Engineer (L5)',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Core AI Platform & Infrastructure',
    requestType: 'Role Assignment',
    priority: 'High',
    submittedAt: '2026-09-28 10:15 UTC',
    status: 'Pending',
    details:
      'Confirm L5 Senior Staff calibration for Sarah Chen based on ML Skill Analysis benchmark (87% performance index) and high-throughput PyTorch pipeline background.',
    documents: [
      { name: 'ML_Skill_Analysis_Report.pdf' },
      { name: 'Compensation_Band_L5.pdf' }
    ],
    comments: ''
  },
  {
    id: 'appr-02',
    candidateId: 'cand-98421',
    candidateName: 'Sarah Chen',
    candidateRole: 'Senior ML Systems Engineer (L5)',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Core AI Platform & Infrastructure',
    requestType: 'Budget Approval',
    priority: 'Medium',
    submittedAt: '2026-09-28 11:30 UTC',
    status: 'Pending',
    details:
      'Approval for dedicated Cloud GPU cluster training quota ($4,500/month) and workstation hardware allocation (M3 Max 64GB).',
    documents: [
      { name: 'Hardware_Requisition_Order.pdf' }
    ]
  },
  {
    id: 'appr-03',
    candidateId: 'cand-98421',
    candidateName: 'Sarah Chen',
    candidateRole: 'Senior ML Systems Engineer (L5)',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Core AI Platform & Infrastructure',
    requestType: 'Document Approval',
    priority: 'High',
    submittedAt: '2026-09-26 14:00 UTC',
    status: 'Approved',
    details:
      'AI-validated Identity and Stanford University MS Degree verified with 98% and 96% confidence respectively. Background check cleared.',
    reviewedBy: 'Elena Rostova (Compliance Director)',
    reviewedAt: '2026-09-27 09:30 UTC',
    comments: 'All academic credentials and prior employment tenure verified without exception.'
  },
  {
    id: 'appr-04',
    candidateId: 'cand-98421',
    candidateName: 'Sarah Chen',
    candidateRole: 'Senior ML Systems Engineer (L5)',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Core AI Platform & Infrastructure',
    requestType: 'Final Onboarding Approval',
    priority: 'High',
    submittedAt: '2026-09-28 14:00 UTC',
    status: 'Pending',
    details:
      'Final engineering VP sign-off to activate active employee payroll profile, corporate badge access, and GitHub organization committer rights on Day 1.',
    documents: [
      { name: 'Pre_Onboarding_Summary_Dossier.pdf' }
    ]
  },
  {
    id: 'appr-05',
    candidateId: 'cand-77192',
    candidateName: 'Alex Rivera',
    candidateRole: 'Distributed Cloud Architect',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Cloud Security & Infrastructure',
    requestType: 'Role Assignment',
    priority: 'Medium',
    submittedAt: '2026-09-27 16:20 UTC',
    status: 'Approved',
    details: 'Role level L6 confirmed for distributed cloud infrastructure and cross-region Kubernetes governance.',
    reviewedBy: 'David Zhang',
    reviewedAt: '2026-09-28 08:45 UTC',
    comments: 'Approved based on stellar System Design assessment score.'
  }
];

export const approvalService = {
  /**
   * Get all approval requests
   */
  async getApprovals(): Promise<ApprovalRequest[]> {
    await delay(350);
    try {
      const stored = localStorage.getItem(APPROVALS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse approvals from storage', e);
    }
    this.saveApprovals(DEFAULT_APPROVALS);
    return DEFAULT_APPROVALS;
  },

  /**
   * Save approvals array to localStorage
   */
  saveApprovals(approvals: ApprovalRequest[]): void {
    try {
      localStorage.setItem(APPROVALS_KEY, JSON.stringify(approvals));
    } catch (e) {
      console.error('Failed to save approvals', e);
    }
  },

  /**
   * Get only pending approvals
   */
  async getPendingApprovals(): Promise<ApprovalRequest[]> {
    const list = await this.getApprovals();
    return list.filter((a) => a.status === 'Pending');
  },

  /**
   * Submit decision for an approval request
   */
  async submitDecision(
    id: string,
    decision: 'Approved' | 'Rejected',
    comments: string,
    reviewerName: string = 'David Zhang (Director)'
  ): Promise<ApprovalRequest | null> {
    await delay(600);
    const list = await this.getApprovals();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      status: decision as ApprovalStatus,
      comments: comments || (decision === 'Approved' ? 'Approved by engineering leadership.' : 'Returned with feedback.'),
      reviewedBy: reviewerName,
      reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
    };

    this.saveApprovals(list);
    return list[index];
  }
};
