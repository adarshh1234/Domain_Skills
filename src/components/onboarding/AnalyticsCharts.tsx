import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { HiringFunnelStage, MonthlyTrend, SkillDistributionItem } from '../../types/onboarding';
import { Users, ArrowDownRight, TrendingUp, CheckCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyTrendChartProps {
  data: MonthlyTrend[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Accepted Hires',
        data: data.map((d) => d.hires),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true
      },
      {
        label: 'Offers Extended',
        data: data.map((d) => d.offers),
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 3
      },
      {
        label: 'Hiring Target OKR',
        data: data.map((d) => d.target),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderDash: [3, 3],
        tension: 0.1,
        borderWidth: 1.5,
        pointBackgroundColor: '#10b981',
        pointRadius: 2.5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#cbd5e1',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 600 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 14
        }
      },
      tooltip: {
        backgroundColor: 'rgba(9, 14, 26, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 10
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={chartData} options={options as any} />
    </div>
  );
};

interface SkillDistributionChartProps {
  data: SkillDistributionItem[];
}

export const SkillDistributionChart: React.FC<SkillDistributionChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.skill),
    datasets: [
      {
        data: data.map((d) => d.percentage),
        backgroundColor: data.map((d) => d.color),
        borderColor: '#0b101c',
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#cbd5e1',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 600 },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(9, 14, 26, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}% (${data[context.dataIndex]?.headcount || 0} engineers)`
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '280px', position: 'relative' }}>
      <Doughnut data={chartData} options={options as any} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '32%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
          1,248
        </div>
        <div style={{ fontSize: '0.675rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
          Total Talent
        </div>
      </div>
    </div>
  );
};

interface HiringFunnelChartProps {
  funnel: HiringFunnelStage[];
}

export const HiringFunnelChart: React.FC<HiringFunnelChartProps> = ({ funnel }) => {
  const maxCount = funnel[0]?.count || 14200;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {funnel.map((item, index) => {
        const widthPercent = Math.max(16, Math.round((item.count / maxCount) * 100));
        const colors = [
          'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
          'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
          'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
          'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)',
          'linear-gradient(90deg, #06b6d4 0%, #0891b2 100%)',
          'linear-gradient(90deg, #10b981 0%, #059669 100%)'
        ];

        return (
          <div key={item.stage}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                marginBottom: '0.35rem',
                color: '#e2e8f0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <span style={{ color: '#64748b', fontSize: '0.725rem' }}>0{index + 1}</span>
                <span>{item.stage}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem' }}>
                <span style={{ color: '#ffffff', fontWeight: 800 }}>{item.count.toLocaleString()} candidates</span>
                <span
                  style={{
                    color: index === funnel.length - 1 ? '#34d399' : '#94a3b8',
                    fontWeight: 700,
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px'
                  }}
                >
                  {item.conversionRate}% conv.
                </span>
              </div>
            </div>

            <div
              style={{
                height: '14px',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '9999px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: `${widthPercent}%`,
                  height: '100%',
                  background: colors[index % colors.length],
                  borderRadius: '9999px',
                  transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
