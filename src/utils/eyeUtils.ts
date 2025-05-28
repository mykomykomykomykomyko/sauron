
/**
 * Utility functions for eye tracking and pupil positioning
 * Handles mathematical calculations for mouse-following behavior
 */

interface MousePosition {
  x: number;
  y: number;
}

interface PupilPosition {
  x: number;
  y: number;
}

/**
 * Calculates pupil position based on mouse coordinates
 * Provides smooth tracking with distance-based constraints
 */
export const calculatePupilPosition = (mousePosition: MousePosition): PupilPosition => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2 + 200;
  const maxDistance = 4;
  
  const deltaX = mousePosition.x - centerX;
  const deltaY = mousePosition.y - centerY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  if (distance === 0) return { x: 0, y: 0 };
  
  const normalizedX = (deltaX / distance) * Math.min(distance / 80, maxDistance);
  const normalizedY = (deltaY / distance) * Math.min(distance / 80, maxDistance);
  
  return { x: normalizedX, y: normalizedY };
};
