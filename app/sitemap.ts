import { MetadataRoute } from 'next';
import { allRoutes, SITE } from '@/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return allRoutes.map((path) => ({
    url: path === '/' ? SITE.url : `${SITE.url}${path}`,
    lastModified,
    changeFrequency: path === '/' || path === '/contact' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.includes('/services') || path.includes('/ai-data') ? 0.85 : 0.7,
  }));
}
