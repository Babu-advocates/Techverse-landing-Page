'use client';

import { useEffect, useRef } from 'react';
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

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tickListeners = new Set<TickListener>();

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    lenisRef.current = lenis;
    window.__techverseLenis = lenis;
    window.__techverseLenisTick = {
      add: (fn) => {
        tickListeners.add(fn);
      },
      remove: (fn) => {
        tickListeners.delete(fn);
      },
    };

    lenis.on('scroll', ScrollTrigger.update);

    // Run Lenis, then any stack/transform listeners in the same frame.
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
    };
  }, []);

  return <>{children}</>;
}
