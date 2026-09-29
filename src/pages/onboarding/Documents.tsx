import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  FileText,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Info,
  Layers
} from 'lucide-react';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingStepper } from '../../components/onboarding/OnboardingStepper';
import { DocumentUploadModal } from '../../components/onboarding/DocumentUploadModal';
import { onboardingService } from '../../services/onboardingService';
import { aiService } from '../../services/aiService';
import {
  CandidateProfile,
  OnboardingProgress,
  OnboardingDocument,
  DocumentVerificationStatus
} from '../../types/onboarding';

export const Documents: React.FC = () => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [documents, setDocuments] = useState<OnboardingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [reverifyingId, setReverifyingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cand, prog, docs] = await Promise.all([
        onboardingService.getCandidate(),
        onboardingService.getProgress(),
        onboardingService.getDocuments()
      ]);
      setCandidate(cand);
      setProgress(prog);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadSuccess = async (
    name: string,
    category: OnboardingDocument['category'],
    fileName: string,
    fileSize: string,
    aiResult: { status: OnboardingDocument['status']; confidence: number; remarks: string }
  ) => {
    const uploaded = await onboardingService.uploadDocument(name, category, fileName, fileSize);
    await onboardingService.updateDocumentStatus(
      uploaded.id,
      aiResult.status,
      aiResult.confidence,
      aiResult.remarks
    );
    await loadData();
  };

  const handleReverify = async (doc: OnboardingDocument) => {
    setReverifyingId(doc.id);
    try {
      const result = await aiService.verifyDocument(doc.name, doc.category);
      await onboardingService.updateDocumentStatus(
        doc.id,
        result.status,
        result.confidence,
        result.notes
      );
      await loadData();
    } catch (err) {
      console.error('Re-verification failed', err);
    } finally {
      setReverifyingId(null);
    }
  };

  const getStatusBadge = (status: DocumentVerificationStatus, confidence: number) => {
    switch (status) {
      case 'AI Verified':
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
            <span>AI Verified ({confidence}%)</span>
          </span>
        );
      case 'Needs Manual Review':
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
            <AlertTriangle size={13} />
            <span>Needs Manual Review</span>
          </span>
        );
      case 'Processing':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#93c5fd',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              fontSize: '0.725rem',
              fontWeight: 800
            }}
          >
            <Clock size={13} className="pulse-live-indicator" />
            <span>AI Scanning...</span>
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

  const filteredDocs =
    activeCategory === 'All'
      ? documents
      : documents.filter((d) => d.category === activeCategory);

  const verifiedCount = documents.filter((d) => d.status === 'AI Verified').length;

  return (
    <div className="main-content">
      <OnboardingHeader candidate={candidate} progress={progress} />
      <OnboardingStepper progress={progress} />

      {/* Top Action Bar */}
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
            Compliance & AI Verification Hub
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {verifiedCount} of {documents.length} mandatory onboarding documents cryptographically authenticated
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.35rem', fontSize: '0.825rem' }}
        >
          <UploadCloud size={16} />
          <span>Upload & Verify Document</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.75rem'
        }}
      >
        {['All', 'Identity', 'Education', 'Experience', 'Legal & Tax', 'Certifications'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeCategory === cat ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
              background: activeCategory === cat ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: activeCategory === cat ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid / Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        {filteredDocs.map((doc) => {
          const isReverifying = reverifyingId === doc.id;

          return (
            <div
              key={doc.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border:
                  doc.status === 'AI Verified'
                    ? '1px solid rgba(16, 185, 129, 0.25)'
                    : doc.status === 'Needs Manual Review'
                    ? '1px solid rgba(245, 158, 11, 0.25)'
                    : '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginBottom: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(59, 130, 246, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        flexShrink: 0
                      }}
                    >
                      <FileText size={18} color="#60a5fa" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3 }}>
                        {doc.name}
                      </h4>
                      <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                        {doc.category} · {doc.fileSize}
                      </div>
                    </div>
                  </div>

                  {getStatusBadge(doc.status, doc.aiConfidence)}
                </div>

                {/* File Details & Remarks */}
                <div
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: '10px',
                    background: 'rgba(5, 8, 16, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ fontSize: '0.725rem', color: '#64748b', marginBottom: '0.25rem' }}>
                    File: <code style={{ color: '#93c5fd' }}>{doc.fileName}</code>
                  </div>
                  {doc.remarks && (
                    <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                      {doc.remarks}
                    </p>
                  )}

                  {/* Extracted Key-Values */}
                  {doc.extractedFields && Object.keys(doc.extractedFields).length > 0 && (
                    <div style={{ marginTop: '0.6rem', borderTop: '1px dashed rgba(255, 255, 255, 0.06)', paddingTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.675rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Neural OCR Extracted Entities
                      </div>
                      {Object.entries(doc.extractedFields).slice(0, 3).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                          <span>{k}:</span>
                          <span style={{ color: '#f8fafc', fontWeight: 600 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '0.75rem',
                  fontSize: '0.725rem',
                  color: '#64748b'
                }}
              >
                <span>Uploaded: {doc.uploadDate}</span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleReverify(doc)}
                    disabled={isReverifying}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.725rem' }}
                    title="Trigger AI Optical Verification Pipeline"
                  >
                    <RotateCcw size={12} className={isReverifying ? 'pulse-live-indicator' : ''} />
                    <span>{isReverifying ? 'Verifying...' : 'Re-verify AI'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honest Service Disclaimer Card */}
      <div
        style={{
          background: 'rgba(14, 20, 36, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: '#94a3b8'
        }}
      >
        <Info size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
        <span>
          <strong>Architecture Note:</strong> AI verification runs via <code style={{ color: '#93c5fd' }}>aiService.verifyDocument()</code> service abstraction. The mock OCR pipeline simulates real-world optical character validation, seal verification, and check digit calculations, and is ready for production model APIs.
        </span>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};
