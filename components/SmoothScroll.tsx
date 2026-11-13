'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type TickListener = () => void;

declare global {
  interface Window {
    __techverseLenis?: Lenis | null;
    __techverseLenisTick?: {
      add: (fn: TickListener) => void;
      remove: (fn: TickListener) => void;
    };
  }
}

function shouldUseLenis() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Touch / coarse pointers: native scroll — Lenis + transform stacks jitter on mobile
  if (window.matchMedia('(pointer: coarse)').matches) return false;
  if (window.matchMedia('(hover: none)').matches) return false;
  if (window.innerWidth < 900) return false;
  return true;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (isAdmin) return;
    gsap.registerPlugin(ScrollTrigger);

    const tickListeners = new Set<TickListener>();

    window.__techverseLenisTick = {
      add: (fn) => {
        tickListeners.add(fn);
      },
      remove: (fn) => {
        tickListeners.delete(fn);
      },
    };

    if (!shouldUseLenis()) {
      // Native mobile scroll: drive stack listeners from rAF on scroll
      let raf = 0;
      const onScroll = () => {
        if (raf) return;
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          tickListeners.forEach((fn) => fn());
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.__techverseLenis = null;

      return () => {
        window.removeEventListener('scroll', onScroll);
        if (raf) window.cancelAnimationFrame(raf);
        window.__techverseLenisTick = undefined;
        window.__techverseLenis = null;
      };
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    window.__techverseLenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
      tickListeners.forEach((fn) => fn());
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      if (window.__techverseLenis === lenis) window.__techverseLenis = null;
      window.__techverseLenisTick = undefined;
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isAdmin]);

  return <>{children}</>;
}
