import type { NavGroup, NavLink } from './types';

export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
];

export const softwareNav: NavGroup = {
  label: 'Software Development',
  href: '/services',
  items: [
    { label: 'Custom Software Development', href: '/services/custom-software-development' },
    { label: 'ERP & Business Management Systems', href: '/services/erp-development' },
    { label: 'Mobile App Development', href: '/services/mobile-app-development' },
    { label: 'AI Development & Automation', href: '/services/ai-development-automation' },
  ],
};

export const dataNav: NavGroup = {
  label: 'AI Data Services',
  href: '/ai-data-services',
  items: [
    { label: 'Data Annotation', href: '/ai-data-services/data-annotation' },
    { label: 'Data Labelling', href: '/ai-data-services/data-labelling' },
    { label: 'Image & Video Annotation', href: '/ai-data-services/image-video-annotation' },
    { label: 'AI Training Data', href: '/ai-data-services/ai-training-data' },
    { label: 'Data Collection', href: '/ai-data-services/data-collection' },
    { label: 'Data Entry & Processing', href: '/ai-data-services/data-entry-processing' },
    { label: 'Data Quality & Validation', href: '/ai-data-services/data-quality-validation' },
  ],
};

export const simpleNav: NavLink[] = [
  { label: 'Industries', href: '/industries' },
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact' },
];

export const footerQuickLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Industries', href: '/industries' },
  { label: 'Contact Us', href: '/contact' },
];
