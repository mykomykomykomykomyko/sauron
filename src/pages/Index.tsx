
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Shield, Users, Bell, Sparkles, Zap, Target, TrendingUp, Globe, Clock, CheckCircle, ArrowRight, Brain, Network, Cpu, Database, BarChart3, MessageSquare, Lock, Workflow, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuickReportForm from "@/components/QuickReportForm";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
    
    // Auto-cycle through workflow steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 3000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowSignOutDialog(false);
      toast.success("Signed out successfully!");
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error signing out. Please try again.");
    }
  };

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 20 + 10,
  }));

  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 150 + 50,
    delay: Math.random() * 10,
  }));

  const workflowSteps = [
    {
      title: "Submit Report",
      description: "Contractors submit detailed progress reports through our intuitive interface",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      features: ["Smart form validation", "Auto-save functionality", "Rich text editing", "File attachments"]
    },
    {
      title: "AI Analysis",
      description: "Advanced AI processes and validates the report against multiple data sources",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      features: ["Natural language processing", "Data cross-validation", "Pattern recognition", "Quality assessment"]
    },
    {
      title: "Real-time Insights",
      description: "Generate actionable insights and identify potential issues immediately",
      icon: BarChart3,
      color: "from-red-500 to-orange-500",
      features: ["Instant feedback", "Performance metrics", "Risk assessment", "Trend analysis"]
    },
    {
      title: "Admin Review",
      description: "Admins receive comprehensive dashboards with all validated data and insights",
      icon: Shield,
      color: "from-green-500 to-emerald-500",
      features: ["Executive dashboards", "Detailed analytics", "Export capabilities", "Team oversight"]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Advanced Background with multiple gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/30"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-orange-900/10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-black to-transparent"></div>
      
      {/* Animated mesh gradient */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Dynamic cursor glow - enhanced */}
      <div 
        className="fixed w-96 h-96 bg-gradient-radial from-red-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none z-0 transition-all duration-500 hidden md:block"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Enhanced floating particles */}
      {particles.slice(0, window.innerWidth < 768 ? 15 : 30).map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `linear-gradient(45deg, #ef4444, #8b5cf6, #06b6d4)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.1}deg)`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Floating geometric shapes */}
      {floatingElements.slice(0, window.innerWidth < 768 ? 4 : 8).map((element) => (
        <div
          key={element.id}
          className="absolute pointer-events-none opacity-5 hidden lg:block"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            background: 'linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.1), transparent)',
            clipPath: element.id % 2 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            animation: `float ${20 + element.delay}s ease-in-out infinite`,
            animationDelay: `${element.delay}s`,
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        />
      ))}

      {/* Header with glass morphism */}
      <nav className={`flex items-center justify-center p-4 sm:p-6 md:p-8 border-b border-white/10 backdrop-blur-xl bg-black/30 relative z-10 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center space-x-3 sm:space-x-4 group">
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 via-purple-600 to-red-700 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-red-500/50 group-hover:rotate-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <Eye className="w-5 h-5 sm:w-7 sm:h-7 text-white group-hover:animate-pulse relative z-10" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-3xl font-bold text-white tracking-tight font-mono group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
              THE EYE OF SAURON
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400 font-mono">AI-POWERED OVERSIGHT</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Authentication Buttons with glass morphism */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex gap-2 sm:gap-3">
        {user ? (
          <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/20 text-white/90 hover:bg-white/10 hover:text-white hover:border-white/40 hover:scale-105 transition-all duration-300 backdrop-blur-xl bg-black/30 shadow-lg text-xs sm:text-sm"
              >
                Sign Out
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/20 backdrop-blur-xl mx-4 sm:mx-0">
              <DialogHeader>
                <DialogTitle className="text-red-400">Sign Out</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Are you sure you want to sign out of The Eye of Sauron?
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-3 mt-4">
                <Button 
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex-1 sm:flex-none"
                >
                  Yes, Sign Out
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSignOutDialog(false)}
                  className="border-white/20 text-white/90 hover:bg-white/10 flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <>
            <Link to="/auth">
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/20 text-white/90 hover:bg-white/10 hover:text-white hover:border-white/40 hover:scale-105 transition-all duration-300 backdrop-blur-xl bg-black/30 shadow-lg text-xs sm:text-sm"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                size="sm"
                className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 backdrop-blur-xl shadow-lg text-xs sm:text-sm border border-white/20"
              >
                Register
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Hero Section with enhanced design */}
      <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Hero badge */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-white/20 rounded-full px-4 sm:px-8 py-3 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse relative z-10" />
              <span className="text-sm sm:text-base font-mono text-white/90 relative z-10">NEXT-GENERATION AI OVERSIGHT</span>
              <Network className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse relative z-10" />
            </div>
          </div>

          {/* Main heading with enhanced typography */}
          <div className="relative mb-8 sm:mb-12">
            <h1 className={`text-4xl sm:text-6xl md:text-8xl font-bold mb-6 sm:mb-8 tracking-tight font-mono transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                THE EYE OF
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                SAURON
              </span>
            </h1>
            
            {/* Subtitle with animation */}
            <div className="mb-4 sm:mb-6">
              <div className="inline-flex items-center space-x-3 text-red-400 font-mono text-sm sm:text-lg mb-4">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                <span className="hidden sm:inline bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                  Efficient Yielding Engagement Optimized For Structured Assignments
                </span>
                <span className="sm:hidden bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                  E.Y.E.O.F.S.A
                </span>
                <Target className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </div>
            </div>
          </div>
          
          <p className={`text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-12 leading-relaxed max-w-5xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            The all-seeing <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent font-semibold">AI-powered</span> progress report management system. Submit, track, and analyze team progress with intelligent oversight and real-time insights powered by advanced machine learning.
          </p>

          {/* Quick Report Form for Logged-in Users */}
          {user && (
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <QuickReportForm />
            </div>
          )}
          
          {/* CTA Buttons with enhanced design */}
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-20 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <Link to="/submit" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl bg-gradient-to-r from-red-600 via-red-700 to-purple-600 hover:from-red-700 hover:via-red-800 hover:to-purple-700 text-white border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-110 font-mono group relative overflow-hidden hover:shadow-2xl hover:shadow-red-500/50">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-3 relative z-10 group-hover:animate-pulse" />
                <span className="relative z-10">Submit Report</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-3 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-500 hover:scale-110 font-mono group backdrop-blur-xl">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-pulse" />
                  <span>Access Dashboard</span>
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 ml-3 group-hover:animate-pulse" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-500 hover:scale-110 font-mono group backdrop-blur-xl">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-pulse" />
                  <span>Get Started</span>
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 ml-3 group-hover:animate-pulse" />
                </Button>
              </Link>
            )}
          </div>

          {/* Enhanced Feature Cards with glass morphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-20">
            {[
              {
                icon: FileText,
                title: "Smart Reporting",
                description: "Submit detailed progress reports with AI-powered validation and automatic insights generation using advanced natural language processing.",
                delay: 0.9,
                gradient: "from-blue-500/20 to-cyan-500/20",
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Contractors submit and view their own reports, while admins have full oversight with advanced analytics and real-time monitoring.",
                delay: 1.2,
                gradient: "from-purple-500/20 to-pink-500/20",
              },
              {
                icon: Bell,
                title: "AI Notifications",
                description: "Receive intelligent notifications about report patterns, deadlines, and automated quality assessments powered by machine learning.",
                delay: 1.5,
                gradient: "from-red-500/20 to-orange-500/20",
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className={`bg-black/40 border-white/20 hover:border-white/40 transition-all duration-700 hover:scale-105 hover:shadow-2xl group backdrop-blur-xl cursor-pointer transform transition-all duration-1000 relative overflow-hidden ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                style={{ animationDelay: `${feature.delay}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="flex items-center space-x-3 text-white font-mono text-base sm:text-lg">
                    <div className="p-3 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20 group-hover:scale-110 transition-all duration-300 group-hover:bg-white/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-white group-hover:animate-pulse transition-all duration-300 relative z-10" />
                    </div>
                    <span className="group-hover:text-white transition-colors duration-300">{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Section */}
      <div className="px-4 sm:px-6 md:px-8 py-24 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-full px-6 py-3 backdrop-blur-xl mb-8">
              <Workflow className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-mono text-white/90">HOW IT WORKS</span>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold font-mono mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              INTELLIGENT WORKFLOW
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the power of AI-driven report management with our streamlined four-step process
            </p>
          </div>

          {/* Cohere-inspired Workflow Visualization */}
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-purple-900/10 via-black/50 to-red-900/10 rounded-3xl border border-white/10 backdrop-blur-xl p-8 overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Workflow steps arranged in a flow */}
              <div className="relative">
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <defs>
                    <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  
                  {/* Flowing connection path */}
                  <path
                    d="M 120 100 Q 200 50, 280 100 Q 360 150, 440 100 Q 520 50, 600 100"
                    stroke="url(#flowGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                  />
                  
                  {/* Animated dots */}
                  <circle r="3" fill="#ef4444" className="opacity-80">
                    <animateMotion dur="4s" repeatCount="indefinite">
                      <mpath href="#flowPath" />
                    </animateMotion>
                  </circle>
                  
                  <path id="flowPath" d="M 120 100 Q 200 50, 280 100 Q 360 150, 440 100 Q 520 50, 600 100" opacity="0" />
                </svg>

                {/* Workflow nodes */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative" style={{ zIndex: 2 }}>
                  {workflowSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center group">
                      {/* Step node */}
                      <div className={`relative mb-4 transition-all duration-500 ${
                        currentStep === index ? 'scale-110' : 'hover:scale-105'
                      }`}>
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center border-2 transition-all duration-500 ${
                          currentStep === index 
                            ? 'border-white shadow-2xl shadow-red-500/30' 
                            : 'border-white/20 hover:border-white/40'
                        } relative overflow-hidden`}>
                          {/* Animated background for active step */}
                          {currentStep === index && (
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                          )}
                          
                          <step.icon className="w-10 h-10 text-white relative z-10" />
                          
                          {/* Glow effect */}
                          <div className={`absolute -inset-2 bg-gradient-to-br ${step.color} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                        </div>
                        
                        {/* Step number */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-black border border-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Step info */}
                      <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-red-200 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                        {step.description}
                      </p>
                      
                      {/* Features list */}
                      <div className="mt-4 space-y-1 hidden lg:block">
                        {step.features.slice(0, 2).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2 text-xs text-gray-500">
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                  {workflowSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentStep === index ? 'bg-red-400 w-8' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Deep Dive */}
      <div className="px-4 sm:px-6 md:px-8 py-24 sm:py-32 relative z-10 bg-gradient-to-b from-transparent via-black/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-bold font-mono mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ADVANCED CAPABILITIES
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powered by cutting-edge AI technology and designed for enterprise-scale operations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Analysis",
                description: "Advanced machine learning algorithms analyze reports for consistency, accuracy, and potential issues",
                icon: Brain,
                features: ["Natural Language Processing", "Pattern Recognition", "Anomaly Detection", "Predictive Analytics"],
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Real-Time Monitoring",
                description: "Track progress and performance metrics with live dashboards and instant notifications",
                icon: TrendingUp,
                features: ["Live Dashboards", "Custom Alerts", "Performance Metrics", "Trend Analysis"],
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Enterprise Security",
                description: "Bank-grade security with role-based access control and comprehensive audit trails",
                icon: Lock,
                features: ["End-to-End Encryption", "Role-Based Access", "Audit Trails", "Compliance Ready"],
                color: "from-red-500 to-orange-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-black/40 border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 group backdrop-blur-xl">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-mono text-white group-hover:text-white transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="px-4 sm:px-6 md:px-8 py-24 sm:py-32 relative z-10 bg-gradient-to-t from-black via-red-900/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-white/20 rounded-full px-6 py-3 backdrop-blur-xl mb-8">
            <Sparkles className="w-5 h-5 text-red-400" />
            <span className="text-sm font-mono text-white/90">READY TO BEGIN?</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-bold font-mono mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
            START YOUR OVERSIGHT
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Experience the power of AI-driven project management and intelligent oversight.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to={user ? "/submit" : "/auth"}>
              <Button size="lg" className="px-12 py-6 text-xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-110 font-mono group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <PlayCircle className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">{user ? "Submit Report" : "Get Started"}</span>
                <ArrowRight className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 text-center opacity-60">
            <div>
              <Globe className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-sm text-gray-400">Global Scale</div>
            </div>
            <div>
              <Clock className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-sm text-gray-400">AI 24/7 Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced floating elements */}
      <div className="fixed bottom-6 sm:bottom-10 right-6 sm:right-10 pointer-events-none hidden sm:block">
        <div className="relative">
          <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-purple-500 rounded-full animate-bounce shadow-lg shadow-red-500/50" style={{animationDelay: '0s'}}></div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="text-xs font-mono animate-pulse hidden sm:block">SCROLL FOR MORE</span>
          <span className="text-xs font-mono animate-pulse sm:hidden">SCROLL</span>
          <div className="w-0.5 h-6 sm:h-10 bg-gradient-to-b from-white/60 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default Index;
