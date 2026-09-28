import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import { Timer } from '../components/Timer';
import { questionsData } from '../data/questions';
import { SecurityQuestion } from '../types/question';
import { AssessmentSession } from '../types/session';
import { storageService } from '../services/storage';
import { assessmentService } from '../services/assessment';
import {
  ShieldAlert,
  Send,
  Lock,
  AlertOctagon,
  CheckSquare,
  Square,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const Security: React.FC = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState<AssessmentSession>(() => {
    const existing = storageService.getSession();
    if (existing && existing.mode === 'security') {
      return existing;
    }
    const fallback: AssessmentSession = {
      id: `session-${Date.now()}`,
      mode: 'security',
      startedAt: Date.now(),
      duration: 30,
      currentQuestion: 0,
      answers: {
        selectedVulns: ['SQL Injection (CWE-89)'],
        fixedCode: `// Secure Refactored Implementation
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

router.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // ✅ Mitigated: Parameterized query completely eliminates SQL Injection
  const query = 'SELECT id, username, role, password_hash FROM users WHERE username = $1';

  try {
    const results = await db.query(query, [username]);
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({ success: true, user: { id: user.id, role: user.role } });
  } catch (err) {
    // ✅ Obfuscate internal DB errors from clients
    return res.status(500).json({ error: 'Authentication service error' });
  }
});

module.exports = router;`,
        explanation: 'The original code concatenated unescaped user inputs directly into the SQL query string. An attacker could enter `admin\' --` or `\' OR 1=1 --` to bypass authentication without needing a valid password. Additionally, passwords were stored in plaintext and detailed DB error messages were leaked.'
      },
      config: {
        domain: 'Security & Application Hardening',
        skills: ['OWASP Top 10', 'SQL Injection Mitigation'],
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
  const currentQuestion: SecurityQuestion =
    questionsData.security[questionIndex] || questionsData.security[0];

  const [selectedVulns, setSelectedVulns] = useState<string[]>(() => {
    return (session.answers?.selectedVulns as string[]) || ['SQL Injection (CWE-89)'];
  });

  const [fixedCode, setFixedCode] = useState<string>(() => {
    return (session.answers?.fixedCode as string) || `// Secure Refactored Implementation
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

router.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Use parameterized query with placeholder $1
  const query = 'SELECT id, username, role, password_hash FROM users WHERE username = $1';

  try {
    const results = await db.query(query, [username]);
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({ success: true, user: { id: user.id, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: 'Authentication service error' });
  }
});

module.exports = router;`;
  });

  const [explanation, setExplanation] = useState<string>(() => {
    return (session.answers?.explanation as string) || '';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleVulnerability = (vuln: string) => {
    const updated = selectedVulns.includes(vuln)
      ? selectedVulns.filter((v) => v !== vuln)
      : [...selectedVulns, vuln];

    setSelectedVulns(updated);
    storageService.updateSession({
      answers: {
        selectedVulns: updated,
        fixedCode,
        explanation
      }
    });
  };

  const handleFixedCodeChange = useCallback((newCode: string) => {
    setFixedCode(newCode);
    storageService.updateSession({
      answers: {
        selectedVulns,
        fixedCode: newCode,
        explanation
      }
    });
  }, [selectedVulns, explanation]);

  const handleExplanationChange = (val: string) => {
    setExplanation(val);
    storageService.updateSession({
      answers: {
        selectedVulns,
        fixedCode,
        explanation: val
      }
    });
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answersPayload = {
      selectedVulns,
      fixedCode,
      explanation
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
  }, [selectedVulns, fixedCode, explanation, isSubmitting, session, navigate]);

  const handleTimerExpire = useCallback(() => {
    const answersPayload = {
      selectedVulns,
      fixedCode,
      explanation
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
  }, [selectedVulns, fixedCode, explanation, session, navigate]);

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
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Security Audit Track:
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
            <span>Submit Security Audit</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Vulnerable Code & Checkboxes (Left) vs Secure Code & Explanation (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 460px) 1fr',
          gap: '1.25rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Vulnerable Snippet & Vulnerability Identification */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Vulnerable Backend Route Audit
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
              {currentQuestion.description}
            </p>

            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Vulnerable Target Code (Express / SQL)
            </h4>
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <pre
                style={{
                  background: '#090d16',
                  padding: '0.875rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#fb7185',
                  overflowX: 'auto',
                  lineHeight: '1.45'
                }}
              >
                {currentQuestion.vulnerableSnippet}
              </pre>
            </div>
          </div>

          {/* Vulnerability Checklist */}
          <div className="card">
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertOctagon size={16} color="#fb7185" /> Identified Vulnerability Classes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentQuestion.vulnerabilityOptions.map((vuln) => {
                const isSelected = selectedVulns.includes(vuln);
                return (
                  <div
                    key={vuln}
                    onClick={() => toggleVulnerability(vuln)}
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(244, 63, 94, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                      border: `1px solid ${isSelected ? '#f43f5e' : '#27354f'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? (
                      <CheckSquare size={16} color="#fb7185" />
                    ) : (
                      <Square size={16} color="#64748b" />
                    )}
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: isSelected ? '#fda4af' : '#cbd5e1' }}>
                      {vuln}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Secure Refactoring Code & Exploit Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0, fontSize: '0.9375rem', color: '#f8fafc' }}>
                Secure Refactored Code Implementation
              </label>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Parameterized Queries & Safe Auth
              </span>
            </div>

            <CodeEditor
              code={fixedCode}
              onChange={handleFixedCodeChange}
              language="javascript"
              minHeight="380px"
            />
          </div>

          {/* Exploit Mechanism & Defense-in-Depth Explanation */}
          <div className="card">
            <label className="form-label" style={{ fontSize: '0.9375rem', color: '#f8fafc' }}>
              Exploit Mechanism & Defense-in-Depth Rationale <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              Explain how an attacker could construct malicious input payloads, and how your changes neutralize the vector.
            </p>
            <textarea
              className="form-textarea"
              style={{ minHeight: '120px' }}
              value={explanation}
              onChange={(e) => handleExplanationChange(e.target.value)}
              placeholder="Explain how an input of admin' -- or ' OR 1=1 -- manipulates query logic, why parameterized queries guarantee safety, and why bcrypt password hashing with constant-time comparison is necessary..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
