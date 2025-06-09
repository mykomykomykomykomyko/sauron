
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/navigation/Navigation";
import MainContent from "@/components/layout/MainContent";

const Index: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Simple background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900 to-indigo-900/40"></div>
      
      {/* Navigation */}
      <div className="relative z-50">
        <Navigation user={user} onSignOut={signOut} />
      </div>

      {/* Main Content */}
      <div className="relative z-40">
        <MainContent user={user} />
      </div>
    </div>
  );
};

export default Index;
