'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import type { Job, JobDepartment } from '@/lib/careers';

type Props = {
  initialJob?: Partial<Job>;
  isEdit?: boolean;
};

export default function JobForm({ initialJob, isEdit }: Props) {
  const router = useRouter();
  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields State
  const [title, setTitle] = useState(initialJob?.title || '');
  const [slug, setSlug] = useState(initialJob?.slug || '');
  const [slugTouched, setSlugTouched] = useState(Boolean(initialJob?.slug));
  const [departmentId, setDepartmentId] = useState(initialJob?.department_id || '');
  const [employmentType, setEmploymentType] = useState(initialJob?.employment_type || 'FULL_TIME');
  const [workMode, setWorkMode] = useState(initialJob?.work_mode || 'HYBRID');
  const [location, setLocation] = useState(initialJob?.location || 'Coimbatore, Tamil Nadu, India');
  const [minExp, setMinExp] = useState(initialJob?.min_experience?.toString() || '2');
  const [maxExp, setMaxExp] = useState(initialJob?.max_experience?.toString() || '5');
  const [salaryMin, setSalaryMin] = useState(initialJob?.salary_min?.toString() || '');
  const [salaryMax, setSalaryMax] = useState(initialJob?.salary_max?.toString() || '');
  const [salaryCurrency, setSalaryCurrency] = useState(initialJob?.salary_currency || 'INR');
  const [vacancies, setVacancies] = useState(initialJob?.vacancies?.toString() || '1');
  const [shortDesc, setShortDesc] = useState(initialJob?.short_description || '');
  const [description, setDescription] = useState(initialJob?.description || '');
  const [responsibilities, setResponsibilities] = useState(
    initialJob?.responsibilities ? initialJob.responsibilities.join('\n') : ''
  );
  const [qualifications, setQualifications] = useState(
    initialJob?.qualifications ? initialJob.qualifications.join('\n') : ''
  );
  const [preferredQualifications, setPreferredQualifications] = useState(
    initialJob?.preferred_qualifications ? initialJob.preferred_qualifications.join('\n') : ''
  );
  const [requiredSkills, setRequiredSkills] = useState(
    initialJob?.required_skills ? initialJob.required_skills.join(', ') : ''
  );
  const [benefits, setBenefits] = useState(
    initialJob?.benefits ? initialJob.benefits.join('\n') : ''
  );
  const [openingDate, setOpeningDate] = useState(
    initialJob?.opening_date ? initialJob.opening_date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [deadline, setDeadline] = useState(
    initialJob?.application_deadline ? initialJob.application_deadline.slice(0, 10) : ''
  );
  const [seoTitle, setSeoTitle] = useState(initialJob?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialJob?.seo_description || '');
  const [status, setStatus] = useState<string>(initialJob?.status || 'DRAFT');

  // Auto generate slug from title if not manually changed
  useEffect(() => {
    if (!slugTouched && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  }, [title, slugTouched]);

  // Load departments
  useEffect(() => {
    async function loadDepts() {
      try {
        const res = await fetch('/api/careers/jobs');
        if (res.ok) {
          const data = await res.json();
          setDepartments(data.departments || []);
          if (!departmentId && data.departments?.length > 0) {
            setDepartmentId(data.departments[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load departments', err);
      }
    }
    loadDepts();
  }, [departmentId]);

  async function handleSubmit(saveStatus: string) {
    setError(null);
    if (!title.trim()) {
      setError('Job title is required');
      return;
    }
    if (!slug.trim()) {
      setError('URL slug is required');
      return;
    }
    if (!departmentId) {
      setError('Please select an associated department');
      return;
    }
    if (!shortDesc.trim()) {
      setError('Short summary is required');
      return;
    }

    setLoading(true);

    const payload = {
      title,
      slug,
      department_id: departmentId,
      employment_type: employmentType,
      work_mode: workMode,
      location,
      min_experience: parseInt(minExp, 10) || 0,
      max_experience: maxExp ? parseInt(maxExp, 10) : null,
      salary_min: salaryMin ? parseInt(salaryMin, 10) : null,
      salary_max: salaryMax ? parseInt(salaryMax, 10) : null,
      salary_currency: salaryCurrency,
      vacancies: parseInt(vacancies, 10) || 1,
      short_description: shortDesc,
      description,
      responsibilities: responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      qualifications: qualifications
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      preferred_qualifications: preferredQualifications
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      required_skills: requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: benefits
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      opening_date: openingDate || new Date().toISOString(),
      application_deadline: deadline || null,
      seo_title: seoTitle || `${title} | Techverse Infotech Careers`,
      seo_description: seoDescription || shortDesc,
      status: saveStatus,
    };

    try {
      const url = isEdit
        ? `/api/admin/careers/jobs/${initialJob?.id}`
        : '/api/admin/careers/jobs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save job opening');
      }

      router.push('/admin/careers/jobs');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving job');
      setLoading(false);
    }
  }

  return (
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-page-head">
        <div>
          <Link href="/admin/careers/jobs" className="admin-back-link">
            <ArrowLeft size={14} />
            <span>Back to Openings List</span>
          </Link>
          <h1 className="admin-page-title">
            {isEdit ? `Edit Job: ${initialJob?.title}` : 'Post New Job Opening'}
          </h1>
          <p className="admin-page-desc">
            Define role requirements, department, experience expectations, and publication schedule.
          </p>
        </div>

        <div className="admin-head-actions">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('DRAFT')}
            className="btn btn--secondary btn--sm"
          >
            <Save size={14} />
            <span>Save as Draft</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('PUBLISHED')}
            className="btn btn--primary btn--sm"
          >
            <Send size={14} />
            <span>{isEdit ? 'Update & Publish' : 'Publish Opening Now'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-form-error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Form Body */}
      <div className="admin-form-grid">
        {/* Left Column: Core Job Details */}
        <div className="admin-form-main">
          {/* Section: Basic Info */}
          <div className="admin-panel">
            <h2 className="admin-panel__title">Role Overview</h2>
            <div className="admin-form-row">
              <div className="admin-field-col">
                <label className="admin-label">Job Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="admin-input"
                />
              </div>

              <div className="admin-field-col">
                <label className="admin-label">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugTouched(true);
                  }}
                  placeholder="senior-fullstack-engineer"
                  className="admin-input"
                />
                <span className="admin-field-hint">
                  Public URL: /careers/{slug || '...'}
                </span>
              </div>
            </div>

            <div className="admin-form-row" style={{ marginTop: 16 }}>
              <div className="admin-field-col">
                <label className="admin-label">Department *</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="admin-input"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-field-col">
                <label className="admin-label">Employment Type *</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="admin-input"
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
            </div>

            <div className="admin-form-row" style={{ marginTop: 16 }}>
              <div className="admin-field-col">
                <label className="admin-label">Work Mode *</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as any)}
                  className="admin-input"
                >
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                  <option value="ONSITE">On-site</option>
                </select>
              </div>

              <div className="admin-field-col">
                <label className="admin-label">Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Coimbatore, Tamil Nadu, India"
                  className="admin-input"
                />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">Short Summary (1–2 sentences) *</label>
              <textarea
                rows={2}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Architect resilient Next.js web applications and PostgreSQL distributed services."
                className="admin-textarea"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">Detailed Role Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive narrative about team goals, engineering philosophy, and day-to-day impact..."
                className="admin-textarea"
              />
            </div>
          </div>

          {/* Section: Responsibilities & Qualifications */}
          <div className="admin-panel" style={{ marginTop: 24 }}>
            <h2 className="admin-panel__title">Responsibilities &amp; Requirements</h2>
            <p className="admin-panel__subtitle">Enter one item per line for bullet points</p>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">Key Responsibilities (One per line)</label>
              <textarea
                rows={4}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="• Architect scalable REST and GraphQL APIs&#10;• Maintain 99.9% uptime on Neon PostgreSQL database&#10;• Collaborate directly with product designers"
                className="admin-textarea"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">Required Qualifications (One per line)</label>
              <textarea
                rows={4}
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="• B.E / B.Tech or equivalent practical experience&#10;• 3+ years experience with Next.js, Node.js, and TypeScript&#10;• Proven experience with relational SQL databases"
                className="admin-textarea"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">Preferred / Nice-to-Have Qualifications (One per line)</label>
              <textarea
                rows={3}
                value={preferredQualifications}
                onChange={(e) => setPreferredQualifications(e.target.value)}
                placeholder="• Experience with AWS, Docker, or Kubernetes&#10;• Background with AI data annotation pipelines"
                className="admin-textarea"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">Technical Skills (Comma separated)</label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="TypeScript, Next.js, PostgreSQL, Docker, Tailwind CSS, Redis"
                className="admin-input"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">Benefits &amp; Perks (One per line)</label>
              <textarea
                rows={3}
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="• Comprehensive health insurance for employee & family&#10;• Annual learning stipend for certifications&#10;• Ergonomic desk setup and latest Mac hardware"
                className="admin-textarea"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Parameters, Dates, SEO */}
        <div className="admin-form-side">
          {/* Publishing Parameters */}
          <div className="admin-panel">
            <h2 className="admin-panel__title">Parameters</h2>

            <div style={{ marginTop: 12 }}>
              <label className="admin-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="admin-input"
              >
                <option value="DRAFT">Draft (Internal Only)</option>
                <option value="PUBLISHED">Published (Accepting Applications)</option>
                <option value="PAUSED">Paused</option>
                <option value="CLOSED">Closed (Archived)</option>
              </select>
            </div>

            <div className="admin-form-row" style={{ marginTop: 16 }}>
              <div className="admin-field-col">
                <label className="admin-label">Min Exp (Yrs)</label>
                <input
                  type="number"
                  min="0"
                  value={minExp}
                  onChange={(e) => setMinExp(e.target.value)}
                  className="admin-input"
                />
              </div>
              <div className="admin-field-col">
                <label className="admin-label">Max Exp (Yrs)</label>
                <input
                  type="number"
                  min="0"
                  value={maxExp}
                  onChange={(e) => setMaxExp(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-row" style={{ marginTop: 16 }}>
              <div className="admin-field-col">
                <label className="admin-label">Currency</label>
                <select
                  value={salaryCurrency}
                  onChange={(e) => setSalaryCurrency(e.target.value)}
                  className="admin-input"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div className="admin-field-col">
                <label className="admin-label">Vacancies</label>
                <input
                  type="number"
                  min="1"
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-row" style={{ marginTop: 16 }}>
              <div className="admin-field-col">
                <label className="admin-label">Salary Min (Annual)</label>
                <input
                  type="number"
                  step="50000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="600000"
                  className="admin-input"
                />
              </div>
              <div className="admin-field-col">
                <label className="admin-label">Salary Max (Annual)</label>
                <input
                  type="number"
                  step="50000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="1200000"
                  className="admin-input"
                />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">Application Opening Date</label>
              <input
                type="date"
                value={openingDate}
                onChange={(e) => setOpeningDate(e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">Application Deadline (Optional)</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="admin-panel" style={{ marginTop: 24 }}>
            <h2 className="admin-panel__title">SEO &amp; Social Meta</h2>

            <div style={{ marginTop: 12 }}>
              <label className="admin-label">Custom SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Leave blank to use default role title"
                className="admin-input"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="admin-label">SEO Description</label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Meta description displayed on search results..."
                className="admin-textarea"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
