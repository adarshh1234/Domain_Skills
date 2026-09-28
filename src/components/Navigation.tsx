import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Cpu,
  Layers,
  Bug,
  Database,
  ShieldAlert,
  BarChart3,
  Home,
  Sparkles,
  Activity
} from 'lucide-react';
import { AssessmentSession } from '../types/session';

interface NavigationProps {
  session?: AssessmentSession | null;
  onExitSession?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ session, onExitSession }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAssessmentPage = location.pathname !== '/' && location.pathname !== '/results';

  const getModeLabel = (mode?: string) => {
    switch (mode) {
      case 'coding':
        return { label: 'Live Coding', icon: Terminal, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
      case 'architecture':
        return { label: 'Architecture Design', icon: Layers, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' };
      case 'system':
        return { label: 'System Design', icon: Cpu, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' };
      case 'debugging':
        return { label: 'Debugging Lab', icon: Bug, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'database':
        return { label: 'Database & API', icon: Database, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'security':
        return { label: 'Security Audit', icon: ShieldAlert, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' };
      default:
        return { label: 'Assessment', icon: Code2, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
    }
  };

  const modeInfo = session ? getModeLabel(session.mode) : null;
  const ModeIcon = modeInfo?.icon || Code2;

  const handleExit = () => {
    if (onExitSession) {
      onExitSession();
    } else {
      navigate('/');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(6, 9, 16, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.65)'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Brand Logo & Workstation Identity */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Code2 size={20} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  letterSpacing: '-0.03em',
                  color: '#ffffff'
                }}
              >
                DomainSkills
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  fontWeight: 800,
                  letterSpacing: '0.06em'
                }}
              >
                PRO
              </span>
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                color: '#64748b',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              Technical Evaluation Platform
            </div>
          </div>
        </Link>

        {/* Center: Assessment Context Indicator (when in active test session) */}
        {isAssessmentPage && session && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.35rem 0.95rem',
              background: 'rgba(14, 20, 36, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '9999px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                background: modeInfo?.bg || 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ModeIcon size={13} color={modeInfo?.color} strokeWidth={2.4} />
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f8fafc' }}>
              {modeInfo?.label}
            </span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#475569' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {session.config?.difficulty || 'Standard'}
            </span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#475569' }} />
            <span style={{ fontSize: '0.725rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
              <span className="pulse-live-indicator" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Autosave Active
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAssessmentPage ? (
            <button
              onClick={handleExit}
              className="btn btn-secondary"
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.775rem',
                borderRadius: '8px',
                gap: '0.4rem'
              }}
              title="Return to Dashboard (progress is autosaved)"
            >
              <Home size={13} />
              <span>Dashboard</span>
            </button>
          ) : (
            <Link
              to="/results"
              className="btn btn-secondary"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.785rem',
                borderRadius: '8px',
                background: 'rgba(20, 28, 48, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                gap: '0.5rem'
              }}
            >
              <BarChart3 size={14} color="#60a5fa" />
              <span>Results History</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
