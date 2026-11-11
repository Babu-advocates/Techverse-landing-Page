import { processSteps, dataProcess } from '@/content';

export default function ProcessHome() {
  return (
    <section className="section section--surface" id="process" aria-labelledby="process-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Process</p>
          <h2 id="process-h">From brief to production</h2>
        </div>
        <div className="steps">
          {processSteps.map((s) => (
            <article key={s.n} className="step">
              <div className="step__n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 12, fontSize: 15, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--p-muted)' }}>
            For data projects
          </h3>
          <div className="data-strip" aria-label="Data project process" style={{ justifyContent: 'center' }}>
            {dataProcess.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
