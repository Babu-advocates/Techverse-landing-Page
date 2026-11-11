'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import type { Job, JobDepartment } from '@/lib/careers';

export default function AdminJobsManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [jobsRes, deptRes] = await Promise.all([
          fetch('/api/admin/careers/jobs'),
          fetch('/api/careers/jobs'),
        ]);

        if (jobsRes.ok) {
          const data = await jobsRes.json();
          setJobs(data.jobs || []);
        }
        if (deptRes.ok) {
          const data = await deptRes.json();
          setDepartments(data.departments || []);
        }
      } catch (err) {
        console.error('Failed to load jobs list', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleStatusChange(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/careers/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: status as any } : j))
        );
        showMessage(`Job status updated to ${status}.`);
      }
    } catch (err) {
      console.error('Failed to change status', err);
    }
  }

  async function handleDelete(id: string, title: string) {
    const confirmDel = window.confirm(
      `Are you sure you want to delete "${title}"? This will archive the opening. Existing candidate applications will be preserved.`
    );
    if (!confirmDel) return;

    try {
      const res = await fetch(`/api/admin/careers/jobs/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        showMessage(`Job "${title}" deleted.`);
      }
    } catch (err) {
      console.error('Failed to delete job', err);
    }
  }

  async function handleDuplicate(job: Job) {
    const newTitle = `${job.title} (Copy)`;
    const newSlug = `${job.slug}-copy-${Date.now().toString().slice(-4)}`;

    try {
      const payload = {
        ...job,
        title: newTitle,
        slug: newSlug,
        status: 'DRAFT',
      };
      delete (payload as any).id;
      delete (payload as any).created_at;
      delete (payload as any).updated_at;
      delete (payload as any).application_count;

      const res = await fetch('/api/admin/careers/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setJobs((prev) => [data.job, ...prev]);
        showMessage(`Duplicated as draft "${newTitle}".`);
      }
    } catch (err) {
      console.error('Failed to duplicate job', err);
    }
  }

  function showMessage(msg: string) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 4000);
  }

  const filteredJobs = jobs.filter((job) => {
    if (search) {
      const q = search.toLowerCase();
      if (!job.title.toLowerCase().includes(q) && !job.short_description.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter && job.status !== statusFilter) return false;
    if (deptFilter && job.department_id !== deptFilter) return false;
    return true;
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Job Openings Management</h1>
          <p className="admin-page-desc">
            Create, publish, edit, duplicate, and archive job vacancies across all departments.
          </p>
        </div>
        <Link href="/admin/careers/jobs/new" className="btn btn--primary btn--sm">
          <Plus size={15} />
          <span>Post New Opening</span>
        </Link>
      </div>

      {actionMsg && (
        <div className="admin-alert-banner">
          <CheckCircle size={15} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input-wrap">
          <Search size={15} className="admin-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job title or description..."
            className="admin-search-input"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="PAUSED">Paused</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-panel" style={{ marginTop: 16 }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Job Title &amp; Department</th>
                <th>Work Location &amp; Mode</th>
                <th>Status</th>
                <th>Candidates</th>
                <th>Application Deadline</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px' }}>
                    <p style={{ color: '#94a3b8' }}>No job openings found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div>
                        <strong className="admin-job-table-title">{job.title}</strong>
                        <div className="admin-cell-sub">
                          <Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />
                          {job.department_name || 'Department'} • {job.employment_type.replace('_', ' ')}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span>{job.location}</span>
                        <div className="admin-cell-sub">{job.work_mode}</div>
                      </div>
                    </td>
                    <td>
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className={`admin-status-select admin-status-select--${job.status.toLowerCase()}`}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="PAUSED">Paused</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                    <td>
                      <Link
                        href={`/admin/careers/applications?job=${job.id}`}
                        className="admin-candidate-counter"
                      >
                        <strong>{job.application_count || 0}</strong> applicants
                      </Link>
                    </td>
                    <td>
                      {job.application_deadline ? (
                        <span>
                          {new Date(job.application_deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      ) : (
                        <span className="admin-cell-sub">Open-ended</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-action-btn-group">
                        {job.status === 'PUBLISHED' && (
                          <Link
                            href={`/careers/${job.slug}`}
                            target="_blank"
                            className="admin-icon-btn"
                            title="View Public Page"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                        <Link
                          href={`/admin/careers/jobs/${job.id}/edit`}
                          className="admin-icon-btn"
                          title="Edit Job"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(job)}
                          className="admin-icon-btn"
                          title="Duplicate Job"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(job.id, job.title)}
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete / Archive Job"
                        >
                          <Trash2 size={14} />
                        </button>
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
