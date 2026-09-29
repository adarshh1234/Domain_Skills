import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Clock,
  Building,
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react';
import { ApprovalRequest } from '../../types/onboarding';

interface ApprovalModalProps {
  request: ApprovalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onDecision: (id: string, decision: 'Approved' | 'Rejected', comments: string) => Promise<void>;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  request,
  isOpen,
  onClose,
  onDecision
}) => {
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionType, setActionType] = useState<'Approved' | 'Rejected' | null>(null);

  if (!isOpen || !request) return null;

  const handleSubmit = async (decision: 'Approved' | 'Rejected') => {
    setActionType(decision);
    setSubmitting(true);
    try {
      await onDecision(request.id, decision, comments);
      setComments('');
      onClose();
    } catch (err) {
      console.error('Failed to submit approval decision', err);
    } finally {
      setSubmitting(false);
      setActionType(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        background: 'rgba(3, 6, 14, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '650px',
          background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.98) 0%, rgba(9, 14, 26, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              <ShieldCheck size={18} color="#60a5fa" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                Executive Review: {request.requestType}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Request Ref ID: <code style={{ color: '#93c5fd' }}>{request.id}</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Candidate Profile Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.1rem',
              background: 'rgba(16, 24, 44, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #3b82f6',
                  flexShrink: 0
                }}
              >
                <img
                  src={request.candidateAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={request.candidateName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                  {request.candidateName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {request.candidateRole}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  background:
                    request.priority === 'High'
                      ? 'rgba(244, 63, 94, 0.15)'
                      : request.priority === 'Medium'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(59, 130, 246, 0.15)',
                  color:
                    request.priority === 'High'
                      ? '#fb7185'
                      : request.priority === 'Medium'
                      ? '#fbbf24'
                      : '#93c5fd',
                  border:
                    request.priority === 'High'
                      ? '1px solid rgba(244, 63, 94, 0.3)'
                      : request.priority === 'Medium'
                      ? '1px solid rgba(245, 158, 11, 0.3)'
                      : '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                {request.priority} Priority
              </span>
            </div>
          </div>

          {/* Details & Dossier */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              Submission Details & Calibration
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#e2e8f0',
                lineHeight: 1.6,
                background: 'rgba(7, 11, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                borderRadius: '10px'
              }}
            >
              {request.details}
            </div>
          </div>

          {/* Supporting Artifacts */}
          {request.documents && request.documents.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                Attached Verification Dossiers
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {request.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      fontSize: '0.75rem',
                      color: '#93c5fd'
                    }}
                  >
                    <FileText size={13} color="#60a5fa" />
                    <span>{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviewer Comments Form */}
          <div>
            <label
              htmlFor="approval-comments"
              style={{
                display: 'block',
                fontSize: '0.775rem',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: '0.45rem'
              }}
            >
              Manager Feedback & Audit Remarks
            </label>
            <textarea
              id="approval-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide context or rationale for this decision (e.g. Level L5 confirmed with engineering team alignment)..."
              disabled={submitting}
              className="form-textarea"
              style={{ minHeight: '90px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)',
            gap: '1rem'
          }}
        >
          <button
            onClick={onClose}
            disabled={submitting}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.1rem', fontSize: '0.825rem' }}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => handleSubmit('Rejected')}
              disabled={submitting}
              className="btn btn-danger"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.825rem' }}
            >
              {submitting && actionType === 'Rejected' ? (
                <>
                  <Loader2 size={14} className="pulse-live-indicator" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <>
                  <XCircle size={15} />
                  <span>Reject Request</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleSubmit('Approved')}
              disabled={submitting}
              className="btn btn-success"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.825rem' }}
            >
              {submitting && actionType === 'Approved' ? (
                <>
                  <Loader2 size={14} className="pulse-live-indicator" />
                  <span>Approving...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={15} />
                  <span>Approve & Authorize</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
