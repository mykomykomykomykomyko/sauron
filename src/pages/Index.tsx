
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Brain, 
  Shield, 
  BarChart3,
  ArrowRight, 
  Send,
  LogOut,
  Sparkles,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ChatQuickReport from "@/components/ChatQuickReport";

const Index = () => {
  const { user, signOut } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze report quality, detect anomalies, and provide intelligent insights in real-time.",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Automated validation ensures all submissions meet quality standards with comprehensive compliance checking.",
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Comprehensive dashboards provide instant insights into contractor performance and project progress.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
      {/* Subtle background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-purple-900/10"></div>
      
      {/* Floating particles */}
      <div className="fixed inset-0">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              The Eye of Sauron
            </h1>
            <p className="text-xs text-gray-400">AI-Powered Progress Tracking</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-300 hidden sm:block">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Chat Quick Report for logged in users */}
      {user && (
        <div className="relative z-40 px-6 mt-4">
          <ChatQuickReport />
        </div>
      )}

      <div className="relative z-40 px-6">
        {/* Hero Section */}
        <div className={`text-center mb-20 pt-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-6 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-POWERED OVERSIGHT
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              The Eye
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-purple-400 to-red-500 bg-clip-text text-transparent">
              of Sauron
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            The all-seeing AI-powered progress report management system. 
            Submit, track, and analyze team progress with intelligent oversight and real-time insights.
          </p>

          {/* Interactive Eye */}
          <div className="relative mb-12">
            <div 
              className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-110"
              style={{
                transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
              }}
            >
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center relative">
                <div 
                  className="w-3 h-3 bg-red-400 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{
                    transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <>
                <Link to="/submit">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg">
                    <Send className="w-5 h-5 mr-2" />
                    Submit Report
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Powered by <span className="text-red-400">Advanced AI</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of progress tracking with intelligent analysis and real-time insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className={`bg-gradient-to-br ${feature.gradient} border-white/10 hover:border-white/20 transition-all duration-500 group hover:-translate-y-2`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-black/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16 border-t border-white/10">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Workflow?</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join teams already using The Eye of Sauron to streamline their progress tracking and gain unprecedented insights.
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 px-8 py-4 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Start Free Today
              </Button>
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            The Eye of Sauron - Efficient Yielding Engagement Optimized For Structured Assignments
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
