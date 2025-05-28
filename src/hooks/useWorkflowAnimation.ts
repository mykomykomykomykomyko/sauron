
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing automated workflow step animations
 * Cycles through workflow steps with configurable timing
 */
export const useWorkflowAnimation = (stepCount: number = 4, intervalMs: number = 3000) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % stepCount);
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [stepCount, intervalMs]);

  return { activeStep };
};
