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
  ExternalLink,
  Layers,
  Terminal,
  Cpu,
  Bug,
  Database,
  ShieldAlert
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

    // Default to newest result
    if (history.length > 0) {
      setResult(history[0]);
    }
  }, [resultId]);

  if (!result) {
    return (
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: '1.25rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
          <BarChart2 size={32} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            No Assessment Results Found
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto' }}>
            You haven't completed any assessments yet, or previous session results were cleared. Start a new evaluation to view your performance breakdown.
          </p>
        </div>
        <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
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
        return <Terminal size={18} color="#3b82f6" />;
      case 'architecture':
        return <Layers size={18} color="#8b5cf6" />;
      case 'system':
        return <Cpu size={18} color="#06b6d4" />;
      case 'debugging':
        return <Bug size={18} color="#f59e0b" />;
      case 'database':
        return <Database size={18} color="#10b981" />;
      case 'security':
        return <ShieldAlert size={18} color="#f43f5e" />;
      default:
        return <Award size={18} color="#3b82f6" />;
    }
  };

  const minutesSpent = Math.floor(result.timeSpent / 60);
  const secondsSpent = result.timeSpent % 60;

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner & Status Header */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderRadius: '20px',
          background: isHighScorer
            ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)'
            : isPassed
            ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(136, 19, 55, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: `1px solid ${isHighScorer ? 'rgba(16, 185, 129, 0.3)' : isPassed ? 'rgba(59, 130, 246, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span
                className="badge"
                style={{
                  background: isHighScorer ? 'rgba(16, 185, 129, 0.2)' : isPassed ? 'rgba(59, 130, 246, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                  color: isHighScorer ? '#34d399' : isPassed ? '#60a5fa' : '#fb7185',
                  borderColor: isHighScorer ? '#10b981' : isPassed ? '#3b82f6' : '#f43f5e'
                }}
              >
                {result.status.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Calendar size={14} /> {new Date(result.submittedAt).toLocaleDateString()} at {new Date(result.submittedAt).toLocaleTimeString()}
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Assessment Evaluation Report
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', maxWidth: '640px' }}>
              {result.generalFeedback || 'Performance evaluation completed successfully.'}
            </p>
          </div>

          {/* Large Circular/Pill Score Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '1.25rem 2rem',
              borderRadius: '16px',
              border: '1px solid #1e293b'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Overall Score
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: isHighScorer ? '#34d399' : isPassed ? '#60a5fa' : '#fb7185' }}>
                {result.score}
                <span style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 600 }}> / 100</span>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid #27354f', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Mode: <strong style={{ color: '#f8fafc' }}>{result.mode.toUpperCase()}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Time Spent: <strong style={{ color: '#f8fafc' }}>{minutesSpent}m {secondsSpent}s</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
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
          gridTemplateColumns: 'minmax(360px, 1fr) 360px',
          gap: '1.5rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Skill Breakdown Rubric Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="#3b82f6" /> Deterministic Skill Breakdown
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              5 Rubric Evaluation Pillars
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {result.breakdown.map((item, idx) => {
              const percent = Math.round((item.score / item.maxScore) * 100);
              const barColor = percent >= 80 ? '#10b981' : percent >= 60 ? '#3b82f6' : percent >= 40 ? '#f59e0b' : '#f43f5e';

              return (
                <div key={idx} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: barColor }}>
                      {item.score} / {item.maxScore} pts ({percent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: '#090d16', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percent}%`,
                        background: barColor,
                        borderRadius: '9999px',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: '1.5' }}>
                    {item.feedback}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Candidate Submitted Answers Review (if present) */}
          {result.answersSummary && (
            <div className="card" style={{ marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} color="#60a5fa" /> Candidate Submission Snapshot
              </h4>

              {typeof result.answersSummary.code === 'string' && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Submitted Source Code:
                  </div>
                  <pre style={{ background: '#090d16', padding: '0.875rem', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', overflowX: 'auto', maxHeight: '200px' }}>
                    {result.answersSummary.code}
                  </pre>
                </div>
              )}

              {typeof result.answersSummary.selectedPattern === 'string' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                    Selected Pattern: <strong style={{ color: '#cbd5e1' }}>{result.answersSummary.selectedPattern}</strong>
                  </span>
                </div>
              )}

              {typeof result.answersSummary.justification === 'string' && result.answersSummary.justification.trim() !== '' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Architecture Justification:
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    {result.answersSummary.justification}
                  </p>
                </div>
              )}

              {typeof result.answersSummary.identifiedBugs === 'string' && result.answersSummary.identifiedBugs.trim() !== '' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Identified Bug Root Cause:
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>
                    {result.answersSummary.identifiedBugs}
                  </p>
                </div>
              )}

              {Array.isArray(result.answersSummary.selectedVulns) && (
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                    Identified Vulnerabilities: <strong style={{ color: '#fb7185' }}>{(result.answersSummary.selectedVulns as string[]).join(', ')}</strong>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Assessment Action & Historical Submissions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Actions */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc' }}>
              Next Steps
            </h4>
            <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>
              <RotateCcw size={15} /> Start Another Assessment
            </Link>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.8125rem' }}
            >
              Export / Print Result
            </button>
          </div>

          {/* Previous Results History from localStorage */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Clock size={16} color="#94a3b8" /> Prior Submissions
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {allResults.length} total
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '380px', overflowY: 'auto' }}>
              {allResults.map((r) => {
                const isCurrent = r.id === result.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/results?id=${r.id}`)}
                    style={{
                      padding: '0.625rem 0.75rem',
                      borderRadius: '8px',
                      background: isCurrent ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                      border: `1px solid ${isCurrent ? '#3b82f6' : '#1e293b'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getModeIcon(r.mode)}
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
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
                          fontSize: '0.875rem',
                          fontWeight: 700,
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
