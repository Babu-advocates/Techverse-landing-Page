'use client';

import Link from 'next/link';
import { MapPin, Briefcase, Clock, Calendar, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import type { Job } from '@/lib/careers';

type Props = {
  job: Job;
  onApply: (job: Job) => void;
};

export default function JobCard({ job, onApply }: Props) {
  const modeLabels: Record<string, string> = {
    ONSITE: 'On-site',
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
  };

  const typeLabels: Record<string, string> = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
  };

  const formattedDeadline = job.application_deadline
    ? new Date(job.application_deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const experienceText =
    job.min_experience === 0 && (!job.max_experience || job.max_experience === 0)
      ? 'Fresher / 0+ yrs'
      : job.max_experience && job.max_experience > job.min_experience
      ? `${job.min_experience}–${job.max_experience} yrs`
      : `${job.min_experience}+ yrs`;

  const salaryText =
    job.salary_min && job.salary_max
      ? `${job.salary_currency === 'INR' ? '₹' : '$'}${(job.salary_min / 100000).toFixed(1)}L – ${(job.salary_max / 100000).toFixed(1)}L PA`
      : job.salary_min
      ? `${job.salary_currency === 'INR' ? '₹' : '$'}${(job.salary_min / 100000).toFixed(1)}L+ PA`
      : null;

  return (
    <div className="career-job-card">
      <div className="career-job-card__head">
        <div className="career-job-card__info">
          <div className="career-job-card__dept-row">
            <span className="career-job-card__dept">
              <Building2 size={13} className="career-job-card__dept-icon" />
              {job.department_name || 'Engineering'}
            </span>
            <span className="career-job-card__badge career-job-card__badge--mode">
              {modeLabels[job.work_mode] || job.work_mode}
            </span>
            <span className="career-job-card__badge career-job-card__badge--type">
              {typeLabels[job.employment_type] || job.employment_type}
            </span>
          </div>

          <h3 className="career-job-card__title">
            <Link href={`/careers/${job.slug}`}>{job.title}</Link>
          </h3>
        </div>

        {salaryText && (
          <div className="career-job-card__salary">
            <span className="career-job-card__salary-label">Compensation</span>
            <span className="career-job-card__salary-value">{salaryText}</span>
          </div>
        )}
      </div>

      <p className="career-job-card__desc">{job.short_description}</p>

      {/* Meta Specs */}
      <div className="career-job-card__specs">
        <div className="career-job-card__spec-item">
          <MapPin size={14} />
          <span>{job.location}</span>
        </div>
        <div className="career-job-card__spec-item">
          <Briefcase size={14} />
          <span>{experienceText}</span>
        </div>
        {job.vacancies > 0 && (
          <div className="career-job-card__spec-item">
            <Sparkles size={14} />
            <span>{job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}</span>
          </div>
        )}
        {formattedDeadline && (
          <div className="career-job-card__spec-item">
            <Clock size={14} />
            <span>Apply by {formattedDeadline}</span>
          </div>
        )}
      </div>

      {/* Required Skills tags */}
      {job.required_skills && job.required_skills.length > 0 && (
        <div className="career-job-card__tags">
          {job.required_skills.slice(0, 5).map((skill) => (
            <span key={skill} className="career-job-card__tag">
              {skill}
            </span>
          ))}
          {job.required_skills.length > 5 && (
            <span className="career-job-card__tag career-job-card__tag--more">
              +{job.required_skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Card Actions */}
      <div className="career-job-card__foot">
        <Link href={`/careers/${job.slug}`} className="career-job-card__view-link">
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
        <button
          type="button"
          onClick={() => onApply(job)}
          className="btn btn--primary career-job-card__apply-btn"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
