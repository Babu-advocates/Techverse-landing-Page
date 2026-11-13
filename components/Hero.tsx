import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero" data-enter aria-labelledby="hero-h">
      <div className="wrap">
        <div className="hero__grid">
          <div className="hero__text">
            <p className="hero__kicker">
              <span className="dot" aria-hidden="true" />
              Taking projects for this quarter
            </p>
            <h1 id="hero-h">Software engineering for product teams</h1>
            <p className="lead">
              We design, build and ship web apps, mobile apps and AI workflows for SaaS companies.
              First release in 2–4 weeks.
            </p>
            <div className="btn-row">
              <a className="btn btn--primary" href="#contact">
                Book a strategy call
              </a>
              <a className="btn btn--secondary" href="#work">
                See selected work
              </a>
            </div>
          </div>

          <div className="hero__media">
            <Image
              src="/images/taste/photo-f84970238-1280.webp"
              alt="Engineers working at desks in an open office"
              fill
              priority
              sizes="(max-width: 959px) 100vw, 55vw"
              style={{ objectFit: 'cover', objectPosition: '50% 40%' }}
            />
            <div className="hero__float">
              <div className="hero__float-row">
                <span>Typical first ship</span>
                <span>2–4 weeks</span>
              </div>
              <div className="hero__float-title">Scoped MVP with staging and docs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
