import React, { useEffect, useState, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  startedAt: number; // millisecond timestamp
  duration: number; // duration in minutes
  onExpire: () => void;
}

export const Timer: React.FC<TimerProps> = ({ startedAt, duration, onExpire }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const totalDurationSeconds = duration * 60;
    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    return Math.max(0, totalDurationSeconds - elapsedSeconds);
  });

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const expiredTriggeredRef = useRef(false);

  useEffect(() => {
    const calculateRemaining = () => {
      const totalDurationSeconds = duration * 60;
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, totalDurationSeconds - elapsedSeconds);

      setSecondsRemaining(remaining);

      if (remaining <= 0 && !expiredTriggeredRef.current) {
        expiredTriggeredRef.current = true;
        onExpireRef.current();
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [startedAt, duration]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isLowTime = secondsRemaining <= 300 && secondsRemaining > 60; // < 5 mins
  const isCritical = secondsRemaining <= 60; // < 1 min

  const totalSeconds = duration * 60;
  const percentRemaining = Math.max(0, Math.min(100, (secondsRemaining / totalSeconds) * 100));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 1rem',
        background: isCritical ? 'rgba(244, 63, 94, 0.15)' : isLowTime ? 'rgba(245, 158, 11, 0.15)' : 'rgba(17, 24, 39, 0.85)',
        border: `1px solid ${isCritical ? '#f43f5e' : isLowTime ? '#f59e0b' : '#27354f'}`,
        borderRadius: '12px',
        boxShadow: isCritical ? '0 0 16px rgba(244, 63, 94, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
      className={isCritical ? 'timer-critical' : ''}
    >
      {isCritical ? (
        <AlertTriangle size={18} color="#f43f5e" />
      ) : (
        <Clock size={18} color={isLowTime ? '#f59e0b' : '#60a5fa'} />
      )}

      <div>
        <div style={{ fontSize: '0.6875rem', color: isCritical ? '#fb7185' : isLowTime ? '#fcd34d' : '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {isCritical ? 'Time Expiring' : 'Time Remaining'}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: isCritical ? '#f43f5e' : isLowTime ? '#fbbf24' : '#f8fafc', letterSpacing: '0.05em' }}>
          {formattedTime}
        </div>
      </div>

      {/* Progress pill */}
      <div style={{ width: '48px', height: '6px', background: '#1e293b', borderRadius: '9999px', overflow: 'hidden', marginLeft: '0.25rem' }}>
        <div
          style={{
            height: '100%',
            width: `${percentRemaining}%`,
            background: isCritical ? '#f43f5e' : isLowTime ? '#f59e0b' : '#3b82f6',
            transition: 'width 1s linear'
          }}
        />
      </div>
    </div>
  );
};
