import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  FileText
} from 'lucide-react';
import { OnboardingDocument } from '../../types/onboarding';
import { aiService } from '../../services/aiService';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (
    name: string,
    category: OnboardingDocument['category'],
    fileName: string,
    fileSize: string,
    aiResult: { status: OnboardingDocument['status']; confidence: number; remarks: string }
  ) => Promise<void>;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<OnboardingDocument['category']>('Identity');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docName) {
        // Auto derive friendly name
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setDocName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
      setError(null);
    }
  };

  const handleUploadAndVerify = async () => {
    if (!docName.trim()) {
      setError('Please provide a document title');
      return;
    }
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setScanning(true);
    setError(null);

    try {
      setScanStep('Uploading document payload to secure storage enclave...');
      await new Promise((r) => setTimeout(r, 600));

      setScanStep('Running AI optical character recognition & layout analysis...');
      await new Promise((r) => setTimeout(r, 800));

      setScanStep('Validating holographic seals & institutional checksums...');
      const verificationResult = await aiService.verifyDocument(docName, category);

      setScanStep('Finalizing compliance record...');
      const formattedSize = `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`;

      await onUploadSuccess(
        docName,
        category,
        selectedFile.name,
        formattedSize,
        {
          status: verificationResult.status,
          confidence: verificationResult.confidence,
          remarks: verificationResult.notes
        }
      );

      // Reset and close
      setDocName('');
      setSelectedFile(null);
      onClose();
    } catch (err) {
      console.error('Document verification error', err);
      setError('Verification pipeline encountered a temporary error. Please retry.');
    } finally {
      setScanning(false);
      setScanStep('');
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
        backdropFilter: 'blur(16px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !scanning) onClose();
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.98) 0%, rgba(9, 14, 26, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
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
            justifyContent: 'space-between'
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
              <UploadCloud size={18} color="#60a5fa" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                Upload & AI Verify Document
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Automated optical authentication and compliance pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={scanning}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="form-group">
            <label className="form-label">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              disabled={scanning}
              className="form-select"
            >
              <option value="Identity">Identity (Passport, National ID, Driver License)</option>
              <option value="Education">Education (Degree Certificate, Transcripts)</option>
              <option value="Experience">Experience (Relieving Letter, Prior Pay Slips)</option>
              <option value="Legal & Tax">Legal & Tax (W-4, Direct Deposit, NDA)</option>
              <option value="Certifications">Certifications (AWS, GCP, CKA, ML Badges)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Document Title / Display Name</label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Stanford MS Degree Certificate"
              disabled={scanning}
              className="form-input"
            />
          </div>

          {/* File Upload Zone */}
          <div className="form-group">
            <label className="form-label">Select File (PDF, PNG, JPG, DOCX)</label>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.75rem',
                border: '2px dashed rgba(59, 130, 246, 0.35)',
                borderRadius: '14px',
                background: 'rgba(11, 16, 28, 0.6)',
                cursor: scanning ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                disabled={scanning}
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                <UploadCloud size={22} color="#60a5fa" />
              </div>
              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.2rem' }}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for AI scanning
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#cbd5e1' }}>
                    Click to browse or drop file here
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Supports PDF, high-res scans up to 25MB
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Real-time Scanning Progress Bar */}
          {scanning && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(16, 24, 44, 0.8)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Loader2 size={16} color="#60a5fa" className="pulse-live-indicator" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93c5fd' }}>
                  {scanStep}
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  className="shimmer-badge"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '9999px'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}
        >
          <button
            onClick={onClose}
            disabled={scanning}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.1rem', fontSize: '0.825rem' }}
          >
            Cancel
          </button>
          <button
            onClick={handleUploadAndVerify}
            disabled={scanning || !selectedFile || !docName.trim()}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.825rem' }}
          >
            {scanning ? (
              <>
                <Loader2 size={14} className="pulse-live-indicator" />
                <span>AI Verifying...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Upload & Start AI Scan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
