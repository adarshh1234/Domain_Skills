import React from 'react';
import {
  Sparkles,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  Award,
  AlertCircle,
  Clock,
  CheckCircle2,
  Info
} from 'lucide-react';
import { AIInsightsSummary } from '../../services/aiService';

interface AIInsightCardProps {
  insights?: AIInsightsSummary | null;
  loading?: boolean;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insights, loading }) => {
  const data: AIInsightsSummary = insights || {
    predictedSuccessScore: 87,
    roleFitPercentage: 92,
    aiConfidence: 94,
    onboardingRiskLevel: 'Low',
    riskSummary:
      'High probability of rapid ramp-up based on strong distributed computing foundations and aligned tech stack.',
    topStrengths: [
      'Distributed ML Training (PyTorch / Ray)',
      'Cloud Infrastructure & Kubernetes',
      'High-Throughput gRPC / REST Microservices',
      'System Architecture & Resilience'
    ],
    growthRecommendations: [
      'Advanced Apache Spark for Petabyte Analytics',
      'Production Vector Search & RAG Optimization',
      'Company-specific Data Governance Protocols'
    ],
    daysToProductivityEstimate: 14,
    retentionPredictionTenure: 4.2
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(17, 24, 46, 0.9) 0%, rgba(13, 19, 38, 0.95) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: '20px',
        padding: '1.75rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(139, 92, 246, 0.12)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Shimmer Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '260px',
          height: '260px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(35px)'
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(124, 58, 237, 0.4)'
            }}
          >
            <BrainCircuit size={20} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
              AI Predictive Onboarding Intelligence
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Multi-model candidate telemetry and success propensity analysis
            </p>
          </div>
        </div>

        {/* Model Confidence Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            fontSize: '0.75rem',
            color: '#93c5fd',
            fontWeight: 700
          }}
        >
          <Sparkles size={12} color="#60a5fa" />
          <span>AI Model Confidence: {data.aiConfidence}%</span>
        </div>
      </div>

      {/* Primary 4 Metric Tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        {/* Metric 1: Predicted Success */}
        <div
          style={{
            background: 'rgba(14, 20, 36, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.1rem',
            position: 'relative'
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Predicted Success
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399', letterSpacing: '-0.03em' }}>
              {data.predictedSuccessScore}%
            </span>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>High Fit</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
            Based on ML skill calibration & background
          </p>
        </div>

        {/* Metric 2: Role Alignment */}
        <div
          style={{
            background: 'rgba(14, 20, 36, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.1rem'
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Role Fit Score
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#60a5fa', letterSpacing: '-0.03em' }}>
              {data.roleFitPercentage}%
            </span>
            <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700 }}>L5 Senior</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
            Exceeds benchmark in 4/6 core dimensions
          </p>
        </div>

        {/* Metric 3: Time to Productive */}
        <div
          style={{
            background: 'rgba(14, 20, 36, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.1rem'
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Ramp-up Velocity
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#a78bfa', letterSpacing: '-0.03em' }}>
              {data.daysToProductivityEstimate}d
            </span>
            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 700 }}>Est. Time</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
            50% faster than industry norm (28d)
          </p>
        </div>

        {/* Metric 4: Predicted Tenure */}
        <div
          style={{
            background: 'rgba(14, 20, 36, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.1rem'
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Tenure Forecast
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '-0.03em' }}>
              {data.retentionPredictionTenure}y
            </span>
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>Low Churn</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
            High alignment with team longevity OKR
          </p>
        </div>
      </div>

      {/* Summary Narrative & Risk Indicator */}
      <div
        style={{
          background: 'rgba(20, 28, 52, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1rem'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            flexShrink: 0,
            marginTop: '2px'
          }}
        >
          <ShieldCheck size={16} color="#34d399" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
              Onboarding Risk Assessment:
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '0.1rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              {data.onboardingRiskLevel} Risk
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            {data.riskSummary}
          </p>
        </div>
      </div>

      {/* Transparent Service Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.7rem',
          color: '#64748b'
        }}
      >
        <Info size={12} color="#64748b" />
        <span>
          Simulated AI telemetry pipeline. Ready for plug-and-play connection with production ML inference microservices via <code style={{ color: '#93c5fd' }}>aiService.ts</code>.
        </span>
      </div>
    </div>
  );
};
