
import { useState, useEffect } from "react";

interface EyeOfSauronProps {
  mousePosition: { x: number; y: number };
}

const EyeOfSauron = ({ mousePosition }: EyeOfSauronProps) => {
  // Calculate pupil position based on mouse position
  const calculatePupilPosition = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 + 200;
    const maxDistance = 6;
    
    const deltaX = mousePosition.x - centerX;
    const deltaY = mousePosition.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance === 0) return { x: 0, y: 0 };
    
    const normalizedX = (deltaX / distance) * Math.min(distance / 60, maxDistance);
    const normalizedY = (deltaY / distance) * Math.min(distance / 60, maxDistance);
    
    return { x: normalizedX, y: normalizedY };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div className="relative mb-16 flex justify-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 relative cursor-pointer group">
        
        {/* Outer gentle glow - matching page theme */}
        <div className="absolute -inset-6 sm:-inset-8 opacity-40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/30 via-purple-500/20 to-red-500/30 animate-pulse blur-xl"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-red-400/20 via-orange-400/15 to-red-400/20 animate-pulse blur-lg"></div>
        </div>
        
        {/* Professional outer ring */}
        <div className="absolute -inset-4 sm:-inset-6 opacity-60">
          <div className="absolute inset-0 rounded-full border border-red-400/20 bg-gradient-to-br from-red-800/15 via-black to-purple-800/15"></div>
          <div className="absolute inset-1 rounded-full border border-red-300/15 bg-gradient-to-br from-orange-800/20 via-black to-red-800/20"></div>
        </div>
        
        {/* Main Eye Structure - Professional looking */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-700 via-black to-purple-700 shadow-xl shadow-red-500/30 overflow-hidden border border-red-400/30">
          
          {/* Base elegant layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/70 via-black to-purple-600/60"></div>
          
          {/* Subtle scanning lines */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-300 to-transparent animate-pulse"></div>
            <div className="absolute top-2/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-300 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          {/* Gentle shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tl from-red-500/40 via-orange-400/30 to-purple-500/40 opacity-50 animate-pulse"></div>
          
          {/* Professional grid pattern */}
          <div className="absolute inset-0 opacity-15">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 h-full bg-gradient-to-t from-red-300/40 via-transparent to-red-300/40"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                  transformOrigin: '50% 50%'
                }}
              />
            ))}
          </div>
          
          {/* Inner iris chamber */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-500/60 via-black to-orange-500/60 overflow-hidden shadow-inner border border-red-300/20">
            
            {/* Gentle rotating layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/50 via-orange-500/40 to-red-600/50 opacity-70 animate-spin" style={{ animationDuration: '15s' }}></div>
            
            {/* Counter-rotating professional layer */}
            <div className="absolute inset-0 bg-gradient-to-l from-purple-500/30 via-red-500/40 to-orange-500/30 opacity-60 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
            
            {/* Subtle texture points */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-red-200/60 rounded-full animate-pulse blur-sm"></div>
              <div className="absolute bottom-2 right-2 w-0.5 h-0.5 bg-orange-200/60 rounded-full animate-pulse blur-sm"></div>
              <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-red-100/60 rounded-full animate-pulse blur-sm"></div>
            </div>
            
            {/* The Professional Vertical Slit Pupil */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-red-600/70 via-black to-purple-600/60 overflow-hidden">
              
              {/* Inner professional chamber */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/60 via-black to-orange-500/50"></div>
              
              {/* The elegant vertical slit */}
              <div 
                className="absolute w-0.5 h-3 sm:h-4 bg-black top-1/2 left-1/2 transition-transform duration-300 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.6), inset 0 0 4px rgba(0, 0, 0, 1)'
                }}
              >
                {/* Gentle glowing edges */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400/60 via-orange-300/50 to-red-400/60 blur-sm"></div>
                
                {/* Professional void core */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-red-900 to-black"></div>
                
                {/* Subtle center line */}
                <div className="absolute inset-0.5 bg-black">
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gradient-to-b from-red-300/40 via-transparent to-red-300/40 transform -translate-x-1/2 animate-pulse"></div>
                </div>
                
                {/* Professional attention light */}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-gradient-radial from-red-100/30 via-orange-200/20 to-transparent opacity-50 blur-md transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                
                {/* Core professional glow */}
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-radial from-white/30 via-red-200/30 to-transparent opacity-60 blur-sm transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              </div>
              
              {/* Professional highlights */}
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-red-300/50 rounded-full opacity-30 blur-sm animate-pulse"></div>
              <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-orange-300/50 rounded-full opacity-20 blur-sm animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Professional beam effects */}
        <div className="absolute -inset-4 sm:-inset-6 opacity-30">
          {/* Gentle directional indicators */}
          <div className="absolute top-0 left-1/2 w-0.5 h-4 sm:h-6 bg-gradient-to-t from-red-500/40 via-red-300/30 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute bottom-0 left-1/2 w-0.5 h-4 sm:h-6 bg-gradient-to-b from-red-500/40 via-red-300/30 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 left-0 w-4 sm:w-6 h-0.5 bg-gradient-to-l from-red-500/40 via-red-300/30 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 right-0 w-4 sm:w-6 h-0.5 bg-gradient-to-r from-red-500/40 via-red-300/30 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
        </div>
        
        {/* Gentle rotating indicators */}
        <div className="absolute -inset-6 sm:-inset-8 animate-spin opacity-25" style={{ animationDuration: '40s' }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-1.5 bg-gradient-to-t from-red-400/40 via-red-300/30 to-transparent opacity-50 blur-sm"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-1.5rem)`,
                transformOrigin: '50% 1.5rem'
              }}
            />
          ))}
        </div>
        
        {/* Subtle professional aura */}
        <div className="absolute -inset-8 sm:-inset-10 bg-gradient-radial from-red-500/15 via-red-500/8 to-transparent rounded-full animate-pulse opacity-40"></div>
        <div className="absolute -inset-4 sm:-inset-6 bg-gradient-radial from-red-400/8 via-transparent to-transparent rounded-full animate-pulse opacity-30" style={{ animationDelay: '2s' }}></div>
        
        {/* Professional monitoring effect */}
        <div className="absolute -inset-2 sm:-inset-3 bg-gradient-radial from-transparent via-red-300/5 to-transparent animate-pulse blur-lg opacity-40"></div>
      </div>
    </div>
  );
};

export default EyeOfSauron;
