'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Layers,
  ShieldCheck,
  Workflow,
  Target,
  Cpu,
  FileCode,
  Receipt,
  Users,
  Package,
  UserCog,
  ShoppingBag,
  LayoutDashboard,
  Boxes,
  GraduationCap,
  Landmark,
  Wallet,
  Smartphone,
  TabletSmartphone,
  Briefcase,
  MapPinned,
  Bot,
  Sparkles,
  FileSearch,
  MessageSquare,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import CtaBand from './CtaBand';
import type { ServiceItem } from '@/content';

type Props = {
  service: ServiceItem;
  related: ServiceItem[];
  hubHref: string;
  hubLabel: string;
};

const DELIVERABLE_ICONS = [Code2, Layers, Workflow, ShieldCheck];

const DELIVERABLE_HIGHLIGHTS = [
  'Technical Discovery & User Story Mapping',
  'Scalable Modular Architecture & DB Schemas',
  'Production-Hardened Implementation & APIs',
  'Automated Test Suites, CI/CD & Knowledge Transfer',
];

const SYSTEM_ICONS: Record<string, LucideIcon> = {
  'Billing Software': Receipt,
  'CRM Systems': Users,
  'Inventory Management': Package,
  'HRMS & Payroll': UserCog,
  'E-commerce Platforms': ShoppingBag,
  'Custom Internal Tools': LayoutDashboard,
  'ERP Systems': Boxes,
  'School Management Software': GraduationCap,
  'College Management Software': Landmark,
  'Finance & Accounting': Wallet,
  'Inventory & Operations': Package,
  'HR & Payroll Systems': UserCog,
  'Android Applications': Smartphone,
  'iOS Applications': TabletSmartphone,
  'Cross-Platform Apps': Layers,
  'E-commerce Mobile Apps': ShoppingBag,
  'Business & Field Apps': Briefcase,
  'On-Demand Service Apps': MapPinned,
  'AI-Powered Applications': Sparkles,
  'Intelligent Assistants': Bot,
  'Document Processing': FileSearch,
  'Workflow Automation': Workflow,
  'Chatbots & Support AI': MessageSquare,
  'Process Intelligence': Activity,
};

export default function ServiceDetail({ service, related, hubHref, hubLabel }: Props) {
  const isSoftware = hubHref.includes('/services');

  return (
    <div className="service-detail-page">
      {/* Editorial Hero */}
      <section className="detail-hero">
        <div className="detail-hero__glow" aria-hidden="true" />
        <div className="wrap">
          {/* Top Meta Bar */}
          <div className="detail-meta">
            <Link className="detail-back" href={hubHref}>
              <ArrowLeft size={14} />
              <span>{hubLabel}</span>
            </Link>
          </div>

          {/* Headline & Intro */}
          <h1 className="detail-title">{service.title}</h1>
          <p className="detail-lead">{service.intro}</p>

          {/* Action Row */}
          <div className="detail-actions">
            <Link
              className="btn btn--primary detail-btn-primary"
              href={`/contact?service=${encodeURIComponent(service.formValue)}`}
            >
              <span>Discuss Your Project</span>
              <ArrowRight size={16} />
            </Link>
            <Link className="btn btn--secondary detail-btn-secondary" href={hubHref}>
              <span>{hubLabel}</span>
            </Link>
          </div>

          {/* Value Highlights Strip */}
          <div className="detail-highlights">
            <div className="detail-highlight-card">
              <div className="detail-highlight-icon">
                <ShieldCheck size={18} />
              </div>
              <div className="detail-highlight-content">
                <strong>Enterprise Security</strong>
                <p>Role-based access, encryption &amp; auditability</p>
              </div>
            </div>

            <div className="detail-highlight-card">
              <div className="detail-highlight-icon">
                <Cpu size={18} />
              </div>
              <div className="detail-highlight-content">
                <strong>Senior Engineers</strong>
                <p>Direct architectural oversight &amp; transparency</p>
              </div>
            </div>

            <div className="detail-highlight-card">
              <div className="detail-highlight-icon">
                <FileCode size={18} />
              </div>
              <div className="detail-highlight-content">
                <strong>100% Client Ownership</strong>
                <p>Full IP, repository &amp; deployment transfer</p>
              </div>
            </div>

            <div className="detail-highlight-card">
              <div className="detail-highlight-icon">
                <Workflow size={18} />
              </div>
              <div className="detail-highlight-content">
                <strong>Milestone Cadence</strong>
                <p>Bi-weekly sprints with live staging builds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example systems — custom software types we deliver */}
      {service.systems && service.systems.length > 0 && (
        <section className="section detail-section systems-section" aria-labelledby="systems-h">
          <div className="wrap">
            <div className="section-head section-head--left">
              <p className="t-label">Systems we deliver</p>
              <h2 id="systems-h">Systems built around your operations</h2>
              <p className="lead">
                Examples of applications we design and build around your workflows—not off-the-shelf templates.
              </p>
            </div>

            <div className="systems-grid">
              {service.systems.map((system, i) => {
                const Icon = SYSTEM_ICONS[system.title] ?? Code2;
                return (
                  <article key={system.title} className="system-card">
                    <div className="system-card__top">
                      <div className="system-card__icon" aria-hidden="true">
                        <Icon size={20} strokeWidth={1.75} />
                      </div>
                      <span className="system-card__n">/{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="system-card__title">{system.title}</h3>
                    <p className="system-card__copy">{system.blurb}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Deliverables Grid Section */}
      <section className="section detail-section">
        <div className="wrap">
          <div className="section-head section-head--left">
            <p className="t-label">Core Deliverables</p>
            <h2>What We Engineer &amp; Deliver</h2>
            <p className="lead">
              Structured, production-grade outputs designed to integrate directly into your operations.
            </p>
          </div>

          <div className="deliverables-grid">
            {service.deliverables.map((d, i) => {
              const IconComponent = DELIVERABLE_ICONS[i % DELIVERABLE_ICONS.length];
              const highlight = DELIVERABLE_HIGHLIGHTS[i % DELIVERABLE_HIGHLIGHTS.length];
              return (
                <div key={d} className="deliverable-card">
                  <div className="deliverable-card__top">
                    <div className="deliverable-card__icon">
                      <IconComponent size={20} />
                    </div>
                    <span className="deliverable-card__num">/{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <h3 className="deliverable-card__title">{d}</h3>
                  <p className="deliverable-card__highlight">{highlight}</p>

                  <div className="deliverable-card__footer">
                    <span className="deliverable-pill">Production Ready</span>
                    <span className="deliverable-pill">Full Source Ownership</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strategic Fit & Engagement Model Bento Split */}
      <section className="section section--surface detail-section">
        <div className="wrap">
          <div className="detail-split-grid">
            {/* Card 1: Strategic Fit & Ideal Audience */}
            <div className="detail-bento-card">
              <div className="detail-bento-card__badge">
                <Target size={14} />
                <span>STRATEGIC FIT</span>
              </div>
              <h3 className="detail-bento-card__title">Who this practice is engineered for</h3>
              <p className="detail-bento-card__lead">{service.audience}</p>

              <div className="detail-checklist">
                <div className="detail-checklist__item">
                  <CheckCircle2 size={18} className="text-purple flex-shrink-0" />
                  <span>Organizations requiring bespoke systems where SaaS tools fall short</span>
                </div>
                <div className="detail-checklist__item">
                  <CheckCircle2 size={18} className="text-purple flex-shrink-0" />
                  <span>Teams replacing fragmented spreadsheets and manual internal bottlenecks</span>
                </div>
                <div className="detail-checklist__item">
                  <CheckCircle2 size={18} className="text-purple flex-shrink-0" />
                  <span>Businesses demanding high SLA uptime, data confidentiality, and compliance</span>
                </div>
                <div className="detail-checklist__item">
                  <CheckCircle2 size={18} className="text-purple flex-shrink-0" />
                  <span>Leaders who want clean code ownership without ongoing agency lock-in</span>
                </div>
              </div>
            </div>

            {/* Card 2: Engagement Roadmap */}
            <div className="detail-bento-card detail-bento-card--roadmap">
              <div className="detail-bento-card__badge">
                <Workflow size={14} />
                <span>ENGAGEMENT ROADMAP</span>
              </div>
              <h3 className="detail-bento-card__title">How we work together</h3>
              <p className="detail-bento-card__lead">{service.engagement}</p>

              <div className="detail-roadmap">
                <div className="detail-roadmap__step">
                  <div className="detail-roadmap__step-num">01</div>
                  <div className="detail-roadmap__step-body">
                    <strong>Discovery &amp; Architectural Scoping</strong>
                    <p>Requirements workshops, API mapping, data schemas, and sprint roadmap planning.</p>
                  </div>
                </div>

                <div className="detail-roadmap__step">
                  <div className="detail-roadmap__step-num">02</div>
                  <div className="detail-roadmap__step-body">
                    <strong>Iterative Build &amp; Staging Reviews</strong>
                    <p>Bi-weekly engineering sprints with staging releases, demo reviews, and transparent code commits.</p>
                  </div>
                </div>

                <div className="detail-roadmap__step">
                  <div className="detail-roadmap__step-num">03</div>
                  <div className="detail-roadmap__step-body">
                    <strong>Verification, Deployment &amp; Handoff</strong>
                    <p>Automated regression testing, cloud deployment, security review, and team documentation transfer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {related.length > 0 && (
        <section className="section detail-section">
          <div className="wrap">
            <div className="section-head section-head--left">
              <p className="t-label">Complementary Capabilities</p>
              <h2>Related Practices</h2>
              <p className="lead">
                Explore connected technology practices designed to integrate seamlessly with {service.title.toLowerCase()}.
              </p>
            </div>

            <div className="related-grid">
              {related.map((r) => (
                <Link key={r.slug} href={r.seo.path} className="related-card">
                  <div className="related-card__top">
                    <span className="related-card__badge">
                      {isSoftware ? 'Software Service' : 'AI Data Service'}
                    </span>
                    <div className="related-card__arrow">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                  <h3 className="related-card__title">{r.title}</h3>
                  <p className="related-card__desc">{r.short}</p>
                  <span className="related-card__link">
                    <span>View Service Details</span>
                    <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium CTA Band */}
      <CtaBand
        title={`Ready to discuss ${service.title}?`}
        description="Share your requirements with our engineering team. We will review your specs and schedule a focused scoping session."
        ctaHref={`/contact?service=${encodeURIComponent(service.formValue)}`}
        ctaLabel="Schedule Project Scoping"
      />
    </div>
  );
}
