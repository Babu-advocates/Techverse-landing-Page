import Link from 'next/link';
import { aboutTeaser } from '@/content';

export default function AboutTeaser() {
  return (
    <section className="section" aria-labelledby="about-teaser-h">
      <div className="wrap about-split">
        <div className="about-split__media">
          <img
            src="/images/tech-architecture.jpg"
            alt="Modern technical software architecture and AI data workstation"
            width={960}
            height={585}
            loading="lazy"
            decoding="async"
            data-source="production"
            data-subject="technical-architecture"
            style={{ objectFit: 'cover', borderRadius: 'var(--r-lg)' }}
          />
        </div>
        <div className="about-split__text">
          <p className="t-label">{aboutTeaser.label}</p>
          <h2 id="about-teaser-h">{aboutTeaser.headline}</h2>
          <p className="lead" style={{ maxWidth: '40ch' }}>
            {aboutTeaser.body}
          </p>
          <div className="btn-row" style={{ justifyContent: 'flex-start' }}>
            <Link className="btn btn--ghost" href="/about">
              About Techverse Infotech
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
