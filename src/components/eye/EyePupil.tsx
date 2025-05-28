
import React from 'react';

interface EyePupilProps {
  position: { x: number; y: number };
}

/**
 * Animated eye pupil component that follows mouse movement
 * Provides the tracking behavior for the Eye of Sauron
 */
const EyePupil: React.FC<EyePupilProps> = ({ position }) => {
  return (
    <div 
      className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-gray-800 via-black to-gray-700 rounded-full top-1/2 left-1/2 transition-transform duration-500 ease-out shadow-lg"
      style={{
        transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
        boxShadow: '0 0 6px rgba(0, 0, 0, 0.8), inset 0 0 4px rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Friendly pupil highlight */}
      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full blur-sm"></div>
      
      {/* Gentle glow */}
      <div className="absolute -inset-1 bg-gradient-radial from-orange-200/20 via-yellow-100/15 to-transparent opacity-60 blur-sm animate-pulse"></div>
      
      {/* Cartoon shine */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-gradient-radial from-white/40 via-yellow-100/30 to-transparent opacity-80 rounded-full blur-sm"></div>
    </div>
  );
};

export default EyePupil;
