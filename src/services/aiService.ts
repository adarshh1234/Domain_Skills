import { ChatMessage, DocumentVerificationStatus } from '../types/onboarding';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AIDocumentVerificationResult {
  status: DocumentVerificationStatus;
  confidence: number;
  extractedData: Record<string, string>;
  fraudRiskScore: number; // 0-100 (lower is better)
  tamperSignalsDetected: boolean;
  notes: string;
  recommendedAction: 'Auto-Approve' | 'Flag for HR Officer' | 'Re-upload Required';
}

export interface AIInsightsSummary {
  predictedSuccessScore: number;
  roleFitPercentage: number;
  aiConfidence: number;
  onboardingRiskLevel: 'Low' | 'Medium' | 'High';
  riskSummary: string;
  topStrengths: string[];
  growthRecommendations: string[];
  daysToProductivityEstimate: number;
  retentionPredictionTenure: number;
}

export const aiService = {
  /**
   * AI Onboarding Chatbot Conversation
   * Uses simulated knowledge base queries for enterprise policies, benefits, tools, and technical ramp-up.
   */
  async chat(userPrompt: string, _history?: ChatMessage[]): Promise<ChatMessage> {
    await delay(700 + Math.random() * 500);

    const lower = userPrompt.toLowerCase().trim();
    let text = '';
    let suggestions: string[] = [];
    let category = 'General';

    if (lower.includes('benefit') || lower.includes('health') || lower.includes('insurance') || lower.includes('401k')) {
      category = 'Benefits & Perks';
      text =
        "Here is a summary of your Comprehensive Benefits Package:\n\n" +
        "• **Health & Dental**: 100% employer-covered premium with Blue Cross Blue Shield PPO / Kaiser Permanente + Delta Dental.\n" +
        "• **401(k) Retirement**: 50% company match up to 6% of base salary with immediate day-1 vesting.\n" +
        "• **Wellness & WFH Stipend**: $150/month fitness & mental health credit + $1,200 initial home-office setup grant.\n" +
        "• **Learning Budget**: $3,500 annual continuous education & conference allowance.\n\n" +
        "Would you like me to guide you through enrolling in benefits on your Day-1 portal?";
      suggestions = ['How do I submit WFH receipts?', 'Who is my HR Benefits contact?', 'Show Day-1 Checklist'];
    } else if (lower.includes('tool') || lower.includes('laptop') || lower.includes('macbook') || lower.includes('setup') || lower.includes('git') || lower.includes('slack')) {
      category = 'Developer Environment';
      text =
        "Your Engineering Workstation & Tools Setup:\n\n" +
        "• **Hardware**: 16-inch MacBook Pro (M3 Max, 64GB RAM, 1TB SSD) or Dell Precision Linux Workstation.\n" +
        "• **Developer Access**: GitHub Enterprise Cloud, AWS/GCP AI sandboxes, and internal PyTorch cluster access will be provisioned via Okta SSO on Day 1.\n" +
        "• **Communication**: Join Slack workspace (`#engineering-ai-platform`, `#new-hires-2026`, `#dev-help`).\n" +
        "• **Skill Assessments**: You can take your baseline engineering evaluations right now under the **Domain Skills** tab.";
      suggestions = ['Show Skill Radar', 'Take Coding Assessment', 'View IT Setup Checklist'];
    } else if (lower.includes('manager') || lower.includes('david') || lower.includes('team') || lower.includes('1:1') || lower.includes('report')) {
      category = 'Team & Leadership';
      text =
        "Your Direct Reporting Line & Manager Overview:\n\n" +
        "• **Manager**: David Zhang (Director of AI Systems & Infrastructure)\n" +
        "• **Email**: `david.zhang@enterprise-ai.internal`\n" +
        "• **Team**: Core AI Platform & Distributed Inference (14 engineers)\n" +
        "• **First 1:1 Meeting**: Scheduled for Day 1 at 2:00 PM PST via Google Meet.\n\n" +
        "David has already reviewed your resume & technical profile and submitted preliminary role calibrations.";
      suggestions = ['View Manager Approvals', 'Check Day-1 Checklist', 'What are team OKRs?'];
    } else if (lower.includes('policy') || lower.includes('leave') || lower.includes('pto') || lower.includes('holiday') || lower.includes('wfh')) {
      category = 'Company Policies';
      text =
        "Company Workplace & Leave Policies:\n\n" +
        "• **Flexible PTO**: Unlimited paid time off with a recommended minimum of 20 days/year.\n" +
        "• **Hybrid Work Policy**: 2 core collaborative office days (Tue/Thu) with flexible remote work on other days.\n" +
        "• **Parental Leave**: 16 weeks of fully paid parental leave for primary and secondary caregivers.\n" +
        "• **Code of Conduct & AI Ethics**: Enterprise AI safety guidelines apply to all production models and internal research.";
      suggestions = ['View Benefits Overview', 'Check Legal Documents', 'Day-1 Checklist'];
    } else if (lower.includes('task') || lower.includes('checklist') || lower.includes('what next') || lower.includes('todo') || lower.includes('joining')) {
      category = 'Onboarding Tasks';
      text =
        "Here are your immediate next onboarding priorities:\n\n" +
        "1. Complete your **Personal Information** & Emergency Contact details.\n" +
        "2. Upload any remaining documents for **AI Document Verification**.\n" +
        "3. Review your **ML Skill Analysis** & personalized recommended courses.\n" +
        "4. Prepare for your **Day-1 Checklist** kickoff on October 15, 2026.";
      suggestions = ['Open Day-1 Checklist', 'Go to Personal Info', 'View ML Analysis'];
    } else if (lower.includes('assessment') || lower.includes('coding') || lower.includes('system design') || lower.includes('skill')) {
      category = 'Skills Intelligence';
      text =
        "Our unified platform provides full technical assessment capabilities!\n\n" +
        "You can evaluate competencies across:\n" +
        "• **Live Coding Lab** (Algorithms & Data Structures)\n" +
        "• **Architecture Design** (Microservices & Event-Driven Systems)\n" +
        "• **System Design** (Distributed AI & High-Load Architecture)\n" +
        "• **Debugging Lab** (Production Incident Diagnostics)\n" +
        "• **Database & API** (Query optimization & REST/gRPC)\n" +
        "• **Security Audit** (Vulnerability mitigation & Zero-Trust)\n\n" +
        "Your results automatically synchronize with your **ML Skill Analysis** profile.";
      suggestions = ['Launch Live Coding', 'View ML Radar Chart', 'Take Security Audit'];
    } else {
      category = 'AI Assistant';
      text =
        `Hello Sarah! I am your AI Onboarding & Skills Intelligence Assistant.\n\n` +
        `I can assist you with:\n` +
        `• **Day-1 & Pre-boarding Setup**: Hardware, credentials, checklists\n` +
        `• **Company Policies & Benefits**: Health plans, 401(k), PTO guidelines\n` +
        `• **Manager & Team Connections**: David Zhang & AI Platform team\n` +
        `• **Skills Intelligence & Learning**: Skill gaps, ML radar, course recommendations\n` +
        `• **Domain Skills Assessments**: Interactive coding, architecture, and system design challenges\n\n` +
        `How can I help you today?`;
      suggestions = ['What are my Day-1 tasks?', 'Show my Health Benefits', 'Inspect ML Skill Analysis', 'Take a Skill Assessment'];
    }

    return {
      id: `msg-${Date.now().toString(36)}`,
      sender: 'assistant',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions,
      category
    };
  },

  /**
   * AI Document Verification Pipeline Simulation
   * Simulates OCR extraction, cryptographic check digit validation, and anomaly detection.
   */
  async verifyDocument(
    documentName: string,
    category: string
  ): Promise<AIDocumentVerificationResult> {
    await delay(1200 + Math.random() * 600);

    const isTaxOrSpecial = category === 'Legal & Tax';
    const confidence = isTaxOrSpecial ? 84 + Math.floor(Math.random() * 12) : 93 + Math.floor(Math.random() * 7);

    return {
      status: confidence >= 90 ? 'AI Verified' : 'Needs Manual Review',
      confidence,
      fraudRiskScore: Math.max(2, 100 - confidence),
      tamperSignalsDetected: false,
      notes:
        confidence >= 90
          ? `Document structure, security seals, and optical text fidelity confirmed with ${confidence}% AI confidence.`
          : `Document parsed with ${confidence}% confidence. Signature / issuer stamp flagged for secondary human HR review.`,
      extractedData: {
        'Document Type': documentName,
        'Validated Category': category,
        'OCR Engine': 'Enterprise Optical Neural Net v4.2',
        'Verification Hash': `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`
      },
      recommendedAction: confidence >= 90 ? 'Auto-Approve' : 'Flag for HR Officer'
    };
  },

  /**
   * Get High-Level AI Insights
   */
  async getAIInsights(): Promise<AIInsightsSummary> {
    await delay(300);
    return {
      predictedSuccessScore: 87,
      roleFitPercentage: 92,
      aiConfidence: 94,
      onboardingRiskLevel: 'Low',
      riskSummary: 'High probability of rapid ramp-up based on strong distributed computing foundations and aligned tech stack.',
      topStrengths: [
        'Distributed ML Training (PyTorch / Ray)',
        'Cloud Infrastructure & Kubernetes',
        'High-Throughput gRPC / REST Microservices',
        'System Architecture & Resilience'
      ],
      growthRecommendations: [
        'Advanced Apache Spark for Petabyte Analytics',
        'Production Vector Search & RAG Optimization',
        'Company-specific Data Governance Protocols'
      ],
      daysToProductivityEstimate: 14,
      retentionPredictionTenure: 4.2
    };
  }
};
