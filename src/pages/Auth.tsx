
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Shield, Lock, Mail, User, ArrowRight, Brain, Network, Sparkles, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signIn,
    signUp
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome to The Eye of Jasper!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setIsLoading(true);
    try {
      await signUp(email, password, fullName);
      toast.success("Account created successfully! Check your email to verify your account.");
      setActiveTab("signin");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const particles = Array.from({
    length: 20
  }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10
  }));
  const features = [{
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning validates every report"
  }, {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption protects your data"
  }, {
    icon: Network,
    title: "Real-time Insights",
    description: "Get instant feedback and performance metrics"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden relative flex items-center justify-center">
      {/* Background Effects - Updated for Alberta/Jasper theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900 to-indigo-900/40"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-cyan-900/15 via-transparent to-blue-900/20"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800/20 via-slate-900 to-transparent"></div>

      {/* Animated mesh gradient - Updated colors */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{
        animationDelay: '4s'
      }}></div>
      </div>

      {/* Dynamic cursor glow - Updated colors */}
      <div className="fixed w-96 h-96 bg-gradient-radial from-blue-500/15 via-cyan-500/8 to-transparent rounded-full blur-3xl pointer-events-none z-0 transition-all duration-500 hidden md:block" style={{
      left: mousePosition.x - 192,
      top: mousePosition.y - 192
    }} />

      {/* Floating particles - Updated colors */}
      {particles.map(particle => <div key={particle.id} className="absolute rounded-full pointer-events-none animate-pulse" style={{
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: `linear-gradient(45deg, #3b82f6, #06b6d4, #1e40af)`,
      animationDelay: `${particle.delay}s`,
      animationDuration: `${particle.duration}s`,
      opacity: 0.4
    }} />)}

      {/* Back to Home */}
      <Link to="/" className="fixed top-6 left-6 z-50 flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 group">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-white/20 flex items-center justify-center backdrop-blur-xl group-hover:scale-110 transition-all duration-300">
          <Eye className="w-5 h-5" />
        </div>
        <span className="font-mono text-sm hidden sm:inline">Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Branding */}
          <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center border border-white/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <Eye className="w-8 h-8 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white tracking-tight font-mono">THE EYE OF JASPER</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300 font-mono">AI-POWERED OVERSIGHT</span>
                </div>
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              SECURE ACCESS
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join the next generation of intelligent project oversight. Your reports, analyzed and validated by advanced AI.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => <div key={index} className="flex items-start space-x-4 group">
                  <div className="p-2 bg-gradient-to-br from-white/10 to-white/5 rounded-lg border border-white/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white font-mono text-sm">{feature.title}</h4>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </div>)}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>Enterprise Grade</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <Card className="bg-slate-900/40 border-white/20 backdrop-blur-xl shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-full px-4 py-2 backdrop-blur-xl mb-4">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-mono text-white/90">SECURE LOGIN</span>
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <CardTitle className="text-2xl font-mono text-white">
                  Access Your Dashboard
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your credentials to continue your oversight journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800/20 border border-white/20">
                    <TabsTrigger value="signin" className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-4 mt-6">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-white font-mono flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </Label>
                        <Input id="signin-email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="bg-slate-800/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-white font-mono flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Password</span>
                        </Label>
                        <Input id="signin-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="bg-slate-800/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400" />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border border-white/20 hover:border-white/40 transition-all duration-300 font-mono group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <Shield className="w-4 h-4 mr-2 relative z-10" />
                        <span className="relative z-10">{isLoading ? "Authenticating..." : "Sign In"}</span>
                        <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4 mt-6">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-white font-mono flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Full Name</span>
                        </Label>
                        <Input id="signup-name" type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required className="bg-slate-800/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-white font-mono flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </Label>
                        <Input id="signup-email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="bg-slate-800/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-white font-mono flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Password</span>
                        </Label>
                        <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="bg-slate-800/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-white font-mono flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Confirm Password</span>
                        </Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="bg-slate-800/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400" />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border border-white/20 hover:border-white/40 transition-all duration-300 font-mono group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <User className="w-4 h-4 mr-2 relative z-10" />
                        <span className="relative z-10">{isLoading ? "Creating Account..." : "Create Account"}</span>
                        <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        .bg-gradient-radial {
          background: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>;
};
export default Auth;
