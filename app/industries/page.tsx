import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CtaBand from '@/components/CtaBand';
import { buildMetadata, industries, industriesSeo, SITE } from '@/content';

export const metadata: Metadata = buildMetadata(industriesSeo);

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        title="Technology Solutions Across Different Industries."
        lead="We help organizations across sectors design and build digital systems that fit their workflows. The examples below describe the kinds of solutions we can develop—not a claim that we have already deployed products in every industry."
      />

      <section className="section section--tight section--surface">
        <div className="wrap">
          <div className="industry-grid">
            {industries.map((ind) => (
              <article key={ind.slug} className="card-plain">
                <h3>{ind.title}</h3>
                <p>{ind.summary}</p>
                <ul>
                  {ind.examples.map((ex) => (
                    <li key={ex}>{ex}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: 28 }}>
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
