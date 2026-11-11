import Link from 'next/link';
import { ArrowRight, Sparkles, Code2, Users, Rocket } from 'lucide-react';

export default function CareersHero() {
  return (
    <section className="careers-hero">
      <div className="wrap">
        <div className="careers-hero__content">
          <p className="t-label">Careers at Techverse</p>
          <h1 className="careers-hero__title">
            Build Your Future With Techverse Infotech.
          </h1>
          <p className="careers-hero__lead">
            We architect bespoke software, mission-critical ERP platforms, and high-precision AI data annotation pipelines. Join a team where engineering craft, autonomy, and long-term impact come first.
          </p>

          <div className="careers-hero__actions">
            <a href="#openings" className="btn btn--primary">
              <span>View Open Positions</span>
              <ArrowRight size={16} />
            </a>
            <Link href="/about" className="btn btn--secondary">
              <span>Our Culture &amp; Mission</span>
            </Link>
          </div>
        </div>

        {/* Culture & Perks Grid */}
        <div className="careers-perks-grid">
          <div className="careers-perk-card">
            <Code2 size={24} className="careers-perk-icon" />
            <h3>Modern Engineering Stack</h3>
            <p>TypeScript, Next.js, PostgreSQL, Docker, and AI tooling. No legacy baggage or outdated agency workflows.</p>
          </div>

          <div className="careers-perk-card">
            <Rocket size={24} className="careers-perk-icon" />
            <h3>Rapid Growth &amp; Autonomy</h3>
            <p>Direct ownership of products from architecture to deployment with transparent sprint reviews and meritocracy.</p>
          </div>

          <div className="careers-perk-card">
            <Users size={24} className="careers-perk-icon" />
            <h3>Hybrid Work Culture</h3>
            <p>Flexible schedules, ergonomic office spaces in Coimbatore, and seamless asynchronous collaboration tools.</p>
          </div>

          <div className="careers-perk-card">
            <Sparkles size={24} className="careers-perk-icon" />
            <h3>Comprehensive Benefits</h3>
            <p>Competitive compensation, health insurance, annual performance bonuses, and learning stipends for certifications.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
