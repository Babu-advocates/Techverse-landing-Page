import Image from 'next/image';
import Link from 'next/link';
import { SITE, footerQuickLinks, softwareNav, dataNav } from '@/content';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid site-footer__grid--wide">
          <div className="site-footer__brand">
            <strong>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'inline-block',
                    background: '#fff',
                  }}
                >
                  <Image
                    src="/images/techverse-logo.jpg"
                    alt=""
                    width={28}
                    height={28}
                    style={{ objectFit: 'cover' }}
                  />
                </span>
                {SITE.name}
              </span>
            </strong>
            <p className="muted" style={{ color: 'var(--p-inv-muted)', fontSize: 14, maxWidth: '32ch' }}>
              {SITE.positioning}
            </p>
          </div>

          <div className="site-footer__col">
            <h4>Company</h4>
            {footerQuickLinks.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="site-footer__col">
            <h4>Software</h4>
            {softwareNav.items.slice(0, 5).map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label.replace(' & Business Management Systems', '').replace(' Development', '')}
              </Link>
            ))}
          </div>

          <div className="site-footer__col">
            <h4>AI data</h4>
            {dataNav.items.slice(0, 5).map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="site-footer__col">
            <h4>Contact</h4>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div>
            © {year} {SITE.name}
          </div>
          <div>Photo stand-ins pending client photography.</div>
        </div>
      </div>
    </footer>
  );
}
