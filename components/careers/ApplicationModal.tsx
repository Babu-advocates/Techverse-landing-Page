'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { X, CheckCircle2, AlertCircle, Upload, FileText, Send, Copy, Check } from 'lucide-react';
import PhoneInput from '@/components/PhoneInput';
import CustomSelect from '@/components/CustomSelect';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string | null;
  jobTitle?: string;
};

const QUALIFICATION_OPTIONS = [
  "Bachelor's Degree (B.E / B.Tech / B.Sc / BCA)",
  "Master's Degree (M.E / M.Tech / M.Sc / MCA / MBA)",
  'Doctorate / Ph.D',
  'Diploma in Engineering / IT',
  'Higher Secondary / Other',
];

const NOTICE_PERIOD_OPTIONS = [
  'Immediate Joiner (0–15 Days)',
  '1 Month (30 Days)',
  '2 Months (60 Days)',
  '3 Months (90 Days)',
  'Serving Notice Period',
];

const EXPERIENCE_OPTIONS = [
  '0 Years (Fresher / College Graduate)',
  '1–2 Years',
  '3–5 Years',
  '6–8 Years',
  '9+ Years',
];

export default function ApplicationModal({ isOpen, onClose, jobId, jobTitle }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form custom select states
  const [qualification, setQualification] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [experienceRange, setExperienceRange] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!resumeFile) {
      setError('Please upload your Resume / CV file (PDF or DOCX).');
      return;
    }

    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Map experienceRange to numerical approximate
    let expYears = 0;
    if (experienceRange.includes('1–2')) expYears = 2;
    else if (experienceRange.includes('3–5')) expYears = 4;
    else if (experienceRange.includes('6–8')) expYears = 7;
    else if (experienceRange.includes('9+')) expYears = 9;

    formData.set('experience_years', String(expYears));
    if (jobId) formData.set('job_id', jobId);
    formData.set('highest_qualification', qualification);
    formData.set('notice_period', noticePeriod);
    formData.set('resume', resumeFile);

    try {
      const res = await fetch('/api/careers/applications', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSuccessRef(data.referenceNumber);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your application.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopyReference() {
    if (successRef) {
      navigator.clipboard.writeText(successRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="career-modal-backdrop" onClick={onClose}>
      <div
        className="career-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        data-lenis-prevent="true"
      >
        <button type="button" className="career-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {successRef ? (
          <div className="career-modal-success">
            <div className="career-modal-success__icon">
              <CheckCircle2 size={48} className="text-purple" />
            </div>
            <h2>Application Submitted Successfully!</h2>
            <p className="lead">
              Thank you for applying for <strong>{jobTitle || 'Techverse Infotech'}</strong>. Our recruitment team will review your application and be in touch soon.
            </p>

            <div className="career-ref-box">
              <span className="career-ref-label">Your Tracking Reference Number</span>
              <div className="career-ref-value-row">
                <span className="career-ref-code">{successRef}</span>
                <button type="button" className="career-ref-copy-btn" onClick={handleCopyReference}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="career-ref-note">
              A confirmation email has also been sent to your email address. Keep this reference number for future inquiries.
            </p>

            <button type="button" className="btn btn--primary" onClick={onClose} style={{ marginTop: 20 }}>
              Close Window
            </button>
          </div>
        ) : (
          <>
            <div className="career-modal-header">
              <span className="career-modal-eyebrow">Direct Application</span>
              <h2>{jobTitle ? `Apply for ${jobTitle}` : 'General Application'}</h2>
              <p className="career-modal-subtitle">
                Join our engineering team in building next-generation digital platforms and AI solutions.
              </p>
            </div>

            {error && (
              <div className="contact-status contact-status--err" style={{ marginBottom: 20 }}>
                <AlertCircle size={18} className="contact-status__icon" />
                <span>{error}</span>
              </div>
            )}

            <form className="career-application-form" onSubmit={handleSubmit}>
              {/* Anti-spam honeypot */}
              <input type="text" name="company_website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <h4 className="career-form-section-title">1. Personal Information</h4>
              <div className="contact-form__row">
                <div className="form-field">
                  <label htmlFor="full_name">Full Name *</label>
                  <input id="full_name" name="full_name" required placeholder="e.g. Alex Sharma" autoComplete="name" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email Address *</label>
                  <input id="email" name="email" type="email" required placeholder="alex@example.com" autoComplete="email" />
                </div>
              </div>

              <div className="contact-form__row">
                <div className="form-field">
                  <label htmlFor="phone">Phone Number *</label>
                  <PhoneInput id="phone" name="phone" required />
                </div>
                <div className="form-field">
                  <label htmlFor="location">Current Location (City, Country) *</label>
                  <input id="location" name="location" required placeholder="e.g. Coimbatore, India" />
                </div>
              </div>

              <div className="contact-form__row">
                <div className="form-field">
                  <label htmlFor="linkedin_url">LinkedIn Profile URL</label>
                  <input id="linkedin_url" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="form-field">
                  <label htmlFor="github_url">GitHub / Portfolio URL</label>
                  <input id="github_url" name="github_url" type="url" placeholder="https://github.com/username" />
                </div>
              </div>

              <h4 className="career-form-section-title">2. Professional Profile</h4>
              <div className="contact-form__row">
                <div className="form-field">
                  <label>Total Experience</label>
                  <CustomSelect
                    name="experience_range"
                    value={experienceRange}
                    onChange={setExperienceRange}
                    options={EXPERIENCE_OPTIONS}
                    placeholder="Select experience level"
                  />
                </div>
                <div className="form-field">
                  <label>Notice Period</label>
                  <CustomSelect
                    name="notice_period_select"
                    value={noticePeriod}
                    onChange={setNoticePeriod}
                    options={NOTICE_PERIOD_OPTIONS}
                    placeholder="Select notice period"
                  />
                </div>
              </div>

              <div className="contact-form__row">
                <div className="form-field">
                  <label htmlFor="current_company">Current Company</label>
                  <input id="current_company" name="current_company" placeholder="e.g. Current Employer or Freelance" />
                </div>
                <div className="form-field">
                  <label htmlFor="current_designation">Current Designation</label>
                  <input id="current_designation" name="current_designation" placeholder="e.g. Software Engineer" />
                </div>
              </div>

              <div className="contact-form__row">
                <div className="form-field">
                  <label>Highest Qualification</label>
                  <CustomSelect
                    name="qualification_select"
                    value={qualification}
                    onChange={setQualification}
                    options={QUALIFICATION_OPTIONS}
                    placeholder="Select degree / education"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="expected_salary">Expected Annual Compensation (INR)</label>
                  <input id="expected_salary" name="expected_salary" placeholder="e.g. ₹8,00,000 / Year" />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="skills">Key Technical Skills & Tools</label>
                <input id="skills" name="skills" placeholder="e.g. React, Next.js, TypeScript, PostgreSQL, Docker" />
              </div>

              <h4 className="career-form-section-title">3. Resume / CV Upload *</h4>
              <div className="career-file-dropzone">
                <input
                  type="file"
                  id="resume_file_input"
                  accept=".pdf,.doc,.docx,application/pdf"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setResumeFile(e.target.files[0]);
                    }
                  }}
                  className="career-file-input"
                />
                <label htmlFor="resume_file_input" className="career-file-label">
                  <Upload size={24} className="career-upload-icon" />
                  {resumeFile ? (
                    <div className="career-file-chosen">
                      <FileText size={18} className="text-purple" />
                      <span>{resumeFile.name} ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                  ) : (
                    <div>
                      <span className="career-file-title">Click to upload your Resume/CV</span>
                      <span className="career-file-hint">PDF or DOCX format (Max 5MB)</span>
                    </div>
                  )}
                </label>
              </div>

              <div className="form-field" style={{ marginTop: 14 }}>
                <label htmlFor="why_join">Why Techverse Infotech?</label>
                <textarea
                  id="why_join"
                  name="why_join"
                  rows={3}
                  placeholder="Tell us what excites you about this role and our engineering culture..."
                />
              </div>

              <div className="career-consent-row">
                <label className="career-checkbox-label">
                  <input type="checkbox" name="privacy_consent" value="true" required defaultChecked />
                  <span>
                    I confirm that the information provided is accurate and consent to Techverse Infotech processing my application for recruitment purposes.
                  </span>
                </label>
              </div>

              <div className="career-modal-footer">
                <button type="button" className="btn btn--secondary" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={submitting}>
                  <span>{submitting ? 'Submitting Application…' : 'Submit Application'}</span>
                  <Send size={15} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
