import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Target,
  Layers,
  Code2,
  Cpu,
  ShieldCheck,
  Check
} from 'lucide-react';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingStepper } from '../../components/onboarding/OnboardingStepper';
import { SkillRadarChart } from '../../components/onboarding/SkillRadarChart';
import { mlService } from '../../services/mlService';
import { onboardingService } from '../../services/onboardingService';
import {
  SkillAnalysis,
  CandidateProfile,
  OnboardingProgress
} from '../../types/onboarding';

export const MLAnalysis: React.FC = () => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [analysis, setAnalysis] = useState<SkillAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolledMap, setEnrolledMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cand, prog, mlData] = await Promise.all([
          onboardingService.getCandidate(),
          onboardingService.getProgress(),
          mlService.getSkillAnalysis()
        ]);
        setCandidate(cand);
        setProgress(prog);
        setAnalysis(mlData);

        const initialMap: Record<string, boolean> = {};
        mlData.recommendations.forEach((r) => {
          initialMap[r.id] = !!r.isEnrolled;
        });
        setEnrolledMap(initialMap);
      } catch (err) {
        console.error('Failed to load ML analysis', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEnroll = async (courseId: string) => {
    await mlService.enrollInCourse(courseId);
    setEnrolledMap((prev) => ({ ...prev, [courseId]: true }));
  };

  return (
    <div className="main-content">
      <OnboardingHeader candidate={candidate} progress={progress} />
      <OnboardingStepper progress={progress} />

      {/* Top Section: Overview Key Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {/* Metric 1 */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 22, 44, 0.9) 0%, rgba(10, 16, 32, 0.95) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            ML Evaluated Performance
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#3b82f6', letterSpacing: '-0.03em' }}>
              {analysis?.performanceScore || 87}%
            </span>
            <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 700 }}>Top 8% Cohort</span>
          </div>
          <p style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.35rem' }}>
            Aggregated from algorithmic & systems assessment telemetry
          </p>
        </div>

        {/* Metric 2 */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 22, 44, 0.9) 0%, rgba(10, 16, 32, 0.95) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            Role Fit Index (L5 Senior)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#8b5cf6', letterSpacing: '-0.03em' }}>
              {analysis?.roleFitPercentage || 92}%
            </span>
            <span style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 700 }}>Strong Fit</span>
          </div>
          <p style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.35rem' }}>
            Matched against Core AI Platform team requirements
          </p>
        </div>

        {/* Metric 3 */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 22, 44, 0.9) 0%, rgba(10, 16, 32, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            Predicted Tenure Horizon
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#10b981', letterSpacing: '-0.03em' }}>
              {analysis?.predictedTenureYears || 4.2}y
            </span>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>High Stability</span>
          </div>
          <p style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.35rem' }}>
            Tenure longevity model based on role alignment & growth vector
          </p>
        </div>

        {/* Metric 4 */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 22, 44, 0.9) 0%, rgba(10, 16, 32, 0.95) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            AI Confidence Calibration
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '-0.03em' }}>
              {analysis?.aiConfidencePercentage || 94}%
            </span>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>High Signal</span>
          </div>
          <p style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.35rem' }}>
            Multi-source vector confidence score
          </p>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Skill Gap Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Left Column: Skill Radar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                <BrainCircuit size={18} color="#60a5fa" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                  Multi-Dimensional Skill Radar
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Candidate vs L5 Target Standard vs Enterprise Benchmark
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: '380px' }}>
            {analysis?.radarData && <SkillRadarChart data={analysis.radarData} />}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.75rem',
              color: '#94a3b8'
            }}
          >
            <span>Strongest: Python / C++ (92%), ML Pipelines (90%)</span>
            <Link to="/coding" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 700 }}>
              Recalibrate via Live Lab →
            </Link>
          </div>
        </div>

        {/* Right Column: Skill Gap Detection & Remediation */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(244, 63, 94, 0.3)'
                }}
              >
                <Target size={18} color="#fb7185" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                  Competency Gap Detection Matrix
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Identified growth vectors for Day-1 to Day-90 ramp-up
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
            {analysis?.skillGaps.map((gap, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.9rem 1.1rem',
                  borderRadius: '12px',
                  background: 'rgba(10, 15, 28, 0.75)',
                  border:
                    gap.priority === 'High'
                      ? '1px solid rgba(244, 63, 94, 0.3)'
                      : gap.priority === 'Medium'
                      ? '1px solid rgba(245, 158, 11, 0.3)'
                      : '1px solid rgba(59, 130, 246, 0.25)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                    {gap.skill}
                  </div>
                  <span
                    style={{
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      background:
                        gap.priority === 'High'
                          ? 'rgba(244, 63, 94, 0.15)'
                          : gap.priority === 'Medium'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(59, 130, 246, 0.15)',
                      color:
                        gap.priority === 'High'
                          ? '#fb7185'
                          : gap.priority === 'Medium'
                          ? '#fbbf24'
                          : '#93c5fd',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {gap.priority} Priority · Gap: {gap.gap}%
                  </span>
                </div>

                {/* Progress Comparison Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${gap.currentLevel}%`,
                        height: '100%',
                        background: '#3b82f6',
                        borderRadius: '9999px'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.725rem', color: '#94a3b8', minWidth: '85px', textAlign: 'right' }}>
                    {gap.currentLevel}% / {gap.requiredLevel}% req
                  </span>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {gap.actionablePlan}
                </p>

                {gap.relatedAssessmentTrack && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link
                      to={gap.relatedAssessmentTrack}
                      style={{
                        fontSize: '0.725rem',
                        color: '#60a5fa',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <span>Take Domain Track Challenge</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Path Roadmap Progression */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}
          >
            <TrendingUp size={18} color="#a78bfa" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Individual Career Progression Roadmap
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              ML Systems Engineering track from L5 Senior Staff to L7 Principal Fellow
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            position: 'relative'
          }}
        >
          {analysis?.careerPath.map((step, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background: step.isCurrent
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(139, 92, 246, 0.18) 100%)'
                  : 'rgba(11, 16, 28, 0.7)',
                border: step.isCurrent
                  ? '1px solid rgba(59, 130, 246, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: step.isCurrent ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: step.isCurrent ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                    color: step.isCurrent ? '#93c5fd' : '#94a3b8'
                  }}
                >
                  {step.level}
                </span>
                <span style={{ fontSize: '0.725rem', color: '#64748b' }}>{step.timeframe}</span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                {step.title}
              </h4>

              <p style={{ fontSize: '0.785rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                {step.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {step.keySkills.map((sk, skIdx) => (
                  <span
                    key={skIdx}
                    style={{
                      fontSize: '0.675rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#93c5fd',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Learning Courses */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <BookOpen size={18} color="#34d399" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Curated Upskilling & Learning Recommendations
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Personalized technical courses matched to detected competency gaps
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}
        >
          {analysis?.recommendations.map((rec) => {
            const isEnrolled = enrolledMap[rec.id];

            return (
              <div
                key={rec.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: '14px',
                  background: 'rgba(10, 15, 28, 0.75)',
                  border: isEnrolled ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 600 }}>
                      {rec.provider}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: '#34d399',
                        background: 'rgba(16, 185, 129, 0.12)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(16, 185, 129, 0.25)'
                      }}
                    >
                      {rec.matchScore}% Match
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                    {rec.title}
                  </h4>

                  <div style={{ fontSize: '0.725rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    {rec.duration} · {rec.difficulty}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {rec.skillsCovered.map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.675rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#cbd5e1'
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button
                    onClick={() => handleEnroll(rec.id)}
                    disabled={isEnrolled}
                    className={isEnrolled ? 'btn btn-success' : 'btn btn-primary'}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.775rem', width: '100%' }}
                  >
                    {isEnrolled ? (
                      <>
                        <Check size={14} />
                        <span>Enrolled in Course</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={14} />
                        <span>Enroll in Academy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
