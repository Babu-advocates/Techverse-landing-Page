'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Download,
  Filter,
  FileText,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Briefcase,
} from 'lucide-react';
import type { JobApplication, Job } from '@/lib/careers';

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

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          fetch('/api/admin/careers/applications'),
          fetch('/api/admin/careers/jobs'),
        ]);

        if (appsRes.ok) {
          const aData = await appsRes.json();
          setApplications(aData.applications || []);
        }
        if (jobsRes.ok) {
          const jData = await jobsRes.json();
          setJobs(jData.jobs || []);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleQuickStatus(id: string, newStatus: string) {
    setStatusUpdating(id);
    try {
      const res = await fetch(`/api/admin/careers/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          comments: `Quick status updated from pipeline view to ${newStatus}`,
        }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, application_status: newStatus } : a))
        );
        showToast(`Status updated to ${newStatus.replace(/_/g, ' ')}`);
      }
    } catch (err) {
      console.error('Failed to update application status', err);
    } finally {
      setStatusUpdating(null);
    }
  }

  function showToast(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  }

  const filteredApps = applications.filter((app) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesName = app.full_name.toLowerCase().includes(q);
      const matchesEmail = app.email.toLowerCase().includes(q);
      const matchesRef = app.application_reference.toLowerCase().includes(q);
      const matchesPhone = app.phone?.toLowerCase().includes(q);
      if (!matchesName && !matchesEmail && !matchesRef && !matchesPhone) return false;
    }
    if (selectedStatus && app.application_status !== selectedStatus) return false;
    if (selectedJob && app.job_id !== selectedJob) return false;
    return true;
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Candidate Pipeline</h1>
          <p className="admin-page-desc">
            Review incoming submissions, advance candidate stages, and download verified resume documents.
          </p>
        </div>

        <div className="admin-head-actions">
          <a
            href="/api/admin/careers/export"
            className="btn btn--secondary btn--sm"
            download="candidates.csv"
          >
            <Download size={14} />
            <span>Export to CSV</span>
          </a>
        </div>
      </div>

      {notification && (
        <div className="admin-alert-banner">
          <CheckCircle size={15} />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input-wrap">
          <Search size={15} className="admin-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or reference number..."
            className="admin-search-input"
          />
        </div>

        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">All Job Positions</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">All Recruitment Stages</option>
          {APPLICATION_STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pipeline Table */}
      <div className="admin-panel" style={{ marginTop: 16 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference &amp; Candidate</th>
                <th>Applied Opening</th>
                <th>Experience &amp; Status</th>
                <th>Stage Pipeline</th>
                <th>Submitted</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px' }}>
                    <p style={{ color: '#94a3b8' }}>
                      No applications found matching your search and filter criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="admin-user-cell">
                        <span className="admin-cell-ref">{app.application_reference}</span>
                        <strong style={{ fontSize: 14 }}>{app.full_name}</strong>
                        <div className="admin-cell-sub">
                          <Mail size={11} style={{ display: 'inline', marginRight: 4 }} />
                          {app.email}
                        </div>
                        {app.phone && (
                          <div className="admin-cell-sub">
                            <Phone size={11} style={{ display: 'inline', marginRight: 4 }} />
                            {app.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div>
                        <strong style={{ color: '#f1f5f9' }}>
                          {app.job_title || 'General Application'}
                        </strong>
                        <div className="admin-cell-sub">{app.location || 'India'}</div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <span>{app.experience_years} yrs exp</span>
                        {app.notice_period && (
                          <div className="admin-cell-sub">{app.notice_period}</div>
                        )}
                      </div>
                    </td>

                    <td>
                      <select
                        value={app.application_status}
                        disabled={statusUpdating === app.id}
                        onChange={(e) => handleQuickStatus(app.id, e.target.value)}
                        className={`admin-status-select admin-status-select--${app.application_status.toLowerCase()}`}
                      >
                        {APPLICATION_STAGES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <span className="admin-cell-sub">
                        {new Date(app.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
                        <a
                          href={`/api/admin/careers/applications/${app.id}/resume`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn--secondary btn--xs"
                          title="Download Verified Resume PDF"
                        >
                          <FileText size={12} />
                          <span>Resume</span>
                        </a>

                        <Link
                          href={`/admin/careers/applications/${app.id}`}
                          className="btn btn--primary btn--xs"
                        >
                          <span>Dossier</span>
                          <ChevronRight size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
