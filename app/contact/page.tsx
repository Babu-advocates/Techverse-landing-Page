import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import { buildMetadata, contactPage, SITE } from '@/content';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Techverse Infotech | Discuss Your Project',
  description:
    'Contact Techverse Infotech to discuss custom software, ERP, websites, mobile apps, AI automation, or AI data services projects.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="contact-page">
      <PageHero title={contactPage.headline} lead={contactPage.description}>
        <p style={{ marginTop: 14 }}>
          <a
            href={`mailto:${SITE.email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--p-ink)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            {SITE.email}
          </a>
        </p>
      </PageHero>

      <section
        className="section section--tight section--surface"
        style={{ paddingBottom: 'clamp(80px, 12vw, 140px)' }}
      >
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="contact-form-card">
            <Suspense fallback={<p className="muted">Loading project inquiry form…</p>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
