'use client';

import { useEffect, useRef } from 'react';
import { trackBlogRead } from '@/lib/analytics';

interface Props {
  slug: string;
  scrollThreshold?: number; // percentage, default 40
  timeThreshold?: number;   // seconds, default 25
}

export default function BlogReadTracker({ slug, scrollThreshold = 40, timeThreshold = 25 }: Props) {
  const scrollFired = useRef(false);
  const timeFired = useRef(false);

  useEffect(() => {
    // Scroll-based trigger
    const handleScroll = () => {
      if (scrollFired.current) return;
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= scrollThreshold) {
        scrollFired.current = true;
        trackBlogRead(slug, 'scroll_depth', Math.round(scrollPercent));
      }
    };

    // Time-based trigger
    const timeTimer = setTimeout(() => {
      if (!timeFired.current && !scrollFired.current) {
        timeFired.current = true;
        trackBlogRead(slug, 'time_on_page', undefined, timeThreshold);
      }
    }, timeThreshold * 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeTimer);
    };
  }, [slug, scrollThreshold, timeThreshold]);

  return null;
}
