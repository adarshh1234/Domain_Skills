import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer } from '../components/Timer';
import { questionsData } from '../data/questions';
import { ArchitectureQuestion } from '../types/question';
import { AssessmentSession } from '../types/session';
import { storageService } from '../services/storage';
import { assessmentService } from '../services/assessment';
import {
  Layers,
  Send,
  Sparkles,
  GitBranch,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

export const ArchitectureDesign: React.FC = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState<AssessmentSession>(() => {
    const existing = storageService.getSession();
    if (existing && existing.mode === 'architecture') {
      return existing;
    }
    const fallback: AssessmentSession = {
      id: `session-${Date.now()}`,
      mode: 'architecture',
      startedAt: Date.now(),
      duration: 30,
      currentQuestion: 0,
      answers: {
        selectedPattern: questionsData.architecture[0].patterns[0],
        diagram: questionsData.architecture[0].starterDiagram,
        justification: '',
        tradeOffs: ''
      },
      config: {
        domain: 'Backend & Distributed Systems',
        skills: ['Microservices', 'System Architecture'],
        difficulty: 'Intermediate',
        time: 30,
        allowCompile: true,
        aiHints: true,
        recordScreen: false,
        autoEval: true
      },
      status: 'active'
    };
    storageService.saveSession(fallback);
    return fallback;
  });

  const questionIndex = session.currentQuestion || 0;
  const currentQuestion: ArchitectureQuestion =
    questionsData.architecture[questionIndex] || questionsData.architecture[0];

  const [selectedPattern, setSelectedPattern] = useState<string>(() => {
    return (session.answers?.selectedPattern as string) || currentQuestion.patterns[0];
  });

  const [diagram, setDiagram] = useState<string>(() => {
    return (session.answers?.diagram as string) || currentQuestion.starterDiagram || '';
  });

  const [justification, setJustification] = useState<string>(() => {
    return (session.answers?.justification as string) || '';
  });

  const [tradeOffs, setTradeOffs] = useState<string>(() => {
    return (session.answers?.tradeOffs as string) || '';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autosave to localStorage
  const persistAnswers = useCallback((updates: Partial<{ selectedPattern: string; diagram: string; justification: string; tradeOffs: string }>) => {
    storageService.updateSession({
      answers: {
        selectedPattern,
        diagram,
        justification,
        tradeOffs,
        ...updates
      }
    });
  }, [selectedPattern, diagram, justification, tradeOffs]);

  const handlePatternSelect = (pattern: string) => {
    setSelectedPattern(pattern);
    persistAnswers({ selectedPattern: pattern });
  };

  const handleDiagramChange = (val: string) => {
    setDiagram(val);
    persistAnswers({ diagram: val });
  };

  const handleJustificationChange = (val: string) => {
    setJustification(val);
    persistAnswers({ justification: val });
  };

  const handleTradeOffsChange = (val: string) => {
    setTradeOffs(val);
    persistAnswers({ tradeOffs: val });
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answersPayload = {
      selectedPattern,
      diagram,
      justification,
      tradeOffs
    };

    storageService.updateSession({
      answers: answersPayload,
      status: 'submitted'
    });

    const active = storageService.getSession() || session;
    const finalResult = assessmentService.evaluateSession(
      {
        ...active,
        answers: answersPayload
      },
      questionsData
    );

    storageService.saveResult(finalResult);
    navigate(`/results?id=${finalResult.id}`);
  }, [selectedPattern, diagram, justification, tradeOffs, isSubmitting, session, navigate]);

  const handleTimerExpire = useCallback(() => {
    const answersPayload = {
      selectedPattern,
      diagram,
      justification,
      tradeOffs
    };

    storageService.updateSession({
      answers: answersPayload,
      status: 'expired'
    });

    const active = storageService.getSession() || session;
    const finalResult = assessmentService.evaluateSession(
      {
        ...active,
        answers: answersPayload,
        status: 'expired'
      },
      questionsData
    );

    storageService.saveResult(finalResult);
    navigate(`/results?id=${finalResult.id}`);
  }, [selectedPattern, diagram, justification, tradeOffs, session, navigate]);

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '0.875rem 1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
            <Layers size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Architecture Design:
              </span>
              <span className="badge badge-medium">{currentQuestion.difficulty}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              {currentQuestion.title}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Timer
            startedAt={session.startedAt}
            duration={session.duration}
            onExpire={handleTimerExpire}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-success"
            style={{ padding: '0.625rem 1.25rem' }}
          >
            <Send size={15} />
            <span>Submit Architecture</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Problem & Pattern Selection (Left) vs Diagram & Analysis (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 440px) 1fr',
          gap: '1.25rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Requirements & Pattern Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              System Objectives & Constraints
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
              {currentQuestion.description}
            </p>

            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Key Technical Requirements
            </h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {currentQuestion.requirements.map((req, i) => (
                <li key={i} style={{ color: '#cbd5e1' }}>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Pattern Selector */}
          <div className="card">
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitBranch size={16} color="#a78bfa" /> Select Core Architectural Pattern
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentQuestion.patterns.map((pat) => {
                const isSelected = selectedPattern === pat;
                return (
                  <div
                    key={pat}
                    onClick={() => handlePatternSelect(pat)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      border: `1px solid ${isSelected ? '#8b5cf6' : '#27354f'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isSelected ? '#c4b5fd' : '#cbd5e1' }}>
                      {pat}
                    </span>
                    {isSelected && <CheckCircle2 size={16} color="#a78bfa" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: ASCII Diagram, Justification, and Trade-offs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Architecture Topology Editor */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                System Architecture Topology (ASCII / Component Map)
              </label>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Monospace Topology
              </span>
            </div>
            <textarea
              className="form-textarea"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                minHeight: '260px',
                lineHeight: '1.45',
                whiteSpace: 'pre',
                background: '#090d16'
              }}
              value={diagram}
              onChange={(e) => handleDiagramChange(e.target.value)}
              placeholder="Design your component topology diagram here..."
            />
          </div>

          {/* Justification & Scaling Strategy */}
          <div className="card">
            <label className="form-label">
              Architecture Justification & Scalability Strategy
            </label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '130px' }}
              value={justification}
              onChange={(e) => handleJustificationChange(e.target.value)}
              placeholder="Explain how your architecture achieves low latency, high availability, database sharding, and resilience against failures..."
            />
          </div>

          {/* Trade-offs Analysis */}
          <div className="card">
            <label className="form-label">
              Engineering Trade-offs & Consistency vs Latency
            </label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '110px' }}
              value={tradeOffs}
              onChange={(e) => handleTradeOffsChange(e.target.value)}
              placeholder="Discuss trade-offs (e.g. CAP theorem considerations, cache invalidation complexities, operational maintenance costs)..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
