import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetail from '@/components/ServiceDetail';
import { buildMetadata, dataServices, getDataService } from '@/content';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return dataServices.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getDataService(params.slug);
  if (!service) return {};
  return buildMetadata(service.seo);
}

export default function DataServicePage({ params }: Props) {
  const service = getDataService(params.slug);
  if (!service) notFound();

  const related = service.related
    .map((slug) => getDataService(slug))
    .filter(Boolean) as typeof dataServices;

  return (
    <ServiceDetail
      service={service}
      related={related}
      hubHref="/ai-data-services"
      hubLabel="All AI data services"
    />
  );
}
