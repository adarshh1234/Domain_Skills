import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import { Timer } from '../components/Timer';
import { questionsData } from '../data/questions';
import { DebuggingQuestion } from '../types/question';
import { AssessmentSession } from '../types/session';
import { storageService } from '../services/storage';
import { assessmentService } from '../services/assessment';
import {
  Bug,
  Send,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

export const Debugging: React.FC = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState<AssessmentSession>(() => {
    const existing = storageService.getSession();
    if (existing && existing.mode === 'debugging') {
      return existing;
    }
    const fallback: AssessmentSession = {
      id: `session-${Date.now()}`,
      mode: 'debugging',
      startedAt: Date.now(),
      duration: 30,
      currentQuestion: 0,
      answers: {
        fixedCode: questionsData.debugging[0].starterCode,
        identifiedBugs: ''
      },
      config: {
        domain: 'Frontend Engineering',
        skills: ['React Hooks', 'Performance & Memory'],
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
  const currentQuestion: DebuggingQuestion =
    questionsData.debugging[questionIndex] || questionsData.debugging[0];

  const [fixedCode, setFixedCode] = useState<string>(() => {
    return (session.answers?.fixedCode as string) || currentQuestion.starterCode;
  });

  const [identifiedBugs, setIdentifiedBugs] = useState<string>(() => {
    return (session.answers?.identifiedBugs as string) || '';
  });

  const [openHintIndex, setOpenHintIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFixedCodeChange = useCallback((newCode: string) => {
    setFixedCode(newCode);
    storageService.updateSession({
      answers: {
        fixedCode: newCode,
        identifiedBugs
      }
    });
  }, [identifiedBugs]);

  const handleBugsChange = (val: string) => {
    setIdentifiedBugs(val);
    storageService.updateSession({
      answers: {
        fixedCode,
        identifiedBugs: val
      }
    });
  };

  const handleReset = () => {
    setFixedCode(currentQuestion.starterCode);
    storageService.updateSession({
      answers: {
        fixedCode: currentQuestion.starterCode,
        identifiedBugs
      }
    });
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answersPayload = {
      fixedCode,
      identifiedBugs
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
  }, [fixedCode, identifiedBugs, isSubmitting, session, navigate]);

  const handleTimerExpire = useCallback(() => {
    const answersPayload = {
      fixedCode,
      identifiedBugs
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
  }, [fixedCode, identifiedBugs, session, navigate]);

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Bar */}
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
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Bug size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Debugging Lab:
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
            <span>Submit Fix</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Problem & Buggy Code (Left) vs Fix Editor & Diagnosis (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 460px) 1fr',
          gap: '1.25rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Context, Buggy Code View, Hints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Incident Summary & User Report
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
              {currentQuestion.description}
            </p>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.8125rem',
                color: '#fcd34d',
                marginBottom: '1rem'
              }}
            >
              <strong>Expected Behavior:</strong> {currentQuestion.expectedBehavior}
            </div>

            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Original Insecure / Buggy Snippet
            </h4>
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <pre
                style={{
                  background: '#090d16',
                  padding: '0.875rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#fb7185',
                  overflowX: 'auto',
                  lineHeight: '1.45'
                }}
              >
                {currentQuestion.buggyCode}
              </pre>
            </div>
          </div>

          {/* Progressive Hints Accordion */}
          <div className="card">
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={16} color="#60a5fa" /> Progressive Investigation Hints
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentQuestion.hints.map((hint, idx) => {
                const isOpen = openHintIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: 'rgba(15, 23, 42, 0.5)'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenHintIndex(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <span>Hint {idx + 1}</span>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0.75rem 0.875rem', fontSize: '0.8125rem', color: '#cbd5e1', borderTop: '1px solid #1e293b', background: 'rgba(59, 130, 246, 0.05)' }}>
                        {hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Root Cause Diagnosis & Code Fix Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Bug Identification Input */}
          <div className="card">
            <label className="form-label" style={{ fontSize: '0.9375rem', color: '#f8fafc' }}>
              Root Cause Diagnosis & Bug Identification <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              Explain precisely why the memory leak occurs and why the garbage collector cannot reclaim memory.
            </p>
            <textarea
              className="form-textarea"
              style={{ minHeight: '90px' }}
              value={identifiedBugs}
              onChange={(e) => handleBugsChange(e.target.value)}
              placeholder="e.g., Missing return cleanup in useEffect. The setInterval keeps ticking and retains closures on previous state, creating orphaned intervals whenever deviceId changes..."
            />
          </div>

          {/* Fixed Code Editor */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0, fontSize: '0.9375rem', color: '#f8fafc' }}>
                Refactored & Fixed Code Implementation
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}
              >
                <RotateCcw size={12} /> Reset to Starter
              </button>
            </div>

            <CodeEditor
              code={fixedCode}
              onChange={handleFixedCodeChange}
              language="javascript"
              minHeight="400px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
