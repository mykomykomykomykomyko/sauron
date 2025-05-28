
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
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
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
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-transparent"></div>

      {/* Animated mesh gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Dynamic cursor glow */}
      <div 
        className="fixed w-96 h-96 bg-gradient-radial from-red-500/15 via-purple-500/8 to-transparent rounded-full blur-3xl pointer-events-none z-0 transition-all duration-500 hidden md:block"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      {/* Floating particles */}
      {particles.map((particle) => (
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
            opacity: 0.4,
          }}
        />
      ))}

      {/* Header */}
      <nav className="flex items-center justify-between p-4 sm:p-6 md:p-8 border-b border-white/10 backdrop-blur-xl bg-black/30 relative z-10">
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 via-purple-600 to-red-700 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
            <Eye className="w-5 h-5 sm:w-7 sm:h-7 text-white relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
              THE EYE OF SAURON
            </span>
            <span className="text-xs text-gray-400 font-mono hidden sm:block">AI-POWERED OVERSIGHT</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="outline" size="sm" className="border-white/20 text-white/90 hover:bg-white/10 font-mono">
              Sign In
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 py-16 sm:py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className={`text-center mb-16 sm:mb-24 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-white/20 rounded-full px-6 py-3 backdrop-blur-xl mb-8">
              <Shield className="w-5 h-5 text-red-400" />
              <span className="text-sm font-mono text-white/90">AI-POWERED PROJECT OVERSIGHT</span>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-mono mb-8 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent leading-tight">
              THE EYE OF
              <br />
              <span className="bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                SAURON
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Revolutionary AI-powered oversight system that analyzes, validates, and monitors project progress reports with unmatched precision and intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono text-lg px-8 py-4 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <Eye className="w-6 h-6 mr-3 relative z-10" />
                  <span className="relative z-10">Deploy Oversight</span>
                  <ArrowRight className="w-6 h-6 ml-3 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white/20 text-white/90 hover:bg-white/10 font-mono text-lg px-8 py-4">
                <FileText className="w-6 h-6 mr-3" />
                View Demo
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className={`grid md:grid-cols-3 gap-8 mb-16 sm:mb-24 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {[
              {
                icon: Brain,
                title: "AI Analysis Engine",
                description: "Advanced machine learning algorithms analyze every report for quality, completeness, and potential issues."
              },
              {
                icon: Shield,
                title: "Real-time Validation",
                description: "Instant verification and cross-referencing against project requirements and historical data."
              },
              {
                icon: BarChart3,
                title: "Intelligent Insights",
                description: "Comprehensive analytics and predictive insights to optimize project performance and outcomes."
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-black/40 border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 group backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-mono">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Intelligent Workflow Section */}
          <div className={`mb-16 sm:mb-24 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Intelligent Workflow
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Streamlined process from submission to insights, powered by cutting-edge AI technology
              </p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <Card className="bg-black/40 border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 group backdrop-blur-xl">
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold font-mono">
                          {step.number}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 font-mono">{step.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Arrow between steps */}
                    {index < workflowSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ChevronRight className="w-8 h-8 text-white/60" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Report Submission */}
          <div className={`mb-16 sm:mb-24 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold font-mono text-white mb-4">
                  Quick Report Submission
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Submit your progress report for instant AI analysis and validation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="flex space-x-4">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="Type your progress report here..."
                        value={quickReport}
                        onChange={(e) => setQuickReport(e.target.value)}
                        className={`bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-transparent focus:ring-0 h-12 transition-all duration-300 ${
                          quickReport.trim() ? 'shadow-[0_0_20px_rgba(255,0,0,0.1),0_0_40px_rgba(138,43,226,0.1),0_0_60px_rgba(6,182,212,0.1)] border-transparent' : ''
                        }`}
                      />
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono px-8 h-12 group"
                      disabled={!quickReport.trim()}
                    >
                      <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      Submit
                      <Sparkles className="w-5 h-5 ml-2 group-hover:animate-pulse" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Section */}
          <div className={`text-center mb-16 transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "AI 24/7 Support",
                  description: "Round-the-clock AI-powered assistance for all your oversight needs"
                },
                {
                  icon: Lock,
                  title: "Enterprise Security",
                  description: "Bank-grade encryption and security protocols protect your sensitive data"
                },
                {
                  icon: Target,
                  title: "Precision Accuracy",
                  description: "Industry-leading accuracy rates ensure reliable analysis and insights"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-mono">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="bg-gradient-to-r from-red-500/10 via-purple-500/10 to-red-500/10 border border-white/20 rounded-3xl p-12 backdrop-blur-xl">
              <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Deploy The Eye?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Transform your project oversight with AI-powered intelligence and real-time analytics.
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono text-lg px-12 py-4 group">
                  <Eye className="w-6 h-6 mr-3" />
                  Begin Surveillance
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        .bg-gradient-radial {
          background: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default Index;
