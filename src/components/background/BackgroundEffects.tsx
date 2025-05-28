
import React from 'react';
import ParticleSystem from './ParticleSystem';

/**
 * Background visual effects component
 * Combines gradient overlays and particle animations for atmospheric styling
 */
const BackgroundEffects: React.FC = () => {
  return (
    <>
      {/* Gradient Background Layers */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/30"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-orange-900/10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,0,0.1),transparent_50%)]"></div>
      
      {/* Animated Particle System */}
      <ParticleSystem particleCount={20} />
    </>
  );
};

export default BackgroundEffects;
