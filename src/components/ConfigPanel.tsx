import React from 'react';
import { AssessmentConfig } from '../types/assessment';
import { Sparkles, Sliders, Shield, Video, Zap, CheckCircle2 } from 'lucide-react';

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
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa'
          }}>
            <Sliders size={18} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc' }}>
            Assessment Configuration
          </h3>
        </div>
        <span className="badge badge-primary">
          Preset Active
        </span>
      </div>

      {/* Domain Selection */}
      <div className="form-group">
        <label className="form-label" htmlFor="domain-select">
          Engineering Domain <span style={{ color: '#f43f5e' }}>*</span>
        </label>
        <select
          id="domain-select"
          className="form-select"
          value={config.domain}
          onChange={(e) => handleDomainChange(e.target.value)}
        >
          {Object.keys(DOMAINS).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.domain && (
          <p style={{ color: '#fb7185', fontSize: '0.75rem', marginTop: '0.375rem' }}>
            {errors.domain}
          </p>
        )}
      </div>

      {/* Skill Tags Multi-select */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label className="form-label" style={{ margin: 0 }}>
            Target Skills <span style={{ color: '#f43f5e' }}>*</span>
          </label>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {config.skills.length} selected
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {currentSkills.map((skill) => {
            const isSelected = config.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: `1px solid ${isSelected ? '#3b82f6' : '#27354f'}`,
                  background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  color: isSelected ? '#93c5fd' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem'
                }}
              >
                {isSelected && <CheckCircle2 size={12} color="#60a5fa" />}
                {skill}
              </button>
            );
          })}
        </div>
        {errors.skills && (
          <p style={{ color: '#fb7185', fontSize: '0.75rem', marginTop: '0.375rem' }}>
            {errors.skills}
          </p>
        )}
      </div>

      {/* Difficulty & Time Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Difficulty</label>
          <select
            className="form-select"
            value={config.difficulty}
            onChange={(e) => onChange({ difficulty: e.target.value as AssessmentConfig['difficulty'] })}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Duration</label>
          <select
            className="form-select"
            value={config.time}
            onChange={(e) => onChange({ time: Number(e.target.value) })}
          >
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>60 Minutes</option>
          </select>
        </div>
      </div>

      {/* Environment & Proctoring Toggles */}
      <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>
          Environment Options
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.allowCompile}
              onChange={(e) => onChange({ allowCompile: e.target.checked })}
              style={{ accentColor: '#3b82f6', width: '15px', height: '15px' }}
            />
            <span>Allow Execution</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.aiHints}
              onChange={(e) => onChange({ aiHints: e.target.checked })}
              style={{ accentColor: '#3b82f6', width: '15px', height: '15px' }}
            />
            <span>AI Hints Guide</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.recordScreen}
              onChange={(e) => onChange({ recordScreen: e.target.checked })}
              style={{ accentColor: '#3b82f6', width: '15px', height: '15px' }}
            />
            <span>Screen Proctor</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.autoEval}
              onChange={(e) => onChange({ autoEval: e.target.checked })}
              style={{ accentColor: '#3b82f6', width: '15px', height: '15px' }}
            />
            <span>Auto Evaluation</span>
          </label>
        </div>
      </div>
    </div>
  );
};
