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
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <a
            href={`mailto:${SITE.email}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--p-ink)',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'var(--p-panel-bg, #fff)',
              border: '1px solid var(--p-border, rgba(0,0,0,0.08))',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ opacity: 0.6 }}>✉</span>
            {SITE.email}
          </a>

          <a
            href={`tel:${SITE.phoneRaw}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--p-ink)',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'var(--p-panel-bg, #fff)',
              border: '1px solid var(--p-border, rgba(0,0,0,0.08))',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ opacity: 0.6 }}>📞</span>
            {SITE.phone}
          </a>

          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '14px',
              fontWeight: 600,
              color: '#128C7E',
              padding: '8px 16px',
              borderRadius: '999px',
              background: '#e7fce9',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#25D366' }} />
            WhatsApp: {SITE.phoneDisplay}
          </a>
        </div>
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
