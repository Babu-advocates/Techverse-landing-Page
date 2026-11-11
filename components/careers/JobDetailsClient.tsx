'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/lib/careers';
import ApplicationModal from './ApplicationModal';

type Props = {
  job: Job;
};

export default function JobDetailsClient({ job }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Sticky Bottom Bar on Mobile / Desktop for high conversion */}
      <div className="career-sticky-bar">
        <div className="wrap career-sticky-bar__inner">
          <div className="career-sticky-bar__meta">
            <strong>{job.title}</strong>
            <span>{job.location} • {job.work_mode}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn--primary"
          >
            <span>Apply For This Position</span>
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Main Trigger inside Hero */}
      <div className="career-detail__apply-trigger">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn--primary btn--large"
        >
          <span>Apply For This Position</span>
          <Send size={16} />
        </button>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
      />
    </>
  );
}
