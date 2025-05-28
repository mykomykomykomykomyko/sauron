
import React from 'react';
import { User } from '@supabase/supabase-js';
import ChatQuickReport from '@/components/ChatQuickReport';
import HeroSection from '@/components/HeroSection';
import WorkflowSection from '@/components/WorkflowSection';
import DemoSection from '@/components/DemoSection';
import FinalCTASection from '@/components/FinalCTASection';

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
        <WorkflowSection activeStep={activeStep} />
        <DemoSection />
        <FinalCTASection />
      </div>
    </>
  );
};

export default MainContent;
