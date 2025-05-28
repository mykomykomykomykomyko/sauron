
import { useState, useEffect } from "react";

interface EyeOfSauronProps {
  mousePosition: { x: number; y: number };
}

const EyeOfSauron = ({ mousePosition }: EyeOfSauronProps) => {
  // Calculate pupil position based on mouse position
  const calculatePupilPosition = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 + 200;
    const maxDistance = 8;
    
    const deltaX = mousePosition.x - centerX;
    const deltaY = mousePosition.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance === 0) return { x: 0, y: 0 };
    
    const normalizedX = (deltaX / distance) * Math.min(distance / 50, maxDistance);
    const normalizedY = (deltaY / distance) * Math.min(distance / 50, maxDistance);
    
    return { x: normalizedX, y: normalizedY };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div className="relative mb-16 flex justify-center">
      <div className="w-24 h-24 relative cursor-pointer group">
        
        {/* Outer surveillance glow - matching page theme */}
        <div className="absolute -inset-8 opacity-60">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/40 via-purple-600/30 to-red-600/40 animate-pulse blur-xl"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-red-500/30 via-orange-500/20 to-red-500/30 animate-pulse blur-lg"></div>
        </div>
        
        {/* Tech-noir outer ring */}
        <div className="absolute -inset-6 opacity-80">
          <div className="absolute inset-0 rounded-full border border-red-500/30 bg-gradient-to-br from-red-900/20 via-black to-purple-900/20"></div>
          <div className="absolute inset-1 rounded-full border border-red-400/20 bg-gradient-to-br from-orange-900/30 via-black to-red-900/30"></div>
        </div>
        
        {/* Main Eye Structure - Tech enhanced */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-900 via-black to-purple-900 shadow-2xl shadow-red-600/50 overflow-hidden border border-red-500/40">
          
          {/* Base molten layer - more subtle */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-800/90 via-black to-purple-800/80"></div>
          
          {/* Tech scanning lines */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-pulse"></div>
            <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          {/* Heat wave shimmer - more controlled */}
          <div className="absolute inset-0 bg-gradient-to-tl from-red-600/60 via-orange-500/40 to-purple-600/60 opacity-70 animate-pulse"></div>
          
          {/* Surveillance grid pattern */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 h-full bg-gradient-to-t from-red-400/60 via-transparent to-red-400/60"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  transformOrigin: '50% 50%'
                }}
              />
            ))}
          </div>
          
          {/* Inner iris chamber */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-600/80 via-black to-orange-600/80 overflow-hidden shadow-inner border border-red-400/30">
            
            {/* Slow rotating surveillance layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-700/70 via-orange-600/50 to-red-700/70 opacity-90 animate-spin" style={{ animationDuration: '12s' }}></div>
            
            {/* Counter-rotating tech layer */}
            <div className="absolute inset-0 bg-gradient-to-l from-purple-600/40 via-red-600/60 to-orange-600/40 opacity-80 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
            
            {/* Digital noise texture */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute top-2 left-2 w-1 h-1 bg-red-300/80 rounded-full animate-pulse blur-sm"></div>
              <div className="absolute bottom-2 right-2 w-0.5 h-0.5 bg-orange-300/80 rounded-full animate-pulse blur-sm"></div>
              <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-red-200/80 rounded-full animate-pulse blur-sm"></div>
            </div>
            
            {/* The Vertical Slit Pupil - Enhanced */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-red-700/90 via-black to-purple-700/80 overflow-hidden">
              
              {/* Inner surveillance chamber */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 via-black to-orange-600/70"></div>
              
              {/* The iconic vertical slit with tech enhancement */}
              <div 
                className="absolute w-0.5 h-4 bg-black top-1/2 left-1/2 transition-transform duration-300 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.8), inset 0 0 6px rgba(0, 0, 0, 1)'
                }}
              >
                {/* Glowing edges with tech feel */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/80 via-orange-400/60 to-red-500/80 blur-sm"></div>
                
                {/* Deep void core */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-red-950 to-black"></div>
                
                {/* Central scanning line */}
                <div className="absolute inset-0.5 bg-black">
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-red-400/60 via-transparent to-red-400/60 transform -translate-x-1/2 animate-pulse"></div>
                </div>
                
                {/* Surveillance spotlight - more focused */}
                <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-radial from-red-200/40 via-orange-300/30 to-transparent opacity-60 blur-md transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                
                {/* Core light source */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-radial from-white/50 via-red-300/40 to-transparent opacity-80 blur-sm transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              </div>
              
              {/* Tech highlights */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-red-400/60 rounded-full opacity-40 blur-sm animate-pulse"></div>
              <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-orange-400/60 rounded-full opacity-30 blur-sm animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Surveillance beam effects - matching page theme */}
        <div className="absolute -inset-6 opacity-50">
          {/* Cardinal direction beams */}
          <div className="absolute top-0 left-1/2 w-0.5 h-6 bg-gradient-to-t from-red-600/60 via-red-400/40 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute bottom-0 left-1/2 w-0.5 h-6 bg-gradient-to-b from-red-600/60 via-red-400/40 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-gradient-to-l from-red-600/60 via-red-400/40 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 right-0 w-6 h-0.5 bg-gradient-to-r from-red-600/60 via-red-400/40 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
        </div>
        
        {/* Rotating surveillance ring */}
        <div className="absolute -inset-8 animate-spin opacity-40" style={{ animationDuration: '30s' }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-2 bg-gradient-to-t from-red-500/60 via-red-400/40 to-transparent opacity-60 blur-sm"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-1.5rem)`,
                transformOrigin: '50% 1.5rem'
              }}
            />
          ))}
        </div>
        
        {/* Subtle outer surveillance aura */}
        <div className="absolute -inset-10 bg-gradient-radial from-red-600/20 via-red-600/10 to-transparent rounded-full animate-pulse opacity-60"></div>
        <div className="absolute -inset-6 bg-gradient-radial from-red-500/10 via-transparent to-transparent rounded-full animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
        
        {/* Tech distortion effect */}
        <div className="absolute -inset-3 bg-gradient-radial from-transparent via-red-400/5 to-transparent animate-pulse blur-lg opacity-60"></div>
      </div>
    </div>
  );
};

export default EyeOfSauron;
