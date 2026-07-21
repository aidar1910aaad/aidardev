'use client';

import React, { CSSProperties, useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animationType?: 'slide-up' | 'fade-in' | 'slide-left' | 'slide-right';
  threshold?: number;
  triggerOnce?: boolean;
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  animationType = 'slide-up',
  threshold = 0.12,
  triggerOnce = true,
}: AnimatedSectionProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(entry.target);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return (
    <div
      ref={elementRef}
      className={`motion-reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      data-motion={animationType}
      style={{ '--motion-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
