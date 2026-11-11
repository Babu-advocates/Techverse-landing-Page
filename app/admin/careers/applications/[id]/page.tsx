'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Calendar,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import type { JobApplication, ApplicationStatusHistory } from '@/lib/careers';

const APPLICATION_STAGES = [
  { value: 'NEW', label: 'New' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'ASSESSMENT_PENDING', label: 'Assessment Pending' },
  { value: 'ASSESSMENT_COMPLETED', label: 'Assessment Completed' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
  { value: 'INTERVIEW_COMPLETED', label: 'Interview Completed' },
  { value: 'SELECTED', label: 'Selected' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'OFFER_RELEASED', label: 'Offer Released' },
  { value: 'OFFER_ACCEPTED', label: 'Offer Accepted' },
  { value: 'OFFER_DECLINED', label: 'Offer Declined' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
];

export default function CandidateDossierPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [application, setApplication] = useState<JobApplication | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Status update state
  const [targetStatus, setTargetStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Note state
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Interview state
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewRound, setInterviewRound] = useState('Technical Screening (Round 1)');
  const [interviewDate, setInterviewDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [interviewMode, setInterviewMode] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/');
  const [interviewer, setInterviewer] = useState('Senior Tech Lead');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [schedulingInterview, setSchedulingInterview] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadDossier() {
      try {
        const res = await fetch(`/api/admin/careers/applications/${id}`);
        if (!res.ok) {
          router.push('/admin/careers/applications');
          return;
        }
        const data = await res.json();
        setApplication(data.application);
        setTargetStatus(data.application.application_status);
        setHistory(data.history || []);
        setNotes(data.notes || []);
        setInterviews(data.interviews || []);
      } catch (err) {
        console.error('Failed to load candidate dossier', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadDossier();
  }, [id, router]);

  function notify(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  async function handleStatusSubmit(e: FormEvent) {
    e.preventDefault();
    if (!targetStatus || targetStatus === application?.application_status) return;

    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/careers/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          comments: statusComment.trim() || `Advanced status to ${targetStatus}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setApplication((prev) => (prev ? { ...prev, application_status: targetStatus } : null));
        setStatusComment('');
        // Reload history
        const reloadRes = await fetch(`/api/admin/careers/applications/${id}`);
        if (reloadRes.ok) {
          const reloaded = await reloadRes.json();
          setHistory(reloaded.history || []);
        }
        notify(`Recruitment status transitioned to ${targetStatus.replace(/_/g, ' ')}`);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/careers/applications/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotes((prev) => [data.note, ...prev]);
        setNewNote('');
        notify('Private recruiter note logged.');
      }
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setAddingNote(false);
    }
  }

  async function handleScheduleInterview(e: FormEvent) {
    e.preventDefault();
    if (!interviewDate || !startTime) return;

    setSchedulingInterview(true);
    try {
      const res = await fetch('/api/admin/careers/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: id,
          interview_round: interviewRound,
          interview_date: interviewDate,
          start_time: startTime,
          end_time: endTime,
          interview_mode: interviewMode,
          meeting_link: meetingLink,
          interviewer: interviewer,
          interview_notes: interviewNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setInterviews((prev) => [data.interview, ...prev]);
        setShowInterviewForm(false);
        setInterviewNotes('');
        notify('Interview scheduled & calendar invite triggered.');
      }
    } catch (err) {
      console.error('Failed to schedule interview', err);
    } finally {
      setSchedulingInterview(false);
    }
  }

  if (loading || !application) {
    return (
      <div className="admin-loading-spinner-wrap">
        <div className="admin-loading-spinner" />
        <p>Loading candidate profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Top Breadcrumb & Header */}
      <div className="admin-page-head">
        <div>
          <Link href="/admin/careers/applications" className="admin-back-link">
            <ArrowLeft size={14} />
            <span>Back to Candidate Pipeline</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <h1 className="admin-page-title">{application.full_name}</h1>
            <span className={`admin-status-pill admin-status--${application.application_status.toLowerCase()}`}>
              {application.application_status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="admin-page-desc">
            Reference: <strong>{application.application_reference}</strong> • Submitted on{' '}
            {new Date(application.submitted_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="admin-head-actions">
          <a
            href={`/api/admin/careers/applications/${application.id}/resume`}
            target="_blank"
            rel="noreferrer"
            className="btn btn--primary btn--sm"
          >
            <Download size={14} />
            <span>Download Resume PDF</span>
          </a>
        </div>
      </div>

      {toastMsg && (
        <div className="admin-alert-banner">
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main 2-Column Dossier Grid */}
      <div className="admin-dossier-grid">
        {/* Left Column: Candidate Info, Questions, Resume */}
        <div className="admin-dossier-main">
          {/* Contact & Professional Overview */}
          <div className="admin-panel">
            <h2 className="admin-panel__title">Candidate Profile</h2>
            <div className="admin-profile-specs-grid">
              <div className="admin-spec-box">
                <span className="admin-spec-label">Applied Role</span>
                <span className="admin-spec-val" style={{ color: '#c084fc', fontWeight: 600 }}>
                  {application.job_title || 'General Application'}
                </span>
              </div>

              <div className="admin-spec-box">
                <span className="admin-spec-label">Total Experience</span>
                <span className="admin-spec-val">{application.experience_years} Years</span>
              </div>

              <div className="admin-spec-box">
                <span className="admin-spec-label">Notice Period</span>
                <span className="admin-spec-val">{application.notice_period || 'Not Specified'}</span>
              </div>

              <div className="admin-spec-box">
                <span className="admin-spec-label">Expected Salary</span>
                <span className="admin-spec-val">{application.expected_salary || 'Not Specified'}</span>
              </div>

              <div className="admin-spec-box">
                <span className="admin-spec-label">Current Company</span>
                <span className="admin-spec-val">
                  {application.current_company
                    ? `${application.current_designation ? `${application.current_designation} at ` : ''}${application.current_company}`
                    : 'Not currently employed'}
                </span>
              </div>

              <div className="admin-spec-box">
                <span className="admin-spec-label">Highest Qualification</span>
                <span className="admin-spec-val">{application.highest_qualification || 'Bachelor’s Degree'}</span>
              </div>
            </div>

            {/* Direct Contact info */}
            <div className="admin-contact-strip" style={{ marginTop: 20 }}>
              <a href={`mailto:${application.email}`} className="admin-contact-link">
                <Mail size={14} />
                <span>{application.email}</span>
              </a>
              {application.phone && (
                <a href={`tel:${application.phone}`} className="admin-contact-link">
                  <Phone size={14} />
                  <span>{application.phone}</span>
                </a>
              )}
              {application.location && (
                <span className="admin-contact-link" style={{ cursor: 'default' }}>
                  <MapPin size={14} />
                  <span>{application.location}</span>
                </span>
              )}
            </div>

            {/* Social & Portfolio Links */}
            {(application.linkedin_url || application.github_url || application.portfolio_url) && (
              <div className="admin-social-links" style={{ marginTop: 16 }}>
                {application.linkedin_url && (
                  <a
                    href={application.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-social-btn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.2a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                    </svg>
                    <span>LinkedIn Profile</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {application.github_url && (
                  <a
                    href={application.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-social-btn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                    </svg>
                    <span>GitHub Code</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {application.portfolio_url && (
                  <a
                    href={application.portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-social-btn"
                  >
                    <Globe size={14} />
                    <span>Live Portfolio</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Technical Skills & Questionnaire */}
          <div className="admin-panel" style={{ marginTop: 20 }}>
            <h2 className="admin-panel__title">Candidate Responses &amp; Skills</h2>

            {application.skills && (
              <div style={{ marginTop: 12 }}>
                <span className="admin-spec-label">Reported Skills</span>
                <p style={{ marginTop: 4, color: '#e2e8f0' }}>{application.skills}</p>
              </div>
            )}

            {application.why_join && (
              <div style={{ marginTop: 16 }}>
                <span className="admin-spec-label">Why do you want to join Techverse Infotech?</span>
                <p style={{ marginTop: 4, color: '#e2e8f0', whiteSpace: 'pre-line' }}>
                  {application.why_join}
                </p>
              </div>
            )}

            {application.cover_letter && (
              <div style={{ marginTop: 16 }}>
                <span className="admin-spec-label">Cover Letter</span>
                <p style={{ marginTop: 4, color: '#cbd5e1', whiteSpace: 'pre-line' }}>
                  {application.cover_letter}
                </p>
              </div>
            )}
          </div>

          {/* Verified Resume File Box */}
          <div className="admin-panel" style={{ marginTop: 20 }}>
            <h2 className="admin-panel__title">Attached Resume Document</h2>
            <div className="admin-resume-box">
              <div className="admin-resume-box__icon">
                <FileText size={24} />
              </div>
              <div className="admin-resume-box__info">
                <strong>{application.resume_original_name || 'Resume-Candidate.pdf'}</strong>
                <span>
                  Size: {(application.resume_file_size / 1024).toFixed(1)} KB • Verified PDF Magic
                  Bytes
                </span>
              </div>
              <a
                href={`/api/admin/careers/applications/${application.id}/resume`}
                target="_blank"
                rel="noreferrer"
                className="btn btn--primary btn--sm"
              >
                <Download size={14} />
                <span>Open / Download</span>
              </a>
            </div>
          </div>

          {/* Interview Schedule Panel */}
          <div className="admin-panel" style={{ marginTop: 20 }}>
            <div className="admin-panel__head">
              <div>
                <h2 className="admin-panel__title">Interview Rounds</h2>
                <p className="admin-panel__subtitle">Scheduled discussions and technical evaluations</p>
              </div>
              {!showInterviewForm && (
                <button
                  type="button"
                  onClick={() => setShowInterviewForm(true)}
                  className="btn btn--secondary btn--sm"
                >
                  <Calendar size={14} />
                  <span>Schedule Interview</span>
                </button>
              )}
            </div>

            {/* Form */}
            {showInterviewForm && (
              <form onSubmit={handleScheduleInterview} className="admin-interview-form">
                <div className="admin-form-row">
                  <div className="admin-field-col">
                    <label className="admin-label">Round Title</label>
                    <input
                      type="text"
                      required
                      value={interviewRound}
                      onChange={(e) => setInterviewRound(e.target.value)}
                      placeholder="Technical Architecture Round"
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-field-col">
                    <label className="admin-label">Interviewer</label>
                    <input
                      type="text"
                      required
                      value={interviewer}
                      onChange={(e) => setInterviewer(e.target.value)}
                      placeholder="Engineering Lead"
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-form-row" style={{ marginTop: 12 }}>
                  <div className="admin-field-col">
                    <label className="admin-label">Date</label>
                    <input
                      type="date"
                      required
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-field-col">
                    <label className="admin-label">Time Range</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="admin-input"
                      />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-form-row" style={{ marginTop: 12 }}>
                  <div className="admin-field-col">
                    <label className="admin-label">Mode</label>
                    <select
                      value={interviewMode}
                      onChange={(e) => setInterviewMode(e.target.value as any)}
                      className="admin-input"
                    >
                      <option value="ONLINE">Online (Google Meet / Zoom)</option>
                      <option value="OFFLINE">In-Person (Coimbatore Office)</option>
                    </select>
                  </div>
                  <div className="admin-field-col">
                    <label className="admin-label">Meeting URL or Venue</label>
                    <input
                      type="text"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://meet.google.com/xyz-abc"
                      className="admin-input"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label className="admin-label">Internal Briefing Notes for Interviewer</label>
                  <textarea
                    rows={2}
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    placeholder="Focus on distributed PostgreSQL transactions and Next.js server components..."
                    className="admin-textarea"
                  />
                </div>

                <div className="admin-form-actions" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setShowInterviewForm(false)}
                    className="btn btn--secondary btn--sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={schedulingInterview}
                    className="btn btn--primary btn--sm"
                  >
                    <span>{schedulingInterview ? 'Scheduling...' : 'Save & Dispatch Invite'}</span>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}

            {/* List of Scheduled Interviews */}
            <div className="admin-interviews-list" style={{ marginTop: 16 }}>
              {interviews.length === 0 ? (
                <p className="admin-cell-sub">No interviews scheduled yet.</p>
              ) : (
                interviews.map((iv) => (
                  <div key={iv.id} className="admin-interview-card">
                    <div>
                      <strong>{iv.interview_round}</strong>
                      <div className="admin-cell-sub">
                        Interviewer: {iv.interviewer} • {iv.interview_mode}
                      </div>
                      <div style={{ fontSize: 13, color: '#93c5fd', marginTop: 4 }}>
                        {new Date(iv.interview_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at {iv.start_time} - {iv.end_time}
                      </div>
                    </div>
                    {iv.meeting_link && (
                      <a
                        href={iv.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn--ghost btn--xs"
                      >
                        <span>Join Link</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Status Transition Stepper & Recruiter Notes */}
        <div className="admin-dossier-side">
          {/* Status Stepper Card */}
          <div className="admin-panel">
            <h2 className="admin-panel__title">Recruitment Stage</h2>
            <p className="admin-panel__subtitle">Advance candidate across the 13 recruitment stages</p>

            <form onSubmit={handleStatusSubmit} style={{ marginTop: 14 }}>
              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Update Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="admin-input"
                >
                  {APPLICATION_STAGES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="admin-label">Transition Comment / Rationale *</label>
                <textarea
                  rows={2}
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="e.g. Passed coding assessment with 95% score; moving to panel interview."
                  className="admin-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={updatingStatus || targetStatus === application.application_status}
                className="btn btn--primary btn--sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{updatingStatus ? 'Transitioning...' : 'Confirm Status Update'}</span>
              </button>
            </form>

            {/* Audit History Timeline */}
            <div className="admin-history-timeline" style={{ marginTop: 24 }}>
              <span className="admin-spec-label">Stage Audit History</span>
              {history.map((h, i) => (
                <div key={h.id || i} className="admin-history-item">
                  <div className="admin-history-dot" />
                  <div className="admin-history-body">
                    <strong>{h.new_status.replace(/_/g, ' ')}</strong>
                    {h.comments && <p>{h.comments}</p>}
                    <span className="admin-history-time">
                      {h.changed_by_name || 'Admin'} •{' '}
                      {new Date(h.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Recruiter Notes (Confidential) */}
          <div className="admin-panel" style={{ marginTop: 20 }}>
            <h2 className="admin-panel__title">Internal Recruiter Notes</h2>
            <p className="admin-panel__subtitle">Private notes visible only to hiring admins</p>

            <form onSubmit={handleAddNote} style={{ marginTop: 14 }}>
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log internal feedback, compensation discussions, or candidate references..."
                className="admin-textarea"
              />
              <button
                type="submit"
                disabled={addingNote || !newNote.trim()}
                className="btn btn--secondary btn--sm"
                style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
              >
                <MessageSquare size={14} />
                <span>{addingNote ? 'Saving...' : 'Add Recruiter Note'}</span>
              </button>
            </form>

            <div className="admin-notes-log" style={{ marginTop: 16 }}>
              {notes.length === 0 ? (
                <span className="admin-cell-sub">No notes recorded yet.</span>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="admin-note-bubble">
                    <p>{n.note}</p>
                    <span className="admin-history-time">
                      {n.author_name || 'Recruiter'} •{' '}
                      {new Date(n.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
