import { SkillAnalysis, SkillRadarItem, SkillGapItem, CareerMilestone, LearningRecommendation } from '../types/onboarding';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_RADAR_DATA: SkillRadarItem[] = [
  { skill: 'Python / C++', currentLevel: 92, requiredLevel: 85, benchmark: 80 },
  { skill: 'Machine Learning', currentLevel: 90, requiredLevel: 88, benchmark: 75 },
  { skill: 'Big Data (Spark/Flink)', currentLevel: 68, requiredLevel: 85, benchmark: 70 },
  { skill: 'AI Systems & LLMs', currentLevel: 88, requiredLevel: 85, benchmark: 72 },
  { skill: 'Cloud & Kubernetes', currentLevel: 75, requiredLevel: 85, benchmark: 78 },
  { skill: 'SQL & Data Pipelines', currentLevel: 82, requiredLevel: 80, benchmark: 74 }
];

const DEFAULT_SKILL_GAPS: SkillGapItem[] = [
  {
    skill: 'Big Data Processing (Apache Spark & Ray)',
    category: 'Data Infrastructure',
    currentLevel: 68,
    requiredLevel: 85,
    gap: 17,
    priority: 'High',
    actionablePlan: 'Complete petabyte data streaming module; run Ray on Kubernetes hands-on workshop.',
    relatedAssessmentTrack: '/database'
  },
  {
    skill: 'Kubernetes Cluster Auto-scaling & GPU Orchestration',
    category: 'Cloud Engineering',
    currentLevel: 75,
    requiredLevel: 85,
    gap: 10,
    priority: 'Medium',
    actionablePlan: 'Review enterprise EKS cluster node topologies and Karpenter GPU provisioners.',
    relatedAssessmentTrack: '/system-design'
  },
  {
    skill: 'Security Hardening & Model Enclave Audits',
    category: 'Security & Compliance',
    currentLevel: 72,
    requiredLevel: 80,
    gap: 8,
    priority: 'Medium',
    actionablePlan: 'Execute the internal Zero-Trust AI Security Assessment on Domain Skills platform.',
    relatedAssessmentTrack: '/security'
  },
  {
    skill: 'High-Throughput gRPC & Distributed Tracing',
    category: 'Architecture',
    currentLevel: 80,
    requiredLevel: 85,
    gap: 5,
    priority: 'Low',
    actionablePlan: 'Calibrate with Architecture Design Assessment track for peer alignment.',
    relatedAssessmentTrack: '/architecture'
  }
];

const DEFAULT_CAREER_PATH: CareerMilestone[] = [
  {
    title: 'Senior ML Systems Engineer',
    level: 'L5 (Current Track)',
    timeframe: 'Year 0 - 2',
    description: 'Lead high-throughput inference serving pipelines, fine-tuning infrastructure, and latency reduction for foundation model workloads.',
    keySkills: ['Distributed ML', 'PyTorch / Triton', 'vLLM', 'Kubernetes'],
    isCurrent: true
  },
  {
    title: 'Staff ML Architect',
    level: 'L6',
    timeframe: 'Year 2 - 4',
    description: 'Design global AI infrastructure topology, cross-cloud training fabric, multi-modal pipeline architecture, and enterprise ML governance.',
    keySkills: ['Multi-datacenter AI Fabric', 'GPU Cluster Optimization', 'Enterprise Governance', 'Technical Strategy']
  },
  {
    title: 'Principal AI Scientist / Fellow',
    level: 'L7 / Executive IC',
    timeframe: 'Year 4 - 6+',
    description: 'Set company-wide frontier AI research roadmaps, patent breakthrough generative algorithms, and represent the enterprise in industry consortia.',
    keySkills: ['Frontier AI Research', 'Cross-Disciplinary Strategy', 'Next-Gen Neural Architectures', 'Industry Leadership']
  }
];

const DEFAULT_RECOMMENDATIONS: LearningRecommendation[] = [
  {
    id: 'lr-01',
    title: 'Petabyte-Scale Machine Learning with Apache Spark & Ray',
    provider: 'Enterprise Learning Academy',
    duration: '6 hours · Self-paced',
    matchScore: 98,
    difficulty: 'Advanced',
    skillsCovered: ['Apache Spark 3.5', 'Ray Train', 'Delta Lake', 'GPU Acceleration'],
    isEnrolled: false
  },
  {
    id: 'lr-02',
    title: 'Kubernetes for AI Workloads: GPU Slicing & Auto-scaling',
    provider: 'Cloud Native Computing Foundation',
    duration: '4.5 hours · Interactive Labs',
    matchScore: 94,
    difficulty: 'Intermediate',
    skillsCovered: ['Karpenter', 'NVIDIA Multi-Instance GPU (MIG)', 'KServe', 'Prometheus'],
    isEnrolled: true
  },
  {
    id: 'lr-03',
    title: 'High-Performance Foundation Model Inference with Triton & vLLM',
    provider: 'Deep Learning Engineering Lab',
    duration: '8 hours · Video & Code Labs',
    matchScore: 92,
    difficulty: 'Advanced',
    skillsCovered: ['TensorRT-LLM', 'PagedAttention', 'Continuous Batching', 'gRPC Caching'],
    isEnrolled: false
  },
  {
    id: 'lr-04',
    title: 'Enterprise AI Security & Zero-Trust Threat Modeling',
    provider: 'Cybersecurity Defense Hub',
    duration: '3 hours · Micro-course',
    matchScore: 89,
    difficulty: 'Intermediate',
    skillsCovered: ['Model Inversion Defense', 'Prompt Injection Shields', 'Confidential Computing'],
    isEnrolled: false
  }
];

export const mlService = {
  /**
   * Get ML Skill Analysis & Gap Intelligence
   */
  async getSkillAnalysis(candidateId: string = 'cand-98421'): Promise<SkillAnalysis> {
    await delay(500);

    return {
      candidateId,
      performanceScore: 87,
      predictedTenureYears: 4.2,
      roleFitPercentage: 92,
      aiConfidencePercentage: 94,
      radarData: DEFAULT_RADAR_DATA,
      skillGaps: DEFAULT_SKILL_GAPS,
      careerPath: DEFAULT_CAREER_PATH,
      recommendations: DEFAULT_RECOMMENDATIONS,
      keyStrengths: [
        'Deep algorithmic competence in Python and C++ performance bindings (92%)',
        'Exceptional production AI / LLM pipeline design skills (88%)',
        'Proven architectural rigor in distributed systems and microservice topologies'
      ],
      growthAreas: [
        'Petabyte big data streaming & Apache Spark ecosystem (Gap: 17%)',
        'GPU dynamic auto-scaling on multi-tenant Kubernetes clusters (Gap: 10%)',
        'Enterprise Model Security & Zero-Trust compliance verification (Gap: 8%)'
      ],
      riskIndicators: {
        level: 'Low',
        summary: 'Minimal ramp-up friction expected.',
        details: 'Candidate demonstrates strong foundational mastery in 85%+ of core L5 competency dimensions.'
      },
      analyzedAt: new Date().toISOString()
    };
  },

  /**
   * Enroll in a recommended learning course
   */
  async enrollInCourse(courseId: string): Promise<boolean> {
    await delay(300);
    const item = DEFAULT_RECOMMENDATIONS.find((r) => r.id === courseId);
    if (item) {
      item.isEnrolled = true;
      return true;
    }
    return false;
  }
};
