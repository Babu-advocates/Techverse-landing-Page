'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  Download,
  CheckCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  ChevronRight,
  Building2,
} from 'lucide-react';
import type { Job, JobApplication } from '@/lib/careers';

export default function AdminCareersOverview() {
  const [metrics, setMetrics] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [metricsRes, jobsRes, appsRes] = await Promise.all([
          fetch('/api/admin/careers/metrics'),
          fetch('/api/admin/careers/jobs'),
          fetch('/api/admin/careers/applications?limit=6'),
        ]);

        if (metricsRes.ok) setMetrics(await metricsRes.json());
        if (jobsRes.ok) {
          const jData = await jobsRes.json();
          setJobs(jData.jobs || []);
        }
        if (appsRes.ok) {
          const aData = await appsRes.json();
          setRecentApplications(aData.applications || []);
        }
      } catch (err) {
        console.error('Failed to load admin overview metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleQuickStatusChange(jobId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/careers/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: newStatus as any } : j))
        );
      }
    } catch (err) {
      console.error('Failed to update job status', err);
    }
  }

  if (loading) {
    return (
      <div className="admin-loading-spinner-wrap">
        <div className="admin-loading-spinner" />
        <p>Loading recruitment metrics...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Recruitment Dashboard</h1>
          <p className="admin-page-desc">
            Monitor real-time applicant pipelines, manage job postings, and track candidate interview outcomes.
          </p>
        </div>

        <div className="admin-head-actions">
          <a
            href="/api/admin/careers/export"
            className="btn btn--secondary btn--sm"
            download="techverse-candidate-applications.csv"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </a>
          <Link href="/admin/careers/jobs/new" className="btn btn--primary btn--sm">
            <Plus size={14} />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-card__top">
            <span className="admin-metric-label">Total Applications</span>
            <span className="admin-metric-icon admin-metric-icon--blue">
              <Users size={18} />
            </span>
          </div>
          <div className="admin-metric-val">{metrics?.totalApplications || 0}</div>
          <div className="admin-metric-footer">
            <span>+{metrics?.thisMonthApplications || 0} submitted this month</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-card__top">
            <span className="admin-metric-label">Published Openings</span>
            <span className="admin-metric-icon admin-metric-icon--green">
              <Briefcase size={18} />
            </span>
          </div>
          <div className="admin-metric-val">{metrics?.publishedJobs || 0}</div>
          <div className="admin-metric-footer">
            <span>{metrics?.totalJobs || 0} total listings created</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-card__top">
            <span className="admin-metric-label">Draft Openings</span>
            <span className="admin-metric-icon admin-metric-icon--amber">
              <Clock size={18} />
            </span>
          </div>
          <div className="admin-metric-val">{metrics?.draftJobs || 0}</div>
          <div className="admin-metric-footer">
            <span>Unpublished internal drafts</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-card__top">
            <span className="admin-metric-label">Active Interviews</span>
            <span className="admin-metric-icon admin-metric-icon--purple">
              <Calendar size={18} />
            </span>
          </div>
          <div className="admin-metric-val">{metrics?.scheduledInterviews || 0}</div>
          <div className="admin-metric-footer">
            <span>Upcoming rounds scheduled</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Recent Applications + Job Status Overview */}
      <div className="admin-dashboard-split">
        {/* Recent Applications Column */}
        <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2 className="admin-panel__title">Recent Candidate Applications</h2>
              <p className="admin-panel__subtitle">Latest submissions across all active job openings</p>
            </div>
            <Link href="/admin/careers/applications" className="admin-panel__link">
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="admin-table-empty">
              <p>No applications received yet. They will appear here once submitted.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Applied Position</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="admin-user-cell">
                          <strong>{app.full_name}</strong>
                          <span className="admin-cell-sub">{app.email}</span>
                          <span className="admin-cell-ref">{app.application_reference}</span>
                        </div>
                      </td>
                      <td>
                        <span className="admin-role-badge">
                          {app.job_title || 'General Application'}
                        </span>
                      </td>
                      <td>{app.experience_years} yrs</td>
                      <td>
                        <span className={`admin-status-pill admin-status--${app.application_status.toLowerCase()}`}>
                          {app.application_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/admin/careers/applications/${app.id}`}
                          className="btn btn--secondary btn--xs"
                        >
                          View Dossier
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Active Openings Overview */}
        <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2 className="admin-panel__title">Job Listings Summary</h2>
              <p className="admin-panel__subtitle">Manage visibility and status for all vacancies</p>
            </div>
            <Link href="/admin/careers/jobs" className="admin-panel__link">
              <span>Manage Jobs</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div>
                        <strong>{job.title}</strong>
                        <div className="admin-cell-sub">
                          {job.location} • {job.work_mode}
                        </div>
                      </div>
                    </td>
                    <td>{job.department_name}</td>
                    <td>
                      <select
                        value={job.status}
                        onChange={(e) => handleQuickStatusChange(job.id, e.target.value)}
                        className={`admin-status-select admin-status-select--${job.status.toLowerCase()}`}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="PAUSED">Paused</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                    <td>
                      <strong>{job.application_count || 0}</strong> candidates
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <Link
                          href={`/admin/careers/jobs/${job.id}/edit`}
                          className="btn btn--secondary btn--xs"
                        >
                          Edit
                        </Link>
                        {job.status === 'PUBLISHED' && (
                          <Link
                            href={`/careers/${job.slug}`}
                            target="_blank"
                            className="btn btn--ghost btn--xs"
                            title="View on Live Site"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
