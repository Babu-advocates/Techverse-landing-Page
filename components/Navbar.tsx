'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { softwareNav, dataNav, simpleNav, SITE } from '@/content';

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(!isHome);
  const [softOpen, setSoftOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const solidRef = useRef(!isHome);

  useEffect(() => {
    if (isAdmin) return;
    setSolid(!isHome);
    solidRef.current = !isHome;
  }, [isHome, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const y = window.scrollY || 0;
      const nextSolid = isHome ? y > 40 : true;
      if (nextSolid !== solidRef.current) {
        solidRef.current = nextSolid;
        setSolid(nextSolid);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isHome, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const onDoc = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setSoftOpen(false);
        setDataOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, isAdmin]);

  useEffect(() => {
    setMenuOpen(false);
    setSoftOpen(false);
    setDataOpen(false);
  }, [pathname]);

  if (isAdmin) {
    return null;
  }

  const closeAll = () => {
    setMenuOpen(false);
    setSoftOpen(false);
    setDataOpen(false);
  };

  const mobileLinks = [
    { label: 'Home', href: '/' },
    { label: softwareNav.label, href: softwareNav.href },
    { label: dataNav.label, href: dataNav.href },
    ...simpleNav.filter((l) => l.href !== '/contact'),
  ];

  return (
    <header className={`site-nav ${solid ? 'is-solid' : ''} ${menuOpen ? 'is-menu-open' : ''}`} ref={navRef}>
      <div className="site-nav__bar">
        <Link href="/" className="site-nav__logo" aria-label="Techverse Infotech home" onClick={closeAll}>
          <span className="site-nav__mark">
            <Image
              src="/images/techverse-logo.jpg"
              alt=""
              width={32}
              height={32}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </span>
          Techverse Infotech
        </Link>

        <nav className="site-nav__links" aria-label="Main">
          <div className="nav-drop">
            <button
              type="button"
              className={`nav-drop__btn ${softOpen ? 'is-open' : ''}`}
              aria-expanded={softOpen}
              onClick={() => {
                setSoftOpen((v) => !v);
                setDataOpen(false);
              }}
            >
              {softwareNav.label}
              <span aria-hidden="true" style={{ fontSize: '11px', opacity: 0.7 }}>
                ▾
              </span>
            </button>
            {softOpen && (
              <div className="nav-mega" role="region" aria-label="Software Development">
                <div className="nav-mega__intro">
                  <Link href={softwareNav.href} onClick={closeAll} className="nav-mega__hub">
                    All software services
                  </Link>
                  <p>Custom software, ERP systems, mobile applications, and AI automation.</p>
                </div>
                <ul className="nav-mega__list">
                  {softwareNav.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={closeAll}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="nav-drop">
            <button
              type="button"
              className={`nav-drop__btn ${dataOpen ? 'is-open' : ''}`}
              aria-expanded={dataOpen}
              onClick={() => {
                setDataOpen((v) => !v);
                setSoftOpen(false);
              }}
            >
              {dataNav.label}
              <span aria-hidden="true" style={{ fontSize: '11px', opacity: 0.7 }}>
                ▾
              </span>
            </button>
            {dataOpen && (
              <div className="nav-mega nav-mega--quiet" role="region" aria-label="AI Data Services">
                <div className="nav-mega__intro">
                  <Link href={dataNav.href} onClick={closeAll} className="nav-mega__hub">
                    All AI data services
                  </Link>
                  <p>Annotation, labelling, training data, collection, and processing.</p>
                </div>
                <ul className="nav-mega__list">
                  {dataNav.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={closeAll}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {simpleNav
            .filter((l) => l.href !== '/contact')
            .map((link) => (
              <Link key={link.href} href={link.href} onClick={closeAll}>
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="site-nav__actions">
          <Link className="btn btn--primary site-nav__contact-btn" href={SITE.primaryCta.href} onClick={closeAll}>
            Contact Us
          </Link>
          <button
            className="site-nav__toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {menuOpen ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu — expands from the same nav pill */}
      <div
        id="site-nav-menu"
        className={`site-nav__drawer ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="site-nav__drawer-links" aria-label="Mobile">
          {mobileLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeAll}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn--primary site-nav__drawer-cta" href={SITE.primaryCta.href} onClick={closeAll}>
          Contact Us
        </Link>
      </div>
    </header>
  );
}
