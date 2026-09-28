import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer } from '../components/Timer';
import { questionsData } from '../data/questions';
import { DatabaseQuestion } from '../types/question';
import { AssessmentSession } from '../types/session';
import { storageService } from '../services/storage';
import { assessmentService } from '../services/assessment';
import {
  Database,
  Send,
  Table,
  Terminal,
  Code,
  CheckCircle2,
  FileCode
} from 'lucide-react';

export const DatabaseAPI: React.FC = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState<AssessmentSession>(() => {
    const existing = storageService.getSession();
    if (existing && existing.mode === 'database') {
      return existing;
    }
    const fallback: AssessmentSession = {
      id: `session-${Date.now()}`,
      mode: 'database',
      startedAt: Date.now(),
      duration: 30,
      currentQuestion: 0,
      answers: {
        schema: questionsData.database[0].starterSchema,
        apiEndpoints: `GET /api/v1/products?category_id={id}&page=1&limit=20
POST /api/v1/cart/items (Payload: { variant_id, quantity })
POST /api/v1/checkout/orders (Idempotent order placement)
GET /api/v1/orders/{id}/status`,
        queries: `-- 1. Low stock inventory alert
SELECT p.title, pv.sku, pv.stock_quantity
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE pv.stock_quantity < 10 AND p.is_active = true;

-- 2. Concurrency-safe atomic stock reservation during checkout
UPDATE product_variants
SET stock_quantity = stock_quantity - 2
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  AND stock_quantity >= 2;`
      },
      config: {
        domain: 'Full Stack Development',
        skills: ['PostgreSQL', 'REST & GraphQL APIs'],
        difficulty: 'Intermediate',
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
  const currentQuestion: DatabaseQuestion =
    questionsData.database[questionIndex] || questionsData.database[0];

  const [schema, setSchema] = useState<string>(() => {
    return (session.answers?.schema as string) || currentQuestion.starterSchema;
  });

  const [apiEndpoints, setApiEndpoints] = useState<string>(() => {
    return (
      (session.answers?.apiEndpoints as string) ||
      `GET /api/v1/products?category_id={id}&page=1&limit=20
POST /api/v1/cart/items (Payload: { variant_id, quantity })
POST /api/v1/checkout/orders (Idempotent order placement)
GET /api/v1/orders/{id}/status`
    );
  });

  const [queries, setQueries] = useState<string>(() => {
    return (
      (session.answers?.queries as string) ||
      `-- 1. Low stock inventory alert
SELECT p.title, pv.sku, pv.stock_quantity
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE pv.stock_quantity < 10 AND p.is_active = true;

-- 2. Concurrency-safe atomic stock reservation during checkout
UPDATE product_variants
SET stock_quantity = stock_quantity - 2
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  AND stock_quantity >= 2;`
    );
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const persistAnswers = useCallback((updates: Partial<{ schema: string; apiEndpoints: string; queries: string }>) => {
    storageService.updateSession({
      answers: {
        schema,
        apiEndpoints,
        queries,
        ...updates
      }
    });
  }, [schema, apiEndpoints, queries]);

  const handleSchemaChange = (val: string) => {
    setSchema(val);
    persistAnswers({ schema: val });
  };

  const handleApiChange = (val: string) => {
    setApiEndpoints(val);
    persistAnswers({ apiEndpoints: val });
  };

  const handleQueriesChange = (val: string) => {
    setQueries(val);
    persistAnswers({ queries: val });
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answersPayload = {
      schema,
      apiEndpoints,
      queries
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
  }, [schema, apiEndpoints, queries, isSubmitting, session, navigate]);

  const handleTimerExpire = useCallback(() => {
    const answersPayload = {
      schema,
      apiEndpoints,
      queries
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
  }, [schema, apiEndpoints, queries, session, navigate]);

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
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
            <Database size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Database & API Track:
              </span>
              <span className="badge badge-medium">{currentQuestion.difficulty}</span>
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
            <span>Submit Schema & API</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Problem Requirements (Left) & Editors for Schema/API/Queries (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 440px) 1fr',
          gap: '1.25rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Requirements & Prompts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Platform Modeling Objectives
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
              {currentQuestion.description}
            </p>

            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Design Requirements
            </h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem' }}>
              {currentQuestion.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>

            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.375rem' }}>
              Required Analytical Queries
            </h4>
            <pre style={{ fontSize: '0.75rem', color: '#94a3b8', background: '#090d16', padding: '0.75rem', borderRadius: '8px', whiteSpace: 'pre-line', border: '1px solid #1e293b' }}>
              {currentQuestion.sampleQueriesPrompt}
            </pre>
          </div>
        </div>

        {/* Right Column: SQL Schema Editor, API Endpoints, and SQL Queries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Relational Schema DDL */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Table size={15} color="#34d399" /> Relational SQL Schema DDL (PostgreSQL)
              </label>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Normalized Tables & Constraints
              </span>
            </div>
            <textarea
              className="form-textarea"
              style={{
                minHeight: '260px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                lineHeight: '1.45',
                background: '#090d16'
              }}
              value={schema}
              onChange={(e) => handleSchemaChange(e.target.value)}
              placeholder="CREATE TABLE ... "
            />
          </div>

          {/* RESTful / GraphQL API Endpoints */}
          <div className="card">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={15} color="#60a5fa" /> RESTful / GraphQL API Contract & Status Codes
            </label>
            <textarea
              className="form-textarea"
              style={{
                minHeight: '110px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem'
              }}
              value={apiEndpoints}
              onChange={(e) => handleApiChange(e.target.value)}
              placeholder="Define HTTP verbs, paths, request payloads, and response status codes..."
            />
          </div>

          {/* Queries & Concurrency Management */}
          <div className="card">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={15} color="#f59e0b" /> SQL Analytical Queries & Atomic Stock Transactions
            </label>
            <textarea
              className="form-textarea"
              style={{
                minHeight: '130px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                background: '#090d16'
              }}
              value={queries}
              onChange={(e) => handleQueriesChange(e.target.value)}
              placeholder="Write queries with JOINs, aggregations, and atomic concurrency guards..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
