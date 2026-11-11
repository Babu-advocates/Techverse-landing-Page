import type { ServiceItem } from './types';

export const dataServices: ServiceItem[] = [
  {
    slug: 'data-annotation',
    title: 'Data Annotation',
    short: 'Annotation of images, videos, text, and datasets for machine learning and AI development.',
    intro:
      'We support annotation workflows that help prepare datasets for machine learning and AI model development, aligned to your guidelines and quality expectations.',
    deliverables: [
      'Guideline-aligned annotation workflows',
      'Image, video, text, and structured dataset annotation',
      'Sampling and review checkpoints',
      'Delivery in agreed formats and schedules',
    ],
    audience: 'AI companies, technology providers, and teams building or improving ML models.',
    engagement:
      'Scope, guidelines, languages, formats, quality metrics, and timelines are finalized based on project requirements.',
    related: ['data-labelling', 'image-video-annotation', 'ai-training-data'],
    formValue: 'Data Annotation',
    seo: {
      title: 'Data Annotation Services | Techverse Infotech',
      description:
        'Data annotation services for images, video, text, and AI training datasets with guideline-driven quality workflows.',
      path: '/ai-data-services/data-annotation',
    },
  },
  {
    slug: 'data-labelling',
    title: 'Data Labelling',
    short: 'Structured labelling and classification to prepare datasets for machine learning applications.',
    intro:
      'We help label and classify data so models receive consistent, structured inputs—following your taxonomy and acceptance criteria.',
    deliverables: [
      'Classification and labelling against defined schemas',
      'Consistency checks across batches',
      'Review and correction workflows',
      'Export-ready labelled datasets',
    ],
    audience: 'Teams preparing supervised learning datasets across text, media, or structured records.',
    engagement:
      'We align on labels, edge cases, and quality thresholds before scaling production labelling.',
    related: ['data-annotation', 'ai-training-data', 'data-quality-validation'],
    formValue: 'Data Labelling',
    seo: {
      title: 'Data Labelling Services | Techverse Infotech',
      description:
        'Structured data labelling and classification services for machine learning and AI applications.',
      path: '/ai-data-services/data-labelling',
    },
  },
  {
    slug: 'image-video-annotation',
    title: 'Image & Video Annotation',
    short: 'Bounding boxes, polygons, segmentation, tracking, classification, and related CV workflows.',
    intro:
      'Computer vision projects need precise visual labels. We support common image and video annotation workflows used in detection, segmentation, and tracking projects.',
    deliverables: [
      'Bounding boxes, polygons, and segmentation',
      'Object tracking and frame-level labelling',
      'Image and video classification',
      'Guideline-driven review cycles',
    ],
    audience: 'Teams building computer vision products or research datasets.',
    engagement:
      'Tooling, formats, and sampling rates are agreed up front so annotation quality stays measurable.',
    related: ['data-annotation', 'ai-training-data', 'data-quality-validation'],
    formValue: 'Image & Video Annotation',
    seo: {
      title: 'Image & Video Annotation Services | Techverse Infotech',
      description:
        'Image and video annotation including bounding boxes, polygons, segmentation, tracking, and classification.',
      path: '/ai-data-services/image-video-annotation',
    },
  },
  {
    slug: 'ai-training-data',
    title: 'AI Training Data Preparation',
    short: 'Collection, cleaning, classification, structuring, and preparation of AI training datasets.',
    intro:
      'Reliable models start with reliable data. We help prepare training datasets through collection support, cleaning, structuring, and labelling workflows tailored to your project.',
    deliverables: [
      'Dataset preparation and structuring',
      'Cleaning and formatting',
      'Labelling and annotation coordination',
      'Validation against agreed criteria',
    ],
    audience: 'AI product teams and vendors who need training data prepared to a defined standard.',
    engagement:
      'We define dataset specs and quality gates with you, then execute in batches with review checkpoints.',
    related: ['data-collection', 'data-annotation', 'data-quality-validation'],
    formValue: 'AI Training Data',
    seo: {
      title: 'AI Training Data Preparation | Techverse Infotech',
      description:
        'AI training data preparation including collection support, cleaning, structuring, labelling, and validation.',
      path: '/ai-data-services/ai-training-data',
    },
  },
  {
    slug: 'data-collection',
    title: 'Data Collection',
    short: 'Organized data collection and dataset preparation based on project requirements.',
    intro:
      'When projects need new source data, we can support organized collection and packaging according to your instructions and compliance expectations.',
    deliverables: [
      'Requirement-based collection planning',
      'Source gathering within agreed scope',
      'Basic cleaning and organization',
      'Delivery in requested structures',
    ],
    audience: 'Teams that need datasets assembled before annotation or model training.',
    engagement:
      'Collection methods, sources, and constraints are confirmed before work begins.',
    related: ['ai-training-data', 'data-entry-processing', 'data-quality-validation'],
    formValue: 'Data Collection',
    seo: {
      title: 'Data Collection Services | Techverse Infotech',
      description:
        'Organized data collection and dataset preparation services based on project guidelines and requirements.',
      path: '/ai-data-services/data-collection',
    },
  },
  {
    slug: 'data-entry-processing',
    title: 'Data Entry & Processing',
    short: 'Accurate data entry, document processing, extraction, formatting, and digitization.',
    intro:
      'We support operational data work—entry, extraction, formatting, and digitization—when accuracy and consistency matter for business or AI pipelines.',
    deliverables: [
      'Data entry and spreadsheet processing',
      'Document digitization and extraction',
      'Formatting and structuring',
      'Verification against sample checks',
    ],
    audience: 'Businesses and technology teams with bulk processing or digitization needs.',
    engagement:
      'Volume, complexity, and turnaround expectations shape staffing and quality review cadence.',
    related: ['data-quality-validation', 'data-collection', 'data-labelling'],
    formValue: 'Data Entry & Processing',
    seo: {
      title: 'Data Entry & Processing Services | Techverse Infotech',
      description:
        'Data entry, document processing, extraction, formatting, and digitization services for business and AI workflows.',
      path: '/ai-data-services/data-entry-processing',
    },
  },
  {
    slug: 'data-quality-validation',
    title: 'Data Quality & Validation',
    short: 'Validation, quality checking, consistency review, and annotation QA.',
    intro:
      'Quality processes help catch errors before datasets are used in production. We support validation, review, and consistency checks aligned to your acceptance criteria.',
    deliverables: [
      'Guideline-based quality review',
      'Duplicate and consistency checks',
      'Annotation review and correction loops',
      'Reporting on agreed quality metrics',
    ],
    audience: 'Teams that need independent or supplemental QA on labelled and collected datasets.',
    engagement:
      'Acceptance criteria and sampling approach are defined with you so quality is measurable—not vague.',
    related: ['data-annotation', 'data-labelling', 'ai-training-data'],
    formValue: 'Data Quality Assurance',
    seo: {
      title: 'Data Quality & Validation Services | Techverse Infotech',
      description:
        'Dataset validation, quality checking, consistency review, and annotation QA for AI and business data projects.',
      path: '/ai-data-services/data-quality-validation',
    },
  },
];

export const dataHubSeo = {
  title: 'AI Data Services | Annotation, Labelling & Training Data | Techverse Infotech',
  description:
    'Data annotation, labelling, image and video annotation, AI training data preparation, collection, entry, and quality validation services.',
  path: '/ai-data-services',
};

export const dataCategories = {
  computerVision: [
    'Image Annotation',
    'Video Annotation',
    'Object Detection',
    'Bounding Box Annotation',
    'Polygon Annotation',
    'Image Segmentation',
    'Object Tracking',
    'Image Classification',
  ],
  textLanguage: [
    'Text Annotation',
    'Text Classification',
    'Entity Recognition',
    'Sentiment Labelling',
    'Document Categorization',
    'Text Data Preparation',
  ],
  aiOperations: [
    'Data Collection',
    'Data Cleaning',
    'Dataset Preparation',
    'Data Labelling',
    'Quality Validation',
    'Annotation Review',
    'Data Formatting',
  ],
  businessSupport: [
    'Data Entry',
    'Document Digitization',
    'Data Extraction',
    'Spreadsheet Processing',
    'Data Verification',
    'Data Management',
  ],
};

export function getDataService(slug: string) {
  return dataServices.find((s) => s.slug === slug);
}
