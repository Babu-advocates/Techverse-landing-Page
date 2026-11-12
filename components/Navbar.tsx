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
  const [open, setOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [solid, setSolid] = useState(!isHome);
  const [progress, setProgress] = useState(0);
  const [softOpen, setSoftOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isAdmin) return;
    setSolid(!isHome);
  }, [isHome, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (isHome) setSolid(y > 40);
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      setProgress(Math.min(100, Math.round((y / max) * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const onDoc = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setSoftOpen(false);
        setDataOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    document.body.style.overflow = open || dockOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, dockOpen, isAdmin]);

  if (isAdmin) {
    return null;
  }

  const closeAll = () => {
    setOpen(false);
    setDockOpen(false);
    setSoftOpen(false);
    setDataOpen(false);
  };

  return (
    <>
      {/* Pill-shaped Top Navbar */}
      <header
        className={`site-nav ${solid ? 'is-solid' : ''}`}
        ref={navRef}
      >
        <div className="site-nav__bar">
          <Link href="/" className="site-nav__logo" aria-label="Techverse Infotech home" onClick={closeAll}>
            <span className="site-nav__mark">
              <Image
                src="/images/techverse-logo.jpg"
                alt="Techverse Infotech Emblem"
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
                <span aria-hidden="true" style={{ fontSize: '11px', opacity: 0.7 }}>▾</span>
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
                <span aria-hidden="true" style={{ fontSize: '11px', opacity: 0.7 }}>▾</span>
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
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                {open ? (
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                ) : (
                  <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="site-nav__drawer is-open">
            <Link href={softwareNav.href} onClick={closeAll}>
              {softwareNav.label}
            </Link>
            <Link href={dataNav.href} onClick={closeAll}>
              {dataNav.label}
            </Link>
            {simpleNav.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeAll}>
                {link.label}
              </Link>
            ))}
            <Link href={SITE.primaryCta.href} onClick={closeAll} style={{ fontWeight: 700, color: '#9333ea' }}>
              Contact Us →
            </Link>
          </div>
        )}
      </header>

      {/* Floating Bottom Pill Dock with Progress Bar & Menu */}
      <div className="site-dock" role="navigation" aria-label="Quick menu">
        <span className="site-dock__mark" aria-hidden="true">
          <Image
            src="/images/techverse-logo.jpg"
            alt="Techverse"
            width={32}
            height={32}
            style={{ objectFit: 'cover' }}
          />
        </span>

        {/* Dynamic Round Circular Progress Ring */}
        <div
          className="site-dock__round-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Scroll progress: ${progress}%`}
          title={`Scroll progress: ${progress}%`}
        >
          <svg width="34" height="34" viewBox="0 0 36 36">
            <defs>
              <linearGradient id="dock-round-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="50%" stopColor="#c026d3" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Background Circular Track */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="3.2"
            />
            {/* Animated Circular Progress Stroke */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="url(#dock-round-grad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray={88}
              strokeDashoffset={88 - (88 * progress) / 100}
              transform="rotate(-90 18 18)"
              style={{
                transition: 'stroke-dashoffset 0.1s linear',
                filter: 'drop-shadow(0 0 4px rgba(192, 38, 211, 0.6))',
              }}
            />
          </svg>
        </div>

        <button
          type="button"
          className="site-dock__menu"
          onClick={() => setDockOpen(true)}
          aria-expanded={dockOpen}
        >
          Menu
        </button>
      </div>

      {dockOpen && (
        <div
          className="site-dock__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDockOpen(false);
          }}
        >
          <div className="site-dock__sheet">
            <p className="muted">Navigate</p>
            <Link href="/" onClick={closeAll}>
              Home
            </Link>
            <Link href={softwareNav.href} onClick={closeAll}>
              Software Development
            </Link>
            <Link href={dataNav.href} onClick={closeAll}>
              AI Data Services
            </Link>
            <Link href="/industries" onClick={closeAll}>
              Industries
            </Link>
            <Link href="/about" onClick={closeAll}>
              About Us
            </Link>
            <Link href="/contact" onClick={closeAll}>
              Contact Us
            </Link>
            <div style={{ paddingTop: 8 }}>
              <button type="button" className="btn btn--ghost" style={{ width: '100%' }} onClick={() => setDockOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
