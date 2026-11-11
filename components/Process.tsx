const stages = [
  {
    n: '01',
    title: 'Discovery',
    copy: 'We map users, data and constraints, then write a short architecture note before code starts.',
  },
  {
    n: '02',
    title: 'Build',
    copy: 'A senior pod works in your repo with typed code, tests and daily notes on what changed.',
  },
  {
    n: '03',
    title: 'Automate',
    copy: 'Where AI helps, we add retrieval or agents behind real product actions, with eval checks.',
  },
  {
    n: '04',
    title: 'Ship',
    copy: 'Staging, monitoring and a handoff so your team can run the system without us.',
  },
];

export default function Process() {
  return (
    <section className="section section--surface" id="process" aria-labelledby="process-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Process</p>
          <h2 id="process-h">How a project runs</h2>
          <p className="lead">
            Four phases. You stay in Slack and GitHub the whole way. No long agency theatre.
          </p>
        </div>

        <div className="steps">
          {stages.map((stage) => (
            <article key={stage.n} className="step">
              <div className="step__n">Phase {stage.n}</div>
              <h3>{stage.title}</h3>
              <p>{stage.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
