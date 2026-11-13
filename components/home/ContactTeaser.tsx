import Link from 'next/link';
import { SITE, contactPage } from '@/content';

export default function ContactTeaser() {
  return (
    <section className="section section--ink" aria-labelledby="contact-teaser-h">
      <div className="wrap close">
        <p className="t-label" style={{ color: 'var(--p-inv-muted)' }}>
          Contact
        </p>
        <h2 id="contact-teaser-h">{contactPage.headline}</h2>
        <p className="muted">{contactPage.description}</p>
        <div className="btn-row">
          <Link className="btn btn--primary" href={SITE.primaryCta.href} style={{ background: '#fff', color: '#121212' }}>
            Contact Us
          </Link>
          <a className="btn btn--ghost" href={`tel:${SITE.phoneRaw}`} style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            Call: {SITE.phone}
          </a>
          <a className="btn btn--ghost" href={`mailto:${SITE.email}`} style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            {SITE.email}
          </a>
        </div>
      </div>
    </section>
  );
}
