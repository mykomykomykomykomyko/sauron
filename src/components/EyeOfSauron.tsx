
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
    <div className="relative mb-12">
      <div className="w-32 h-32 mx-auto relative cursor-pointer group">
        
        {/* Outer Ring of Fire - Chaotic flames */}
        <div className="absolute -inset-6 opacity-90">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-700 via-orange-500 to-red-700 animate-pulse blur-xl"></div>
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-yellow-500 via-orange-400 to-red-600 animate-pulse blur-lg"></div>
        </div>
        
        {/* Main Eye Structure - Molten Base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-900 via-orange-700 to-black shadow-2xl shadow-red-600/60 overflow-hidden">
          
          {/* Molten lava base layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-700 to-black opacity-95"></div>
          
          {/* Heat wave shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-tl from-yellow-400 via-orange-500 to-red-800 opacity-60 animate-pulse"></div>
          
          {/* Lava crack patterns - radiating from center */}
          <div className="absolute inset-0 opacity-70">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-0.5 h-full bg-gradient-to-t from-yellow-300 via-orange-400 to-red-500 opacity-80 blur-sm"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                  transformOrigin: '50% 50%'
                }}
              />
            ))}
          </div>
          
          {/* Inner molten iris */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700 overflow-hidden shadow-inner">
            
            {/* Hypnotic rotating lava layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 opacity-85 animate-spin" style={{ animationDuration: '8s' }}></div>
            
            {/* Counter-rotating molten layer for depth */}
            <div className="absolute inset-0 bg-gradient-to-l from-orange-400 via-red-500 to-yellow-300 opacity-70 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
            
            {/* Lava bubble texture */}
            <div className="absolute inset-0 opacity-60">
              <div className="absolute top-2 left-3 w-2 h-2 bg-yellow-300 rounded-full animate-pulse blur-sm"></div>
              <div className="absolute bottom-3 right-2 w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse blur-sm"></div>
              <div className="absolute top-4 right-4 w-1 h-1 bg-yellow-200 rounded-full animate-pulse blur-sm"></div>
            </div>
            
            {/* The Vertical Slit Pupil - Serpent-like */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-500 via-red-600 to-black overflow-hidden">
              
              {/* Inner molten chamber */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-700 opacity-90"></div>
              
              {/* The iconic vertical slit */}
              <div 
                className="absolute w-1 h-6 bg-black top-1/2 left-1/2 transition-transform duration-200 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                  boxShadow: '0 0 15px rgba(255, 69, 0, 0.9), inset 0 0 8px rgba(0, 0, 0, 1)'
                }}
              >
                {/* Molten edges of the slit */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-orange-400 to-red-600 blur-sm opacity-90"></div>
                
                {/* Deep darkness of the slit */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-red-950 to-black"></div>
                
                {/* Central void */}
                <div className="absolute inset-0.5 bg-black"></div>
                
                {/* Intense spotlight effect radiating outward */}
                <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-gradient-radial from-yellow-200 via-orange-300 to-transparent opacity-40 blur-md transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                
                {/* Inner light source */}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-gradient-radial from-white via-yellow-300 to-transparent opacity-60 blur-sm transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                
                {/* Heat distortion around slit */}
                <div className="absolute -top-1 -bottom-1 left-0 right-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-50 blur-md animate-pulse"></div>
              </div>
              
              {/* Molten highlights around pupil chamber */}
              <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-50 blur-md animate-pulse"></div>
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-orange-300 rounded-full opacity-40 blur-md animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Chaotic Flame Effects */}
        <div className="absolute -inset-8 opacity-75">
          {/* Primary flame tongues */}
          <div className="absolute top-0 left-1/2 w-1.5 h-8 bg-gradient-to-t from-orange-600 via-yellow-400 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute bottom-0 left-1/2 w-1.5 h-8 bg-gradient-to-b from-orange-600 via-yellow-400 to-transparent transform -translate-x-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 left-0 w-8 h-1.5 bg-gradient-to-l from-orange-600 via-yellow-400 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
          <div className="absolute top-1/2 right-0 w-8 h-1.5 bg-gradient-to-r from-orange-600 via-yellow-400 to-transparent transform -translate-y-1/2 animate-pulse blur-sm"></div>
          
          {/* Diagonal chaos flames */}
          <div className="absolute top-1 left-1 w-4 h-1 bg-gradient-to-tl from-red-600 via-orange-400 to-transparent transform rotate-45 animate-pulse opacity-80"></div>
          <div className="absolute top-1 right-1 w-4 h-1 bg-gradient-to-tr from-red-600 via-orange-400 to-transparent transform -rotate-45 animate-pulse opacity-80"></div>
          <div className="absolute bottom-1 left-1 w-4 h-1 bg-gradient-to-bl from-red-600 via-orange-400 to-transparent transform -rotate-45 animate-pulse opacity-80"></div>
          <div className="absolute bottom-1 right-1 w-4 h-1 bg-gradient-to-br from-red-600 via-orange-400 to-transparent transform rotate-45 animate-pulse opacity-80"></div>
        </div>
        
        {/* Hypnotic rotating ring of fire */}
        <div className="absolute -inset-10 animate-spin opacity-60" style={{ animationDuration: '20s' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-3 bg-gradient-to-t from-red-600 via-orange-400 to-yellow-300 opacity-70 blur-sm"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-2rem)`,
                transformOrigin: '50% 2rem'
              }}
            />
          ))}
        </div>
        
        {/* Malevolent outer glow - surveillance aura */}
        <div className="absolute -inset-12 bg-gradient-radial from-red-600/30 via-orange-600/15 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -inset-8 bg-gradient-radial from-yellow-500/20 via-red-600/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Heat wave distortion effect */}
        <div className="absolute -inset-4 bg-gradient-radial from-transparent via-orange-400/5 to-transparent animate-pulse blur-lg"></div>
      </div>
    </div>
  );
};

export default EyeOfSauron;
