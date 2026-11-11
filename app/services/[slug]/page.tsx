import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetail from '@/components/ServiceDetail';
import { buildMetadata, getSoftwareService, softwareServices } from '@/content';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return softwareServices.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getSoftwareService(params.slug);
  if (!service) return {};
  return buildMetadata(service.seo);
}

export default function SoftwareServicePage({ params }: Props) {
  const service = getSoftwareService(params.slug);
  if (!service) notFound();

  const related = service.related
    .map((slug) => getSoftwareService(slug))
    .filter(Boolean) as typeof softwareServices;

  return (
    <ServiceDetail
      service={service}
      related={related}
      hubHref="/services"
      hubLabel="All software services"
    />
  );
}
