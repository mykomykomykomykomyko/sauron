
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

interface WelcomeScreenProps {
  user: User;
  onComplete: () => void;
}

/**
 * Apple-style welcome screen animation component
 * Displays elegant welcome message with smooth transitions
 */
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ user, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  useEffect(() => {
    // Start text animation after brief delay
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 500);

    // Start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Complete animation after 3 seconds
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative text-center">
        {/* Welcome text with Apple-style animation */}
        <div 
          className={`transform transition-all duration-1000 ease-out ${
            textVisible 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-8 opacity-0 scale-95'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-wide">
            Welcome
          </h1>
          
          {/* User name with gradient and glow effect */}
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-medium bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent leading-tight">
              {fullName}
            </h2>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 text-2xl md:text-4xl font-medium text-white/5 blur-sm">
              {fullName}
            </div>
          </div>
        </div>

        {/* Animated dots indicator */}
        <div 
          className={`flex justify-center space-x-2 mt-12 transition-all duration-700 delay-300 ${
            textVisible ? 'opacity-60' : 'opacity-0'
          }`}
        >
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 bg-white/40 rounded-full animate-pulse"
              style={{
                animationDelay: `${dot * 0.2}s`,
                animationDuration: '1.5s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  );
};

export default WelcomeScreen;
