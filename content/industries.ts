import type { IndustryItem } from './types';

export const industries: IndustryItem[] = [
  {
    slug: 'education',
    title: 'Education & EdTech',
    summary: 'Digital systems that help institutions manage students, staff, and academic operations.',
    examples: [
      'School and college ERP concepts',
      'Student information and attendance',
      'Timetable and fee management',
      'Parent and teacher portals',
    ],
  },
  {
    slug: 'healthcare',
    title: 'Healthcare',
    summary: 'Administrative and workflow software that supports clinics and healthcare operations.',
    examples: [
      'Appointment and scheduling systems',
      'Healthcare portals',
      'Administrative automation',
      'Internal workflow tools',
    ],
  },
  {
    slug: 'retail',
    title: 'Retail & E-commerce',
    summary: 'Commerce and operations tools for selling, inventory, and order management.',
    examples: [
      'Inventory and billing software',
      'Order management',
      'E-commerce storefronts',
      'Retail operations dashboards',
    ],
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing',
    summary: 'Systems that support production visibility, inventory tracking, and operational workflows.',
    examples: [
      'Production management tools',
      'Inventory tracking',
      'Operational dashboards',
      'Workflow automation',
    ],
  },
  {
    slug: 'logistics',
    title: 'Logistics & Transportation',
    summary: 'Software for dispatch, tracking, and day-to-day logistics operations.',
    examples: [
      'Fleet and dispatch management',
      'Tracking and status workflows',
      'Operations cockpits',
      'Partner and driver portals',
    ],
  },
  {
    slug: 'finance',
    title: 'Finance & Professional Services',
    summary: 'Business systems for firms that need structured workflows and client-facing portals.',
    examples: [
      'Client portals',
      'Workflow and case tracking',
      'Reporting dashboards',
      'Internal operations tools',
    ],
  },
  {
    slug: 'startups',
    title: 'Startups & Technology Companies',
    summary: 'Product and platform development support for teams building digital offerings.',
    examples: [
      'MVP and product platforms',
      'Admin and customer apps',
      'API-backed services',
      'AI feature integration',
    ],
  },
  {
    slug: 'enterprise',
    title: 'Enterprise Businesses',
    summary: 'Custom systems and integrations that support multi-team business operations.',
    examples: [
      'Departmental business applications',
      'ERP-style management systems',
      'System integrations',
      'Automation initiatives',
    ],
  },
];

export const industriesSeo = {
  title: 'Industries We Serve | Techverse Infotech',
  description:
    'Technology solutions for education, healthcare, retail, manufacturing, logistics, finance, startups, and enterprise businesses.',
  path: '/industries',
};
