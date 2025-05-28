import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  FileText, 
  Brain, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Send,
  Upload,
  BarChart3,
  Users,
  Lock,
  Clock,
  Target,
  ChevronRight,
  Sparkles,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ChatQuickReport from "@/components/ChatQuickReport";

const Index = () => {
  const { user, signOut } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quickReport, setQuickReport] = useState("");
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

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10,
  }));

  const workflowSteps = [
    {
      number: 1,
      title: "Submit Report",
      description: "Contractors submit detailed progress reports",
      icon: Upload,
      color: "from-blue-500 to-cyan-400"
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Advanced AI processes and validates submissions",
      icon: Brain,
      color: "from-purple-500 to-pink-400"
    },
    {
      number: 3,
      title: "Quality Review",
      description: "Automated quality checks and validation",
      icon: Shield,
      color: "from-green-500 to-emerald-400"
    },
    {
      number: 4,
      title: "Dashboard Insights",
      description: "Real-time analytics and performance metrics",
      icon: BarChart3,
      color: "from-orange-500 to-red-400"
    }
  ];

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
      <nav className="relative z-50 flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              The Eye of Sauron
            </h1>
            <p className="text-xs text-gray-400 font-mono">Efficient Yielding Engagement Optimized For Structured Assignments</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-300 font-mono">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                size="sm" 
                className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-red-600 hover:bg-red-700">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Chat Quick Report for logged in users */}
      {user && (
        <div className="relative z-40 px-6 mt-8">
          <ChatQuickReport />
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-40 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <div className="mb-8">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4 font-mono">
              AI-POWERED PROGRESS TRACKING
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-400 via-purple-400 to-red-600 bg-clip-text text-transparent">
                THE EYE
              </span>
              <br />
              <span className="text-white/80">OF SAURON</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-mono">
              The all-seeing AI-powered progress report management system. 
              Submit, track, and analyze team progress with intelligent oversight and real-time insights.
            </p>
          </div>

          {/* Interactive Eye */}
          <div className="relative mb-12">
            <div 
              className="w-32 h-32 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer group"
              style={{
                transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
              }}
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center relative">
                <div 
                  className="w-4 h-4 bg-red-400 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{
                    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <>
                <Link to="/submit">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg font-mono">
                    <Send className="w-5 h-5 mr-2" />
                    Submit Report
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg font-mono">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg font-mono">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg font-mono">
                  <Eye className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 font-mono">
            HOW THE SYSTEM <span className="text-red-400">WORKS</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.number} className="bg-black/40 border-white/10 hover:border-red-500/30 transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="outline" className="w-8 h-8 rounded-full border-white/20 text-white font-mono">
                      {step.number}
                    </Badge>
                    <CardTitle className="text-white font-mono">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 text-center font-mono">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-red-500/20 hover:border-red-500/50 transition-all duration-300">
            <CardHeader>
              <Brain className="w-8 h-8 text-red-400 mb-2" />
              <CardTitle className="text-white font-mono">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 font-mono">
                Advanced machine learning algorithms analyze report quality, detect anomalies, and provide intelligent insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
            <CardHeader>
              <Shield className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle className="text-white font-mono">Quality Assurance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 font-mono">
                Automated validation ensures all submissions meet quality standards before approval.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white font-mono">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 font-mono">
                Comprehensive dashboards provide instant insights into contractor performance and project progress.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/20 hover:border-green-500/50 transition-all duration-300">
            <CardHeader>
              <Clock className="w-8 h-8 text-green-400 mb-2" />
              <CardTitle className="text-white font-mono">Instant Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 font-mono">
                Lightning-fast report processing with immediate feedback and status updates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/20 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader>
              <Users className="w-8 h-8 text-orange-400 mb-2" />
              <CardTitle className="text-white font-mono">Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 font-mono">
                Seamless collaboration tools for teams to review, approve, and manage contractor submissions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
            <CardHeader>
              <Lock className="w-8 h-8 text-cyan-400 mb-2" />
              <CardTitle className="text-white font-mono">Secure & Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 font-mono">
                Enterprise-grade security with full audit trails and compliance reporting capabilities.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-12 border-t border-white/10">
          <p className="text-gray-400 font-mono">
            The Eye of Sauron - Advanced Contractor Intelligence System
          </p>
          <p className="text-gray-600 text-sm font-mono mt-2">
            Powered by AI • Built for Excellence • Designed for Control
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
