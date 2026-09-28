import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer } from '../components/Timer';
import { questionsData } from '../data/questions';
import { SystemDesignQuestion } from '../types/question';
import { AssessmentSession } from '../types/session';
import { storageService } from '../services/storage';
import { assessmentService } from '../services/assessment';
import {
  Cpu,
  Send,
  Plus,
  Check,
  Server,
  Cloud,
  Layers,
  Database,
  Radio,
  FileCheck
} from 'lucide-react';

export const SystemDesign: React.FC = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState<AssessmentSession>(() => {
    const existing = storageService.getSession();
    if (existing && existing.mode === 'system') {
      return existing;
    }
    const fallback: AssessmentSession = {
      id: `session-${Date.now()}`,
      mode: 'system',
      startedAt: Date.now(),
      duration: 30,
      currentQuestion: 0,
      answers: {
        selectedComponents: [
          'API Gateway & Load Balancer',
          'Content Delivery Network (CDN Edge)',
          'Video Transcoding Pipeline (FFmpeg / AWS MediaConvert)'
        ],
        notes: ''
      },
      config: {
        domain: 'Cloud Architecture & DevOps',
        skills: ['Distributed Systems', 'System Design'],
        difficulty: 'Advanced',
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
  const currentQuestion: SystemDesignQuestion =
    questionsData.system[questionIndex] || questionsData.system[0];

  const [selectedComponents, setSelectedComponents] = useState<string[]>(() => {
    return (
      (session.answers?.selectedComponents as string[]) || [
        'API Gateway & Load Balancer',
        'Content Delivery Network (CDN Edge)',
        'Video Transcoding Pipeline (FFmpeg / AWS MediaConvert)'
      ]
    );
  });

  const [notes, setNotes] = useState<string>(() => {
    return (session.answers?.notes as string) || '';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleComponent = (comp: string) => {
    const updated = selectedComponents.includes(comp)
      ? selectedComponents.filter((c) => c !== comp)
      : [...selectedComponents, comp];

    setSelectedComponents(updated);
    storageService.updateSession({
      answers: {
        selectedComponents: updated,
        notes
      }
    });
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    storageService.updateSession({
      answers: {
        selectedComponents,
        notes: val
      }
    });
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answersPayload = {
      selectedComponents,
      notes
    };

    storageService.updateSession({
      answers: answersPayload,
      status: 'submitted'
    });

    const active = storageService.getSession() || session;
    const finalResult = assessmentService.evaluateSession(
      {
        ...active,
        answers: answersPayload
      },
      questionsData
    );

    storageService.saveResult(finalResult);
    navigate(`/results?id=${finalResult.id}`);
  }, [selectedComponents, notes, isSubmitting, session, navigate]);

  const handleTimerExpire = useCallback(() => {
    const answersPayload = {
      selectedComponents,
      notes
    };

    storageService.updateSession({
      answers: answersPayload,
      status: 'expired'
    });

    const active = storageService.getSession() || session;
    const finalResult = assessmentService.evaluateSession(
      {
        ...active,
        answers: answersPayload,
        status: 'expired'
      },
      questionsData
    );

    storageService.saveResult(finalResult);
    navigate(`/results?id=${finalResult.id}`);
  }, [selectedComponents, notes, session, navigate]);

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                System Design Track:
              </span>
              <span className="badge badge-hard">{currentQuestion.difficulty}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              {currentQuestion.title}
            </h2>
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-success"
            style={{ padding: '0.625rem 1.25rem' }}
          >
            <Send size={15} />
            <span>Submit System Design</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 460px) 1fr',
          gap: '1.25rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Requirements & Available Components Palette */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              System Objectives & Scale
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
              {currentQuestion.description}
            </p>

            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Core Functional Requirements
            </h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {currentQuestion.requirements.map((req, i) => (
                <li key={i} style={{ color: '#cbd5e1' }}>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Component Selection Palette */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} color="#22d3ee" /> System Building Blocks
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600 }}>
                {selectedComponents.length} selected
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentQuestion.availableComponents.map((comp) => {
                const isSelected = selectedComponents.includes(comp);
                return (
                  <div
                    key={comp}
                    onClick={() => toggleComponent(comp)}
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                      border: `1px solid ${isSelected ? '#06b6d4' : '#27354f'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: isSelected ? '#67e8f9' : '#cbd5e1' }}>
                      {comp}
                    </span>
                    {isSelected ? (
                      <Check size={14} color="#06b6d4" />
                    ) : (
                      <Plus size={14} color="#64748b" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: In-depth Technical Documentation & Design Spec */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '0.25rem' }}>
              System Design Specification & Data Flow
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Detail your video chunking pipeline, CDN edge eviction policy, database partitioning schema, and failover strategy.
            </p>
          </div>

          <textarea
            className="form-textarea"
            style={{
              minHeight: '440px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder={`1. HIGH-LEVEL TOPOLOGY & INGESTION PIPELINE:
   - Creator uploads master video (e.g. ProRes) -> S3 Master Bucket
   - S3 PutObject event triggers AWS MediaConvert / FFmpeg cluster
   - Transcodes into HLS (m3u8) / MPEG-DASH at multiple bitrates (1080p, 720p, 480p)
   - Chunks (4-second .ts segments) pushed to Global S3 Replicas

2. CONTENT DELIVERY & CDN EDGE CACHING:
   - Client requests manifest file -> Edge CDN (Open Connect)
   - Cache-control: public, max-age for static segments
   - Geo-DNS routing to closest POP (Point of Presence)

3. USER STATE, WATCH PROGRESS & PLAYBACK CONSISTENCY:
   - Heartbeat every 10s sends current timestamp to Redis Cluster
   - Asynchronously flushed via Kafka to Cassandra for persistent history

4. FAILURE MODES & BOTTLENECK MITIGATION:
   - If origin CDN node fails, automatic fallover to secondary CDN provider
   - Circuit breakers on metadata microservices to protect core database`}
          />
        </div>
      </div>
    </div>
  );
};
