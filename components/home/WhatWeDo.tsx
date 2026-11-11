import Link from 'next/link';
import { SITE, whatWeDo, softwareServices, dataServices } from '@/content';

export default function WhatWeDo() {
  return (
    <section className="section" id="expertise" aria-labelledby="expertise-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">{whatWeDo.label}</p>
          <h2 id="expertise-h">{whatWeDo.headline}</h2>
          <p className="lead">{whatWeDo.description}</p>
        </div>

        <div className="offer">
          <div className="offer__col">
            <p className="t-label">Software & technology</p>
            <h3>Systems built around how you work</h3>
            <p className="muted">{whatWeDo.softwareIntro}</p>
            <ul className="offer__list">
              {softwareServices.map((s) => (
                <li key={s.slug}>
                  <Link href={s.seo.path}>
                    {s.title.replace(' Development', '').replace(' & Business Management Systems', '')}
                    <span>View</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="btn-row" style={{ justifyContent: 'flex-start', marginTop: 8 }}>
              <Link className="btn btn--ghost" href={SITE.secondaryCta.href}>
                All software services
              </Link>
            </div>
          </div>

          <div className="offer__col">
            <p className="t-label">AI data services</p>
            <h3>Structured data for training and delivery</h3>
            <p className="muted">{whatWeDo.dataIntro}</p>
            <ul className="offer__list">
              {dataServices.map((s) => (
                <li key={s.slug}>
                  <Link href={s.seo.path}>
                    {s.title}
                    <span>View</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="btn-row" style={{ justifyContent: 'flex-start', marginTop: 8 }}>
              <Link className="btn btn--ghost" href={SITE.dataCta.href}>
                All AI data services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
