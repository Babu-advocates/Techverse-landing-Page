'use client';

import React, { useEffect, useRef } from 'react';

interface TitleSweepProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  style?: React.CSSProperties;
}

export default function TitleSweep({
  text,
  as: Component = 'h1',
  className = '',
  style = {},
}: TitleSweepProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLSpanElement>('.ti-sweep-char');
    if (!chars.length) return;

    // Palette: muted slate → solid purple → ink (light theme)
    const palette = [
      [91, 101, 119], // muted
      [124, 58, 237], // purple
      [109, 40, 217], // deep purple
      [91, 33, 182], // richer purple
      [11, 18, 32], // ink
    ];

    const mix = (from: number[], to: number[], p: number) =>
      from.map((val, i) => Math.round(val + (to[i] - val) * p));

    const spectrum = (pos: number) => {
      const p = Math.max(0, Math.min(1, pos));
      const scaled = p * (palette.length - 1);
      const index = Math.min(palette.length - 2, Math.floor(scaled));
      const rgb = mix(palette[index], palette[index + 1], scaled - index);
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    };

    let frameId: number;
    let observer: IntersectionObserver;
    let isVisible = false;

    const updateChars = () => {
      if (!isVisible) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight || 800;
      
      // Calculate scroll progress through the element: 0 when entering bottom, 1 when leaving top
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height * 0.7)));

      chars.forEach((char, idx) => {
        const charOffset = idx / chars.length;
        // Wave sweep effect centered around current scroll progress
        const wave = Math.sin((progress * Math.PI) + (charOffset * 0.6));
        const color = spectrum(progress * 0.8 + (charOffset * 0.3));
        
        char.style.color = color;
        if (progress > 0.15) {
          char.style.opacity = '1';
        }
      });

      frameId = requestAnimationFrame(updateChars);
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(frameId);
          frameId = requestAnimationFrame(updateChars);
        } else {
          cancelAnimationFrame(frameId);
        }
      });
    }, { threshold: 0.05 });

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [text]);

  // Split into words and chars for smooth inline wrapping
  const words = text.split(' ');

  return (
    <Component
      ref={containerRef as any}
      className={`ti-sweep-container ${className}`}
      style={{ display: 'inline-block', ...style }}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="ti-sweep-word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {Array.from(word).map((char, cIdx) => (
            <span
              key={cIdx}
              className="ti-sweep-char"
              style={{
                display: 'inline-block',
                transition: 'color 0.15s ease',
                color: '#5b6577',
              }}
            >
              {char}
            </span>
          ))}
          {wIdx < words.length - 1 && <span style={{ display: 'inline-block', width: '0.28em' }}>&nbsp;</span>}
        </span>
      ))}
    </Component>
  );
}
