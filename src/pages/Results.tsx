import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { AssessmentResult } from '../types/result';
import {
  Award,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  RotateCcw,
  BarChart2,
  ChevronRight,
  TrendingUp,
  FileText,
  Printer,
  Layers,
  Terminal,
  Cpu,
  Bug,
  Database,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resultId = searchParams.get('id') || undefined;

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [allResults, setAllResults] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    const history = storageService.getResults();
    setAllResults(history);

    if (resultId) {
      const matched = history.find((r) => r.id === resultId || r.sessionId === resultId);
      if (matched) {
        setResult(matched);
        return;
      }
    }

    if (history.length > 0) {
      setResult(history[0]);
    }
  }, [resultId]);

  if (!result) {
    return (
      <div
        className="main-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          gap: '1.25rem'
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
          }}
        >
          <BarChart2 size={34} strokeWidth={2.2} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            No Assessment Results Found
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
            You haven't completed any assessments yet, or previous session results were cleared. Start a new evaluation to view your performance breakdown.
          </p>
        </div>
        <Link to="/" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', borderRadius: '12px' }}>
          Launch an Assessment
        </Link>
      </div>
    );
  }

  const isPassed = result.score >= 60;
  const isHighScorer = result.score >= 80;

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'coding':
        return <Terminal size={17} color="#3b82f6" strokeWidth={2.2} />;
      case 'architecture':
        return <Layers size={17} color="#8b5cf6" strokeWidth={2.2} />;
      case 'system':
        return <Cpu size={17} color="#06b6d4" strokeWidth={2.2} />;
      case 'debugging':
        return <Bug size={17} color="#f59e0b" strokeWidth={2.2} />;
      case 'database':
        return <Database size={17} color="#10b981" strokeWidth={2.2} />;
      case 'security':
        return <ShieldAlert size={17} color="#f43f5e" strokeWidth={2.2} />;
      default:
        return <Award size={17} color="#3b82f6" strokeWidth={2.2} />;
    }
  };

  const minutesSpent = Math.floor(result.timeSpent / 60);
  const secondsSpent = result.timeSpent % 60;

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner & Status Header */}
      <div
        className="animate-fade-in"
        style={{
          padding: '2.25rem 2.5rem',
          borderRadius: '24px',
          background: isHighScorer
            ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(13, 20, 34, 0.95) 70%, rgba(16, 185, 129, 0.08) 100%)'
            : isPassed
            ? 'linear-gradient(135deg, rgba(20, 45, 95, 0.45) 0%, rgba(13, 20, 34, 0.95) 70%, rgba(59, 130, 246, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(110, 15, 45, 0.4) 0%, rgba(13, 20, 34, 0.95) 70%, rgba(244, 63, 94, 0.08) 100%)',
          border: `1px solid ${
            isHighScorer ? 'rgba(16, 185, 129, 0.35)' : isPassed ? 'rgba(59, 130, 246, 0.35)' : 'rgba(244, 63, 94, 0.35)'
          }`,
          boxShadow: isHighScorer
            ? '0 20px 45px -10px rgba(0, 0, 0, 0.75), 0 0 35px rgba(16, 185, 129, 0.12)'
            : isPassed
            ? '0 20px 45px -10px rgba(0, 0, 0, 0.75), 0 0 35px rgba(59, 130, 246, 0.12)'
            : '0 20px 45px -10px rgba(0, 0, 0, 0.75), 0 0 35px rgba(244, 63, 94, 0.12)',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.75rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
              <span
                className="badge"
                style={{
                  background: isHighScorer ? 'rgba(16, 185, 129, 0.18)' : isPassed ? 'rgba(59, 130, 246, 0.18)' : 'rgba(244, 63, 94, 0.18)',
                  color: isHighScorer ? '#34d399' : isPassed ? '#60a5fa' : '#fb7185',
                  borderColor: isHighScorer ? 'rgba(16, 185, 129, 0.45)' : isPassed ? 'rgba(59, 130, 246, 0.45)' : 'rgba(244, 63, 94, 0.45)',
                  boxShadow: `0 0 12px ${isHighScorer ? 'rgba(16, 185, 129, 0.25)' : isPassed ? 'rgba(59, 130, 246, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`
                }}
              >
                {result.status.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Calendar size={14} /> {new Date(result.submittedAt).toLocaleDateString()} at {new Date(result.submittedAt).toLocaleTimeString()}
              </span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.025em', marginBottom: '0.625rem' }}>
              Assessment Evaluation Report
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.975rem', lineHeight: 1.6 }}>
              {result.generalFeedback || 'Performance evaluation completed successfully.'}
            </p>
          </div>

          {/* Large Circular/Pill Score Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
              background: 'rgba(11, 16, 28, 0.85)',
              padding: '1.5rem 2.25rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Overall Score
              </div>
              <div style={{ fontSize: '3.25rem', fontWeight: 900, lineHeight: 1, color: isHighScorer ? '#34d399' : isPassed ? '#60a5fa' : '#fb7185' }}>
                {result.score}
                <span style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 600 }}> / 100</span>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ fontSize: '0.785rem', color: '#94a3b8' }}>
                Mode: <strong style={{ color: '#f8fafc' }}>{result.mode.toUpperCase()}</strong>
              </div>
              <div style={{ fontSize: '0.785rem', color: '#94a3b8' }}>
                Time Spent: <strong style={{ color: '#f8fafc' }}>{minutesSpent}m {secondsSpent}s</strong>
              </div>
              <div style={{ fontSize: '0.785rem', color: '#94a3b8' }}>
                Allocated: <strong style={{ color: '#f8fafc' }}>{result.totalDuration || 30}m</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Score Breakdown (Left) vs Summary & Answers (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(360px, 1fr) 380px',
          gap: '1.75rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Skill Breakdown Rubric Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.02em' }}>
              <TrendingUp size={20} color="#60a5fa" /> Deterministic Skill Breakdown
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.04)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
              5 Rubric Evaluation Pillars
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {result.breakdown.map((item, idx) => {
              const percent = Math.round((item.score / item.maxScore) * 100);
              const barColor = percent >= 80 ? '#10b981' : percent >= 60 ? '#3b82f6' : percent >= 40 ? '#f59e0b' : '#f43f5e';
              const gradientBar = percent >= 80
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : percent >= 60
                ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                : percent >= 40
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #f43f5e, #fb7185)';

              return (
                <div key={idx} className="card" style={{ padding: '1.25rem 1.35rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(15, 21, 35, 0.85)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: barColor }}>
                      {item.score} / {item.maxScore} pts ({percent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: 'rgba(0, 0, 0, 0.45)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percent}%`,
                        background: gradientBar,
                        borderRadius: '9999px',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: `0 0 8px ${barColor}`
                      }}
                    />
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.55 }}>
                    {item.feedback}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Candidate Submitted Answers Review (if present) */}
          {result.answersSummary && (
            <div className="card" style={{ marginTop: '0.5rem', background: 'rgba(15, 21, 35, 0.85)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={17} color="#60a5fa" /> Candidate Submission Snapshot
              </h4>

              {typeof result.answersSummary.code === 'string' && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Submitted Source Code:
                  </div>
                  <pre style={{ background: '#080c14', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.07)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', overflowX: 'auto', maxHeight: '200px', lineHeight: 1.5 }}>
                    {result.answersSummary.code}
                  </pre>
                </div>
              )}

              {typeof result.answersSummary.selectedPattern === 'string' && (
                <div style={{ marginTop: '0.625rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                    Selected Pattern: <strong style={{ color: '#cbd5e1' }}>{result.answersSummary.selectedPattern}</strong>
                  </span>
                </div>
              )}

              {typeof result.answersSummary.justification === 'string' && result.answersSummary.justification.trim() !== '' && (
                <div style={{ marginTop: '0.625rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Architecture Justification:
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: '1.55' }}>
                    {result.answersSummary.justification}
                  </p>
                </div>
              )}

              {typeof result.answersSummary.identifiedBugs === 'string' && result.answersSummary.identifiedBugs.trim() !== '' && (
                <div style={{ marginTop: '0.625rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Identified Bug Root Cause:
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: '1.55' }}>
                    {result.answersSummary.identifiedBugs}
                  </p>
                </div>
              )}

              {Array.isArray(result.answersSummary.selectedVulns) && (
                <div style={{ marginTop: '0.625rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                    Identified Vulnerabilities: <strong style={{ color: '#fb7185' }}>{(result.answersSummary.selectedVulns as string[]).join(', ')}</strong>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Assessment Action & Historical Submissions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Actions */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', background: 'rgba(15, 21, 35, 0.85)' }}>
            <h4 style={{ fontSize: '0.975rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
              Next Steps
            </h4>
            <Link to="/" className="btn btn-primary" style={{ width: '100%', borderRadius: '10px' }}>
              <RotateCcw size={15} /> Start Another Assessment
            </Link>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.8125rem', borderRadius: '10px' }}
            >
              <Printer size={14} /> Export / Print Result
            </button>
          </div>

          {/* Previous Results History from localStorage */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', background: 'rgba(15, 21, 35, 0.85)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.975rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Clock size={16} color="#60a5fa" /> Prior Submissions
              </h4>
              <span style={{ fontSize: '0.725rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.12)', padding: '0.125rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                {allResults.length} total
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '420px', overflowY: 'auto' }}>
              {allResults.map((r) => {
                const isCurrent = r.id === result.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/results?id=${r.id}`)}
                    style={{
                      padding: '0.75rem 0.875rem',
                      borderRadius: '10px',
                      background: isCurrent ? 'rgba(59, 130, 246, 0.15)' : 'rgba(11, 16, 28, 0.7)',
                      border: `1px solid ${isCurrent ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.06)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.18s ease-out'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                        e.currentTarget.style.background = 'rgba(18, 25, 44, 0.9)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.background = 'rgba(11, 16, 28, 0.7)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {getModeIcon(r.mode)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f8fafc' }}>
                          {r.mode.toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                          {new Date(r.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 800,
                          color: r.score >= 80 ? '#34d399' : r.score >= 60 ? '#60a5fa' : '#fb7185'
                        }}
                      >
                        {r.score}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                        {Math.floor(r.timeSpent / 60)}m {r.timeSpent % 60}s
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
