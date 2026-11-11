import { capabilities } from '@/content';

export default function Capabilities() {
  return (
    <section className="section section--surface" aria-labelledby="capabilities-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Featured capabilities</p>
          <h2 id="capabilities-h">What We Can Build for Your Business.</h2>
          <p className="lead">
            These are development capabilities—not claims of packaged proprietary products already launched.
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map((c) => (
            <article key={c.title} className="card-plain">
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
