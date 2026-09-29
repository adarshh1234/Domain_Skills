import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Heart,
  Globe,
  Share2,
  Code2
} from 'lucide-react';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingStepper } from '../../components/onboarding/OnboardingStepper';
import { onboardingService } from '../../services/onboardingService';
import { CandidateProfile, OnboardingProgress } from '../../types/onboarding';

export const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cand, prog] = await Promise.all([
          onboardingService.getCandidate(),
          onboardingService.getProgress()
        ]);
        setCandidate(cand);
        setProgress(prog);
      } catch (err) {
        console.error('Failed to load candidate profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof CandidateProfile, value: any) => {
    if (!candidate) return;
    setCandidate({ ...candidate, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  const handleEmergencyChange = (field: 'name' | 'relationship' | 'phone', value: string) => {
    if (!candidate) return;
    setCandidate({
      ...candidate,
      emergencyContact: {
        ...candidate.emergencyContact,
        [field]: value
      }
    });
  };

  const validate = (): boolean => {
    if (!candidate) return false;
    const newErrors: Record<string, string> = {};

    if (!candidate.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!candidate.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!candidate.personalEmail.trim() || !candidate.personalEmail.includes('@')) {
      newErrors.personalEmail = 'Valid personal email is required';
    }
    if (!candidate.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!candidate.location.trim()) newErrors.location = 'Work location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !candidate) return;

    setSaving(true);
    setSuccessBanner(false);

    try {
      const updated = await onboardingService.updatePersonalInfo(candidate);
      setCandidate(updated);
      setSuccessBanner(true);
      setTimeout(() => setSuccessBanner(false), 4500);
    } catch (err) {
      console.error('Failed to save candidate updates', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="main-content">
      <OnboardingHeader candidate={candidate} progress={progress} />
      <OnboardingStepper progress={progress} />

      {/* Success Notification Banner */}
      {successBanner && (
        <div
          className="animate-fade-in"
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              Personal profile successfully updated and synchronized with HRIS database.
            </span>
          </div>
          <button
            onClick={() => navigate('/onboarding/documents')}
            className="btn btn-primary"
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              background: '#10b981',
              border: 'none'
            }}
          >
            <span>Proceed to Documents</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Main Profile Form Card */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              <User size={20} color="#60a5fa" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Employee Information & Records
              </h3>
              <p style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                Ensure your personal, tax identifier, and emergency contacts are up to date
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.825rem' }}
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {candidate && (
          <form onSubmit={handleSave}>
            {/* Section 1: Basic Identity */}
            <div style={{ marginBottom: '2rem' }}>
              <h4
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#93c5fd',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <User size={15} />
                <span>1. Personal & Contact Identity</span>
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    value={candidate.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="form-input"
                    style={{ borderColor: errors.firstName ? '#f43f5e' : undefined }}
                  />
                  {errors.firstName && <span style={{ color: '#fb7185', fontSize: '0.725rem' }}>{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    value={candidate.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="form-input"
                    style={{ borderColor: errors.lastName ? '#f43f5e' : undefined }}
                  />
                  {errors.lastName && <span style={{ color: '#fb7185', fontSize: '0.725rem' }}>{errors.lastName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Work Email (Internal SSO)</label>
                  <input
                    type="email"
                    value={candidate.email}
                    disabled
                    className="form-input"
                    style={{ opacity: 0.7, background: 'rgba(5, 8, 16, 0.5)' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Personal Email *</label>
                  <input
                    type="email"
                    value={candidate.personalEmail}
                    onChange={(e) => handleChange('personalEmail', e.target.value)}
                    className="form-input"
                    style={{ borderColor: errors.personalEmail ? '#f43f5e' : undefined }}
                  />
                  {errors.personalEmail && <span style={{ color: '#fb7185', fontSize: '0.725rem' }}>{errors.personalEmail}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    value={candidate.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="form-input"
                    style={{ borderColor: errors.phone ? '#f43f5e' : undefined }}
                  />
                  {errors.phone && <span style={{ color: '#fb7185', fontSize: '0.725rem' }}>{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Location / Work Hub *</label>
                  <input
                    type="text"
                    value={candidate.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="form-input"
                    style={{ borderColor: errors.location ? '#f43f5e' : undefined }}
                  />
                  {errors.location && <span style={{ color: '#fb7185', fontSize: '0.725rem' }}>{errors.location}</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Role & Organization Hierarchy */}
            <div style={{ marginBottom: '2rem' }}>
              <h4
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#c4b5fd',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Briefcase size={15} />
                <span>2. Position, Department & Reporting Line</span>
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div className="form-group">
                  <label className="form-label">Assigned Engineering Role</label>
                  <input
                    type="text"
                    value={candidate.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Career Level / Band</label>
                  <input
                    type="text"
                    value={candidate.level}
                    onChange={(e) => handleChange('level', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department / Group</label>
                  <input
                    type="text"
                    value={candidate.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Joining Date</label>
                  <input
                    type="date"
                    value={candidate.joiningDate}
                    onChange={(e) => handleChange('joiningDate', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Direct Manager</label>
                  <input
                    type="text"
                    value={candidate.managerName}
                    disabled
                    className="form-input"
                    style={{ opacity: 0.7 }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Manager Contact Email</label>
                  <input
                    type="email"
                    value={candidate.managerEmail}
                    disabled
                    className="form-input"
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Emergency Contacts */}
            <div style={{ marginBottom: '2rem' }}>
              <h4
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#f43f5e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Heart size={15} />
                <span>3. Emergency Contact (Next of Kin)</span>
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div className="form-group">
                  <label className="form-label">Contact Full Name</label>
                  <input
                    type="text"
                    value={candidate.emergencyContact.name}
                    onChange={(e) => handleEmergencyChange('name', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <input
                    type="text"
                    value={candidate.emergencyContact.relationship}
                    onChange={(e) => handleEmergencyChange('relationship', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Phone</label>
                  <input
                    type="tel"
                    value={candidate.emergencyContact.phone}
                    onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Bio & Professional Links */}
            <div style={{ marginBottom: '2rem' }}>
              <h4
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#34d399',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Globe size={15} />
                <span>4. Professional Bio & Social Links</span>
              </h4>

              <div className="form-group">
                <label className="form-label">Candidate Engineering Bio / Summary</label>
                <textarea
                  value={candidate.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div className="form-group">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={candidate.linkedinUrl || ''}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    className="form-input"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={candidate.githubUrl || ''}
                    onChange={(e) => handleChange('githubUrl', e.target.value)}
                    className="form-input"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1.25rem'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Information is encrypted at rest and stored in your local session.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.75rem' }}
                >
                  <Save size={15} />
                  <span>{saving ? 'Synchronizing...' : 'Save & Update Profile'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
