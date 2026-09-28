import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigPanel } from '../components/ConfigPanel';
import { ModesGrid, ASSESSMENT_MODES_LIST } from '../components/ModesGrid';
import { AssessmentConfig, AssessmentMode } from '../types/assessment';
import { AssessmentSession } from '../types/session';
import { AssessmentResult } from '../types/result';
import { storageService } from '../services/storage';
import { questionsData } from '../data/questions';
import {
  Rocket,
  PlayCircle,
  Clock,
  Sparkles,
  Award,
  RotateCcw,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [config, setConfig] = useState<AssessmentConfig>({
    domain: 'Frontend Engineering',
    skills: ['React', 'TypeScript'],
    difficulty: 'Intermediate',
    time: 30,
    allowCompile: true,
    aiHints: true,
    recordScreen: false,
    autoEval: true
  });

  const [selectedMode, setSelectedMode] = useState<AssessmentMode | null>(null);
  const [errors, setErrors] = useState<{ domain?: string; skills?: string; mode?: string }>({});
  const [activeSession, setActiveSession] = useState<AssessmentSession | null>(null);
  const [previousResults, setPreviousResults] = useState<AssessmentResult[]>([]);

  // Check for existing active session & previous results on mount
  useEffect(() => {
    const existing = storageService.getSession();
    if (existing && existing.status === 'active') {
      setActiveSession(existing);
      setSelectedMode(existing.mode);
      if (existing.config) {
        setConfig(existing.config);
      }
    }

    const results = storageService.getResults();
    setPreviousResults(results);
  }, []);

  const handleConfigChange = (updates: Partial<AssessmentConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    if (updates.domain) setErrors((prev) => ({ ...prev, domain: undefined }));
    if (updates.skills) setErrors((prev) => ({ ...prev, skills: undefined }));
  };

  const handleSelectMode = (mode: AssessmentMode) => {
    setSelectedMode(mode);
    setErrors((prev) => ({ ...prev, mode: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: { domain?: string; skills?: string; mode?: string } = {};

    if (!config.domain.trim()) {
      newErrors.domain = 'Please select an engineering domain';
    }

    if (!config.skills || config.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }

    if (!selectedMode) {
      newErrors.mode = 'Please select an assessment track below';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLaunchTest = () => {
    if (!validate() || !selectedMode) return;

    const modeConfig = ASSESSMENT_MODES_LIST.find((m) => m.id === selectedMode);
    const targetRoute = modeConfig ? modeConfig.route : '/coding';

    let starterAnswers: Record<string, unknown> = {};
    if (selectedMode === 'coding') {
      starterAnswers = { code: questionsData.coding[0].starterCode };
    } else if (selectedMode === 'architecture') {
      starterAnswers = {
        selectedPattern: questionsData.architecture[0].patterns[0],
        diagram: questionsData.architecture[0].starterDiagram,
        justification: '',
        tradeOffs: ''
      };
    } else if (selectedMode === 'system') {
      starterAnswers = {
        selectedComponents: ['API Gateway & Load Balancer', 'Content Delivery Network (CDN Edge)'],
        notes: ''
      };
    } else if (selectedMode === 'debugging') {
      starterAnswers = {
        fixedCode: questionsData.debugging[0].starterCode,
        identifiedBugs: ''
      };
    } else if (selectedMode === 'database') {
      starterAnswers = {
        schema: questionsData.database[0].starterSchema,
        apiEndpoints: 'GET /api/products\nPOST /api/orders\nGET /api/cart',
        queries: '-- Write SQL queries here'
      };
    } else if (selectedMode === 'security') {
      starterAnswers = {
        selectedVulns: ['SQL Injection (CWE-89)'],
        fixedCode: questionsData.security[0].vulnerableSnippet,
        explanation: ''
      };
    }

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const newSession: AssessmentSession = {
      id: sessionId,
      mode: selectedMode,
      startedAt: Date.now(),
      duration: config.time,
      currentQuestion: 0,
      answers: starterAnswers,
      config,
      status: 'active'
    };

    storageService.saveSession(newSession);
    navigate(targetRoute);
  };

  const handleResumeSession = () => {
    if (!activeSession) return;
    const modeConfig = ASSESSMENT_MODES_LIST.find((m) => m.id === activeSession.mode);
    const targetRoute = modeConfig ? modeConfig.route : '/coding';
    navigate(targetRoute);
  };

  const handleDiscardSession = () => {
    storageService.clearSession();
    setActiveSession(null);
  };

  const selectedModeConfig = ASSESSMENT_MODES_LIST.find((m) => m.id === selectedMode);

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
      {/* =========================================================================
          1. COMMAND-CENTER HERO SECTION (Split: Left Content & Right AI Viz)
         ========================================================================= */}
      <div
        className="animate-fade-in"
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(14, 22, 42, 0.9) 0%, rgba(9, 13, 24, 0.95) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.75), 0 0 35px rgba(59, 130, 246, 0.08)',
          padding: '2.75rem 3rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(320px, 0.9fr)',
          gap: '2.5rem',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Ambient Backlight */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '25%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.16) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }}
        />

        {/* Left Side: Brand, Headings, Summary */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="shimmer-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.95rem',
              border: '1px solid rgba(99, 102, 241, 0.45)',
              borderRadius: '9999px',
              fontSize: '0.725rem',
              fontWeight: 800,
              color: '#c7d2fe',
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.22)'
            }}
          >
            <Sparkles size={14} color="#818cf8" />
            <span>Senior Candidate Evaluation Suite</span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                fontSize: '2.75rem',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.08,
                letterSpacing: '-0.04em'
              }}
            >
              DOMAIN SKILLS
            </div>
            <div
              style={{
                fontSize: '2.75rem',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Assessment Platform
            </div>
          </div>

          <p style={{ fontSize: '1.025rem', color: '#94a3b8', lineHeight: 1.65, maxWidth: '620px' }}>
            Run real-time, client-side proctored technical rounds across Algorithms, Distributed System Design, Production Debugging, SQL Modeling, and OWASP Security Audits with persistent timer auto-save.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.785rem', color: '#cbd5e1' }}>
              <ShieldCheck size={16} color="#34d399" />
              <span>Client-Side Sandboxing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.785rem', color: '#cbd5e1' }}>
              <Zap size={16} color="#60a5fa" />
              <span>Deterministic Rubric</span>
            </div>
          </div>
        </div>

        {/* Right Side: Decorative Abstract AI Assessment Visualization */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
            background: 'rgba(8, 12, 22, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '1.25rem',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 12px 30px rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
        >
          {/* Header of AI Engine Simulation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-live-indicator" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
                EVALUATION_ENGINE // ACTIVE
              </span>
            </div>
            <span style={{ fontSize: '0.675rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              NODE_ID: #DS-884
            </span>
          </div>

          {/* Telemetry Micro-Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <div style={{ background: 'rgba(15, 22, 38, 0.8)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>EXECUTION HARNESS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                ONLINE
              </div>
              <div style={{ fontSize: '0.675rem', color: '#94a3b8', marginTop: '0.2rem' }}>Sandboxed ES6 Runtime</div>
            </div>

            <div style={{ background: 'rgba(15, 22, 38, 0.8)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PERSISTENCE STATE</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                LOCAL_SYNC
              </div>
              <div style={{ fontSize: '0.675rem', color: '#94a3b8', marginTop: '0.2rem' }}>Resilient Recovery</div>
            </div>
          </div>

          {/* Visual Simulation of Assessment Vectors */}
          <div
            style={{
              background: 'rgba(12, 17, 30, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.725rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Algorithms (Two Sum / LRU)</span>
              <span style={{ color: '#34d399' }}>READY</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Distributed Architecture (URL/Chat)</span>
              <span style={{ color: '#34d399' }}>READY</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>RCA Debugger (Memory Leak)</span>
              <span style={{ color: '#34d399' }}>READY</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Vulnerability Audit (SQLi CWE-89)</span>
              <span style={{ color: '#34d399' }}>READY</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. ACTIVE SESSION CONTROL PANEL (Appears dynamically if session exists)
         ========================================================================= */}
      {activeSession && (
        <div
          className="animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(13, 19, 34, 0.95) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.65)',
            borderRadius: '20px',
            padding: '1.35rem 2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            boxShadow: '0 0 35px rgba(59, 130, 246, 0.22), 0 14px 28px -6px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Left: Active Live Signal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.35) 0%, rgba(37, 99, 235, 0.18) 100%)',
                border: '1.5px solid rgba(59, 130, 246, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
                boxShadow: '0 0 18px rgba(59, 130, 246, 0.35)'
              }}
            >
              <PlayCircle size={26} strokeWidth={2.4} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.2rem' }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.725rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#93c5fd',
                    letterSpacing: '0.06em',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <span className="pulse-live-indicator" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                  LIVE SESSION ACTIVE
                </span>
                <span className="badge badge-primary">IN PROGRESS</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                {activeSession.mode.toUpperCase()} Technical Round
              </h3>
            </div>
          </div>

          {/* Center: Live Session Telemetry Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0, 0, 0, 0.35)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Started: <strong style={{ color: '#f8fafc' }}>{new Date(activeSession.startedAt).toLocaleTimeString()}</strong>
            </div>
            <span style={{ color: '#475569' }}>•</span>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Allotted: <strong style={{ color: '#f8fafc' }}>{activeSession.duration} min</strong>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <button
              onClick={handleDiscardSession}
              className="btn btn-danger"
              style={{ fontSize: '0.8125rem', padding: '0.65rem 1.15rem' }}
            >
              <RotateCcw size={14} /> Discard & Reset
            </button>
            <button
              onClick={handleResumeSession}
              className="btn btn-primary"
              style={{ fontSize: '0.875rem', padding: '0.7rem 1.5rem', fontWeight: 800 }}
            >
              Resume Assessment <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. ASSESSMENT WORKSPACE (Config Console Left | Assessment Modules Right)
         ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(330px, 400px) 1fr',
          gap: '2rem',
          alignItems: 'start'
        }}
      >
        {/* Left Side: Assessment Control Center */}
        <ConfigPanel
          config={config}
          onChange={handleConfigChange}
          errors={errors}
        />

        {/* Right Side: Assessment Modules & Launch Command Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <ModesGrid
            selectedMode={selectedMode}
            onSelectMode={handleSelectMode}
            error={errors.mode}
          />

          {/* =====================================================================
              4. LAUNCH COMMAND BAR (The Ultimate CTA Moment)
             ===================================================================== */}
          <div
            className="card animate-fade-in"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              padding: '1.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(17, 24, 42, 0.95) 0%, rgba(26, 36, 62, 0.9) 100%)',
              border: selectedMode ? '1.5px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              boxShadow: selectedMode ? '0 0 35px rgba(59, 130, 246, 0.25), 0 10px 30px rgba(0, 0, 0, 0.65)' : '0 10px 25px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 800,
                    color: selectedMode ? '#60a5fa' : '#94a3b8',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  ⚡ READY TO BEGIN
                </span>
                {selectedMode && (
                  <span className="badge badge-primary">
                    {selectedMode.toUpperCase()}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                {selectedModeConfig
                  ? `${selectedModeConfig.name} Assessment · ${config.time} Minutes Limit`
                  : 'Select an assessment track above to initialize session'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLaunchTest}
              className="btn btn-primary"
              style={{
                padding: '0.95rem 2.5rem',
                fontSize: '1.05rem',
                fontWeight: 900,
                borderRadius: '14px',
                letterSpacing: '-0.01em',
                boxShadow: '0 6px 25px rgba(37, 99, 235, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <Rocket size={20} strokeWidth={2.5} />
              <span>Launch Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. RECENT ASSESSMENT ACTIVITY / HISTORY LOG
         ========================================================================= */}
      {previousResults.length > 0 && (
        <div
          className="card animate-fade-in"
          style={{
            background: 'linear-gradient(180deg, rgba(14, 20, 36, 0.85) 0%, rgba(9, 13, 24, 0.8) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.75rem 2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                <Award size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  Assessment Activity & Audit Log
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Locally recorded performance evaluations</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/results')}
              className="btn btn-secondary"
              style={{ fontSize: '0.775rem', padding: '0.45rem 1rem', borderRadius: '8px' }}
            >
              View Full Breakdown
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {previousResults.slice(0, 3).map((res) => {
              const scoreColor = res.score >= 80 ? '#34d399' : res.score >= 60 ? '#60a5fa' : '#fb7185';
              const badgeBg = res.score >= 80 ? 'rgba(16, 185, 129, 0.15)' : res.score >= 60 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(244, 63, 94, 0.15)';
              const badgeBorder = res.score >= 80 ? 'rgba(16, 185, 129, 0.35)' : res.score >= 60 ? 'rgba(59, 130, 246, 0.35)' : 'rgba(244, 63, 94, 0.35)';

              return (
                <div
                  key={res.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.5rem',
                    background: 'rgba(9, 13, 24, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '14px',
                    transition: 'all 0.18s ease-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                    e.currentTarget.style.background = 'rgba(16, 23, 40, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.background = 'rgba(9, 13, 24, 0.75)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span
                      className="badge"
                      style={{
                        background: badgeBg,
                        color: scoreColor,
                        borderColor: badgeBorder,
                        fontSize: '0.725rem',
                        padding: '0.3rem 0.75rem'
                      }}
                    >
                      {res.mode.toUpperCase()}
                    </span>

                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>Evaluation Score:</span>
                        <span style={{ color: scoreColor }}>{res.score} / 100</span>
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.15rem' }}>
                        Submitted {new Date(res.submittedAt).toLocaleDateString()} at {new Date(res.submittedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {Math.floor(res.timeSpent / 60)}m {res.timeSpent % 60}s elapsed
                    </span>
                    <button
                      onClick={() => navigate(`/results?id=${res.id}`)}
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.785rem', borderRadius: '8px' }}
                    >
                      Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
