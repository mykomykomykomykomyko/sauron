
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, ArrowLeft, LogIn, Loader2, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        toast.success("Logged in successfully!");
        navigate('/dashboard');
      } else {
        // Forgot password functionality
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth`,
        });

        if (error) throw error;
        toast.success("Password reset email sent! Check your inbox.");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-800">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5 text-neutral-400" />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-900 to-red-800 rounded-lg flex items-center justify-center border border-red-800/30">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight font-mono">SAURON</span>
          </div>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="px-6 md:px-8 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight font-mono">
              {isLogin ? 'Sign In' : 'Reset Password'}
            </h1>
            <p className="text-neutral-400">
              {isLogin ? 'Access the SAURON system' : 'Enter your email to reset your password'}
            </p>
          </div>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white font-mono">
                {isLogin ? 'Login' : 'Forgot Password'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-300 font-mono">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@company.com"
                    className="bg-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-red-500"
                    required
                  />
                </div>

                {isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-neutral-300 font-mono">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      className="bg-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-red-500"
                      required
                      minLength={6}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 font-mono"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isLogin ? 'Signing In...' : 'Sending Reset Email...'}
                    </>
                  ) : (
                    <>
                      {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <KeyRound className="w-4 h-4 mr-2" />}
                      {isLogin ? 'Sign In' : 'Send Reset Email'}
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-neutral-400 hover:text-white transition-colors font-mono text-sm"
                  >
                    {isLogin ? "Forgot your password?" : "Back to sign in"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
