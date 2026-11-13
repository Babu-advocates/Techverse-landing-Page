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
    systems: [
      {
        title: 'Billing Software',
        blurb: 'Invoicing, payments, subscriptions, and revenue tracking shaped to your pricing model.',
      },
      {
        title: 'CRM Systems',
        blurb: 'Lead pipelines, customer records, follow-ups, and sales workflows for growth teams.',
      },
      {
        title: 'Inventory Management',
        blurb: 'Stock levels, warehouses, purchase orders, and fulfilment visibility in real time.',
      },
      {
        title: 'HRMS & Payroll',
        blurb: 'Attendance, leave, payroll runs, and employee records for day-to-day people ops.',
      },
      {
        title: 'E-commerce Platforms',
        blurb: 'Catalog, checkout, orders, and customer accounts for digital retail businesses.',
      },
      {
        title: 'Custom Internal Tools',
        blurb: 'Workflow apps, portals, and dashboards that replace spreadsheets and manual handoffs.',
      },
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
    systems: [
      {
        title: 'ERP Systems',
        blurb: 'Finance, inventory, HR, and operations connected in one integrated business platform.',
      },
      {
        title: 'School Management Software',
        blurb: 'Academics, admissions, fees, attendance, and administration for schools.',
      },
      {
        title: 'College Management Software',
        blurb: 'Students, faculty, courses, exams, and campus operations for colleges and universities.',
      },
      {
        title: 'Finance & Accounting',
        blurb: 'Ledgers, invoicing, expenses, and reporting tailored to your finance workflows.',
      },
      {
        title: 'Inventory & Operations',
        blurb: 'Stock, warehouses, purchase orders, and day-to-day operational control.',
      },
      {
        title: 'HR & Payroll Systems',
        blurb: 'Attendance, leave, payroll runs, and employee records in one place.',
      },
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
    systems: [
      {
        title: 'Android Applications',
        blurb: 'Native and modern Android apps built for performance, usability, and Play Store readiness.',
      },
      {
        title: 'iOS Applications',
        blurb: 'iPhone and iPad apps designed for smooth UX, reliability, and App Store guidelines.',
      },
      {
        title: 'Cross-Platform Apps',
        blurb: 'Shared codebase apps that reach Android and iOS without compromising quality.',
      },
      {
        title: 'E-commerce Mobile Apps',
        blurb: 'Catalog, cart, checkout, and order tracking experiences for digital retail brands.',
      },
      {
        title: 'Business & Field Apps',
        blurb: 'Sales, attendance, inventory, and field-force tools that keep teams productive on the go.',
      },
      {
        title: 'On-Demand Service Apps',
        blurb: 'Booking, dispatch, payments, and customer journeys for service-led businesses.',
      },
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
    systems: [
      {
        title: 'AI-Powered Applications',
        blurb: 'Practical AI features embedded into products and internal tools for real business outcomes.',
      },
      {
        title: 'Intelligent Assistants',
        blurb: 'Task-focused assistants that help teams answer questions, draft work, and complete routines faster.',
      },
      {
        title: 'Document Processing',
        blurb: 'Extract, classify, and process documents so paperwork becomes searchable, structured data.',
      },
      {
        title: 'Workflow Automation',
        blurb: 'Automate approvals, handoffs, and repetitive processes across your existing systems.',
      },
      {
        title: 'Chatbots & Support AI',
        blurb: 'Customer and internal support bots trained on your knowledge base and operating rules.',
      },
      {
        title: 'Process Intelligence',
        blurb: 'Insights and alerts that help teams spot bottlenecks, exceptions, and next-best actions.',
      },
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
