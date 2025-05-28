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
  LogOut,
  TrendingUp,
  Award,
  Timer,
  MessageCircle,
  Star,
  Activity,
  Lightbulb,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ChatQuickReport from "@/components/ChatQuickReport";

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

  const workflowSteps = [
    {
      number: 1,
      title: "Submit Report",
      description: "Contractors submit detailed progress reports through our intuitive interface",
      icon: Upload,
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Advanced neural networks process and validate submissions in real-time",
      icon: Brain,
      color: "from-purple-500 to-pink-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      number: 3,
      title: "Quality Review",
      description: "Automated quality checks ensure compliance and accuracy",
      icon: Shield,
      color: "from-green-500 to-emerald-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
    {
      number: 4,
      title: "Dashboard Insights",
      description: "Generate actionable insights and performance metrics",
      icon: BarChart3,
      color: "from-orange-500 to-red-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    }
  ];

  // Calculate pupil position based on mouse position
  const calculatePupilPosition = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 + 200; // Approximate position of the eye
    const maxDistance = 15; // Maximum distance the pupil can move
    
    const deltaX = mousePosition.x - centerX;
    const deltaY = mousePosition.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance === 0) return { x: 0, y: 0 };
    
    const normalizedX = (deltaX / distance) * Math.min(distance / 50, maxDistance);
    const normalizedY = (deltaY / distance) * Math.min(distance / 50, maxDistance);
    
    return { x: normalizedX, y: normalizedY };
  };

  const pupilPosition = calculatePupilPosition();

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

          {/* Interactive Eye of Sauron */}
          <div className="relative mb-12">
            <div className="w-40 h-40 mx-auto relative cursor-pointer group">
              {/* Outer Eye Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse">
                <div className="absolute inset-1 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500">
                  {/* Eye Socket */}
                  <div className="absolute inset-2 rounded-full bg-black border-2 border-red-400/50">
                    {/* Iris */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-r from-red-500 to-orange-400 overflow-hidden">
                      {/* Pupil that follows cursor */}
                      <div 
                        className="absolute w-8 h-8 bg-black rounded-full top-1/2 left-1/2 transition-transform duration-100 ease-out"
                        style={{
                          transform: `translate(-50%, -50%) translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                        }}
                      >
                        {/* Inner glow */}
                        <div className="absolute inset-0.5 bg-red-600 rounded-full animate-pulse"></div>
                        <div className="absolute inset-1 bg-red-400 rounded-full"></div>
                      </div>
                      
                      {/* Iris texture lines */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-red-300 transform -translate-x-1/2"></div>
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-300 transform -translate-y-1/2"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-red-300/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Flaming effect */}
              <div className="absolute -inset-4 opacity-60">
                <div className="absolute top-0 left-1/2 w-2 h-8 bg-gradient-to-t from-orange-500 to-transparent transform -translate-x-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-8 bg-gradient-to-b from-orange-500 to-transparent transform -translate-x-1/2 animate-pulse"></div>
                <div className="absolute top-1/2 left-0 w-8 h-2 bg-gradient-to-l from-orange-500 to-transparent transform -translate-y-1/2 animate-pulse"></div>
                <div className="absolute top-1/2 right-0 w-8 h-2 bg-gradient-to-r from-orange-500 to-transparent transform -translate-y-1/2 animate-pulse"></div>
              </div>
              
              {/* Rotating ring of fire */}
              <div className="absolute -inset-8 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 w-1 h-4 bg-red-400 transform -translate-x-1/2 opacity-70"></div>
                <div className="absolute top-2 right-2 w-1 h-3 bg-orange-400 transform opacity-50"></div>
                <div className="absolute bottom-2 left-2 w-1 h-3 bg-red-500 transform opacity-60"></div>
                <div className="absolute bottom-0 right-1/2 w-1 h-4 bg-yellow-400 transform translate-x-1/2 opacity-40"></div>
              </div>
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

        {/* How The System Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 font-mono">
            HOW THE SYSTEM <span className="text-red-400">WORKS</span>
          </h2>
          
          {/* Workflow Container */}
          <div className="max-w-6xl mx-auto">
            {/* Steps Grid - Removed flow line and slider elements */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {workflowSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = activeStep === index;
                
                return (
                  <div key={step.number} className="relative">
                    {/* Step Card */}
                    <div className={`relative group transition-all duration-500 ${isActive ? 'scale-105' : ''}`}>
                      {/* Animated Background */}
                      <div className={`absolute inset-0 rounded-xl ${step.bgColor} ${step.borderColor} border-2 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : 'opacity-50'}`}></div>
                      
                      {/* Content */}
                      <div className="relative p-6 text-center">
                        {/* Icon Circle */}
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${isActive ? 'scale-110 shadow-lg' : ''}`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        
                        {/* Step Number Badge */}
                        <div className={`w-8 h-8 mx-auto mb-3 rounded-full border-2 ${step.borderColor} ${step.bgColor} flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110' : ''}`}>
                          <span className="text-white font-bold text-sm">{step.number}</span>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-3 font-mono">{step.title}</h3>
                        
                        {/* Description */}
                        <p className="text-gray-400 text-sm font-mono leading-relaxed">
                          {step.description}
                        </p>
                        
                        {/* Active Indicator */}
                        {isActive && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-mono mb-4">
              EXPERIENCE THE <span className="text-red-400">POWER</span>
            </h2>
            <p className="text-gray-400 font-mono">See how The Eye analyzes and validates reports in real-time</p>
          </div>

          <Card className="bg-black/40 border-white/10 hover:border-red-500/30 transition-all duration-500 group">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-mono">AI-Powered Analysis</h3>
                  <p className="text-gray-400 mb-6 font-mono">
                    Watch as our advanced neural networks process contractor submissions, 
                    validate quality standards, and generate intelligent insights in milliseconds.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300 font-mono">Quality validation checks</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300 font-mono">Anomaly detection</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300 font-mono">Performance insights</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-lg p-6 border border-white/10">
                    <div className="flex items-center space-x-2 mb-4">
                      <Brain className="w-6 h-6 text-purple-400" />
                      <span className="text-white font-mono">Neural Analysis Active</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-black/40 rounded p-3 border-l-4 border-blue-500">
                        <div className="text-blue-400 text-sm font-mono">Processing Report #24601</div>
                        <div className="text-gray-300 text-xs font-mono">Quality Score: 94.7%</div>
                      </div>
                      <div className="bg-black/40 rounded p-3 border-l-4 border-green-500">
                        <div className="text-green-400 text-sm font-mono">Validation Complete</div>
                        <div className="text-gray-300 text-xs font-mono">Status: Approved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA Section */}
        <div className="text-center py-16 border-t border-white/10">
          <div className="mb-8">
            <h2 className="text-4xl font-bold font-mono mb-4">
              READY TO EXPERIENCE <span className="text-red-400">THE POWER</span>?
            </h2>
            <p className="text-xl text-gray-300 font-mono">
              Join thousands of teams already using The Eye of Sauron
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {user ? (
              <>
                <Link to="/submit">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg font-mono">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Submitting Reports
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-mono">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Explore Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg font-mono">
                  <Rocket className="w-5 h-5 mr-2" />
                  Get Started Now
                </Button>
              </Link>
            )}
          </div>

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
