import { AssessmentSession } from '../types/session';
import { AssessmentResult } from '../types/result';

const ACTIVE_SESSION_KEY = 'skills-test-active-session';
const RESULTS_KEY = 'skills-test-results';
const SESSION_PREFIX = 'skills-test-session-';

export const storageService = {
  /**
   * Save the current active assessment session
   */
  saveSession(session: AssessmentSession): void {
    try {
      const serialized = JSON.stringify(session);
      localStorage.setItem(ACTIVE_SESSION_KEY, serialized);
      // Also persist to dedicated session key
      localStorage.setItem(`${SESSION_PREFIX}${session.id}`, serialized);
    } catch (err) {
      console.error('Failed to save session to localStorage:', err);
    }
  },

  /**
   * Get the current active session
   */
  getSession(): AssessmentSession | null {
    try {
      const data = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object' || !parsed.id || !parsed.mode) {
        return null;
      }
      return parsed as AssessmentSession;
    } catch (err) {
      console.error('Failed to parse active session from localStorage:', err);
      return null;
    }
  },

  /**
   * Get a specific session by its ID
   */
  getSessionById(sessionId: string): AssessmentSession | null {
    try {
      const data = localStorage.getItem(`${SESSION_PREFIX}${sessionId}`);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return parsed as AssessmentSession;
    } catch (err) {
      console.error(`Failed to load session ${sessionId}:`, err);
      return null;
    }
  },

  /**
   * Partially update the active session (e.g. answers, currentQuestion, status)
   */
  updateSession(updates: Partial<AssessmentSession>): AssessmentSession | null {
    try {
      const current = this.getSession();
      if (!current) return null;

      const updated: AssessmentSession = {
        ...current,
        ...updates,
        answers: {
          ...current.answers,
          ...(updates.answers || {})
        },
        lastSavedAt: Date.now()
      };

      this.saveSession(updated);
      return updated;
    } catch (err) {
      console.error('Failed to update session:', err);
      return null;
    }
  },

  /**
   * Clear active session upon completion or manual reset
   */
  clearSession(): void {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (err) {
      console.error('Failed to remove active session:', err);
    }
  },

  /**
   * Save an assessment result to the results history
   */
  saveResult(result: AssessmentResult): void {
    try {
      const existing = this.getResults();
      // Remove any prior entry with exact same id
      const filtered = existing.filter((r) => r.id !== result.id);
      const updated = [result, ...filtered];
      localStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save result to localStorage:', err);
    }
  },

  /**
   * Retrieve all saved results, sorted newest first
   */
  getResults(): AssessmentResult[] {
    try {
      const raw = localStorage.getItem(RESULTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as AssessmentResult[];
    } catch (err) {
      console.error('Failed to parse results array from localStorage:', err);
      return [];
    }
  },

  /**
   * Retrieve a single result by ID or get the latest result
   */
  getResult(resultId?: string): AssessmentResult | null {
    const list = this.getResults();
    if (list.length === 0) return null;
    if (!resultId) return list[0]; // newest
    return list.find((r) => r.id === resultId || r.sessionId === resultId) || list[0];
  }
};
