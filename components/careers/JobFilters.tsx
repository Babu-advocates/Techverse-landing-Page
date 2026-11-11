'use client';

import { Search, X, Filter } from 'lucide-react';
import type { JobDepartment } from '@/lib/careers';

export type FilterState = {
  search: string;
  department: string;
  workMode: string;
  employmentType: string;
  experienceLevel: string;
};

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  departments: JobDepartment[];
  totalJobs: number;
  filteredCount: number;
};

export default function JobFilters({
  filters,
  onChange,
  departments,
  totalJobs,
  filteredCount,
}: Props) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.department) ||
    Boolean(filters.workMode) ||
    Boolean(filters.employmentType) ||
    Boolean(filters.experienceLevel);

  function reset() {
    onChange({
      search: '',
      department: '',
      workMode: '',
      employmentType: '',
      experienceLevel: '',
    });
  }

  return (
    <div className="career-filters">
      <div className="career-filters__top">
        {/* Search Input */}
        <div className="career-filters__search-wrap">
          <Search size={18} className="career-filters__search-icon" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by job title, role, or technical skill..."
            className="career-filters__search-input"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="career-filters__search-clear"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Counter & Clear */}
        <div className="career-filters__meta">
          <span className="career-filters__count">
            Showing <strong>{filteredCount}</strong> of {totalJobs} openings
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={reset}
              className="career-filters__reset-btn"
            >
              <X size={13} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Select Controls */}
      <div className="career-filters__row">
        {/* Department Filter */}
        <div className="career-filter-field">
          <label htmlFor="filter-department" className="career-filter-label">
            Department
          </label>
          <select
            id="filter-department"
            value={filters.department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="career-filter-select"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode */}
        <div className="career-filter-field">
          <label htmlFor="filter-workmode" className="career-filter-label">
            Work Mode
          </label>
          <select
            id="filter-workmode"
            value={filters.workMode}
            onChange={(e) => onChange({ ...filters, workMode: e.target.value })}
            className="career-filter-select"
          >
            <option value="">All Modes</option>
            <option value="ONSITE">On-site</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        {/* Employment Type */}
        <div className="career-filter-field">
          <label htmlFor="filter-type" className="career-filter-label">
            Employment Type
          </label>
          <select
            id="filter-type"
            value={filters.employmentType}
            onChange={(e) => onChange({ ...filters, employmentType: e.target.value })}
            className="career-filter-select"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        {/* Experience Level */}
        <div className="career-filter-field">
          <label htmlFor="filter-exp" className="career-filter-label">
            Experience Level
          </label>
          <select
            id="filter-exp"
            value={filters.experienceLevel}
            onChange={(e) => onChange({ ...filters, experienceLevel: e.target.value })}
            className="career-filter-select"
          >
            <option value="">Any Experience</option>
            <option value="fresher">Fresher / 0 years</option>
            <option value="mid">1 to 3 years</option>
            <option value="senior">4 to 7 years</option>
            <option value="lead">8+ years</option>
          </select>
        </div>
      </div>
    </div>
  );
}
