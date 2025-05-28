
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

/**
 * Custom hook for managing welcome screen display logic
 * Handles session tracking and welcome screen visibility across all pages
 */
export const useWelcomeScreen = (user: User | null) => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    console.log('useWelcomeScreen: user changed', user?.email);
    
    // Show welcome screen when user logs in (not on page refresh)
    if (user) {
      // Check if this is a fresh login vs page refresh
      const welcomeShown = sessionStorage.getItem('welcome_shown_for_session');
      const currentUserEmail = user.email;
      const lastWelcomeUser = sessionStorage.getItem('last_welcome_user');
      
      console.log('Welcome check:', { welcomeShown, currentUserEmail, lastWelcomeUser });
      
      // Show welcome if:
      // 1. No welcome shown this session, OR
      // 2. Different user than last welcome
      if (!welcomeShown || lastWelcomeUser !== currentUserEmail) {
        console.log('Showing welcome screen for', currentUserEmail);
        setShowWelcome(true);
        sessionStorage.setItem('welcome_shown_for_session', 'true');
        sessionStorage.setItem('last_welcome_user', currentUserEmail || '');
      }
    } else {
      // Clear session storage when user logs out
      console.log('User logged out, clearing welcome session');
      sessionStorage.removeItem('welcome_shown_for_session');
      sessionStorage.removeItem('last_welcome_user');
      setShowWelcome(false);
    }
  }, [user]);

  const handleWelcomeComplete = () => {
    console.log('Welcome screen completed');
    setShowWelcome(false);
  };

  return {
    showWelcome,
    handleWelcomeComplete,
  };
};
