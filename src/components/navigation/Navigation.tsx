import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from '@supabase/supabase-js';
interface NavigationProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

/**
 * Main navigation component with responsive design
 * Handles user authentication state and provides navigation links
 */
const Navigation: React.FC<NavigationProps> = ({
  user,
  onSignOut
}) => {
  const handleSignOut = async () => {
    try {
      await onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return <nav className="relative z-50 flex items-center justify-between p-4 sm:p-6">
      {/* Brand Logo and Title */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
          <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">JASPER</h1>
          <p className="text-xs text-gray-300 font-mono hidden sm:block">Judgment & Assessment System for Performance, Evidence & Results</p>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {user ? <>
            <span className="text-xs sm:text-sm text-gray-300 font-mono hidden md:block">
              {user.user_metadata?.full_name || user.email}
            </span>
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-xs sm:text-sm px-2 sm:px-3">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Dash</span>
              </Button>
            </Link>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10 text-xs sm:text-sm px-2 sm:px-3">
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </> : <Link to="/auth">
            <Button className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4">
              Sign In
            </Button>
          </Link>}
      </div>
    </nav>;
};
export default Navigation;