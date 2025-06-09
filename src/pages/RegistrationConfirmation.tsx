
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CheckCircle, ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const RegistrationConfirmation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGoToLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden relative flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900 to-indigo-900/40"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-cyan-900/15 via-transparent to-blue-900/20"></div>
      
      {/* Animated mesh gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
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
        <Card className={`bg-slate-900/40 border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center border border-green-400/30 relative overflow-hidden animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-600 to-blue-700 rounded-xl flex items-center justify-center border border-white/20">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight font-mono">JASPER</h1>
                <p className="text-xs text-gray-300 font-mono">AI-POWERED OVERSIGHT</p>
              </div>
            </div>

            <CardTitle className="text-2xl font-mono text-white mb-2">
              Account Confirmed!
            </CardTitle>
            <CardDescription className="text-gray-300">
              Thank you for confirming your account. You can now sign in to access The Eye of Jasper system.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Mail className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-mono font-semibold">Email Verified Successfully</span>
              </div>
              <p className="text-gray-300 text-sm">
                Your email has been confirmed and your account is now active. You can proceed to sign in and start using the system.
              </p>
            </div>

            <Button
              onClick={handleGoToLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border border-white/20 hover:border-white/40 transition-all duration-300 font-mono group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <span className="relative z-10">Go to Login Page</span>
              <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact support or visit our documentation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;
