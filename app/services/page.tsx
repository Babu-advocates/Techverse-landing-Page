import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Database,
  Layers,
  Workflow,
  Smartphone,
  Cpu,
  Plug,
  Cloud,
  CheckCircle2,
} from 'lucide-react';
import CtaBand from '@/components/CtaBand';
import { buildMetadata, softwareHubSeo, softwareServices, SITE } from '@/content';

export const metadata: Metadata = buildMetadata(softwareHubSeo);

const SERVICE_ICONS = [Code2, Database, Layers, Smartphone, Cpu, Plug, Cloud];
const SERVICE_COLORS = [
  { accent: '#7c3aed' },
  { accent: '#059669' },
  { accent: '#2563eb' },
  { accent: '#ea580c' },
  { accent: '#0284c7' },
  { accent: '#db2777' },
  { accent: '#16a34a' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Discovery & Scoping', desc: 'We start with a focused session to understand your requirements, map workflows, and define the right technical approach.' },
  { num: '02', title: 'Architecture & Planning', desc: 'Technical blueprints, sprint roadmaps, API contracts, and database schemas are defined before a single line of production code.' },
  { num: '03', title: 'Iterative Engineering', desc: 'Bi-weekly builds with staging access and transparent commit history—you review and direct at every milestone.' },
  { num: '04', title: 'Delivery & Handoff', desc: 'Full repository transfer, deployment, automated test suites, CI/CD configuration, and comprehensive documentation.' },
];

export default function ServicesHubPage() {
  return (
    <div className="hub-page">
      {/* ── Hero ── */}
      <section className="hub-hero">
        <div className="hub-hero__glow" aria-hidden="true" />
        <div className="wrap">
          <h1 className="hub-hero__title">
            Customized digital solutions for real business operations.
          </h1>
          <p className="hub-hero__lead">
            From ERP systems and mobile apps to APIs and cloud foundations—we design, develop, and implement software shaped around how your teams actually work.
          </p>

          <div className="hub-hero__actions">
            <Link className="hub-btn-primary" href={SITE.primaryCta.href}>
              <span>Start a Project</span>
              <ArrowRight size={16} />
            </Link>
            <Link className="hub-btn-secondary" href="/about">
              How we work
            </Link>
          </div>

          <div className="hub-hero__stats">
            <div className="hub-stat">
              <span className="hub-stat__val">7</span>
              <span className="hub-stat__label">Software Practices</span>
            </div>
            <div className="hub-stat-divider" aria-hidden="true" />
            <div className="hub-stat">
              <span className="hub-stat__val">100%</span>
              <span className="hub-stat__label">Client Code Ownership</span>
            </div>
            <div className="hub-stat-divider" aria-hidden="true" />
            <div className="hub-stat">
              <span className="hub-stat__val">Full</span>
              <span className="hub-stat__label">Source & IP Transfer</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section className="section hub-services-section">
        <div className="wrap">
          <div className="section-head section-head--left">
            <p className="t-label">Our Practices</p>
            <h2>Seven software disciplines, one consistent partner.</h2>
            <p className="lead">
              Explore each practice to understand scope, typical deliverables, and how engagement works.
            </p>
          </div>

          <div className="hub-service-grid">
            {softwareServices.map((s, i) => {
              const IconComponent = SERVICE_ICONS[i % SERVICE_ICONS.length];
              const colors = SERVICE_COLORS[i % SERVICE_COLORS.length];
              return (
                <Link
                  key={s.slug}
                  href={s.seo.path}
                  className="hub-service-card"
                  style={{ '--card-accent': colors.accent } as React.CSSProperties}
                >
                  <div className="hub-service-card__inner">
                    <div className="hub-service-card__top">
                      <div className="hub-service-card__icon">
                        <IconComponent size={22} />
                      </div>
                      <div className="hub-service-card__meta">
                        <span className="hub-service-card__num">/{String(i + 1).padStart(2, '0')}</span>
                        <div className="hub-service-card__arrow">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </div>

                    <h3 className="hub-service-card__title">{s.title}</h3>
                    <p className="hub-service-card__desc">{s.short}</p>

                    <div className="hub-service-card__footer">
                      <span className="hub-service-card__cta">
                        <span>View Practice Details</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Engagement Process ── */}
      <section className="section section--surface hub-process-section">
        <div className="wrap">
          <div className="section-head">
            <p className="t-label">Engagement Model</p>
            <h2>How we build together</h2>
            <p className="lead">
              A transparent, structured process that respects your time and delivers working software at each milestone.
            </p>
          </div>

          <div className="hub-process-grid">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="hub-process-step">
                <div className="hub-process-step__num">{step.num}</div>
                <h3 className="hub-process-step__title">{step.title}</h3>
                <p className="hub-process-step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="hub-trust">
        <div className="wrap">
          <div className="hub-trust__inner">
            {[
              'Full Source Code & Repository Ownership',
              'Signed NDA Before Any Discovery Call',
              'Direct Senior Engineer Communication',
              'Bi-Weekly Staging Builds & Reviews',
              'No Hidden Costs — Milestone-Based Billing',
            ].map((item) => (
              <div key={item} className="hub-trust__item">
                <CheckCircle2 size={15} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
