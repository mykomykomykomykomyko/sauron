
import React from 'react';

/**
 * Eye visual effects component
 * Provides glows, beams, and atmospheric effects around the eye with blue Alberta theme
 */
const EyeEffects: React.FC = () => {
  return (
    <>
      {/* Blue glow */}
      <div className="absolute -inset-8 sm:-inset-10 opacity-30">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-cyan-400/15 to-blue-400/20 animate-pulse blur-2xl"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-300/15 via-blue-300/10 to-cyan-300/15 animate-pulse blur-xl"></div>
      </div>
      
      {/* Outer blue ring */}
      <div className="absolute -inset-6 sm:-inset-8 opacity-50">
        <div className="absolute inset-0 rounded-full border-2 border-blue-300/30 bg-gradient-to-br from-blue-100/10 via-cyan-100/5 to-blue-100/10"></div>
        <div className="absolute inset-2 rounded-full border border-cyan-200/20 bg-gradient-to-br from-cyan-50/15 via-blue-50/10 to-cyan-50/15"></div>
      </div>

      {/* Blue beams */}
      <div className="absolute -inset-6 sm:-inset-8 opacity-20">
        <div className="absolute top-0 left-1/2 w-1 h-6 sm:h-8 bg-gradient-to-t from-blue-300/40 via-cyan-200/30 to-transparent transform -translate-x-1/2 animate-pulse blur-sm rounded-full"></div>
        <div className="absolute bottom-0 left-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-300/40 via-cyan-200/30 to-transparent transform -translate-x-1/2 animate-pulse blur-sm rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-6 sm:w-8 h-1 bg-gradient-to-l from-blue-300/40 via-cyan-200/30 to-transparent transform -translate-y-1/2 animate-pulse blur-sm rounded-full"></div>
        <div className="absolute top-1/2 right-0 w-6 sm:w-8 h-1 bg-gradient-to-r from-blue-300/40 via-cyan-200/30 to-transparent transform -translate-y-1/2 animate-pulse blur-sm rounded-full"></div>
      </div>
      
      {/* Rotating blue indicators */}
      <div className="absolute -inset-8 sm:-inset-10 animate-spin opacity-15" style={{ animationDuration: '60s' }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-2 bg-gradient-to-t from-blue-300/30 via-cyan-200/25 to-transparent opacity-40 blur-sm rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-2rem)`,
              transformOrigin: '50% 2rem'
            }}
          />
        ))}
      </div>
      
      {/* Blue aura */}
      <div className="absolute -inset-10 sm:-inset-12 bg-gradient-radial from-blue-200/10 via-cyan-100/5 to-transparent rounded-full animate-pulse opacity-30"></div>
      <div className="absolute -inset-6 sm:-inset-8 bg-gradient-radial from-blue-100/8 via-transparent to-transparent rounded-full animate-pulse opacity-25" style={{ animationDelay: '3s' }}></div>
      
      {/* Monitoring effect */}
      <div className="absolute -inset-4 sm:-inset-5 bg-gradient-radial from-transparent via-blue-100/5 to-transparent animate-pulse blur-xl opacity-30"></div>
    </>
  );
};

export default EyeEffects;
