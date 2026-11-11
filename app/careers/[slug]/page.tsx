import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Share2,
} from 'lucide-react';
import { getJobBySlug } from '@/lib/careers';
import JobDetailsClient from '@/components/careers/JobDetailsClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job || job.status !== 'PUBLISHED') {
    return {
      title: 'Job Not Found | Techverse Infotech Careers',
    };
  }

  return {
    title: job.seo_title || `${job.title} | Careers at Techverse Infotech`,
    description:
      job.seo_description ||
      job.short_description ||
      `Apply for the ${job.title} opening at Techverse Infotech in ${job.location}.`,
    openGraph: {
      title: `${job.title} | Techverse Infotech Careers`,
      description: job.short_description,
      type: 'article',
      url: `https://techverseinfotech.com/careers/${job.slug}`,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job || job.status !== 'PUBLISHED') {
    notFound();
  }

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
        month: 'long',
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
      : 'Competitive / Industry Standard';

  // Google JobPosting Schema JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || job.short_description,
    datePosted: job.published_at || job.created_at,
    validThrough: job.application_deadline || undefined,
    employmentType: job.employment_type === 'FULL_TIME' ? 'FULL_TIME' : 'OTHER',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Techverse Infotech',
      sameAs: 'https://techverseinfotech.com',
      logo: 'https://techverseinfotech.com/images/techverse-logo.jpg',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'IN',
      },
    },
    baseSalary: job.salary_min
      ? {
          '@type': 'MonetaryAmount',
          currency: job.salary_currency,
          value: {
            '@type': 'QuantitativeValue',
            minValue: job.salary_min,
            maxValue: job.salary_max || undefined,
            unitText: 'YEAR',
          },
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="career-detail-page">
        {/* Top Breadcrumb & Hero */}
        <section className="career-detail-hero">
          <div className="wrap">
            <Link href="/careers" className="career-back-link">
              <ArrowLeft size={16} />
              <span>Back to all open positions</span>
            </Link>

            <div className="career-detail-header">
              <div className="career-detail-header__main">
                <div className="career-detail-header__tags">
                  <span className="career-job-card__dept">
                    <Building2 size={14} className="career-job-card__dept-icon" />
                    {job.department_name || 'Engineering'}
                  </span>
                  <span className="career-job-card__badge career-job-card__badge--mode">
                    {modeLabels[job.work_mode] || job.work_mode}
                  </span>
                  <span className="career-job-card__badge career-job-card__badge--type">
                    {typeLabels[job.employment_type] || job.employment_type}
                  </span>
                </div>

                <h1 className="career-detail__title">{job.title}</h1>

                <p className="career-detail__summary">{job.short_description}</p>

                {/* Key Specs Row */}
                <div className="career-detail__specs-bar">
                  <div className="career-detail__spec-col">
                    <span className="career-detail__spec-label">Location</span>
                    <span className="career-detail__spec-val">
                      <MapPin size={15} />
                      {job.location}
                    </span>
                  </div>
                  <div className="career-detail__spec-col">
                    <span className="career-detail__spec-label">Experience</span>
                    <span className="career-detail__spec-val">
                      <Briefcase size={15} />
                      {experienceText}
                    </span>
                  </div>
                  <div className="career-detail__spec-col">
                    <span className="career-detail__spec-label">Compensation</span>
                    <span className="career-detail__spec-val">
                      <Sparkles size={15} />
                      {salaryText}
                    </span>
                  </div>
                  {formattedDeadline && (
                    <div className="career-detail__spec-col">
                      <span className="career-detail__spec-label">Deadline</span>
                      <span className="career-detail__spec-val">
                        <Clock size={15} />
                        {formattedDeadline}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Column */}
              <div className="career-detail-header__side">
                <div className="career-detail-action-card">
                  <h3>Ready to apply?</h3>
                  <p>Applications take under 2 minutes. We reply to all submissions within 48h.</p>
                  <JobDetailsClient job={job} />
                  <div className="career-detail-action-card__notes">
                    <span>• No lengthy questionnaires</span>
                    <span>• Transparent status updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="career-detail-body">
          <div className="wrap">
            <div className="career-detail-layout">
              <div className="career-detail-content">
                {/* Full Description */}
                <div className="career-detail-block">
                  <h2>About the Position</h2>
                  <div className="career-detail-prose">
                    <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>
                  </div>
                </div>

                {/* Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className="career-detail-block">
                    <h2>Key Responsibilities</h2>
                    <ul className="career-detail-checklist">
                      {job.responsibilities.map((resp, i) => (
                        <li key={i}>
                          <CheckCircle2 size={18} className="career-detail-check-icon" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Required Qualifications */}
                {job.qualifications && job.qualifications.length > 0 && (
                  <div className="career-detail-block">
                    <h2>Required Qualifications</h2>
                    <ul className="career-detail-checklist">
                      {job.qualifications.map((qual, i) => (
                        <li key={i}>
                          <CheckCircle2 size={18} className="career-detail-check-icon" />
                          <span>{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Preferred Qualifications */}
                {job.preferred_qualifications && job.preferred_qualifications.length > 0 && (
                  <div className="career-detail-block">
                    <h2>Preferred / Nice to Have</h2>
                    <ul className="career-detail-checklist">
                      {job.preferred_qualifications.map((pqual, i) => (
                        <li key={i}>
                          <CheckCircle2 size={18} className="career-detail-check-icon" />
                          <span>{pqual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Skills */}
                {job.required_skills && job.required_skills.length > 0 && (
                  <div className="career-detail-block">
                    <h2>Required Technical Skills</h2>
                    <div className="career-job-card__tags">
                      {job.required_skills.map((skill) => (
                        <span key={skill} className="career-job-card__tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div className="career-detail-block">
                    <h2>Benefits &amp; Perks</h2>
                    <div className="career-detail-benefits-grid">
                      {job.benefits.map((b, i) => (
                        <div key={i} className="career-detail-benefit-item">
                          <Sparkles size={16} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="career-detail-sidebar">
                <div className="career-detail-sidebar-card">
                  <h3>About Techverse Infotech</h3>
                  <p>
                    Techverse Infotech is a specialized software and AI engineering consultancy. We design resilient cloud architectures, mission-critical ERP solutions, and state-of-the-art training pipelines for leading AI models worldwide.
                  </p>
                  <div className="career-detail-sidebar-specs">
                    <div>
                      <strong>Headquarters</strong>
                      <span>Coimbatore, Tamil Nadu, India</span>
                    </div>
                    <div>
                      <strong>Industry</strong>
                      <span>Software Engineering &amp; AI Data</span>
                    </div>
                    <div>
                      <strong>Engineering Culture</strong>
                      <span>Autonomy, Clean Code, Direct Impact</span>
                    </div>
                  </div>
                  <Link href="/about" className="career-job-card__view-link">
                    <span>Learn more about our team</span>
                    <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                  </Link>
                </div>

                <div className="career-detail-sidebar-card">
                  <h3>Questions regarding this role?</h3>
                  <p>
                    Reach out directly to our recruitment team at{' '}
                    <a href="mailto:careers@techverseinfotech.com" style={{ color: '#9333ea', textDecoration: 'underline' }}>
                      careers@techverseinfotech.com
                    </a>
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
