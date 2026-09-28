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
        gap: '0.875rem',
        padding: '0.55rem 1.15rem',
        background: isCritical
          ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)'
          : isLowTime
          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(19, 27, 46, 0.85) 0%, rgba(13, 18, 30, 0.9) 100%)',
        border: `1px solid ${
          isCritical ? 'rgba(244, 63, 94, 0.6)' : isLowTime ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.1)'
        }`,
        borderRadius: '14px',
        boxShadow: isCritical
          ? '0 0 20px rgba(244, 63, 94, 0.35)'
          : isLowTime
          ? '0 0 16px rgba(245, 158, 11, 0.25)'
          : '0 4px 14px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      className={isCritical ? 'timer-critical' : ''}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: isCritical
            ? 'rgba(244, 63, 94, 0.2)'
            : isLowTime
            ? 'rgba(245, 158, 11, 0.2)'
            : 'rgba(59, 130, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isCritical ? (
          <AlertTriangle size={18} color="#fb7185" strokeWidth={2.4} />
        ) : (
          <Clock size={17} color={isLowTime ? '#fbbf24' : '#60a5fa'} strokeWidth={2.2} />
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: '0.675rem',
            color: isCritical ? '#fda4af' : isLowTime ? '#fcd34d' : '#94a3b8',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          {isCritical ? 'Time Expiring' : 'Time Remaining'}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.18rem',
            fontWeight: 800,
            color: isCritical ? '#f43f5e' : isLowTime ? '#fbbf24' : '#f8fafc',
            letterSpacing: '0.06em',
            lineHeight: 1.15
          }}
        >
          {formattedTime}
        </div>
      </div>

      {/* Progress pill */}
      <div
        style={{
          width: '52px',
          height: '6px',
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginLeft: '0.35rem'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentRemaining}%`,
            background: isCritical
              ? 'linear-gradient(90deg, #f43f5e, #fda4af)'
              : isLowTime
              ? 'linear-gradient(90deg, #f59e0b, #fcd34d)'
              : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
            boxShadow: isCritical
              ? '0 0 8px #f43f5e'
              : isLowTime
              ? '0 0 8px #f59e0b'
              : '0 0 8px #3b82f6',
            transition: 'width 1s linear'
          }}
        />
      </div>
    </div>
  );
};
