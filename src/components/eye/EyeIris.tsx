
import React from 'react';
import EyePupil from './EyePupil';

interface EyeIrisProps {
  pupilPosition: { x: number; y: number };
}

/**
 * Eye iris component with animated layers and pupil
 * Contains the inner eye structure with rotating animations
 */
const EyeIris: React.FC<EyeIrisProps> = ({ pupilPosition }) => {
  return (
    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-amber-400/70 via-orange-300/80 to-red-400/60 overflow-hidden shadow-inner border border-orange-100/30">
      {/* Gentle rotating layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 via-orange-300/50 to-amber-400/40 opacity-60 animate-spin" style={{ animationDuration: '20s' }}></div>
      
      {/* Counter-rotating friendly layer */}
      <div className="absolute inset-0 bg-gradient-to-l from-red-300/20 via-orange-200/30 to-yellow-300/25 opacity-50 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
      
      {/* Cartoon sparkles */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-1 left-2 w-1 h-1 bg-white/80 rounded-full animate-pulse blur-sm"></div>
        <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-yellow-200/80 rounded-full animate-pulse blur-sm"></div>
        <div className="absolute top-2 right-2 w-0.5 h-0.5 bg-orange-100/80 rounded-full animate-pulse blur-sm"></div>
      </div>
      
      {/* The Friendly Round Pupil Container */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-orange-500/80 via-red-400/60 to-amber-500/70 overflow-hidden">
        {/* Inner friendly chamber */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/70 via-orange-300/50 to-red-400/60"></div>
        
        {/* The animated pupil */}
        <EyePupil position={pupilPosition} />
        
        {/* Friendly highlights around pupil */}
        <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-orange-200/60 rounded-full opacity-40 blur-sm animate-pulse"></div>
        <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-yellow-200/60 rounded-full opacity-30 blur-sm animate-pulse"></div>
      </div>
    </div>
  );
};

export default EyeIris;
