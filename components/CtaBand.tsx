import Link from 'next/link';
import { ArrowRight, ShieldCheck, Clock, Terminal } from 'lucide-react';
import { SITE } from '@/content';

type Props = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function CtaBand({
  title = 'Ready to discuss your project?',
  description = 'Tell us what you want to build. We will review your requirements and propose a practical next step.',
  ctaLabel = SITE.primaryCta.label,
  ctaHref = SITE.primaryCta.href,
}: Props) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div className="cta-band__card">
          <div className="cta-band__glow" aria-hidden="true" />
          
          <h2 className="cta-band__title">{title}</h2>
          <p className="cta-band__desc">{description}</p>

          <div className="cta-band__actions">
            <Link className="btn btn--primary cta-band__btn" href={ctaHref}>
              <span>{ctaLabel}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="cta-band__trust">
            <div className="cta-band__trust-item">
              <ShieldCheck size={16} className="text-purple" />
              <span>Signed Mutual NDA Upfront</span>
            </div>
            <div className="cta-band__trust-item">
              <Clock size={16} className="text-purple" />
              <span>Technical Review in 24–48h</span>
            </div>
            <div className="cta-band__trust-item">
              <Terminal size={16} className="text-purple" />
              <span>Direct Senior Engineer Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
