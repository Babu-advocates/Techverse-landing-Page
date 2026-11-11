import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CtaBand from '@/components/CtaBand';
import { aboutPage, buildMetadata, SITE } from '@/content';

export const metadata: Metadata = buildMetadata({
  title: 'About Techverse Infotech | Technology & AI Data Services',
  description:
    'Techverse Infotech builds customized software, ERP systems, websites, mobile apps, AI automation, and AI data services for businesses and institutions.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PageHero title={aboutPage.headline} />

      <section className="section section--tight">
        <div className="wrap" style={{ maxWidth: 820, display: 'grid', gap: 18 }}>
          {aboutPage.paragraphs.map((p) => (
            <p key={p} className="lead">
              {p}
            </p>
          ))}

          <div className="benefit-grid" style={{ marginTop: 24 }}>
            <article className="card-plain">
              <h3>Mission</h3>
              <p>{aboutPage.mission}</p>
            </article>
            <article className="card-plain">
              <h3>Vision</h3>
              <p>{aboutPage.vision}</p>
            </article>
          </div>

          <div className="btn-row" style={{ marginTop: 12 }}>
            <Link className="btn btn--secondary" href="/services">
              Explore software services
            </Link>
            <Link className="btn btn--secondary" href="/ai-data-services">
              Explore AI data services
            </Link>
            <Link className="btn btn--primary" href={SITE.primaryCta.href}>
              {SITE.primaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
