
import React from 'react';
import { User } from '@supabase/supabase-js';
import ChatQuickReport from '@/components/ChatQuickReport';
import HeroSection from '@/components/HeroSection';
import WorkflowSection from '@/components/WorkflowSection';
import FeaturesSection from '@/components/FeaturesSection';
import DemoSection from '@/components/DemoSection';
import FinalCTASection from '@/components/FinalCTASection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface MainContentProps {
  user: User | null;
  isVisible: boolean;
  mousePosition: { x: number; y: number };
  activeStep: number;
}

/**
 * Main content layout component
 * Organizes and renders all primary page sections with proper spacing and user context
 */
const MainContent: React.FC<MainContentProps> = ({ 
  user, 
  isVisible, 
  mousePosition, 
  activeStep 
}) => {
  const { isVisible: isScrollVisible } = useScrollAnimation();

  return (
    <>
      {/* Chat Quick Report for authenticated users */}
      {user && (
        <div className="relative z-40 mt-4 sm:mt-8">
          <ChatQuickReport />
        </div>
      )}

      {/* Main Page Content Sections */}
      <div className="relative z-40 px-4 sm:px-6">
        <HeroSection isVisible={isVisible} mousePosition={mousePosition} />
        
        <div 
          data-scroll-id="workflow"
          className={`transition-all duration-1000 ${
            isScrollVisible('workflow') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <WorkflowSection activeStep={activeStep} />
        </div>
        
        <FeaturesSection />
        
        <div 
          data-scroll-id="demo"
          className={`transition-all duration-1000 ${
            isScrollVisible('demo') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <DemoSection />
        </div>
        
        <div 
          data-scroll-id="final-cta"
          className={`transition-all duration-1000 ${
            isScrollVisible('final-cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <FinalCTASection />
        </div>
      </div>
    </>
  );
};

export default MainContent;
