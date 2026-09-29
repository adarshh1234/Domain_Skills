import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Building,
  User,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingStepper } from '../../components/onboarding/OnboardingStepper';
import { ApprovalModal } from '../../components/onboarding/ApprovalModal';
import { approvalService } from '../../services/approvalService';
import { onboardingService } from '../../services/onboardingService';
import {
  ApprovalRequest,
  CandidateProfile,
  OnboardingProgress,
  ApprovalStatus
} from '../../types/onboarding';

export const Approvals: React.FC = () => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cand, prog, apprList] = await Promise.all([
        onboardingService.getCandidate(),
        onboardingService.getProgress(),
        approvalService.getApprovals()
      ]);
      setCandidate(cand);
      setProgress(prog);
      setApprovals(apprList);
    } catch (err) {
      console.error('Failed to load approvals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReview = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDecision = async (id: string, decision: 'Approved' | 'Rejected', comments: string) => {
    await approvalService.submitDecision(id, decision, comments, 'David Zhang (Director of AI Systems)');
    await loadData();
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              fontSize: '0.725rem',
              fontWeight: 800
            }}
          >
            <CheckCircle2 size={13} />
            <span>Approved</span>
          </span>
        );
      case 'Pending':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              fontSize: '0.725rem',
              fontWeight: 800
            }}
          >
            <Clock size={13} />
            <span>Pending Review</span>
          </span>
        );
      case 'Rejected':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#fb7185',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              fontSize: '0.725rem',
              fontWeight: 800
            }}
          >
            <XCircle size={13} />
            <span>Rejected</span>
          </span>
        );
    }
  };

  const filteredApprovals =
    activeStatus === 'All'
      ? approvals
      : approvals.filter((a) => a.status === activeStatus);

  const pendingCount = approvals.filter((a) => a.status === 'Pending').length;

  return (
    <div className="main-content">
      <OnboardingHeader candidate={candidate} progress={progress} />
      <OnboardingStepper progress={progress} />

      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Manager & Leadership Approval Queue
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Review, calibrate, and sign off on role designations, budget allocations, and day-1 permissions
          </p>
        </div>

        <div
          style={{
            padding: '0.45rem 0.95rem',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Clock size={15} />
          <span>{pendingCount} Pending Leadership Actions</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.75rem'
        }}
      >
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeStatus === status ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
              background: activeStatus === status ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: activeStatus === status ? '#ffffff' : '#94a3b8'
            }}
          >
            {status} ({status === 'All' ? approvals.length : approvals.filter((a) => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Approvals Table / Card List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {filteredApprovals.map((req) => (
          <div
            key={req.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              flexWrap: 'wrap',
              gap: '1.25rem',
              border: req.status === 'Pending' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Candidate & Request Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '260px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #8b5cf6',
                  flexShrink: 0
                }}
              >
                <img
                  src={req.candidateAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={req.candidateName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                    {req.candidateName}
                  </span>
                  <span
                    style={{
                      fontSize: '0.675rem',
                      fontWeight: 700,
                      color:
                        req.priority === 'High'
                          ? '#fb7185'
                          : req.priority === 'Medium'
                          ? '#fbbf24'
                          : '#93c5fd',
                      background:
                        req.priority === 'High'
                          ? 'rgba(244, 63, 94, 0.12)'
                          : req.priority === 'Medium'
                          ? 'rgba(245, 158, 11, 0.12)'
                          : 'rgba(59, 130, 246, 0.12)',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {req.priority}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {req.candidateRole} · {req.department}
                </div>
              </div>
            </div>

            {/* Request Type & Summary Details */}
            <div style={{ flex: '1 1 320px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#93c5fd', marginBottom: '0.2rem' }}>
                {req.requestType}
              </div>
              <p
                style={{
                  fontSize: '0.775rem',
                  color: '#cbd5e1',
                  lineHeight: 1.45,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {req.details}
              </p>
              {req.comments && (
                <div style={{ fontSize: '0.725rem', color: '#34d399', marginTop: '0.25rem', fontStyle: 'italic' }}>
                  " {req.comments} " — {req.reviewedBy}
                </div>
              )}
            </div>

            {/* Submission Time & Status */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', minWidth: '130px' }}>
              {getStatusBadge(req.status)}
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {req.submittedAt}
              </span>
            </div>

            {/* Action Button */}
            <div>
              <button
                onClick={() => handleOpenReview(req)}
                className="btn btn-secondary"
                style={{
                  padding: '0.5rem 1.1rem',
                  fontSize: '0.775rem',
                  borderRadius: '8px',
                  background: req.status === 'Pending' ? 'rgba(59, 130, 246, 0.2)' : undefined,
                  borderColor: req.status === 'Pending' ? 'rgba(59, 130, 246, 0.5)' : undefined
                }}
              >
                <Eye size={13} color="#60a5fa" />
                <span>{req.status === 'Pending' ? 'Review & Decide' : 'View Audit Trail'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      <ApprovalModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        onDecision={handleDecision}
      />
    </div>
  );
};
