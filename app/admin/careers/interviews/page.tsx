'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  ChevronRight,
  User,
  Building2,
  CheckCircle,
} from 'lucide-react';
import type { Interview } from '@/lib/careers';

export default function AdminInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/careers/interviews');
        if (res.ok) {
          const data = await res.json();
          setInterviews(data.interviews || []);
        }
      } catch (err) {
        console.error('Failed to load interviews', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="admin-page-container">
      {/* Head */}
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Interview Schedules</h1>
          <p className="admin-page-desc">
            Track upcoming technical screenings, architectural rounds, and panel discussions.
          </p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop: 16 }}>
        {loading ? (
          <div className="admin-loading-spinner-wrap">
            <div className="admin-loading-spinner" />
            <p>Loading scheduled interviews...</p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="admin-table-empty" style={{ padding: '48px 16px', textAlign: 'center' }}>
            <Calendar size={36} style={{ margin: '0 auto 12px', color: '#64748b' }} />
            <h3 style={{ fontSize: 16, color: '#f1f5f9' }}>No interviews currently scheduled</h3>
            <p style={{ color: '#94a3b8', marginTop: 4 }}>
              To schedule an interview, navigate to a candidate’s dossier in the Applications pipeline and click "Schedule Interview".
            </p>
            <Link
              href="/admin/careers/applications"
              className="btn btn--secondary btn--sm"
              style={{ marginTop: 16, display: 'inline-flex' }}
            >
              Go to Candidate Pipeline →
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Round &amp; Candidate</th>
                  <th>Applied Position</th>
                  <th>Date &amp; Time</th>
                  <th>Mode / Venue</th>
                  <th>Interviewer</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((iv) => (
                  <tr key={iv.id}>
                    <td>
                      <div>
                        <strong>{iv.interview_round}</strong>
                        <div className="admin-cell-sub">
                          <User size={11} style={{ display: 'inline', marginRight: 4 }} />
                          {iv.candidate_name || 'Candidate'}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="admin-role-badge">
                        {iv.job_title || 'General Position'}
                      </span>
                    </td>

                    <td>
                      <div>
                        <strong style={{ color: '#93c5fd' }}>
                          {new Date(iv.interview_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </strong>
                        <div className="admin-cell-sub">
                          <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                          {iv.start_time} - {iv.end_time}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <span>{iv.interview_mode === 'ONLINE' ? 'Online' : 'In-Person'}</span>
                        {iv.meeting_link && (
                          <div className="admin-cell-sub">
                            <a
                              href={iv.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#a855f7', textDecoration: 'underline' }}
                            >
                              Meeting Link
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    <td>{iv.interviewer}</td>

                    <td>
                      <span className="admin-status-pill admin-status--scheduled">
                        {iv.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/careers/applications/${iv.application_id}`}
                        className="btn btn--secondary btn--xs"
                      >
                        <span>View Candidate</span>
                        <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
