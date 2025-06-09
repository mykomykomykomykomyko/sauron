
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, User, Mail, Building, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<'admin' | 'contractor'>('contractor');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !fullName.trim()) {
      toast.error("Email and full name are required");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, "", fullName, companyName); // Empty password for email confirmation flow
      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden relative flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900 to-indigo-900/40"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-cyan-900/15 via-transparent to-blue-900/20"></div>
      
      {/* Animated mesh gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Back to Home */}
      <Link to="/" className="fixed top-6 left-6 z-50 flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 group">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-white/20 flex items-center justify-center backdrop-blur-xl group-hover:scale-110 transition-all duration-300">
          <Eye className="w-5 h-5" />
        </div>
        <span className="font-mono text-sm hidden sm:inline">Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-slate-900/40 border-white/20 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center border border-white/20 relative overflow-hidden">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight font-mono">JASPER</h1>
                <p className="text-xs text-gray-300 font-mono">AI-POWERED OVERSIGHT</p>
              </div>
            </div>
            <CardTitle className="text-2xl font-mono text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-300">
              Register for The Eye of Jasper system. Choose your role and provide your details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-mono flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address *</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-800/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white font-mono flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Full Name *</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-slate-800/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-white font-mono flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Company/Organization</span>
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Government of Alberta (optional)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-slate-800/20 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-mono flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Role *</span>
                </Label>
                <Select value={role} onValueChange={(value: 'admin' | 'contractor') => setRole(value)}>
                  <SelectTrigger className="bg-slate-800/20 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl">
                    <SelectItem value="contractor" className="text-white hover:bg-white/10">
                      Contractor
                    </SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-white/10">
                      Government of Alberta Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">
                  {role === 'admin' 
                    ? 'Admin users can manage accounts and view all reports' 
                    : 'Contractor users can submit reports and view their analytics'
                  }
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border border-white/20 hover:border-white/40 transition-all duration-300 font-mono group relative overflow-hidden"
              >
                <User className="w-4 h-4 mr-2" />
                {isLoading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400 mb-4">
                Already have an account?{" "}
                <Link to="/auth" className="text-blue-400 hover:text-blue-300 underline">
                  Sign in here
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
