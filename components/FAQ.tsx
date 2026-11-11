const faqs = [
  {
    q: 'Is Techverse Infotech a fit for us?',
    a: 'We work best with Seed to Series C product teams that need a senior pod for a new product, a rebuild, or AI features that have to live in production.',
  },
  {
    q: 'How do first releases land in 2–4 weeks?',
    a: 'We keep scope tight, staff senior people only, and start in your repo on day one. No separate “discovery deck” phase that burns a month.',
  },
  {
    q: 'Can you join our existing team?',
    a: 'Yes. Most clients already have engineers. We join Slack, Linear or Jira, and open pull requests like any other teammate.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do, from the first commit. We do not ship proprietary frameworks you cannot leave.',
  },
  {
    q: 'How do engagements start?',
    a: 'A 30-minute strategy call, then a paid one-week pilot sprint. If the pilot misses, we revise at no extra cost or refund the unused balance.',
  },
  {
    q: 'How do you handle security?',
    a: 'Mutual NDAs, least-privilege access, secret scanning and practices aligned with SOC 2 and HIPAA when the product needs them.',
  },
];

export default function FAQ() {
  return (
    <section className="section section--surface" id="questions" aria-labelledby="questions-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Questions</p>
          <h2 id="questions-h">Answers before you book a call</h2>
        </div>

        <div className="faq">
          {faqs.map((item) => (
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
    </section>
  );
}
