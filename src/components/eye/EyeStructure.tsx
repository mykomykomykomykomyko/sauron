
import React from 'react';
import EyeIris from './EyeIris';

interface EyeStructureProps {
  pupilPosition: { x: number; y: number };
}

/**
 * Main eye structure component with outer layers and iris
 * Provides the base eye appearance with friendly cartoon styling
 */
const EyeStructure: React.FC<EyeStructureProps> = ({ pupilPosition }) => {
  return (
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 via-yellow-200 to-red-300 shadow-xl shadow-orange-300/20 overflow-hidden border-2 border-orange-200/50">
      {/* Friendly base layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/80 via-yellow-100/60 to-red-200/70"></div>
      
      {/* Gentle cartoon highlights */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-2 left-3 w-2 h-1 bg-white/60 rounded-full blur-sm"></div>
        <div className="absolute top-3 right-4 w-1 h-1 bg-yellow-100/70 rounded-full blur-sm"></div>
      </div>
      
      {/* Soft animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tl from-yellow-300/30 via-orange-200/20 to-red-300/25 opacity-60 animate-pulse"></div>
      
      {/* Cartoon-style gentle pattern */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-0.5 h-full bg-gradient-to-t from-orange-400/30 via-transparent to-orange-400/30 rounded-full"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
              transformOrigin: '50% 50%'
            }}
          />
        ))}
      </div>
      
      {/* Inner iris component */}
      <EyeIris pupilPosition={pupilPosition} />
    </div>
  );
};

export default EyeStructure;
