
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMouseTracking } from "@/hooks/useMouseTracking";
import { useWorkflowAnimation } from "@/hooks/useWorkflowAnimation";
import BackgroundEffects from "@/components/background/BackgroundEffects";
import Navigation from "@/components/navigation/Navigation";
import MainContent from "@/components/layout/MainContent";

/**
 * Main Index Page Component
 * Enterprise-ready modular landing page with authentication integration
 * Composed of reusable hooks and components for maintainability
 */
const Index: React.FC = () => {
  // Authentication context
  const { user, signOut } = useAuth();
  
  // Custom hooks for state management
  const { mousePosition, isVisible } = useMouseTracking();
  const { activeStep } = useWorkflowAnimation(4, 3000);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Visual Effects */}
      <BackgroundEffects />

      {/* Main Navigation */}
      <Navigation user={user} onSignOut={signOut} />

      {/* Main Page Content */}
      <MainContent 
        user={user} 
        isVisible={isVisible} 
        mousePosition={mousePosition} 
        activeStep={activeStep} 
      />
    </div>
  );
};

export default Index;
