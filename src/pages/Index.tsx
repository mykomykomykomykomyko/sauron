import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Shield, Users, Bell, Sparkles, Zap, Target, TrendingUp, Globe, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowSignOutDialog(false);
    navigate('/');
  };

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
      {/* Dynamic cursor glow */}
      <div 
        className="fixed w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-red-500/40 rounded-full animate-pulse pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
      ))}

      {/* Header */}
      <nav className={`flex items-center justify-between p-6 md:p-8 border-b border-red-800/30 backdrop-blur-sm bg-black/50 relative z-10 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center border border-red-500/50 group-hover:scale-110 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-red-500/30 group-hover:rotate-12">
            <Eye className="w-6 h-6 text-white group-hover:animate-pulse" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-mono group-hover:text-red-400 transition-all duration-300 group-hover:scale-105">THE EYE OF SAURON</span>
          <div className="hidden md:flex items-center space-x-1 ml-4">
            <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-xs text-red-400 font-mono">AI-POWERED</span>
          </div>
        </div>
        <div className="flex space-x-3">
          {user ? (
            <>
              <Link to="/auth">
                <Button className="bg-red-600 hover:bg-red-700 text-white border border-red-500/50 hover:border-red-400 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                  <Shield className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Access Dashboard</span>
                </Button>
              </Link>
              <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-red-600/50 text-red-400 hover:bg-red-900/30 hover:text-red-300 hover:border-red-400 hover:scale-105 transition-all duration-300">
                    Sign Out
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-red-700/50">
                  <DialogHeader>
                    <DialogTitle className="text-red-400">Sign Out</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Are you sure you want to sign out of The Eye of Sauron?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-3 mt-4">
                    <Button 
                      onClick={handleSignOut}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, Sign Out
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSignOutDialog(false)}
                      className="border-red-600/50 text-red-400 hover:bg-red-900/30"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-red-600 hover:bg-red-700 text-white border border-red-500/50 hover:border-red-400 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                <Shield className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 md:px-8 py-24 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/20 to-red-500/10 rounded-full blur-3xl animate-pulse scale-150"></div>
          
          <div className="relative">
            <div className="mb-6 flex justify-center">
              <div className="flex items-center space-x-2 bg-red-900/30 border border-red-600/50 rounded-full px-6 py-2 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-sm font-mono text-red-300">NEXT-GEN OVERSIGHT</span>
                <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
            </div>

            <h1 className={`text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight font-mono transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              THE EYE OF
              <br />
              <span className="text-red-400">SAURON</span>
            </h1>
            
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 text-red-400 font-mono text-sm mb-2">
                <Target className="w-4 h-4 animate-spin" />
                <span>Efficient Yielding Engagement Optimized For Structured Assignments</span>
              </div>
            </div>
          </div>
          
          <p className={`text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            The all-seeing <span className="text-red-400 font-semibold">AI-powered</span> progress report management system. Submit, track, and analyze team progress with intelligent oversight and real-time insights.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-20 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <Link to="/submit">
              <Button size="lg" className="px-8 py-4 text-lg bg-red-600 hover:bg-red-700 text-white border border-red-500/50 hover:border-red-400 transition-all duration-300 hover:scale-110 font-mono group relative overflow-hidden hover:shadow-xl hover:shadow-red-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                <FileText className="w-5 h-5 mr-2 relative z-10 group-hover:animate-pulse" />
                <span className="relative z-10">Submit Report</span>
                <Sparkles className="w-4 h-4 ml-2 relative z-10 group-hover:animate-spin" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-red-600/50 text-red-400 hover:bg-red-900/30 hover:text-red-300 hover:border-red-400 transition-all duration-300 hover:scale-110 font-mono group relative overflow-hidden">
                <Shield className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                <span>Access Dashboard</span>
                <Eye className="w-4 h-4 ml-2 group-hover:animate-pulse" />
              </Button>
            </Link>
          </div>

          {/* Enhanced Feature Cards - Black with white text */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {[
              {
                icon: FileText,
                title: "Smart Reporting",
                description: "Submit detailed progress reports with AI-powered validation and automatic insights generation.",
                delay: 0.9,
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Contractors submit and view their own reports, while admins have full oversight with advanced analytics.",
                delay: 1.2,
              },
              {
                icon: Bell,
                title: "AI Notifications",
                description: "Receive intelligent notifications about report patterns, deadlines, and automated quality assessments.",
                delay: 1.5,
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className={`bg-black border-red-700/50 hover:border-red-500/70 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 group backdrop-blur-sm cursor-pointer transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                style={{ animationDelay: `${feature.delay}s` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white font-mono">
                    <div className="p-2 bg-red-900/60 rounded-lg border border-red-600/50 group-hover:scale-110 transition-all duration-300 group-hover:bg-red-800/70">
                      <feature.icon className="w-6 h-6 text-red-400 group-hover:text-red-300 group-hover:animate-pulse transition-all duration-300" />
                    </div>
                    <span className="group-hover:text-red-300 transition-colors duration-300">{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200 group-hover:text-white transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* New Features Section */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white mb-12 font-mono">Advanced Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: TrendingUp,
                  title: "Performance Analytics",
                  description: "Real-time dashboards with AI-driven insights into team productivity and project milestones.",
                },
                {
                  icon: Globe,
                  title: "Global Oversight",
                  description: "Monitor projects across multiple locations with unified reporting and compliance tracking.",
                },
                {
                  icon: Clock,
                  title: "Time Intelligence",
                  description: "Automated time tracking with smart scheduling and deadline prediction algorithms.",
                },
                {
                  icon: CheckCircle,
                  title: "Quality Assurance",
                  description: "Built-in validation systems that ensure report accuracy and completeness before submission.",
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-black border-red-700/50 hover:border-red-500/70 transition-all duration-500 hover:scale-105 group">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-white font-mono">
                      <div className="p-2 bg-red-900/60 rounded-lg border border-red-600/50 group-hover:scale-110 transition-all duration-300">
                        <feature.icon className="w-5 h-5 text-red-400 group-hover:animate-pulse" />
                      </div>
                      <span className="group-hover:text-red-300 transition-colors duration-300">{feature.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-200 group-hover:text-white transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {[
              { label: "Reports Analyzed", value: "10K+" },
              { label: "AI Accuracy", value: "99.7%" },
              { label: "Time Saved", value: "80%" },
              { label: "Active Users", value: "500+" }
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="text-3xl md:text-4xl font-bold text-red-400 font-mono group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="mt-32 mb-20">
            <h2 className="text-4xl font-bold text-white mb-12 font-mono">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Submit Reports",
                  description: "Contractors submit detailed progress reports through our intuitive interface with real-time validation.",
                },
                {
                  step: "02", 
                  title: "AI Analysis",
                  description: "Our advanced AI algorithms analyze submissions for accuracy, completeness, and potential issues.",
                },
                {
                  step: "03",
                  title: "Oversight & Insights",
                  description: "Administrators receive comprehensive analytics and automated alerts for optimal project management.",
                }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="fixed bottom-10 right-10 pointer-events-none">
        <div className="relative">
          <div className="w-6 h-6 bg-red-500/40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-400/50 rounded-full animate-ping"></div>
        </div>
      </div>
      <div className="fixed bottom-20 right-20 pointer-events-none">
        <div className="w-4 h-4 bg-red-400/35 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>
      <div className="fixed bottom-16 right-32 pointer-events-none">
        <div className="w-5 h-5 bg-red-600/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="flex flex-col items-center space-y-2 text-red-400/60">
          <span className="text-xs font-mono animate-pulse">SCROLL FOR MORE</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-red-400/60 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
