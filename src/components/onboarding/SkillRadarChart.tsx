import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { SkillRadarItem } from '../../types/onboarding';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillRadarChartProps {
  data: SkillRadarItem[];
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data }) => {
  const labels = data.map((d) => d.skill);
  const currentLevels = data.map((d) => d.currentLevel);
  const requiredLevels = data.map((d) => d.requiredLevel);
  const benchmarks = data.map((d) => d.benchmark);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Candidate Evaluated Skill',
        data: currentLevels,
        backgroundColor: 'rgba(59, 130, 246, 0.25)',
        borderColor: '#3b82f6',
        borderWidth: 2.5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#3b82f6',
        pointRadius: 4.5,
        pointHoverRadius: 6
      },
      {
        label: 'Role Target Standard (L5)',
        data: requiredLevels,
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        borderDash: [4, 4],
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointRadius: 3.5
      },
      {
        label: 'Enterprise Benchmark (Peer Avg)',
        data: benchmarks,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderColor: '#10b981',
        borderWidth: 1.5,
        borderDash: [2, 2],
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointRadius: 2.5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.08)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.06)'
        },
        pointLabels: {
          color: '#cbd5e1',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
            weight: 700
          }
        },
        ticks: {
          color: '#64748b',
          backdropColor: 'transparent',
          stepSize: 20,
          font: {
            size: 9
          }
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
            weight: 600
          },
          padding: 16,
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
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}%`
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '380px' }}>
      <Radar data={chartData} options={options as any} />
    </div>
  );
};
