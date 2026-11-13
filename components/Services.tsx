'use client';

import Link from 'next/link';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { softwareServices } from '@/content';

const colors = ['#14151a', '#222834', '#1b2f2b', '#262438'];

export default function Services() {
  return (
    <section className="section section--services" id="services" aria-labelledby="services-stack-h">
      <div className="wrap">
        <div className="section-head">
          <p className="t-label">Software</p>
          <h2 id="services-stack-h">What we build</h2>
          <p className="lead">Scroll the stack—each card is one software practice.</p>
        </div>
      </div>

      <ScrollStack
        useWindowScroll
        itemDistance={110}
        itemStackDistance={64}
        stackPosition="96px"
        scaleEndPosition="12%"
        baseScale={0.9}
        itemScale={0.025}
        blurAmount={0}
        rotationAmount={0}
      >
        {softwareServices.map((svc, i) => (
          <ScrollStackItem
            key={svc.slug}
            itemClassName="ss-service-card"
            style={{ backgroundColor: colors[i % colors.length] }}
          >
            <div className="ss-card__top">
              <h3 className="ss-card__title">{svc.title}</h3>
              <span className="ss-card__index" aria-hidden="true">
                /{String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="ss-card__bottom">
              <p className="ss-card__bullet">• {svc.short}</p>
              <div>
                <p className="ss-card__copy">{svc.intro}</p>
                <div className="ss-card__actions">
                  <Link className="ss-card__cta" href={svc.seo.path}>
                    Learn more
                  </Link>
                  <Link
                    className="ss-card__cta ss-card__cta--ghost"
                    href={`/contact?service=${encodeURIComponent(svc.formValue)}`}
                  >
                    Discuss project
                  </Link>
                </div>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
