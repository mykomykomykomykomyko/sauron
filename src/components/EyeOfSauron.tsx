
import { useState, useEffect } from "react";

interface EyeOfSauronProps {
  mousePosition: { x: number; y: number };
}

const EyeOfSauron = ({ mousePosition }: EyeOfSauronProps) => {
  // Calculate pupil position based on mouse position
  const calculatePupilPosition = () => {
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

  const pupilPosition = calculatePupilPosition();

  return (
    <div className="relative mb-16 flex justify-center">
      <div className="w-24 h-24 sm:w-28 sm:h-28 relative cursor-pointer group">
        
        {/* Gentle friendly glow */}
        <div className="absolute -inset-8 sm:-inset-10 opacity-30">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/15 to-red-400/20 animate-pulse blur-2xl"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-300/15 via-blue-300/10 to-purple-300/15 animate-pulse blur-xl"></div>
        </div>
        
        {/* Outer cartoon ring */}
        <div className="absolute -inset-6 sm:-inset-8 opacity-50">
          <div className="absolute inset-0 rounded-full border-2 border-blue-300/30 bg-gradient-to-br from-blue-100/10 via-purple-100/5 to-red-100/10"></div>
          <div className="absolute inset-2 rounded-full border border-cyan-200/20 bg-gradient-to-br from-cyan-50/15 via-blue-50/10 to-purple-50/15"></div>
        </div>
        
        {/* Main Eye Structure - Cartoon friendly */}
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
          
          {/* Inner iris - cartoon style */}
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
            
            {/* The Friendly Round Pupil */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-orange-500/80 via-red-400/60 to-amber-500/70 overflow-hidden">
              
              {/* Inner friendly chamber */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/70 via-orange-300/50 to-red-400/60"></div>
              
              {/* The cartoon pupil - round and friendly */}
              <div 
                className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-gray-800 via-black to-gray-700 rounded-full top-1/2 left-1/2 transition-transform duration-500 ease-out shadow-lg"
                style={{
                  transform: `translate(-50%, -50%) translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
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
              
              {/* Friendly highlights around pupil */}
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-orange-200/60 rounded-full opacity-40 blur-sm animate-pulse"></div>
              <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-yellow-200/60 rounded-full opacity-30 blur-sm animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Cartoon-style gentle beams */}
        <div className="absolute -inset-6 sm:-inset-8 opacity-20">
          <div className="absolute top-0 left-1/2 w-1 h-6 sm:h-8 bg-gradient-to-t from-orange-300/40 via-yellow-200/30 to-transparent transform -translate-x-1/2 animate-pulse blur-sm rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-300/40 via-yellow-200/30 to-transparent transform -translate-x-1/2 animate-pulse blur-sm rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-6 sm:w-8 h-1 bg-gradient-to-l from-orange-300/40 via-yellow-200/30 to-transparent transform -translate-y-1/2 animate-pulse blur-sm rounded-full"></div>
          <div className="absolute top-1/2 right-0 w-6 sm:w-8 h-1 bg-gradient-to-r from-orange-300/40 via-yellow-200/30 to-transparent transform -translate-y-1/2 animate-pulse blur-sm rounded-full"></div>
        </div>
        
        {/* Gentle rotating cartoon indicators */}
        <div className="absolute -inset-8 sm:-inset-10 animate-spin opacity-15" style={{ animationDuration: '60s' }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-2 bg-gradient-to-t from-orange-300/30 via-yellow-200/25 to-transparent opacity-40 blur-sm rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-2rem)`,
                transformOrigin: '50% 2rem'
              }}
            />
          ))}
        </div>
        
        {/* Soft cartoon aura */}
        <div className="absolute -inset-10 sm:-inset-12 bg-gradient-radial from-orange-200/10 via-yellow-100/5 to-transparent rounded-full animate-pulse opacity-30"></div>
        <div className="absolute -inset-6 sm:-inset-8 bg-gradient-radial from-amber-100/8 via-transparent to-transparent rounded-full animate-pulse opacity-25" style={{ animationDelay: '3s' }}></div>
        
        {/* Gentle monitoring effect */}
        <div className="absolute -inset-4 sm:-inset-5 bg-gradient-radial from-transparent via-orange-100/5 to-transparent animate-pulse blur-xl opacity-30"></div>
      </div>
    </div>
  );
};

export default EyeOfSauron;
