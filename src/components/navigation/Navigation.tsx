
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from '@supabase/supabase-js';

interface NavigationProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

const Navigation: React.FC<NavigationProps> = ({ user, onSignOut }) => {
  const handleSignOut = async () => {
    try {
      await onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="flex items-center justify-between p-6">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            JASPER
          </h1>
          <p className="text-xs text-gray-300 font-mono">Enterprise Progress Tracking</p>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm text-gray-300 font-mono">
              {user.user_metadata?.full_name || user.email}
            </span>
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
