import React from 'react';
import { AssessmentMode, ModeInfo } from '../types/assessment';
import { Terminal, Layers, Cpu, Bug, Database, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

interface ModesGridProps {
  selectedMode: AssessmentMode | null;
  onSelectMode: (mode: AssessmentMode) => void;
  error?: string;
}

export const ASSESSMENT_MODES_LIST: ModeInfo[] = [
  {
    id: 'coding',
    name: 'Live Coding',
    route: '/coding',
    tagline: 'Algorithmic Problem Solving',
    description: 'Solve real-world algorithmic problems with sandboxed test case execution and runtime evaluation.',
    icon: 'Terminal',
    badge: 'Algorithms',
    accent: '#3b82f6'
  },
  {
    id: 'architecture',
    name: 'Architecture Design',
    route: '/architecture',
    tagline: 'High-Level System Architecture',
    description: 'Design distributed architectures, evaluate design patterns, trade-offs, and microservice topographies.',
    icon: 'Layers',
    badge: 'Microservices',
    accent: '#8b5cf6'
  },
  {
    id: 'system',
    name: 'System Design',
    route: '/system-design',
    tagline: 'Planet-Scale Infrastructures',
    description: 'Architect planetary streaming, storage, caching, and CDN delivery networks with fault tolerance.',
    icon: 'Cpu',
    badge: 'Distributed',
    accent: '#06b6d4'
  },
  {
    id: 'debugging',
    name: 'Debugging & RCA',
    route: '/debugging',
    tagline: 'Root Cause Analysis',
    description: 'Diagnose critical production memory leaks, unhandled lifecycle timers, and concurrency race hazards.',
    icon: 'Bug',
    badge: 'Troubleshoot',
    accent: '#f59e0b'
  },
  {
    id: 'database',
    name: 'Database & API Design',
    route: '/database',
    tagline: 'Schema & REST/GraphQL API',
    description: 'Model normalized relational data entities, write analytical queries, and structure idempotent APIs.',
    icon: 'Database',
    badge: 'SQL & Schema',
    accent: '#10b981'
  },
  {
    id: 'security',
    name: 'Security Audit',
    route: '/security',
    tagline: 'Vulnerability Remediation',
    description: 'Audit vulnerable code endpoints, mitigate SQL injection vulnerabilities, and harden web services.',
    icon: 'ShieldAlert',
    badge: 'OWASP / CWE',
    accent: '#f43f5e'
  }
];

export const ModesGrid: React.FC<ModesGridProps> = ({ selectedMode, onSelectMode, error }) => {
  const getIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal size={22} color={color} />;
      case 'Layers':
        return <Layers size={22} color={color} />;
      case 'Cpu':
        return <Cpu size={22} color={color} />;
      case 'Bug':
        return <Bug size={22} color={color} />;
      case 'Database':
        return <Database size={22} color={color} />;
      case 'ShieldAlert':
        return <ShieldAlert size={22} color={color} />;
      default:
        return <Terminal size={22} color={color} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
            Choose Assessment Track
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
            Select an assessment mode to challenge the candidate
          </p>
        </div>
        {error && (
          <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 600 }}>
            {error}
          </span>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}
      >
        {ASSESSMENT_MODES_LIST.map((mode) => {
          const isSelected = selectedMode === mode.id;

          return (
            <div
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              style={{
                position: 'relative',
                padding: '1.25rem',
                borderRadius: '16px',
                background: isSelected ? 'rgba(30, 41, 59, 0.95)' : 'var(--bg-card)',
                border: `2px solid ${isSelected ? mode.accent : 'var(--border-card)'}`,
                boxShadow: isSelected ? `0 0 20px ${mode.accent}33` : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#3b5072';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-card)';
                  e.currentTarget.style.transform = 'none';
                }
              }}
            >
              <div>
                {/* Header with icon and badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `${mode.accent}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${mode.accent}40`
                    }}
                  >
                    {getIcon(mode.icon, mode.accent)}
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: `${mode.accent}15`,
                      color: mode.accent,
                      borderColor: `${mode.accent}40`
                    }}
                  >
                    {mode.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  {mode.name}
                </h4>
                <div style={{ fontSize: '0.75rem', color: mode.accent, fontWeight: 600, marginBottom: '0.5rem' }}>
                  {mode.tagline}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: '1.45' }}>
                  {mode.description}
                </p>
              </div>

              {/* Selection Indicator & Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #1e293b'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Route: <code style={{ color: '#cbd5e1' }}>{mode.route}</code>
                </span>
                {isSelected ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, color: mode.accent }}>
                    <CheckCircle size={14} /> Selected
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#64748b' }}>
                    Select <ArrowRight size={12} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
