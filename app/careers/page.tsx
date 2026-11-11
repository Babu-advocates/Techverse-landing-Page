import type { Metadata } from 'next';
import { getPublishedJobs, getAllDepartments } from '@/lib/careers';
import CareersHero from '@/components/careers/CareersHero';
import CareersPortalClient from '@/components/careers/CareersPortalClient';
import FAQ from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Careers | Build Your Future with Techverse Infotech',
  description:
    'Join Techverse Infotech. Explore active job openings in full-stack software development, ERP systems, AI data annotation, and machine learning pipelines.',
  openGraph: {
    title: 'Careers at Techverse Infotech',
    description:
      'We are hiring software engineers, AI annotators, and ERP specialists in Coimbatore and remote across India. Build mission-critical software with us.',
    url: 'https://techverseinfotech.com/careers',
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

const CAREERS_FAQS = [
  {
    q: 'What is Techverse Infotech’s work policy (remote, hybrid, or on-site)?',
    a: 'We offer flexible work modes depending on the role. Most engineering roles support hybrid or full remote arrangements with optional desks in our Coimbatore hub, while certain high-security data operations are on-site.',
  },
  {
    q: 'How long does the hiring process typically take?',
    a: 'Our recruitment timeline is typically 7 to 14 days from initial application review to final offer release. We communicate feedback at each stage.',
  },
  {
    q: 'Can I apply for multiple positions at the same time?',
    a: 'Yes, although we recommend applying for the position that best matches your primary technical strengths and project experience.',
  },
  {
    q: 'Do you consider fresh graduates or interns?',
    a: 'Yes, we regularly open junior engineering and internship roles for enthusiastic builders with solid foundational knowledge in algorithms, web technologies, and database design.',
  },
];

export default async function CareersPage() {
  let jobs: any[] = [];
  let departments: any[] = [];

  try {
    [jobs, departments] = await Promise.all([
      getPublishedJobs(),
      getAllDepartments(),
    ]);
  } catch (err) {
    console.error('Failed to load careers jobs from database:', err);
  }

  return (
    <main className="careers-page">
      <CareersHero />
      <CareersPortalClient initialJobs={jobs} departments={departments} />
      <FAQ items={CAREERS_FAQS} />
    </main>
  );
}
