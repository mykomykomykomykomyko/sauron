import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ChatQuickReport from "@/components/ChatQuickReport";
import HeroSection from "@/components/HeroSection";
import WorkflowSection from "@/components/WorkflowSection";
import DemoSection from "@/components/DemoSection";
import FinalCTASection from "@/components/FinalCTASection";

const Index = () => {
  const { user, signOut } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Animate workflow steps
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10,
  }));

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/30"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-orange-900/10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,0,0.1),transparent_50%)]"></div>
      
      {/* Animated Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed w-1 h-1 bg-red-500/30 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
            <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              The Eye of Sauron
            </h1>
            <p className="text-xs text-gray-400 font-mono hidden sm:block">Efficient Yielding Engagement Optimized For Structured Assignments</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {user ? (
            <>
              <span className="text-xs sm:text-sm text-gray-300 font-mono hidden md:block">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs sm:text-sm px-2 sm:px-3">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Dash</span>
                </Button>
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                size="sm" 
                className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10 text-xs sm:text-sm px-2 sm:px-3"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm px-3 sm:px-4">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Chat Quick Report for logged in users */}
      {user && (
        <div className="relative z-40 mt-4 sm:mt-8">
          <ChatQuickReport />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-40 px-4 sm:px-6">
        <HeroSection isVisible={isVisible} mousePosition={mousePosition} />
        <WorkflowSection activeStep={activeStep} />
        <DemoSection />
        <FinalCTASection />
      </div>
    </div>
  );
};

export default Index;
