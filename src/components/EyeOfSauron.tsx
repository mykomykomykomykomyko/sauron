
import React from "react";
import EyeStructure from './eye/EyeStructure';
import EyeEffects from './eye/EyeEffects';
import { calculatePupilPosition } from '@/utils/eyeUtils';

interface EyeOfSauronProps {
  mousePosition: { x: number; y: number };
}

/**
 * Main Eye component (now themed for Jasper)
 * Enterprise-ready modular eye tracking system with blue Alberta-friendly styling
 * Composed of multiple sub-components for maintainability and extensibility
 */
const EyeOfSauron: React.FC<EyeOfSauronProps> = ({ mousePosition }) => {
  // Calculate pupil position using utility function
  const pupilPosition = calculatePupilPosition(mousePosition);

  return (
    <div className="relative mb-16 flex justify-center">
      <div className="w-24 h-24 sm:w-28 sm:h-28 relative cursor-pointer group">
        {/* Eye Effects Layer */}
        <EyeEffects />
        
        {/* Main Eye Structure */}
        <EyeStructure pupilPosition={pupilPosition} />
      </div>
    </div>
  );
};

export default EyeOfSauron;
