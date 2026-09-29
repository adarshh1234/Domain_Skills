import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  Award,
  ChevronRight,
  BrainCircuit,
  FileCheck,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';
import { CandidateProfile, OnboardingProgress } from '../../types/onboarding';

interface OnboardingHeaderProps {
  candidate: CandidateProfile | null;
  progress: OnboardingProgress | null;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ candidate, progress }) => {
  const location = useLocation();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/onboarding':
        return {
          title: 'Onboarding & Skills Intelligence Command Center',
          subtitle: 'AI-guided pre-boarding, automated compliance verification, and engineering competency telemetry'
        };
      case '/onboarding/personal':
        return {
          title: 'Personal & Professional Profile',
          subtitle: 'Candidate credentials, reporting hierarchy, and emergency contacts'
        };
      case '/onboarding/documents':
        return {
          title: 'AI Document Verification Hub',
          subtitle: 'Automated OCR extraction, cryptographic check digit verification, and compliance status'
        };
      case '/onboarding/approvals':
        return {
          title: 'Manager & Leadership Approval Queue',
          subtitle: 'Role calibrations, equipment budgets, and final onboarding sign-offs'
        };
      case '/onboarding/ml-analysis':
        return {
          title: 'ML Skills Intelligence & Gap Radar',
          subtitle: 'Multi-dimensional competency benchmark against L5 Senior Staff standards'
        };
      case '/onboarding/analytics':
        return {
          title: 'Big Data Hiring & Onboarding Analytics',
          subtitle: 'Enterprise-wide talent velocity, 12-month cohort trends, and retention predictions'
        };
      case '/onboarding/checklist':
        return {
          title: 'Day-1 Readiness & Execution Checklist',
          subtitle: 'Interactive task milestones, hardware provisioning, and team onboarding syncs'
        };
      default:
        return {
          title: 'Employee Onboarding Suite',
          subtitle: 'AI-assisted onboarding and skills intelligence'
        };
    }
  };

  const pageInfo = getPageTitle(location.pathname);
  const percentage = progress?.overallPercentage || 74;

  return (
    <div
      style={{
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(14, 22, 42, 0.85) 0%, rgba(20, 28, 52, 0.6) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '1.75rem 2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Subtle Gradient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(30px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(30px)'
        }}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Left: Breadcrumbs & Main Title */}
        <div style={{ flex: '1 1 500px', minWidth: '280px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontWeight: 600,
              marginBottom: '0.6rem'
            }}
          >
            <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              Platform
            </Link>
            <ChevronRight size={12} color="#64748b" />
            <Link to="/onboarding" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Onboarding & Skills Intelligence
            </Link>
            {location.pathname !== '/onboarding' && (
              <>
                <ChevronRight size={12} color="#64748b" />
                <span style={{ color: '#a78bfa' }}>{pageInfo.title.split(' ')[0]}</span>
              </>
            )}
          </div>

          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              lineHeight: 1.25,
              marginBottom: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            {pageInfo.title}
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)',
                color: '#c4b5fd',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Sparkles size={11} color="#a78bfa" />
              AI-Powered
            </span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '680px', lineHeight: 1.5 }}>
            {pageInfo.subtitle}
          </p>
        </div>

        {/* Right: Candidate Status & Readiness Widget */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            background: 'rgba(11, 16, 28, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '0.85rem 1.25rem',
            backdropFilter: 'blur(12px)'
          }}
        >
          {/* Avatar & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #8b5cf6',
                boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)',
                flexShrink: 0
              }}
            >
              <img
                src={candidate?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={candidate?.firstName || 'Candidate'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Sarah Chen'}
              </div>
              <div style={{ fontSize: '0.725rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{candidate?.role || 'Senior ML Systems Engineer'}</span>
                <span style={{ color: '#38bdf8' }}>•</span>
                <span style={{ color: '#a78bfa', fontWeight: 600 }}>{candidate?.level || 'L5'}</span>
              </div>
            </div>
          </div>

          <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.08)' }} />

          {/* Days to Joining & Progress */}
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.675rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Days to Day 1
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1.2 }}>
                {progress?.daysToJoining || 16}d
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.675rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Readiness
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', lineHeight: 1.2 }}>
                {percentage}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
