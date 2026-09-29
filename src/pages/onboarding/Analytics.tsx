import React, { useState, useEffect } from 'react';
import {
  PieChart,
  TrendingUp,
  Users,
  Clock,
  Award,
  Sparkles,
  BarChart3,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Building,
  CheckCircle2
} from 'lucide-react';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingStepper } from '../../components/onboarding/OnboardingStepper';
import {
  MonthlyTrendChart,
  SkillDistributionChart,
  HiringFunnelChart
} from '../../components/onboarding/AnalyticsCharts';
import { analyticsService } from '../../services/analyticsService';
import { onboardingService } from '../../services/onboardingService';
import {
  AnalyticsData,
  CandidateProfile,
  OnboardingProgress
} from '../../types/onboarding';

export const Analytics: React.FC = () => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [timeRange, setTimeRange] = useState<string>('Last 12 Months');
  const [loading, setLoading] = useState(true);

  const loadData = async (dept?: string) => {
    setLoading(true);
    try {
      const [cand, prog, analyticsData] = await Promise.all([
        onboardingService.getCandidate(),
        onboardingService.getProgress(),
        analyticsService.getAnalytics(dept || selectedDept, timeRange)
      ]);
      setCandidate(cand);
      setProgress(prog);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeptChange = (dept: string) => {
    setSelectedDept(dept);
    loadData(dept);
  };

  return (
    <div className="main-content">
      <OnboardingHeader candidate={candidate} progress={progress} />
      <OnboardingStepper progress={progress} />

      {/* Filter and Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Enterprise Talent Analytics & Big Data
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Real-time telemetry across recruitment funnels, ramp-up velocities, and skills distributions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => handleDeptChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '220px', padding: '0.5rem 2rem 0.5rem 0.85rem', fontSize: '0.8rem' }}
          >
            <option value="All Departments">All Engineering Departments</option>
            <option value="Core AI Platform & Infrastructure">Core AI Platform</option>
            <option value="Data Platform & Petabyte Streaming">Data Platform</option>
            <option value="Cloud Security & Infrastructure">Cloud Security</option>
            <option value="Enterprise Applications & UI/UX">Enterprise Apps</option>
          </select>

          {/* Time Range Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px', padding: '0.5rem 2rem 0.5rem 0.85rem', fontSize: '0.8rem' }}
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
            <option value="Last 12 Months">Last 12 Months</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Stat Cards (5 Cards) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {analytics?.kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginTop: '0.25rem' }}>
                {kpi.value}
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.725rem' }}>
              <span
                style={{
                  color: kpi.isPositive ? '#34d399' : '#fb7185',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                {kpi.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {kpi.change}
              </span>
              <span style={{ color: '#64748b' }}>{kpi.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid: 12-Month Trends + Skills Doughnut */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Monthly Hiring Trends */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
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
                <TrendingUp size={18} color="#60a5fa" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  12-Month Engineering Hiring Trends
                </h3>
                <p style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                  Accepted Hires vs Offers Extended vs Target OKR
                </p>
              </div>
            </div>
          </div>

          {analytics?.monthlyTrends && <MonthlyTrendChart data={analytics.monthlyTrends} />}
        </div>

        {/* Skills Distribution Doughnut */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
                <PieChart size={18} color="#a78bfa" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  Technical Domain Distribution
                </h3>
                <p style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                  Headcount breakdown by engineering specialization
                </p>
              </div>
            </div>
          </div>

          {analytics?.skillDistribution && <SkillDistributionChart data={analytics.skillDistribution} />}
        </div>
      </div>

      {/* Hiring Funnel & Drop-off Telemetry */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}
          >
            <BarChart3 size={18} color="#22d3ee" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Full-Cycle Recruitment & Onboarding Funnel
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Conversion velocity from application intake to completed day-1 verification
            </p>
          </div>
        </div>

        {analytics?.funnel && <HiringFunnelChart funnel={analytics.funnel} />}
      </div>

      {/* AI-Powered Talent Insights Cards */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(139, 92, 246, 0.4)'
            }}
          >
            <Sparkles size={18} color="#c4b5fd" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              AI Automated Talent Intelligence & Optimization Alerts
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Continuous algorithmic telemetry identifying bottlenecks and acceleration opportunities
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
          {analytics?.aiInsights.map((insight) => (
            <div
              key={insight.id}
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background: 'rgba(10, 15, 28, 0.8)',
                border:
                  insight.severity === 'warning'
                    ? '1px solid rgba(245, 158, 11, 0.3)'
                    : insight.severity === 'success'
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid rgba(59, 130, 246, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#93c5fd'
                    }}
                  >
                    {insight.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      color: insight.severity === 'warning' ? '#fbbf24' : '#34d399'
                    }}
                  >
                    {insight.metric}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', lineHeight: 1.35 }}>
                  {insight.title}
                </h4>

                <p style={{ fontSize: '0.785rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                  {insight.description}
                </p>
              </div>

              <div
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(255, 255, 255, 0.08)',
                  fontSize: '0.725rem',
                  color: '#94a3b8'
                }}
              >
                <strong style={{ color: '#38bdf8' }}>Action: </strong>
                {insight.actionRecommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
