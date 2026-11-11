'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface ProjectCard {
  id: string;
  title: string;
  category: string;
  tag: string;
  metric: string;
  metricLabel: string;
  description: string;
  gradient: string;
}

const projects: ProjectCard[] = [
  {
    id: '1',
    title: 'Aegis Core',
    category: 'Enterprise Fintech',
    tag: 'Distributed Systems',
    metric: '99.999%',
    metricLabel: 'Transaction Uptime',
    description: 'High-frequency clearing engine processing $400M+ daily with sub-millisecond settlement latency.',
    gradient: 'linear-gradient(135deg, #4338ca 0%, #3b82f6 100%)',
  },
  {
    id: '2',
    title: 'CogniFlow AI',
    category: 'Autonomous Agents',
    tag: 'LLM Orchestration',
    metric: '4.8x',
    metricLabel: 'Workflow Acceleration',
    description: 'Multi-agentic customer intelligence ecosystem automating complex triage across 12 languages.',
    gradient: '#7c3aed',
  },
  {
    id: '3',
    title: 'NeuroVitals Health',
    category: 'HealthTech Platform',
    tag: 'Real-Time Telemetry',
    metric: '1.2M+',
    metricLabel: 'Active Patients',
    description: 'HIPAA-compliant diagnostic dashboard analyzing wearable bio-metrics in real time with predictive alerts.',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  },
  {
    id: '4',
    title: 'Vanguard Cloud',
    category: 'DevOps & Infrastructure',
    tag: 'Kubernetes Mesh',
    metric: '68%',
    metricLabel: 'Cloud Cost Reduction',
    description: 'Automated multi-region autoscaling infrastructure with zero-downtime canary deployments.',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
  },
  {
    id: '5',
    title: 'OmniRoute Global',
    category: 'Logistics Intelligence',
    tag: 'IoT Fleet Cloud',
    metric: '34%',
    metricLabel: 'Fuel & Time Saved',
    description: 'Real-time routing optimization network powering 24,000+ freight carriers across North America & EU.',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
  },
  {
    id: '6',
    title: 'Aura Commerce',
    category: 'Next-Gen E-Commerce',
    tag: 'Headless Next.js',
    metric: '2.4x',
    metricLabel: 'Checkout Conversion',
    description: 'Ultra-low-latency global storefront with edge computing, instant page loads, and personalized AI shopping.',
    gradient: 'linear-gradient(135deg, #db2777 0%, #f43f5e 100%)',
  },
];

export default function ArcSlider() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const cards = Array.from(stage.querySelectorAll<HTMLDivElement>('.arc-card-item'));
    if (!cards.length) return;

    let currentRotation = 0;
    let targetRotation = 0;
    let velocity = 0;
    let isDown = false;
    let startX = 0;
    let lastX = 0;
    let animationFrameId: number;

    const radius = Math.min(window.innerWidth * 0.8, 920);
    const count = cards.length;
    const stepAngle = 360 / count;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      startX = clientX;
      lastX = clientX;
      velocity = 0;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - lastX;
      lastX = clientX;

      // Sensitivity factor
      const deltaDeg = deltaX * 0.16;
      targetRotation += deltaDeg;
      velocity = deltaDeg;
    };

    const onPointerUp = () => {
      if (!isDown) return;
      isDown = false;
      setIsDragging(false);
    };

    const updatePhysics = () => {
      if (!isDown) {
        // Natural friction decay
        velocity *= 0.94;
        targetRotation += velocity;
      }

      // Smooth lerp
      currentRotation += (targetRotation - currentRotation) * 0.1;

      // Position each card along the 3D arc
      cards.forEach((card, index) => {
        const angleDeg = (index * stepAngle + currentRotation);
        const rad = (angleDeg * Math.PI) / 180;
        const x = Math.sin(rad) * radius;
        const z = Math.cos(rad) * radius - radius;
        const rotY = angleDeg;

        // Depth cueing
        const opacity = Math.max(0.2, (Math.cos(rad) + 1) / 2);
        const scale = 0.8 + (opacity * 0.2);

        card.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.zIndex = `${Math.round(z + 2000)}`;
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="arc-carousel-wrapper">
      {/* Floating Drag Indicator Badge */}
      <div
        className="arc-drag-badge"
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '9999px',
          background: 'rgba(124, 58, 237, 0.15)',
          border: '1px solid rgba(109, 40, 217, 0.35)',
          backdropFilter: 'blur(10px)',
          color: '#6d28d9',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        <Sparkles size={14} className="text-violet-700" />
        <span>DRAG TO ROTATE PORTFOLIO</span>
      </div>

      <div
        ref={stageRef}
        id="wfArcStageRoot"
        className="arc-stage"
      >
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="arc-card arc-card-item"
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'absolute',
            }}
          >
            {/* Top Bar with category and tag */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#7c3aed',
                  }}
                >
                  {proj.category}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    background: 'rgba(15, 35, 40, 0.1)',
                    color: '#5b6577',
                    border: '1px solid rgba(15, 35, 40, 0.08)',
                  }}
                >
                  {proj.tag}
                </span>
              </div>

              {/* Title & Metric Preview Banner */}
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#0b1220',
                  marginBottom: '16px',
                  lineHeight: '1.2',
                }}
              >
                {proj.title}
              </h3>

              {/* Graphic Banner */}
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '16px',
                  background: proj.gradient,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 70% 30%, rgba(15, 35, 40, 0.14) 0%, transparent 60%)',
                  }}
                />
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    {proj.metric}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {proj.metricLabel}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#5b6577' }}>
                {proj.description}
              </p>
            </div>

            {/* Bottom Action Link */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(15, 35, 40, 0.1)',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0b1220' }}>
                Case Study Specs
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(15, 35, 40, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0b1220',
                }}
              >
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
