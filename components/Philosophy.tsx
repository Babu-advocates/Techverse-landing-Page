import Image from 'next/image';

export default function Philosophy() {
  return (
    <section className="section" id="about" aria-labelledby="about-h">
      <div className="wrap develop">
        <div className="develop__photo">
          <Image
            src="/images/taste/photo-f31043870.jpg"
            alt="Desks and screens in a working software office"
            width={1280}
            height={848}
            sizes="(max-width: 899px) 100vw, 55vw"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="develop__copy">
          <p className="t-label">Studio</p>
          <h2 id="about-h">A small pod that writes production code</h2>
          <p className="lead">
            Founded in 2023. We work with venture-backed SaaS teams who need senior engineers without
            a six-month agency ramp.
          </p>
          <p className="muted">
            You own the IP. We use your tools. When the engagement ends, the repo, docs and runbooks stay with you.
          </p>
        </div>
      </div>
    </section>
  );
}
