
import React from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface ParticleSystemProps {
  particleCount?: number;
  className?: string;
}

/**
 * Animated particle system for background visual effects
 * Creates floating particles with randomized properties for atmospheric effect
 */
const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  particleCount = 20, 
  className = "fixed w-1 h-1 bg-red-500/30 rounded-full animate-pulse" 
}) => {
  // Generate particles with randomized properties
  const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10,
  }));

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={className}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </>
  );
};

export default ParticleSystem;
