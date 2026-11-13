'use client';

import { useLayoutEffect, useRef, useCallback } from 'react';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '', style }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()} style={style}>
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const cardsRef = useRef([]);
  const cardOffsetsRef = useRef([]);
  const endOffsetRef = useRef(0);
  /** Frozen viewport height — live innerHeight shakes on mobile URL-bar show/hide */
  const layoutHeightRef = useRef(0);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);
  const resizeTimerRef = useRef(null);
  const pendingRafRef = useRef(0);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (end <= start) return scrollTop >= start ? 1 : 0;
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const measureOffsets = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    // Prefer visualViewport when present, but freeze for the session until resize
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    layoutHeightRef.current = Math.round(vv?.height || window.innerHeight);

    const prev = cards.map((card) => card.style.transform);
    cards.forEach((card) => {
      card.style.transform = 'none';
    });

    // Force layout once after clearing transforms
    void scrollerRef.current?.offsetHeight;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    cardOffsetsRef.current = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return Math.round(rect.top + scrollY);
    });

    const endEl = scrollerRef.current?.querySelector('.scroll-stack-end');
    if (endEl) {
      const rect = endEl.getBoundingClientRect();
      endOffsetRef.current = Math.round(rect.top + scrollY);
    } else {
      endOffsetRef.current = 0;
    }

    cards.forEach((card, i) => {
      card.style.transform = prev[i] || '';
    });
  }, []);

  const getScrollTop = useCallback(() => {
    const lenis = typeof window !== 'undefined' ? window.__techverseLenis : null;
    if (lenis && typeof lenis.scroll === 'number' && Number.isFinite(lenis.scroll)) {
      return lenis.scroll;
    }
    return window.scrollY || window.pageYOffset || 0;
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!useWindowScroll || !cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const scrollTop = getScrollTop();
    const containerHeight = layoutHeightRef.current || window.innerHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElementTop = endOffsetRef.current;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cardTop = cardOffsetsRef.current[i];
      if (typeof cardTop !== 'number') return;

      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = Math.min(1, baseScale + i * itemScale);
      // Clamp so scale never overshoots 1 or goes negative from float error
      const scale = Math.min(1, Math.max(targetScale, 1 - scaleProgress * (1 - targetScale)));
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jTop = cardOffsetsRef.current[j];
          const jStart = jTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jStart) topCardIndex = j;
        }
        if (i < topCardIndex) blur = Math.max(0, (topCardIndex - i) * blurAmount);
      }

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      // Whole pixels only — subpixel + scale is the classic stack shake
      const next = {
        translateY: Math.round(translateY),
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const prev = lastTransformsRef.current.get(i);
      const changed =
        !prev ||
        prev.translateY !== next.translateY ||
        Math.abs(prev.scale - next.scale) > 0.001 ||
        Math.abs(prev.rotation - next.rotation) > 0.1 ||
        Math.abs(prev.blur - next.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${next.translateY}px, 0) scale(${next.scale})`;
        card.style.filter = next.blur > 0 ? `blur(${next.blur}px)` : '';
        lastTransformsRef.current.set(i, next);
      }

      if (i === cardsRef.current.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    useWindowScroll,
    getScrollTop,
    parsePercentage,
    stackPosition,
    scaleEndPosition,
    itemStackDistance,
    itemScale,
    baseScale,
    rotationAmount,
    blurAmount,
    calculateProgress,
    onStackComplete,
  ]);

  const scheduleUpdate = useCallback(() => {
    if (pendingRafRef.current) return;
    pendingRafRef.current = window.requestAnimationFrame(() => {
      pendingRafRef.current = 0;
      updateCardTransforms();
    });
  }, [updateCardTransforms]);

  useLayoutEffect(() => {
    if (!useWindowScroll) return undefined;

    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.zIndex = String(i + 1);
    });

    measureOffsets();
    updateCardTransforms();

    const onTick = () => updateCardTransforms();
    let attached = false;
    let pollId = null;
    let nativeHandler = null;

    const attachTick = () => {
      const api = window.__techverseLenisTick;
      if (!api) return false;
      api.add(onTick);
      attached = true;
      updateCardTransforms();
      return true;
    };

    if (!attachTick()) {
      nativeHandler = () => scheduleUpdate();
      window.addEventListener('scroll', nativeHandler, { passive: true });
      pollId = window.setInterval(() => {
        if (attachTick()) {
          window.clearInterval(pollId);
          pollId = null;
          if (nativeHandler) {
            window.removeEventListener('scroll', nativeHandler);
            nativeHandler = null;
          }
        }
      }, 50);
    }

    const onResize = () => {
      if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = window.setTimeout(() => {
        measureOffsets();
        lastTransformsRef.current.clear();
        updateCardTransforms();
      }, 160);
    };
    window.addEventListener('resize', onResize);
    // Ignore visualViewport resize (URL bar) — that's what caused shake; only window resize remasures
    window.addEventListener('orientationchange', onResize);

    return () => {
      if (pollId) window.clearInterval(pollId);
      if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
      if (pendingRafRef.current) window.cancelAnimationFrame(pendingRafRef.current);
      if (attached && window.__techverseLenisTick) {
        window.__techverseLenisTick.remove(onTick);
      }
      if (nativeHandler) window.removeEventListener('scroll', nativeHandler);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      cardsRef.current = [];
      cardOffsetsRef.current = [];
      lastTransformsRef.current.clear();
      stackCompletedRef.current = false;
      isUpdatingRef.current = false;
    };
  }, [
    useWindowScroll,
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    measureOffsets,
    updateCardTransforms,
    scheduleUpdate,
  ]);

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? 'scroll-stack-scroller--window' : ''} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
