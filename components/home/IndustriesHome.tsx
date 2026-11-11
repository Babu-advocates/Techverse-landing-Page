import Link from 'next/link';
import { industries } from '@/content';

export default function IndustriesHome() {
  return (
    <section className="section" aria-labelledby="industries-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Industries</p>
          <h2 id="industries-h">Built for the work your sector needs</h2>
          <p className="lead">
            Sector-shaped software and data workflows—examples of what we can build, not a claim of every deployment.
          </p>
        </div>
        <div className="industry-rail">
          {industries.map((ind) => (
            <Link key={ind.slug} href="/industries">
              {ind.title}
            </Link>
          ))}
        </div>
        <div className="btn-row" style={{ marginTop: 28 }}>
          <Link className="btn btn--ghost" href="/industries">
            Explore industries
          </Link>
        </div>
      </div>
    </section>
  );
}
