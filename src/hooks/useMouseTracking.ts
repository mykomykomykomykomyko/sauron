
import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking mouse position and managing animation states
 * Used for interactive elements that respond to mouse movement
 */
export const useMouseTracking = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initialize visibility for fade-in animations
    setIsVisible(true);
    
    // Mouse movement tracking for interactive elements
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return { mousePosition, isVisible };
};
