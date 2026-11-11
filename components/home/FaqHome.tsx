import { softwareFaqs, dataFaqs } from '@/content';

function FaqGroup({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <div className="faq-group">
      <h3>{title}</h3>
      <div className="faq">
        {items.slice(0, 5).map((item) => (
          <details key={item.q}>
            <summary>
              {item.q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function FaqHome() {
  return (
    <section className="section section--surface" id="questions" aria-labelledby="questions-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Questions</p>
          <h2 id="questions-h">Straight answers</h2>
        </div>
        <FaqGroup title="Software" items={softwareFaqs} />
        <FaqGroup title="AI data" items={dataFaqs} />
      </div>
    </section>
  );
}
