
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

/**
 * Custom hook for managing welcome screen display logic
 * Handles session tracking and welcome screen visibility
 */
export const useWelcomeScreen = (user: User | null) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    // Show welcome screen when user logs in (not on page refresh)
    if (user && !hasShownWelcome) {
      // Check if this is a fresh login vs page refresh
      const isFirstLogin = !sessionStorage.getItem('user_logged_in');
      
      if (isFirstLogin) {
        setShowWelcome(true);
        sessionStorage.setItem('user_logged_in', 'true');
      }
      
      setHasShownWelcome(true);
    }

    // Clear session storage when user logs out
    if (!user) {
      sessionStorage.removeItem('user_logged_in');
      setHasShownWelcome(false);
    }
  }, [user, hasShownWelcome]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return {
    showWelcome,
    handleWelcomeComplete,
  };
};
