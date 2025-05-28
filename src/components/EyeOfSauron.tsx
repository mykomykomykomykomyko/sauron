
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
    <div className="relative mb-12">
      <div className="w-40 h-40 mx-auto relative cursor-pointer group">
        {/* Outer Ring of Fire - Multiple rotating layers */}
        <div className="absolute -inset-8 opacity-80">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse blur-lg"></div>
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-yellow-500 via-orange-400 to-red-500 animate-pulse blur-md"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 animate-pulse blur-sm"></div>
        </div>
        
        {/* Main Eye Structure - Molten Lava Base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-800 via-orange-600 to-red-900 shadow-2xl shadow-red-500/80 overflow-hidden">
          {/* Lava texture layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-600 to-black opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-yellow-400 via-orange-500 to-red-700 opacity-70 animate-pulse"></div>
          
          {/* Molten patterns - creating lava-like texture */}
          <div className="absolute inset-0 opacity-60">
            {/* Irregular molten veins */}
            <div className="absolute top-2 left-4 w-8 h-0.5 bg-yellow-300 transform rotate-12 blur-sm animate-pulse"></div>
            <div className="absolute top-6 right-3 w-6 h-0.5 bg-orange-300 transform -rotate-45 blur-sm animate-pulse"></div>
            <div className="absolute bottom-4 left-6 w-10 h-0.5 bg-yellow-400 transform rotate-45 blur-sm animate-pulse"></div>
            <div className="absolute bottom-3 right-5 w-7 h-0.5 bg-orange-400 transform -rotate-12 blur-sm animate-pulse"></div>
            <div className="absolute top-8 left-8 w-4 h-0.5 bg-yellow-200 transform rotate-75 blur-sm animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-5 h-0.5 bg-orange-200 transform -rotate-30 blur-sm animate-pulse"></div>
          </div>
          
          {/* Inner molten core */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 overflow-hidden shadow-inner">
            {/* Lava bubbling effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 opacity-80 animate-pulse"></div>
            
            {/* Radial molten cracks from center */}
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 h-full bg-gradient-to-t from-yellow-200 via-orange-300 to-red-400 opacity-60 blur-sm"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 22.5}deg)`,
                  transformOrigin: '50% 50%'
                }}
              />
            ))}
            
            {/* Central Eye - The actual pupil area */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-black overflow-hidden">
              {/* Inner flame patterns */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-600 opacity-90"></div>
              
              {/* The Vertical Slit Pupil - The iconic feature */}
              <div 
                className="absolute w-1 h-8 bg-black top-1/2 left-1/2 transition-transform duration-150 ease-out shadow-lg"
                style={{
                  transform: `translate(-50%, -50%) translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                  boxShadow: '0 0 10px rgba(255, 100, 0, 0.8), inset 0 0 5px rgba(0, 0, 0, 0.9)'
                }}
              >
                {/* Slit depth with molten edges */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-orange-400 to-red-500 blur-sm opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-red-900 to-black"></div>
                
                {/* Inner darkness of the slit */}
                <div className="absolute inset-0.5 bg-black"></div>
                
                {/* Molten glow at edges of slit */}
                <div className="absolute -top-0.5 -bottom-0.5 left-0 right-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-60 blur-sm"></div>
              </div>
              
              {/* Molten highlights around the pupil */}
              <div className="absolute top-1 left-2 w-2 h-2 bg-yellow-300 rounded-full opacity-40 blur-md animate-pulse"></div>
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-orange-300 rounded-full opacity-30 blur-md animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Flame Effects - More chaotic and authentic */}
        <div className="absolute -inset-10 opacity-80">
          {/* Major flame tongues */}
          <div className="absolute top-0 left-1/2 w-2 h-12 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute bottom-0 left-1/2 w-2 h-12 bg-gradient-to-b from-orange-500 via-yellow-400 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 left-0 w-12 h-2 bg-gradient-to-l from-orange-500 via-yellow-400 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 right-0 w-12 h-2 bg-gradient-to-r from-orange-500 via-yellow-400 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
          
          {/* Chaotic diagonal flames */}
          <div className="absolute top-2 left-2 w-6 h-1.5 bg-gradient-to-tl from-red-500 via-orange-400 to-transparent transform rotate-45 animate-pulse opacity-70"></div>
          <div className="absolute top-2 right-2 w-6 h-1.5 bg-gradient-to-tr from-red-500 via-orange-400 to-transparent transform -rotate-45 animate-pulse opacity-70"></div>
          <div className="absolute bottom-2 left-2 w-6 h-1.5 bg-gradient-to-bl from-red-500 via-orange-400 to-transparent transform -rotate-45 animate-pulse opacity-70"></div>
          <div className="absolute bottom-2 right-2 w-6 h-1.5 bg-gradient-to-br from-red-500 via-orange-400 to-transparent transform rotate-45 animate-pulse opacity-70"></div>
          
          {/* Additional smaller flames for chaos */}
          <div className="absolute top-4 left-6 w-3 h-1 bg-gradient-to-l from-yellow-400 to-transparent transform rotate-30 animate-pulse opacity-60"></div>
          <div className="absolute bottom-4 right-6 w-3 h-1 bg-gradient-to-r from-yellow-400 to-transparent transform -rotate-30 animate-pulse opacity-60"></div>
        </div>
        
        {/* Rotating ring of fire - Enhanced with more flames */}
        <div className="absolute -inset-12 animate-spin" style={{ animationDuration: '30s' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-4 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 opacity-40 blur-sm"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-2.5rem)`,
                transformOrigin: '50% 2.5rem'
              }}
            />
          ))}
        </div>
        
        {/* Counter-rotating inner ring */}
        <div className="absolute -inset-10 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-3 bg-gradient-to-t from-orange-600 via-yellow-400 to-transparent opacity-50 blur-sm"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-2rem)`,
                transformOrigin: '50% 2rem'
              }}
            />
          ))}
        </div>
        
        {/* Intense outer glow effect */}
        <div className="absolute -inset-16 bg-gradient-radial from-red-500/30 via-orange-500/15 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -inset-12 bg-gradient-radial from-yellow-400/20 via-red-500/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

export default EyeOfSauron;
