import Link from 'next/link';
import { SITE, homeHero } from '@/content';

export default function HomeHero() {
  return (
    <section className="hero" data-enter aria-labelledby="hero-brand">
      <img
        className="hero__bg"
        src="/images/hero-landscape.jpg"
        srcSet="/images/hero/assets/img/photo-f71442664-500.jpg 500w, /images/hero/assets/img/photo-f71442664-960.jpg 960w, /images/hero-landscape.jpg 1280w"
        sizes="100vw"
        width={1280}
        height={853}
        alt=""
        fetchPriority="high"
        decoding="async"
        data-source="stand-in"
        data-subject="landscape"
      />
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__content">
        <p id="hero-brand" className="hero__brand">
          {SITE.name}
        </p>
        <h1>{homeHero.headline}</h1>
        <p className="lead">{homeHero.description}</p>
        <div className="btn-row">
          <Link
            className="btn btn--primary"
            href={SITE.primaryCta.href}
            style={{
              background: '#111113',
              color: '#ffffff',
              borderRadius: '9999px',
              padding: '14px 32px',
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: '0 14px 36px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            Contact Us
          </Link>
          <Link
            className="btn btn--secondary"
            href="/services"
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#111113',
              borderRadius: '9999px',
              padding: '14px 30px',
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              border: '1px solid rgba(255,255,255,0.4)',
            }}
          >
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  );
}
