export type SeoMeta = {
  title: string;
  description: string;
  path: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  href: string;
  items: NavLink[];
};

export type ServiceSystem = {
  title: string;
  blurb: string;
};

export type ServiceItem = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  deliverables: string[];
  systems?: ServiceSystem[];
  audience: string;
  engagement: string;
  related: string[];
  seo: SeoMeta;
  formValue: string;
};

export type IndustryItem = {
  slug: string;
  title: string;
  summary: string;
  examples: string[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type CapabilityItem = {
  title: string;
  blurb: string;
};
