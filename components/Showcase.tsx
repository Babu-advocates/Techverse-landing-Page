import Image from 'next/image';

const cases = [
  {
    id: 'c1',
    client: 'Clearing desk',
    industry: 'Fintech',
    metric: '0.01% failure rate',
    summary: 'Event-driven settlement service for a payments team moving high daily volume.',
    image: '/images/taste/work-1.jpg',
  },
  {
    id: 'c2',
    client: 'Contract review desk',
    industry: 'Legal tech',
    metric: '82% faster review',
    summary: 'Document pipeline that flags clauses and routes exceptions to counsel.',
    image: '/images/taste/photo-f31043870.jpg',
  },
  {
    id: 'c3',
    client: 'Clinic alerts',
    industry: 'Health',
    metric: '65 ms edge alert',
    summary: 'HIPAA-minded telemetry feed that notifies clinicians on vital outliers.',
    image: '/images/taste/work-2.jpg',
  },
  {
    id: 'c4',
    client: 'Fleet board',
    industry: 'Logistics',
    metric: '44% faster dispatch',
    summary: 'Operations cockpit for interstate carriers, rebuilt on a live GraphQL board.',
    image: '/images/taste/work-3.jpg',
  },
];

export default function Showcase() {
  return (
    <section className="section section--surface" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Selected work</p>
          <h2 id="work-h">Projects we have shipped with product teams</h2>
          <p className="lead">
            A short set of recent builds. Numbers come from the client’s own reporting after launch.
          </p>
        </div>

        <div className="sheet">
          {cases.map((item) => (
            <a key={item.id} href="#contact" className="sheet__item">
              <div className="sheet__photo">
                <Image
                  src={item.image}
                  alt=""
                  width={960}
                  height={600}
                  sizes="(max-width: 820px) 100vw, 50vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="sheet__body">
                <div className="sheet__meta">{item.industry}</div>
                <div className="sheet__title">{item.client}</div>
                <p className="muted" style={{ fontSize: 14 }}>
                  {item.summary}
                </p>
                <div className="sheet__metric">{item.metric}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
