
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
  const [quickReport, setQuickReport] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [liveStats, setLiveStats] = useState({
    reportsProcessed: 15420,
    activeUsers: 2847,
    avgProcessingTime: 0.3
  });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Animate live stats
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        reportsProcessed: prev.reportsProcessed + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        avgProcessingTime: Number((0.2 + Math.random() * 0.3).toFixed(1))
      }));
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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Project Manager",
      company: "TechCorp",
      quote: "The Eye of Sauron has revolutionized how we track contractor progress. AI-powered insights save us hours every week.",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Operations Director",
      company: "BuildRight",
      quote: "Real-time analysis and automated quality checks have improved our project delivery by 40%.",
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Team Lead",
      company: "DevSolutions",
      quote: "The intelligent oversight gives us confidence that nothing falls through the cracks.",
      avatar: "EW"
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
        <div className="mb-20">
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

        {/* Live Stats Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-mono mb-4">
              REAL-TIME <span className="text-red-400">INTELLIGENCE</span>
            </h2>
            <p className="text-gray-400 font-mono">Live data from The Eye's neural network</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-black/40 border-red-500/20 hover:border-red-500/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2 font-mono">
                  {liveStats.reportsProcessed.toLocaleString()}
                </div>
                <div className="text-gray-400 font-mono">Reports Processed</div>
                <div className="flex items-center justify-center mt-2 text-green-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-mono">Live</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2 font-mono">
                  {liveStats.activeUsers.toLocaleString()}
                </div>
                <div className="text-gray-400 font-mono">Active Users</div>
                <div className="flex items-center justify-center mt-2 text-green-400">
                  <Activity className="w-4 h-4 mr-1" />
                  <span className="text-sm font-mono">Online</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Timer className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2 font-mono">
                  {liveStats.avgProcessingTime}s
                </div>
                <div className="text-gray-400 font-mono">Avg Processing Time</div>
                <div className="flex items-center justify-center mt-2 text-green-400">
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="text-sm font-mono">Lightning Fast</span>
                </div>
              </CardContent>
            </Card>
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

        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-mono mb-4">
              TRUSTED BY <span className="text-red-400">INDUSTRY LEADERS</span>
            </h2>
            <p className="text-gray-400 font-mono">See what our clients say about The Eye of Sauron</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/40 border-white/10 hover:border-red-500/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold font-mono">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm font-mono">{testimonial.role}</div>
                      <div className="text-red-400 text-sm font-mono">{testimonial.company}</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic font-mono text-sm">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <>
                <Link to="/auth">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg font-mono">
                    <Rocket className="w-5 h-5 mr-2" />
                    Get Started Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-mono">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </>
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
