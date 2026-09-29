import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  FileCheck,
  CheckCircle2,
  BarChart2,
  PieChart,
  CheckSquare,
  Clock,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  Code2,
  Calendar,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingStepper } from '../../components/onboarding/OnboardingStepper';
import { AIInsightCard } from '../../components/onboarding/AIInsightCard';
import { onboardingService } from '../../services/onboardingService';
import { approvalService } from '../../services/approvalService';
import { aiService, AIInsightsSummary } from '../../services/aiService';
import {
  CandidateProfile,
  OnboardingProgress,
  OnboardingDocument,
  ChecklistTask,
  ApprovalRequest
} from '../../types/onboarding';

export const OnboardingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [documents, setDocuments] = useState<OnboardingDocument[]>([]);
  const [checklist, setChecklist] = useState<ChecklistTask[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsightsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [candData, progData, docData, checkData, apprData, aiData] = await Promise.all([
        onboardingService.getCandidate(),
        onboardingService.getProgress(),
        onboardingService.getDocuments(),
        onboardingService.getChecklist(),
        approvalService.getApprovals(),
        aiService.getAIInsights()
      ]);

      setCandidate(candData);
      setProgress(progData);
      setDocuments(docData);
      setChecklist(checkData);
      setApprovals(apprData);
      setAIInsights(aiData);
    } catch (err) {
      console.error('Error loading onboarding dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const verifiedDocsCount = documents.filter((d) => d.status === 'AI Verified').length;
  const pendingTasks = checklist.filter((t) => !t.isCompleted);

  return (
    <div className="main-content">
      <OnboardingHeader candidate={candidate} progress={progress} />
      <OnboardingStepper progress={progress} />

      {/* Candidate Welcome Hero & Mission Statement */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(14, 22, 42, 0.9) 0%, rgba(26, 18, 54, 0.8) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.1)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div style={{ flex: '1 1 480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.4)'
                }}
              >
                Welcome to Engineering Onboarding
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cohort 2026-Q4</span>
            </div>

            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem'
              }}
            >
              Welcome Aboard, {candidate?.firstName || 'Sarah'}!
            </h2>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '620px' }}>
              Your onboarding journey for the <strong>{candidate?.role || 'Senior ML Systems Engineer'}</strong> position is active.
              Our AI skills intelligence engine has configured your personalized compliance dossier, hardware provisioning, and technical assessment tracks.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <Link to="/onboarding/checklist" className="btn btn-primary" style={{ fontSize: '0.825rem' }}>
                <CheckSquare size={15} />
                <span>Open Day-1 Checklist</span>
              </Link>
              <Link to="/onboarding/ml-analysis" className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
                <BrainCircuit size={15} color="#a78bfa" />
                <span>Inspect ML Skill Radar</span>
              </Link>
              <Link to="/coding" className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
                <Code2 size={15} color="#60a5fa" />
                <span>Launch Skill Assessment</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Badge Column */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              minWidth: '280px'
            }}
          >
            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(10, 15, 28, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Verified Documents
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', marginTop: '0.2rem' }}>
                {verifiedDocsCount} / {documents.length}
              </div>
              <div style={{ fontSize: '0.675rem', color: '#64748b' }}>AI Optical Scan Active</div>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(10, 15, 28, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Pending Approvals
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.2rem' }}>
                {pendingApprovalsCount}
              </div>
              <div style={{ fontSize: '0.675rem', color: '#64748b' }}>Engineering Leadership</div>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(10, 15, 28, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Target Joining Date
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                Oct 15, 2026
              </div>
              <div style={{ fontSize: '0.675rem', color: '#64748b' }}>16 Days Remaining</div>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(10, 15, 28, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Assigned Manager
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
                David Zhang
              </div>
              <div style={{ fontSize: '0.675rem', color: '#a78bfa' }}>AI Systems Director</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Intelligence Block */}
      <div style={{ marginBottom: '2rem' }}>
        <AIInsightCard insights={aiInsights} loading={loading} />
      </div>

      {/* Quick Navigation Hub Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Onboarding & Intelligence Modules
            </h3>
            <p style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
              Access core pre-boarding operations, verification status, and skills analytics
            </p>
          </div>
          <button
            onClick={loadDashboardData}
            title="Refresh onboarding status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} />
            <span>Sync Data</span>
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {/* Card 1: Personal Info */}
          <Link
            to="/onboarding/personal"
            className="card"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                <User size={20} color="#60a5fa" />
              </div>
              <span
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                100% COMPLETE
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              Personal & Work Profile
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
              Review your official candidate information, emergency contacts, reporting line, and work location settings.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>Manage Profile</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: Documents */}
          <Link
            to="/onboarding/documents"
            className="card"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <FileCheck size={20} color="#34d399" />
              </div>
              <span
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  color: '#93c5fd',
                  background: 'rgba(59, 130, 246, 0.15)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                {verifiedDocsCount} VERIFIED
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              AI Document Verification
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
              Upload Identity scans, degree certificates, and experience letters for real-time neural OCR validation.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>Review Documents</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: Manager Approvals */}
          <Link
            to="/onboarding/approvals"
            className="card"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                <ShieldCheck size={20} color="#fbbf24" />
              </div>
              <span
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.15)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                {pendingApprovalsCount} PENDING
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              Manager Approval Queue
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
              Track executive sign-offs for role band calibrations, equipment requisitions, and final authorization.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>Open Queue</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 4: ML Skill Analysis */}
          <Link
            to="/onboarding/ml-analysis"
            className="card"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}
              >
                <BrainCircuit size={20} color="#a78bfa" />
              </div>
              <span
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  color: '#c4b5fd',
                  background: 'rgba(139, 92, 246, 0.15)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}
              >
                RADAR ACTIVE
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              ML Skill Intelligence
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
              Explore multi-dimensional radar comparison, competency gap detection, and personalized learning roadmaps.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a78bfa', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>View ML Radar</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 5: Big Data Analytics */}
          <Link
            to="/onboarding/analytics"
            className="card"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}
              >
                <PieChart size={20} color="#22d3ee" />
              </div>
              <span
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  color: '#67e8f9',
                  background: 'rgba(6, 182, 212, 0.15)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}
              >
                1,248 HIRES
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              Big Data Analytics
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
              Enterprise-wide hiring funnel drop-offs, 12-month cohort trends, and skills distribution telemetry.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#22d3ee', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>Explore Analytics</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 6: Day-1 Checklist */}
          <Link
            to="/onboarding/checklist"
            className="card"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(244, 63, 94, 0.3)'
                }}
              >
                <CheckSquare size={20} color="#fb7185" />
              </div>
              <span
                style={{
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  color: '#fda4af',
                  background: 'rgba(244, 63, 94, 0.15)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(244, 63, 94, 0.3)'
                }}
              >
                {pendingTasks.length} PENDING
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              Day-1 Readiness Checklist
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
              Interactive pre-boarding checklist with SSO setup, hardware requisition, manager 1:1, and compliance.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fb7185', fontSize: '0.8rem', fontWeight: 700 }}>
              <span>View Checklist</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      {/* Domain Skills Platform Integration Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 24, 48, 0.9) 0%, rgba(9, 14, 26, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '1.5rem 1.75rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(37, 99, 235, 0.5)'
              }}
            >
              <Code2 size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase' }}>
                Unified Technical Assessment Suite
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
                Domain Skills Evaluation Lab
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Test your engineering capabilities in Live Coding, System Design, Debugging, Database/API, and Security.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
              Assessment Dashboard
            </Link>
            <Link to="/coding" className="btn btn-primary" style={{ fontSize: '0.825rem' }}>
              Launch Live Coding Lab
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
