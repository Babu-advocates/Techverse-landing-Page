import { whyChoose } from '@/content';

export default function WhyChoose() {
  const items = whyChoose.benefits.slice(0, 4);

  return (
    <section className="section section--surface" aria-labelledby="why-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Why Techverse</p>
          <h2 id="why-h">{whyChoose.headline}</h2>
          <p className="lead">{whyChoose.description}</p>
        </div>
        <div className="why-list">
          {items.map((b, i) => (
            <article key={b.title}>
              <p className="n">{String(i + 1).padStart(2, '0')}</p>
              <div>
                <h3>{b.title}</h3>
                <p>{b.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
