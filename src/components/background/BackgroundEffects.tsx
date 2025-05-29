
import React from 'react';
import ParticleSystem from './ParticleSystem';

/**
 * Background visual effects component
 * Combines gradient overlays and particle animations for atmospheric styling
 */
const BackgroundEffects: React.FC = () => {
  return (
    <>
      {/* Gradient Background Layers - Updated for Alberta/Jasper theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-indigo-900/30"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-blue-900/10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      {/* Animated Particle System */}
      <ParticleSystem particleCount={20} />
    </>
  );
};

export default BackgroundEffects;
