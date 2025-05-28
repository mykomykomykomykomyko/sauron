
import { useState, useEffect } from "react";

interface EyeOfSauronProps {
  mousePosition: { x: number; y: number };
}

const EyeOfSauron = ({ mousePosition }: EyeOfSauronProps) => {
  // Calculate pupil position based on mouse position
  const calculatePupilPosition = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 + 200;
    const maxDistance = 18;
    
    const deltaX = mousePosition.x - centerX;
    const deltaY = mousePosition.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance === 0) return { x: 0, y: 0 };
    
    const normalizedX = (deltaX / distance) * Math.min(distance / 40, maxDistance);
    const normalizedY = (deltaY / distance) * Math.min(distance / 40, maxDistance);
    
    return { x: normalizedX, y: normalizedY };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div className="relative mb-12">
      <div className="w-48 h-48 mx-auto relative cursor-pointer group">
        {/* Outer Flame Ring - Multiple layers for depth */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse opacity-80">
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 blur-sm"></div>
        </div>
        
        {/* Main Eye Structure */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-700 via-orange-600 to-red-700 shadow-2xl shadow-red-500/50">
          {/* Eye Socket with depth */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-black via-gray-900 to-black border-4 border-red-500/70 shadow-inner">
            {/* Sclera (white part) with veining */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-red-100 via-yellow-50 to-red-200 overflow-hidden">
              {/* Blood vessel patterns */}
              <div className="absolute inset-0 opacity-60">
                <div className="absolute top-2 left-4 w-8 h-0.5 bg-red-400 transform rotate-12 blur-sm"></div>
                <div className="absolute top-6 right-3 w-6 h-0.5 bg-red-300 transform -rotate-45 blur-sm"></div>
                <div className="absolute bottom-4 left-6 w-10 h-0.5 bg-red-400 transform rotate-45 blur-sm"></div>
                <div className="absolute bottom-3 right-5 w-7 h-0.5 bg-red-300 transform -rotate-12 blur-sm"></div>
              </div>
              
              {/* Iris - Multi-layered for realism */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-700 overflow-hidden shadow-lg">
                {/* Iris texture patterns */}
                <div className="absolute inset-0">
                  {/* Radial lines from center */}
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-0.5 h-full bg-gradient-to-t from-red-400 via-orange-300 to-red-500 opacity-40"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                        transformOrigin: '50% 50%'
                      }}
                    />
                  ))}
                  
                  {/* Concentric circles for texture */}
                  <div className="absolute inset-2 rounded-full border border-red-400/30"></div>
                  <div className="absolute inset-4 rounded-full border border-orange-300/40"></div>
                  <div className="absolute inset-6 rounded-full border border-red-500/30"></div>
                </div>
                
                {/* Pupil that follows cursor with realistic movement */}
                <div 
                  className="absolute w-10 h-10 bg-black rounded-full top-1/2 left-1/2 transition-transform duration-150 ease-out shadow-lg"
                  style={{
                    transform: `translate(-50%, -50%) translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                  }}
                >
                  {/* Inner pupil depth */}
                  <div className="absolute inset-0.5 bg-gradient-to-br from-red-900 to-black rounded-full"></div>
                  <div className="absolute inset-1 bg-black rounded-full">
                    {/* Pupil reflection */}
                    <div className="absolute top-1 left-1 w-2 h-2 bg-red-400 rounded-full opacity-60 blur-sm"></div>
                  </div>
                </div>
                
                {/* Iris highlight */}
                <div className="absolute top-2 left-3 w-3 h-3 bg-yellow-200 rounded-full opacity-30 blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Flame Effects */}
        <div className="absolute -inset-8 opacity-70">
          {/* Cardinal direction flames */}
          <div className="absolute top-0 left-1/2 w-3 h-12 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute bottom-0 left-1/2 w-3 h-12 bg-gradient-to-b from-orange-500 via-yellow-400 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 left-0 w-12 h-3 bg-gradient-to-l from-orange-500 via-yellow-400 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 right-0 w-12 h-3 bg-gradient-to-r from-orange-500 via-yellow-400 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
          
          {/* Diagonal flames */}
          <div className="absolute top-2 left-2 w-8 h-2 bg-gradient-to-tl from-red-500 via-orange-400 to-transparent transform rotate-45 animate-pulse opacity-60"></div>
          <div className="absolute top-2 right-2 w-8 h-2 bg-gradient-to-tr from-red-500 via-orange-400 to-transparent transform -rotate-45 animate-pulse opacity-60"></div>
          <div className="absolute bottom-2 left-2 w-8 h-2 bg-gradient-to-bl from-red-500 via-orange-400 to-transparent transform -rotate-45 animate-pulse opacity-60"></div>
          <div className="absolute bottom-2 right-2 w-8 h-2 bg-gradient-to-br from-red-500 via-orange-400 to-transparent transform rotate-45 animate-pulse opacity-60"></div>
        </div>
        
        {/* Rotating ring of fire - Enhanced */}
        <div className="absolute -inset-12 animate-spin" style={{ animationDuration: '25s' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-6 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 opacity-50 blur-sm"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-3rem)`,
                transformOrigin: '50% 3rem'
              }}
            />
          ))}
        </div>
        
        {/* Outer glow effect */}
        <div className="absolute -inset-16 bg-gradient-radial from-red-500/20 via-orange-500/10 to-transparent rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default EyeOfSauron;
