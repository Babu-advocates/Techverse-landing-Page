import type { ServiceItem } from './types';

export const softwareServices: ServiceItem[] = [
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    short: 'Business-specific applications designed around your workflows, requirements, and operational needs.',
    intro:
      'We design and build custom software that fits how your organization actually works—whether you need an internal operations platform, a customer-facing product, or a system that replaces fragmented tools.',
    deliverables: [
      'Requirement workshops and solution scoping',
      'Architecture and technical planning',
      'Application design and development',
      'Testing, deployment support, and handoff documentation',
    ],
    audience: 'Startups, SMBs, enterprises, and institutions that need software tailored to their processes—not a one-size-fits-all product.',
    engagement:
      'Engagements typically begin with a discovery conversation, followed by scoped planning and iterative delivery with clear milestones.',
    related: ['erp-development', 'mobile-app-development', 'ai-development-automation'],
    formValue: 'Custom Software Development',
    seo: {
      title: 'Custom Software Development | Techverse Infotech',
      description:
        'Custom software development for business workflows, operations platforms, and digital products. Built around your requirements.',
      path: '/services/custom-software-development',
    },
  },
  {
    slug: 'erp-development',
    title: 'ERP & Business Management Systems',
    short: 'Integrated systems for finance, HR, payroll, inventory, education, operations, and more.',
    intro:
      'We develop ERP and business management systems that connect departments, reduce manual work, and give leadership clearer operational visibility.',
    deliverables: [
      'Module planning for finance, HR, inventory, operations, and education',
      'Role-based access and workflow design',
      'Reporting and operational dashboards',
      'Integration with existing tools where needed',
    ],
    audience: 'Growing businesses and institutions that need unified systems for day-to-day operations.',
    engagement:
      'We map your processes first, then prioritize modules so you can launch useful capability without waiting for every feature at once.',
    related: ['custom-software-development', 'mobile-app-development', 'ai-development-automation'],
    formValue: 'ERP Development',
    seo: {
      title: 'ERP & Business Management Systems | Techverse Infotech',
      description:
        'Custom ERP and business management software for finance, HR, payroll, inventory, education, and operations.',
      path: '/services/erp-development',
    },
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile Application Development',
    short: 'Android and iOS applications designed for reliable, intuitive, engaging experiences.',
    intro:
      'We build mobile apps that help customers and teams work on the go—with attention to usability, performance, and long-term maintainability.',
    deliverables: [
      'Android and iOS application development',
      'Cross-platform approaches where they fit',
      'Backend and API integration',
      'Store submission support and release readiness',
    ],
    audience: 'Businesses launching customer apps, field tools, or mobile companions to existing systems.',
    engagement:
      'We clarify platforms, features, and integrations early, then deliver builds you can test and refine before wider release.',
    related: ['custom-software-development', 'ai-development-automation', 'erp-development'],
    formValue: 'Mobile Application Development',
    seo: {
      title: 'Mobile App Development (Android & iOS) | Techverse Infotech',
      description:
        'Android and iOS mobile application development for business and customer experiences.',
      path: '/services/mobile-app-development',
    },
  },
  {
    slug: 'ai-development-automation',
    title: 'AI Development & Automation',
    short: 'AI-powered applications, assistants, document processing, and workflow automation.',
    intro:
      'We help organizations add practical AI and automation where it improves real work—not demos. That includes assistants, document processing, and process automation wired into your systems.',
    deliverables: [
      'AI feature design for existing or new products',
      'Workflow and document automation',
      'Intelligent assistants for defined business tasks',
      'Evaluation, guardrails, and integration planning',
    ],
    audience: 'Teams ready to automate repetitive work or embed AI into products and operations.',
    engagement:
      'We start from the workflow and data you already have, then scope AI capabilities that are measurable and maintainable.',
    related: ['custom-software-development', 'erp-development', 'mobile-app-development'],
    formValue: 'AI Development & Automation',
    seo: {
      title: 'AI Development & Business Automation | Techverse Infotech',
      description:
        'AI-powered applications, workflow automation, document processing, and intelligent assistants for business use.',
      path: '/services/ai-development-automation',
    },
  },
];

export const softwareHubSeo = {
  title: 'Software Development Services | Techverse Infotech',
  description:
    'Custom software, ERP systems, mobile apps, and AI automation from Techverse Infotech.',
  path: '/services',
};

export function getSoftwareService(slug: string) {
  return softwareServices.find((s) => s.slug === slug);
}
