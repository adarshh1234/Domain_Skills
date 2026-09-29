import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  User,
  FileCheck,
  CheckSquare,
  BarChart2,
  CheckCircle2,
  Clock,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import { OnboardingProgress } from '../../types/onboarding';

interface OnboardingStepperProps {
  progress?: OnboardingProgress | null;
}

interface StepItem {
  id: string;
  label: string;
  route: string;
  icon: LucideIcon;
  stageKey: string;
}

const STEPS: StepItem[] = [
  { id: '1', label: 'Welcome & Hub', route: '/onboarding', icon: Sparkles, stageKey: 'welcome' },
  { id: '2', label: 'Personal Info', route: '/onboarding/personal', icon: User, stageKey: 'personal' },
  { id: '3', label: 'Documents', route: '/onboarding/documents', icon: FileCheck, stageKey: 'documents' },
  { id: '4', label: 'Approvals', route: '/onboarding/approvals', icon: CheckCircle2, stageKey: 'approvals' },
  { id: '5', label: 'ML Skills Analysis', route: '/onboarding/ml-analysis', icon: BarChart2, stageKey: 'ml-analysis' },
  { id: '6', label: 'Day-1 Checklist', route: '/onboarding/checklist', icon: CheckSquare, stageKey: 'checklist' }
];

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ progress }) => {
  const location = useLocation();

  const completedStages = progress?.completedStages || ['welcome', 'personal'];
  const overallPercentage = progress?.overallPercentage || 74;

  return (
    <div
      style={{
        background: 'rgba(11, 16, 28, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Top Header Row with Percentage & Progress Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            <Sparkles size={14} color="#60a5fa" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
              Onboarding Journey Milestone Tracker
            </div>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
              Step-by-step pre-boarding compliance and engineering skill calibration
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Overall Progress: </span>
            <span style={{ fontSize: '0.95rem', color: '#34d399', fontWeight: 800 }}>{overallPercentage}%</span>
          </div>
          <div
            style={{
              width: '120px',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${overallPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Stepper Node List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.65rem',
          position: 'relative'
        }}
      >
        {STEPS.map((step, idx) => {
          const isActive = location.pathname === step.route;
          const isCompleted = completedStages.includes(step.stageKey as any);
          const Icon = step.icon;

          return (
            <Link
              key={step.id}
              to={step.route}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                textDecoration: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                  : 'rgba(16, 24, 42, 0.6)',
                border: isActive
                  ? '1px solid rgba(59, 130, 246, 0.5)'
                  : isCompleted
                  ? '1px solid rgba(16, 185, 129, 0.25)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: isActive ? '0 0 16px rgba(59, 130, 246, 0.25)' : 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              {/* Step Circle */}
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  background: isCompleted
                    ? 'rgba(16, 185, 129, 0.2)'
                    : isActive
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isCompleted ? '#34d399' : isActive ? '#60a5fa' : '#64748b',
                  border: isCompleted
                    ? '1px solid rgba(16, 185, 129, 0.5)'
                    : isActive
                    ? '1px solid rgba(59, 130, 246, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {isCompleted ? <CheckCircle2 size={13} color="#34d399" /> : idx + 1}
              </div>

              {/* Label & Status */}
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.775rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#ffffff' : isCompleted ? '#e2e8f0' : '#94a3b8',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: isCompleted ? '#34d399' : isActive ? '#60a5fa' : '#64748b',
                    fontWeight: 600
                  }}
                >
                  {isCompleted ? 'Completed' : isActive ? 'Active Step' : 'Pending'}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
