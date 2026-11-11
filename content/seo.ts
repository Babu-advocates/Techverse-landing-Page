import type { Metadata } from 'next';
import { SITE } from './site';
import type { SeoMeta } from './types';

export function buildMetadata(seo: SeoMeta): Metadata {
  const url = `${SITE.url}${seo.path === '/' ? '' : seo.path}`;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: seo.path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: SITE.name,
      images: [{ url: '/images/techverse-logo.jpg', width: 1200, height: 630, alt: SITE.name }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['/images/techverse-logo.jpg'],
    },
  };
}

export const allRoutes = [
  '/',
  '/services',
  '/services/custom-software-development',
  '/services/erp-development',
  '/services/mobile-app-development',
  '/services/ai-development-automation',
  '/ai-data-services',
  '/ai-data-services/data-annotation',
  '/ai-data-services/data-labelling',
  '/ai-data-services/image-video-annotation',
  '/ai-data-services/ai-training-data',
  '/ai-data-services/data-collection',
  '/ai-data-services/data-entry-processing',
  '/ai-data-services/data-quality-validation',
  '/industries',
  '/about',
  '/contact',
] as const;
