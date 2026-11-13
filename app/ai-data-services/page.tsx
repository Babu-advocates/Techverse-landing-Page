import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Tag,
  Eye,
  Database,
  FileText,
  Layers,
  CheckCircle2,
  ScanSearch,
  FolderOpen,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import CtaBand from '@/components/CtaBand';
import { buildMetadata, dataHubSeo, dataServices, dataCategories, SITE } from '@/content';

export const metadata: Metadata = buildMetadata(dataHubSeo);

const DATA_SERVICE_ICONS = [Tag, Eye, ScanSearch, Database, FolderOpen, FileText, Filter];
const DATA_SERVICE_COLORS = [
  { accent: '#0ea5e9' },
  { accent: '#059669' },
  { accent: '#ea580c' },
  { accent: '#7c3aed' },
  { accent: '#d97706' },
  { accent: '#0d9488' },
  { accent: '#db2777' },
];

const CATEGORY_CONFIG = [
  { key: 'computerVision' as const, label: 'Computer Vision', icon: Eye, color: '#38bdf8' },
  { key: 'textLanguage' as const, label: 'Text & Language', icon: FileText, color: '#a78bfa' },
  { key: 'aiOperations' as const, label: 'AI Data Operations', icon: Layers, color: '#34d399' },
  { key: 'businessSupport' as const, label: 'Business Support', icon: ShieldCheck, color: '#fbbf24' },
];

export default function AiDataHubPage() {
  return (
    <div className="hub-page">
      {/* ── Hero ── */}
      <section className="hub-hero hub-hero--data">
        <div className="hub-hero__glow" aria-hidden="true" />
        <div className="wrap">
          <h1 className="hub-hero__title">
            High-quality data services for the next generation of AI.
          </h1>
          <p className="hub-hero__lead">
            Reliable AI models begin with reliable data. We provide structured annotation, labelling, collection, and QA workflows that help prepare datasets for machine learning, computer vision, and NLP applications.
          </p>

          <div className="hub-hero__actions">
            <Link className="hub-btn-primary" href={SITE.dataProjectCta.href}>
              <span>Discuss Your Data Project</span>
              <ArrowRight size={16} />
            </Link>
            <Link className="hub-btn-secondary" href="/contact">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section className="section hub-services-section">
        <div className="wrap">
          <div className="section-head section-head--left">
            <p className="t-label">Our Services</p>
            <h2>Seven data practices, structured for scale.</h2>
            <p className="lead">
              Project scope, annotation guidelines, quality metrics, formats, and delivery schedules are finalized around your requirements.
            </p>
          </div>

          <div className="hub-service-grid">
            {dataServices.map((s, i) => {
              const IconComponent = DATA_SERVICE_ICONS[i % DATA_SERVICE_ICONS.length];
              const colors = DATA_SERVICE_COLORS[i % DATA_SERVICE_COLORS.length];
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
                        <span>View Service Details</span>
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

      {/* ── Capability Categories ── */}
      <section className="section section--surface hub-categories-section">
        <div className="wrap">
          <div className="section-head">
            <p className="t-label">Full Capability Coverage</p>
            <h2>Everything your AI pipeline needs</h2>
            <p className="lead">
              From raw data collection to final quality validation — a complete data operations suite.
            </p>
          </div>

          <div className="hub-category-grid">
            {CATEGORY_CONFIG.map(({ key, label, icon: IconComponent, color }) => (
              <div key={key} className="hub-category-card" style={{ '--cat-color': color } as React.CSSProperties}>
                <div className="hub-category-card__header">
                  <div className="hub-category-card__icon">
                    <IconComponent size={18} />
                  </div>
                  <h3 className="hub-category-card__title">{label}</h3>
                </div>
                <div className="hub-category-card__tags">
                  {dataCategories[key].map((item) => (
                    <span key={item} className="hub-category-tag">{item}</span>
                  ))}
                </div>
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
              'Guideline-Driven Quality Control',
              'Sampling & Review Checkpoints',
              'Agreed Formats & Delivery Schedules',
              'Signed NDA Before Project Kickoff',
              'Transparent Batch-Level Reporting',
            ].map((item) => (
              <div key={item} className="hub-trust__item">
                <CheckCircle2 size={15} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Discuss your data project"
        description="Share dataset type, volume expectations, annotation guidelines, and timelines — we will help you define a workable approach."
        ctaHref={SITE.dataProjectCta.href}
        ctaLabel={SITE.dataProjectCta.label}
      />
    </div>
  );
}
