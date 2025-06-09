
import { useState, useEffect } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * Detects when elements enter the viewport and triggers animations
 */
export const useScrollAnimation = (threshold: number = 0.1) => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const elementId = entry.target.getAttribute('data-scroll-id');
        if (elementId) {
          setVisibleElements(prev => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) {
              newSet.add(elementId);
            }
            return newSet;
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin: '50px'
    });

    // Observe all elements with data-scroll-id attribute
    const elementsToObserve = document.querySelectorAll('[data-scroll-id]');
    elementsToObserve.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  const isVisible = (elementId: string) => visibleElements.has(elementId);

  return { isVisible };
};
