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
  LogOut,
  Clock,
  Sparkles
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
        return { label: 'Live Coding', icon: Terminal, color: '#3b82f6' };
      case 'architecture':
        return { label: 'Architecture Design', icon: Layers, color: '#8b5cf6' };
      case 'system':
        return { label: 'System Design', icon: Cpu, color: '#06b6d4' };
      case 'debugging':
        return { label: 'Debugging Lab', icon: Bug, color: '#f59e0b' };
      case 'database':
        return { label: 'Database & API', icon: Database, color: '#10b981' };
      case 'security':
        return { label: 'Security Audit', icon: ShieldAlert, color: '#f43f5e' };
      default:
        return { label: 'Assessment', icon: Code2, color: '#3b82f6' };
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
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)'
          }}>
            <Code2 size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DomainSkills
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Assessment Platform
            </div>
          </div>
        </Link>

        {/* Center: Current Assessment Context (if in assessment) */}
        {isAssessmentPage && session && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.375rem 0.875rem',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid #27354f',
            borderRadius: '9999px'
          }}>
            <ModeIcon size={16} color={modeInfo?.color} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
              {modeInfo?.label}
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {session.config?.difficulty || 'Standard'} Mode
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569' }} />
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Live Autosave
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAssessmentPage ? (
            <button
              onClick={handleExit}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.875rem', fontSize: '0.75rem' }}
              title="Return to Dashboard (your progress is autosaved)"
            >
              <Home size={14} />
              <span>Dashboard</span>
            </button>
          ) : (
            <Link
              to="/results"
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.875rem', fontSize: '0.75rem' }}
            >
              <BarChart3 size={14} />
              <span>Results History</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
