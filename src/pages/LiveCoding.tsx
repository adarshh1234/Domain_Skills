import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import { Timer } from '../components/Timer';
import { questionsData } from '../data/questions';
import { CodingQuestion } from '../types/question';
import { AssessmentSession } from '../types/session';
import { storageService } from '../services/storage';
import { assessmentService, executeCodeSafely, CodeExecutionResult } from '../services/assessment';
import {
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';

export const LiveCoding: React.FC = () => {
  const navigate = useNavigate();

  // Load session or initialize fallback
  const [session, setSession] = useState<AssessmentSession>(() => {
    const existing = storageService.getSession();
    if (existing && existing.mode === 'coding') {
      return existing;
    }
    // Create default fallback session
    const fallback: AssessmentSession = {
      id: `session-${Date.now()}`,
      mode: 'coding',
      startedAt: Date.now(),
      duration: 30,
      currentQuestion: 0,
      answers: { code: questionsData.coding[0].starterCode },
      config: {
        domain: 'Frontend Engineering',
        skills: ['React', 'Algorithms'],
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
  const currentQuestion: CodingQuestion =
    questionsData.coding[questionIndex] || questionsData.coding[0];

  const [code, setCode] = useState<string>(() => {
    return (session.answers?.code as string) || currentQuestion.starterCode;
  });

  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'tests' | 'examples' | 'hints'>('tests');

  // Autosave code changes to localStorage
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    storageService.updateSession({
      answers: { code: newCode }
    });
  }, []);

  const handleResetCode = () => {
    const defaultStarter = currentQuestion.starterCode;
    setCode(defaultStarter);
    storageService.updateSession({
      answers: { code: defaultStarter }
    });
  };

  const handleQuestionChange = (index: number) => {
    const targetQ = questionsData.coding[index];
    if (!targetQ) return;
    const newAnswers = { code: targetQ.starterCode };
    setCode(targetQ.starterCode);
    setExecutionResult(null);
    const updated = storageService.updateSession({
      currentQuestion: index,
      answers: newAnswers
    });
    if (updated) setSession(updated);
  };

  // Run test cases locally
  const handleRunCode = () => {
    setIsRunning(true);
    // Slight timeout to ensure UI updates run state
    setTimeout(() => {
      const funcName = currentQuestion.id === 1 ? 'twoSum' : 'LRUCache';
      if (currentQuestion.id === 1) {
        const result = executeCodeSafely(code, funcName, currentQuestion.testCases);
        setExecutionResult(result);
      } else {
        // Run test evaluation for LRUCache
        try {
          const wrapped = `
            "use strict";
            ${code}
            return LRUCache;
          `;
          const factory = new Function(wrapped);
          const LRUCacheClass = factory();
          const tc = currentQuestion.testCases[0];
          const methods = tc.input[0] as string[];
          const args = tc.input[1] as any[][];
          let instance: any = null;
          const actualOutput: any[] = [];

          methods.forEach((m, idx) => {
            if (m === 'LRUCache') {
              instance = new LRUCacheClass(...args[idx]);
              actualOutput.push(null);
            } else if (m === 'put') {
              instance.put(args[idx][0], args[idx][1]);
              actualOutput.push(null);
            } else if (m === 'get') {
              const res = instance.get(args[idx][0]);
              actualOutput.push(res);
            }
          });

          const passed = JSON.stringify(actualOutput) === JSON.stringify(tc.expected);
          setExecutionResult({
            allPassed: passed,
            passedTests: passed ? 1 : 0,
            totalTests: 1,
            results: [
              {
                testIndex: 1,
                passed,
                input: tc.input,
                expected: tc.expected,
                actual: actualOutput
              }
            ]
          });
        } catch (err: any) {
          setExecutionResult({
            allPassed: false,
            passedTests: 0,
            totalTests: 1,
            results: [],
            runtimeError: err?.message || 'LRUCache execution error'
          });
        }
      }
      setIsRunning(false);
    }, 100);
  };

  // Submit assessment and evaluate locally
  const handleSubmitAssessment = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Save final code answer
    storageService.updateSession({
      answers: { code },
      status: 'submitted'
    });

    const active = storageService.getSession() || session;
    const finalResult = assessmentService.evaluateSession(
      {
        ...active,
        answers: { code }
      },
      questionsData
    );

    // Persist result
    storageService.saveResult(finalResult);
    // Mark session completed
    storageService.updateSession({ status: 'submitted' });

    navigate(`/results?id=${finalResult.id}`);
  }, [code, isSubmitting, navigate, session]);

  // Persistent Timer Expiration Handler
  const handleTimerExpire = useCallback(() => {
    storageService.updateSession({
      answers: { code },
      status: 'expired'
    });

    const active = storageService.getSession() || session;
    const finalResult = assessmentService.evaluateSession(
      {
        ...active,
        answers: { code },
        status: 'expired'
      },
      questionsData
    );

    storageService.saveResult(finalResult);
    navigate(`/results?id=${finalResult.id}`);
  }, [code, navigate, session]);

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Bar: Problem Title, Question Switcher, and Timer */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Question {questionIndex + 1} of {questionsData.coding.length}:
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              {currentQuestion.title}
            </h2>
            <span
              className={`badge ${
                currentQuestion.difficulty === 'Easy'
                  ? 'badge-easy'
                  : currentQuestion.difficulty === 'Medium'
                  ? 'badge-medium'
                  : 'badge-hard'
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question Switcher */}
          <div style={{ display: 'flex', gap: '0.25rem', background: '#0f172a', padding: '0.25rem', borderRadius: '8px' }}>
            {questionsData.coding.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => handleQuestionChange(idx)}
                style={{
                  padding: '0.25rem 0.625rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  background: questionIndex === idx ? '#3b82f6' : 'transparent',
                  color: questionIndex === idx ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                Q{idx + 1}
              </button>
            ))}
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
            onClick={handleSubmitAssessment}
            disabled={isSubmitting}
            className="btn btn-success"
            style={{ padding: '0.625rem 1.25rem' }}
          >
            <Send size={15} />
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Main Split: Problem Description (Left) & Editor + Runner (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 460px) 1fr',
          gap: '1.25rem',
          alignItems: 'stretch'
        }}
      >
        {/* Left Column: Problem Details */}
        <div
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxHeight: 'calc(100vh - 180px)',
            overflowY: 'auto'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
              Description
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {currentQuestion.description}
            </p>
          </div>

          {/* Examples */}
          {currentQuestion.examples && currentQuestion.examples.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                Examples
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentQuestion.examples.map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-card)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <div><span style={{ color: '#94a3b8' }}>Input:</span> {ex.input}</div>
                    <div><span style={{ color: '#94a3b8' }}>Output:</span> {ex.output}</div>
                    {ex.explanation && (
                      <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: 'var(--font-sans)' }}>
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constraints */}
          {currentQuestion.constraints && (
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                Constraints
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {currentQuestion.constraints.map((c, i) => (
                  <li key={i}>
                    <code style={{ color: '#e2e8f0', background: '#1e293b', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                      {c}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Execution Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CodeEditor
            code={code}
            onChange={handleCodeChange}
            onReset={handleResetCode}
            language="javascript"
            minHeight="420px"
          />

          {/* Execution Controls & Test Case Results Panel */}
          <div className="card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
                >
                  <Play size={14} />
                  <span>{isRunning ? 'Running Tests...' : 'Run Test Cases'}</span>
                </button>

                {executionResult && (
                  <span
                    className="badge"
                    style={{
                      background: executionResult.allPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                      color: executionResult.allPassed ? '#34d399' : '#fb7185'
                    }}
                  >
                    {executionResult.passedTests} / {executionResult.totalTests} Passed
                  </span>
                )}
              </div>

              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Evaluated client-side in sandboxed JavaScript engine
              </span>
            </div>

            {/* Test Results Output Display */}
            {executionResult && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {executionResult.runtimeError && (
                  <div
                    style={{
                      background: 'rgba(244, 63, 94, 0.1)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#fb7185',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <AlertCircle size={16} />
                    <span><strong>Runtime Error:</strong> {executionResult.runtimeError}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.5rem' }}>
                  {executionResult.results.map((res) => (
                    <div
                      key={res.testIndex}
                      style={{
                        background: res.passed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                        border: `1px solid ${res.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                        borderRadius: '8px',
                        padding: '0.625rem 0.875rem',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                          Test Case #{res.testIndex}
                        </span>
                        {res.passed ? (
                          <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <CheckCircle size={13} /> Passed
                          </span>
                        ) : (
                          <span style={{ color: '#fb7185', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <XCircle size={13} /> Failed
                          </span>
                        )}
                      </div>

                      <div style={{ color: '#94a3b8' }}>
                        Input: <code>{JSON.stringify(res.input)}</code>
                      </div>
                      <div style={{ color: '#94a3b8' }}>
                        Expected: <code style={{ color: '#34d399' }}>{JSON.stringify(res.expected)}</code>
                      </div>
                      <div style={{ color: '#94a3b8' }}>
                        Actual: <code style={{ color: res.passed ? '#34d399' : '#fb7185' }}>{JSON.stringify(res.actual)}</code>
                      </div>
                      {res.error && (
                        <div style={{ color: '#fb7185', marginTop: '0.25rem' }}>
                          Error: {res.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
