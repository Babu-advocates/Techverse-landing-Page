'use client';

import { useState, useMemo } from 'react';
import { Sparkles, FileText, CheckCircle2, ArrowRight, HelpCircle, Briefcase } from 'lucide-react';
import type { Job, JobDepartment } from '@/lib/careers';
import JobCard from './JobCard';
import JobFilters, { FilterState } from './JobFilters';
import ApplicationModal from './ApplicationModal';

type Props = {
  initialJobs: Job[];
  departments: JobDepartment[];
};

export default function CareersPortalClient({ initialJobs, departments }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: '',
    workMode: '',
    employmentType: '',
    experienceLevel: '',
  });

  const [activeJobForModal, setActiveJobForModal] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter jobs logic
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesDesc = job.short_description.toLowerCase().includes(q);
        const matchesSkills = job.required_skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesSkills) return false;
      }

      // Department
      if (filters.department && job.department_id !== filters.department) {
        return false;
      }

      // Work Mode
      if (filters.workMode && job.work_mode !== filters.workMode) {
        return false;
      }

      // Employment Type
      if (filters.employmentType && job.employment_type !== filters.employmentType) {
        return false;
      }

      // Experience Level
      if (filters.experienceLevel) {
        if (filters.experienceLevel === 'fresher') {
          if (job.min_experience !== 0) return false;
        } else if (filters.experienceLevel === 'mid') {
          if (job.min_experience > 3 || (job.max_experience && job.max_experience < 1)) return false;
        } else if (filters.experienceLevel === 'senior') {
          if (job.min_experience < 4 || job.min_experience > 7) return false;
        } else if (filters.experienceLevel === 'lead') {
          if (job.min_experience < 8) return false;
        }
      }

      return true;
    });
  }, [initialJobs, filters]);

  function handleOpenApply(job?: Job) {
    setActiveJobForModal(job || null);
    setIsModalOpen(true);
  }

  return (
    <>
      <section id="openings" className="careers-openings-section">
        <div className="wrap">
          <div className="careers-openings-header">
            <span className="t-label">Active Opportunities</span>
            <h2>Current Job Openings</h2>
            <p>
              Explore our current open positions across software engineering, AI data processing, and business operations.
            </p>
          </div>

          {/* Filter Bar */}
          <JobFilters
            filters={filters}
            onChange={setFilters}
            departments={departments}
            totalJobs={initialJobs.length}
            filteredCount={filteredJobs.length}
          />

          {/* Job Listings Grid */}
          {filteredJobs.length > 0 ? (
            <div className="careers-jobs-grid">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={handleOpenApply} />
              ))}
            </div>
          ) : (
            <div className="careers-empty-state">
              <div className="careers-empty-icon">
                <Briefcase size={36} />
              </div>
              <h3>No matching positions found</h3>
              <p>
                We could not find any active job openings matching your current filter criteria. You can clear your filters or submit a general application for upcoming positions.
              </p>
              <div className="careers-empty-actions">
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      search: '',
                      department: '',
                      workMode: '',
                      employmentType: '',
                      experienceLevel: '',
                    })
                  }
                  className="btn btn--secondary"
                >
                  Clear All Filters
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenApply()}
                  className="btn btn--primary"
                >
                  Submit General Application
                </button>
              </div>
            </div>
          )}

          {/* General Application Banner */}
          <div className="careers-general-box">
            <div className="careers-general-box__content">
              <span className="t-label">Speculative Openings</span>
              <h3>Don’t see the exact role you are looking for?</h3>
              <p>
                We are continually expanding our engineering and data teams. Send us your resume and tell us what you would love to build at Techverse Infotech. We review general applications weekly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenApply()}
              className="btn btn--primary careers-general-box__btn"
            >
              <span>Submit General Application</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Recruitment Process Section */}
          <div className="careers-process-section">
            <div className="careers-process-header">
              <span className="t-label">Transparent Hiring</span>
              <h3>Our 4-Step Recruitment Process</h3>
              <p>
                We value your time. We keep interviews straightforward, hands-on, and focused on real-world engineering problem solving.
              </p>
            </div>

            <div className="careers-process-grid">
              <div className="careers-process-step">
                <div className="careers-process-step__num">01</div>
                <h4>Application Review</h4>
                <p>Our senior technical leads review your portfolio, code repositories, and relevant project experience within 48 business hours.</p>
              </div>

              <div className="careers-process-step">
                <div className="careers-process-step__num">02</div>
                <h4>Technical Assessment</h4>
                <p>A practical coding exercise or system architecture discussion tailored directly to the day-to-day challenges of the role.</p>
              </div>

              <div className="careers-process-step">
                <div className="careers-process-step__num">03</div>
                <h4>Engineering Deep Dive</h4>
                <p>A collaborative interview with your future team members discussing distributed systems, problem solving, and product vision.</p>
              </div>

              <div className="careers-process-step">
                <div className="careers-process-step__num">04</div>
                <h4>Offer &amp; Onboarding</h4>
                <p>A transparent salary package, clear milestone expectations, and seamless onboarding to get you shipping on week one.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={activeJobForModal?.id || null}
        jobTitle={activeJobForModal?.title || 'General Application'}
      />
    </>
  );
}
