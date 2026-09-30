import React, { useState } from 'react';
import { AssessmentMode, ModeInfo } from '../types/assessment';
import {
  Terminal,
  Layers,
  Cpu,
  Bug,
  Database,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bot,
  Cloud,
  Smartphone,
  Activity
} from 'lucide-react';

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
    description: 'Solve real-world algorithmic challenges with sandboxed test case execution and runtime evaluation.',
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

export const ADDITIONAL_MODES_LIST: ModeInfo[] = [
  {
    id: 'coding',
    name: 'AI & LLM Engineering',
    route: '/coding',
    tagline: 'Prompt Tuning & RAG Pipelines',
    description: 'Design agentic workflows, implement vector embeddings, optimize context windows, and manage model guardrails.',
    icon: 'Bot',
    badge: 'Generative AI',
    accent: '#ec4899'
  },
  {
    id: 'architecture',
    name: 'DevOps & Cloud Infra',
    route: '/architecture',
    tagline: 'Kubernetes & CI/CD Hardening',
    description: 'Structure multi-region Kubernetes clusters, Terraform IaC states, GitOps workflows, and zero-trust perimeter policies.',
    icon: 'Cloud',
    badge: 'K8s & Infra',
    accent: '#14b8a6'
  },
  {
    id: 'system',
    name: 'Mobile & Edge Systems',
    route: '/system-design',
    tagline: 'Cross-Platform & Offline Sync',
    description: 'Architect React Native/native bridges, battery-efficient background queues, and conflict-free replicated data types.',
    icon: 'Smartphone',
    badge: 'Mobile Core',
    accent: '#a855f7'
  },
  {
    id: 'database',
    name: 'Data Engineering & ETL',
    route: '/database',
    tagline: 'Stream Processing & Lakehouse',
    description: 'Model real-time event brokers with Kafka, configure Apache Spark pipelines, and partition distributed data warehouses.',
    icon: 'Database',
    badge: 'Big Data',
    accent: '#eab308'
  }
];

export const ModesGrid: React.FC<ModesGridProps> = ({ selectedMode, onSelectMode, error }) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  const getIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal size={22} color={color} strokeWidth={2.4} />;
      case 'Layers':
        return <Layers size={22} color={color} strokeWidth={2.4} />;
      case 'Cpu':
        return <Cpu size={22} color={color} strokeWidth={2.4} />;
      case 'Bug':
        return <Bug size={22} color={color} strokeWidth={2.4} />;
      case 'Database':
        return <Database size={22} color={color} strokeWidth={2.4} />;
      case 'ShieldAlert':
        return <ShieldAlert size={22} color={color} strokeWidth={2.4} />;
      case 'Bot':
        return <Bot size={22} color={color} strokeWidth={2.4} />;
      case 'Cloud':
        return <Cloud size={22} color={color} strokeWidth={2.4} />;
      case 'Smartphone':
        return <Smartphone size={22} color={color} strokeWidth={2.4} />;
      case 'Activity':
        return <Activity size={22} color={color} strokeWidth={2.4} />;
      default:
        return <Terminal size={22} color={color} strokeWidth={2.4} />;
    }
  };

  const getWatermark = (modeId: string) => {
    switch (modeId) {
      case 'coding':
        return '{ fn() }';
      case 'architecture':
        return '──(API)──>';
      case 'system':
        return '[CDN:Edge]';
      case 'debugging':
        return '0x00FF4A';
      case 'database':
        return 'SELECT *';
      case 'security':
        return 'TLS/SSL:OK';
      default:
        return 'MODULE';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              CORE EVALUATION ENGINE
            </span>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.025em' }}>
            Assessment Modules
          </h3>
        </div>
        {error && (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#fb7185',
              fontWeight: 700,
              background: 'rgba(244, 63, 94, 0.12)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(244, 63, 94, 0.35)'
            }}
          >
            {error}
          </span>
        )}
      </div>

      {/* 3x2 Grid for Desktop, adaptive for Tablet & Mobile */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {ASSESSMENT_MODES_LIST.map((mode, index) => {
          const isSelected = selectedMode === mode.id;

          return (
            <div
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 60}ms`,
                position: 'relative',
                padding: '1.5rem',
                borderRadius: '20px',
                background: isSelected
                  ? `radial-gradient(circle at 10% 10%, ${mode.accent}20 0%, rgba(13, 19, 34, 0.98) 100%)`
                  : 'rgba(11, 16, 28, 0.78)',
                border: isSelected
                  ? `2px solid ${mode.accent}`
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected
                  ? `0 0 30px ${mode.accent}30, 0 14px 28px -6px rgba(0, 0, 0, 0.75)`
                  : '0 8px 20px -4px rgba(0, 0, 0, 0.6)',
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.35rem',
                overflow: 'hidden',
                transform: isSelected ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = `${mode.accent}66`;
                  e.currentTarget.style.background = `radial-gradient(circle at 15% 15%, ${mode.accent}14 0%, rgba(16, 24, 42, 0.95) 100%)`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 16px 32px -8px rgba(0, 0, 0, 0.7), 0 0 20px ${mode.accent}20`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(11, 16, 28, 0.78)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(0, 0, 0, 0.6)';
                }
              }}
            >
              {/* Subtle Decorative Technical Watermark */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: isSelected ? `${mode.accent}55` : 'rgba(255, 255, 255, 0.05)',
                  letterSpacing: '0.08em',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              >
                {getWatermark(mode.id)}
              </div>

              {/* Ambient Glow for Selected Module */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '-40px',
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    background: `${mode.accent}25`,
                    filter: 'blur(35px)',
                    pointerEvents: 'none'
                  }}
                />
              )}

              <div>
                {/* Header: Visual Anchor Icon + Category Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${mode.accent}26 0%, ${mode.accent}0c 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1.5px solid ${mode.accent}45`,
                      boxShadow: isSelected ? `0 0 16px ${mode.accent}35` : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {getIcon(mode.icon, mode.accent)}
                  </div>

                  <span
                    className="badge"
                    style={{
                      background: `${mode.accent}14`,
                      color: mode.accent,
                      borderColor: `${mode.accent}35`,
                      fontSize: '0.675rem',
                      padding: '0.2rem 0.6rem'
                    }}
                  >
                    {mode.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>
                  {mode.name}
                </h4>
                <div style={{ fontSize: '0.75rem', color: mode.accent, fontWeight: 700, marginBottom: '0.65rem', letterSpacing: '0.02em' }}>
                  {mode.tagline}
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  {mode.description}
                </p>
              </div>

              {/* Module Footer: Route & Selection Action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.95rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <span
                  style={{
                    fontSize: '0.725rem',
                    color: '#64748b',
                    fontFamily: 'var(--font-mono)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '5px'
                  }}
                >
                  {mode.route}
                </span>

                {isSelected ? (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: mode.accent,
                      letterSpacing: '0.04em'
                    }}
                  >
                    <CheckCircle2 size={16} strokeWidth={2.8} /> SELECTED
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      fontWeight: 600
                    }}
                  >
                    Select <ArrowRight size={13} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MORE OPTIONS ACCORDION BELOW THE SECURITY & AUDIT CARDS */}
      <div style={{ marginTop: '0.25rem' }}>
        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.4rem',
            borderRadius: '16px',
            background: showMore
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)'
              : 'rgba(11, 16, 28, 0.75)',
            border: showMore
              ? '1px solid rgba(59, 130, 246, 0.45)'
              : '1px dashed rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: showMore
              ? '0 0 24px rgba(59, 130, 246, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
              : '0 4px 14px rgba(0, 0, 0, 0.35)'
          }}
          onMouseEnter={(e) => {
            if (!showMore) {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.currentTarget.style.background = 'rgba(16, 24, 42, 0.9)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showMore) {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(11, 16, 28, 0.75)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.35)';
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa'
              }}
            >
              <Sparkles size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span>More Assessment Options & Specialized Tracks</span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    color: '#c4b5fd',
                    letterSpacing: '0.04em'
                  }}
                >
                  +4 ADDITIONAL TRACKS
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                Explore AI & LLM Systems, DevOps & Cloud Ops, Mobile Engineering, and Data Lakehouse tracks
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.775rem',
              fontWeight: 800,
              color: '#60a5fa',
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.25)'
            }}
          >
            <span>{showMore ? 'Hide More Options' : 'Explore More Options'}</span>
            {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {/* EXPANDED ADDITIONAL TRACKS */}
        {showMore && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {ADDITIONAL_MODES_LIST.map((mode, index) => {
              const isSelected = selectedMode === mode.id && selectedMode !== null;

              return (
                <div
                  key={mode.name}
                  onClick={() => onSelectMode(mode.id)}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    position: 'relative',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    background: isSelected
                      ? `radial-gradient(circle at 10% 10%, ${mode.accent}20 0%, rgba(13, 19, 34, 0.98) 100%)`
                      : 'rgba(11, 16, 28, 0.78)',
                    border: isSelected
                      ? `2px solid ${mode.accent}`
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected
                      ? `0 0 30px ${mode.accent}30, 0 14px 28px -6px rgba(0, 0, 0, 0.75)`
                      : '0 8px 20px -4px rgba(0, 0, 0, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.35rem',
                    overflow: 'hidden',
                    transform: isSelected ? 'translateY(-2px)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = `${mode.accent}66`;
                      e.currentTarget.style.background = `radial-gradient(circle at 15% 15%, ${mode.accent}14 0%, rgba(16, 24, 42, 0.95) 100%)`;
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = `0 16px 32px -8px rgba(0, 0, 0, 0.7), 0 0 20px ${mode.accent}20`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.background = 'rgba(11, 16, 28, 0.78)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(0, 0, 0, 0.6)';
                    }
                  }}
                >
                  {/* Subtle Decorative Technical Watermark */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1.25rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: isSelected ? `${mode.accent}55` : 'rgba(255, 255, 255, 0.05)',
                      letterSpacing: '0.08em',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  >
                    {getWatermark(mode.id)}
                  </div>

                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '14px',
                          background: `linear-gradient(135deg, ${mode.accent}26 0%, ${mode.accent}0c 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1.5px solid ${mode.accent}45`,
                          boxShadow: isSelected ? `0 0 16px ${mode.accent}35` : 'none',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        {getIcon(mode.icon, mode.accent)}
                      </div>

                      <span
                        className="badge"
                        style={{
                          background: `${mode.accent}14`,
                          color: mode.accent,
                          borderColor: `${mode.accent}35`,
                          fontSize: '0.675rem',
                          padding: '0.2rem 0.6rem'
                        }}
                      >
                        {mode.badge}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>
                      {mode.name}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: mode.accent, fontWeight: 700, marginBottom: '0.65rem', letterSpacing: '0.02em' }}>
                      {mode.tagline}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.55 }}>
                      {mode.description}
                    </p>
                  </div>

                  {/* Module Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.95rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.725rem',
                        color: '#64748b',
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '5px'
                      }}
                    >
                      {mode.route}
                    </span>

                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        color: mode.accent,
                        fontWeight: 600
                      }}
                    >
                      Select <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
