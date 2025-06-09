
import React from 'react';
import { User } from '@supabase/supabase-js';
import HeroSection from '@/components/HeroSection';

interface MainContentProps {
  user: User | null;
}

const MainContent: React.FC<MainContentProps> = ({ user }) => {
  return (
    <div className="relative z-40 px-6">
      <HeroSection />
      
      {/* Additional content sections can be added here */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          This is your enterprise template foundation. Build upon this structure to create 
          your full-featured progress tracking system.
        </p>
      </div>
    </div>
  );
};

export default MainContent;
