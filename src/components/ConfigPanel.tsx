import React from 'react';
import { AssessmentConfig } from '../types/assessment';
import { Sliders, CheckCircle2, Cpu, Shield, Clock, BarChart3, Terminal } from 'lucide-react';

interface ConfigPanelProps {
  config: AssessmentConfig;
  onChange: (updates: Partial<AssessmentConfig>) => void;
  errors: { domain?: string; skills?: string };
}

const DOMAINS: Record<string, string[]> = {
  'Frontend Engineering': ['React', 'TypeScript', 'CSS/Design Systems', 'Web Performance', 'State Management', 'Testing/Jest'],
  'Full Stack Development': ['React', 'Node.js', 'PostgreSQL', 'REST & GraphQL APIs', 'TypeScript', 'Docker'],
  'Backend & Distributed Systems': ['Node.js', 'System Architecture', 'PostgreSQL', 'Redis Caching', 'Microservices', 'Kafka'],
  'Cloud Architecture & DevOps': ['AWS/GCP', 'Kubernetes', 'Docker', 'CI/CD Pipelines', 'Infrastructure as Code', 'Observability'],
  'Security & Application Hardening': ['OWASP Top 10', 'Penetration Testing', 'Cryptography', 'Secure Auth', 'SQL Injection Mitigation']
};

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange, errors }) => {
  const currentSkills = DOMAINS[config.domain] || DOMAINS['Frontend Engineering'];

  const toggleSkill = (skill: string) => {
    const exists = config.skills.includes(skill);
    const updated = exists
      ? config.skills.filter((s) => s !== skill)
      : [...config.skills, skill];
    onChange({ skills: updated });
  };

  const handleDomainChange = (domain: string) => {
    const defaultSkills = DOMAINS[domain] ? [DOMAINS[domain][0], DOMAINS[domain][1]] : [];
    onChange({ domain, skills: defaultSkills });
  };

  return (
    <div
      className="card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        background: 'linear-gradient(180deg, rgba(14, 20, 36, 0.95) 0%, rgba(8, 12, 22, 0.92) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.75)'
      }}
    >
      {/* Console Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '0.875rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(99, 102, 241, 0.15) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa'
            }}
          >
            <Sliders size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              Control Center
            </h3>
            <span style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              CONFIG_STATION // v2.4
            </span>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.675rem',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            color: '#93c5fd',
            letterSpacing: '0.04em'
          }}
        >
          READY
        </span>
      </div>

      {/* SECTION 1: PROFILE / DOMAIN */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
          <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            01 // PROFILE TRACK
          </span>
          <span style={{ fontSize: '0.675rem', color: '#64748b' }}>Primary Field</span>
        </div>
        <select
          id="domain-select"
          className="form-select"
          value={config.domain}
          onChange={(e) => handleDomainChange(e.target.value)}
          style={{
            padding: '0.7rem 0.9rem',
            fontSize: '0.85rem',
            background: 'rgba(7, 11, 20, 0.85)',
            borderColor: errors.domain ? '#f43f5e' : 'rgba(255, 255, 255, 0.1)'
          }}
        >
          {Object.keys(DOMAINS).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.domain && (
          <p style={{ color: '#fb7185', fontSize: '0.725rem', marginTop: '0.35rem' }}>
            {errors.domain}
          </p>
        )}
      </div>

      {/* SECTION 1.5: JOB DESCRIPTION */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            01.5 // JOB DESCRIPTION
          </span>
          <span style={{ fontSize: '0.675rem', color: '#64748b' }}>Personalization</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.45rem', lineHeight: '1.4' }}>
          Paste the job description to personalize the assessment
        </p>
        <div style={{ position: 'relative' }}>
          <textarea
            id="job-description-textarea"
            className="form-textarea"
            value={config.jobDescription ?? ''}
            onChange={(e) => onChange({ jobDescription: e.target.value })}
            placeholder="Paste the complete job description here..."
            style={{
              width: '100%',
              minHeight: '130px',
              height: '130px',
              padding: '0.75rem 0.9rem 1.85rem 0.9rem',
              fontSize: '0.8125rem',
              lineHeight: '1.5',
              background: 'rgba(7, 11, 20, 0.85)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '0.55rem',
              right: '0.75rem',
              fontSize: '0.675rem',
              color: '#64748b',
              fontFamily: 'var(--font-mono)',
              pointerEvents: 'none',
              background: 'rgba(7, 11, 20, 0.85)',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            {config.jobDescription ? config.jobDescription.length : 0} characters
          </div>
        </div>
      </div>

      {/* SECTION 2: CAPABILITIES / SKILLS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            02 // TARGET CAPABILITIES
          </span>
          <span
            style={{
              fontSize: '0.675rem',
              color: '#93c5fd',
              fontWeight: 700,
              background: 'rgba(59, 130, 246, 0.16)',
              padding: '0.1rem 0.45rem',
              borderRadius: '4px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            {config.skills.length} SELECTED
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {currentSkills.map((skill) => {
            const isSelected = config.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                style={{
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: '9px',
                  border: isSelected
                    ? '1px solid rgba(59, 130, 246, 0.65)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(59, 130, 246, 0.15) 100%)'
                    : 'rgba(10, 15, 26, 0.8)',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  boxShadow: isSelected
                    ? '0 0 16px rgba(59, 130, 246, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                    : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transform: isSelected ? 'translateY(-1px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                    e.currentTarget.style.color = '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                {isSelected ? (
                  <CheckCircle2 size={13} color="#60a5fa" strokeWidth={2.8} />
                ) : (
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#475569' }} />
                )}
                {skill}
              </button>
            );
          })}
        </div>
        {errors.skills && (
          <p style={{ color: '#fb7185', fontSize: '0.725rem', marginTop: '0.35rem' }}>
            {errors.skills}
          </p>
        )}
      </div>

      {/* SECTION 3: BENCHMARK / DIFFICULTY & DURATION */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
          <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            03 // BENCHMARK CRITERIA
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.7rem', color: '#64748b' }}>
              SENIORITY
            </label>
            <select
              className="form-select"
              value={config.difficulty}
              onChange={(e) => onChange({ difficulty: e.target.value as AssessmentConfig['difficulty'] })}
              style={{ padding: '0.65rem 0.8rem', fontSize: '0.8125rem' }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.7rem', color: '#64748b' }}>
              TIME WINDOW
            </label>
            <select
              className="form-select"
              value={config.time}
              onChange={(e) => onChange({ time: Number(e.target.value) })}
              style={{ padding: '0.65rem 0.8rem', fontSize: '0.8125rem' }}
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 4: ENVIRONMENT & PROCTORING */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.875rem', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
          <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            04 // PROCTORING & RUNTIME
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.785rem',
              color: '#cbd5e1',
              cursor: 'pointer',
              padding: '0.45rem 0.6rem',
              borderRadius: '8px',
              background: config.allowCompile ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${config.allowCompile ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
              transition: 'all 0.15s ease'
            }}
          >
            <input
              type="checkbox"
              checked={config.allowCompile}
              onChange={(e) => onChange({ allowCompile: e.target.checked })}
              style={{ accentColor: '#3b82f6', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <span>Execution</span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.785rem',
              color: '#cbd5e1',
              cursor: 'pointer',
              padding: '0.45rem 0.6rem',
              borderRadius: '8px',
              background: config.aiHints ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${config.aiHints ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
              transition: 'all 0.15s ease'
            }}
          >
            <input
              type="checkbox"
              checked={config.aiHints}
              onChange={(e) => onChange({ aiHints: e.target.checked })}
              style={{ accentColor: '#3b82f6', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <span>AI Hints</span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.785rem',
              color: '#cbd5e1',
              cursor: 'pointer',
              padding: '0.45rem 0.6rem',
              borderRadius: '8px',
              background: config.recordScreen ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${config.recordScreen ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
              transition: 'all 0.15s ease'
            }}
          >
            <input
              type="checkbox"
              checked={config.recordScreen}
              onChange={(e) => onChange({ recordScreen: e.target.checked })}
              style={{ accentColor: '#3b82f6', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <span>Proctor</span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.785rem',
              color: '#cbd5e1',
              cursor: 'pointer',
              padding: '0.45rem 0.6rem',
              borderRadius: '8px',
              background: config.autoEval ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${config.autoEval ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
              transition: 'all 0.15s ease'
            }}
          >
            <input
              type="checkbox"
              checked={config.autoEval}
              onChange={(e) => onChange({ autoEval: e.target.checked })}
              style={{ accentColor: '#3b82f6', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <span>Auto Eval</span>
          </label>
        </div>
      </div>
    </div>
  );
};
