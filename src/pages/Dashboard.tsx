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
  ChevronRight
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
    // Clear validation errors when user alters fields
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

    // Target route for selected mode
    const modeConfig = ASSESSMENT_MODES_LIST.find((m) => m.id === selectedMode);
    const targetRoute = modeConfig ? modeConfig.route : '/coding';

    // Initialize starter answers based on mode
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

    // 1. Generate unique session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // 2. Create session object
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

    // 3. Save to localStorage via storage service
    storageService.saveSession(newSession);

    // 4. Navigate to assessment route
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

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          borderRadius: '24px',
          padding: '2rem 2.5rem',
          border: '1px solid #1e40af55',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={14} /> Senior Candidate Evaluation Suite
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Domain Skills Assessment Platform
          </h1>
          <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Run real-time, client-side proctored technical rounds across Algorithms, Distributed System Design, Production Debugging, SQL Modeling, and OWASP Security Audits with persistent timer auto-save.
          </p>
        </div>
      </div>

      {/* Active Session Notification Card (if assessment in progress) */}
      {activeSession && (
        <div
          className="animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(17, 24, 39, 0.9) 100%)',
            border: '2px solid #3b82f6',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: '0 0 24px rgba(59, 130, 246, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
              <PlayCircle size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#60a5fa', letterSpacing: '0.05em' }}>
                  Assessment In Progress
                </span>
                <span className="badge badge-primary">Active</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc' }}>
                {activeSession.mode.toUpperCase()} Round
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                Started at {new Date(activeSession.startedAt).toLocaleTimeString()} • {activeSession.duration} minutes allotted
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleDiscardSession}
              className="btn btn-secondary"
              style={{ fontSize: '0.8125rem' }}
            >
              <RotateCcw size={14} /> Discard & Start New
            </button>
            <button
              onClick={handleResumeSession}
              className="btn btn-primary"
              style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}
            >
              Resume Assessment <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Config Panel (Left) & Modes Grid (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 400px) 1fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}
      >
        <ConfigPanel
          config={config}
          onChange={handleConfigChange}
          errors={errors}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ModesGrid
            selectedMode={selectedMode}
            onSelectMode={handleSelectMode}
            error={errors.mode}
          />

          {/* Launch Button Action Bar */}
          <div
            className="card"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(to right, #111827, #1e293b)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
                Ready to Launch Session?
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {selectedMode
                  ? `Selected: ${selectedMode.toUpperCase()} (${config.time} min limit)`
                  : 'Select an assessment mode card above'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLaunchTest}
              className="btn btn-primary"
              style={{ padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 700 }}
            >
              <Rocket size={18} />
              <span>Launch Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Previous Assessment Results Quick History */}
      {previousResults.length > 0 && (
        <div className="card" style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Award size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc' }}>
                Recent Assessments History
              </h3>
            </div>
            <button
              onClick={() => navigate('/results')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
            >
              View Full Breakdown
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {previousResults.slice(0, 3).map((res) => (
              <div
                key={res.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1.25rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid #1e293b',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    className="badge"
                    style={{
                      background: res.score >= 80 ? 'rgba(16, 185, 129, 0.2)' : res.score >= 60 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                      color: res.score >= 80 ? '#34d399' : res.score >= 60 ? '#fbbf24' : '#fb7185'
                    }}
                  >
                    {res.mode.toUpperCase()}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
                      Score: {res.score} / 100
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {new Date(res.submittedAt).toLocaleDateString()} at {new Date(res.submittedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                    {Math.floor(res.timeSpent / 60)}m {res.timeSpent % 60}s used
                  </span>
                  <button
                    onClick={() => navigate(`/results?id=${res.id}`)}
                    className="btn btn-secondary"
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
