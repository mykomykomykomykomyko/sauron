
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Shield, Users, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-800 animate-fade-in">
        <div className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-red-900 to-red-800 rounded-lg flex items-center justify-center border border-red-800/30 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/20">
            <Eye className="w-5 h-5 text-white group-hover:animate-pulse" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-mono group-hover:text-red-400 transition-colors duration-300">SAURON</span>
        </div>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="/submit">
                <Button className="hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20">
                  Submit Report
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline" className="hover:scale-105 transition-all duration-200">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button className="hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20">
                  Sign In
                </Button>
              </Link>
              <Link to="/submit">
                <Button className="hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20">
                  Submit Report
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-red-600 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-red-500 rounded-full animate-ping opacity-15"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-red-400 rounded-full animate-pulse opacity-20"></div>
      </div>

      {/* Hero Section */}
      <div className="px-6 md:px-8 py-24 relative">
        <div className="max-w-6xl mx-auto text-center">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight font-mono animate-fade-in">
              <span className="inline-block hover:scale-110 hover:text-red-400 transition-all duration-500 cursor-default">S</span>
              <span className="inline-block hover:scale-110 hover:text-red-400 transition-all duration-500 cursor-default" style={{animationDelay: '0.1s'}}>A</span>
              <span className="inline-block hover:scale-110 hover:text-red-400 transition-all duration-500 cursor-default" style={{animationDelay: '0.2s'}}>U</span>
              <span className="inline-block hover:scale-110 hover:text-red-400 transition-all duration-500 cursor-default" style={{animationDelay: '0.3s'}}>R</span>
              <span className="inline-block hover:scale-110 hover:text-red-400 transition-all duration-500 cursor-default" style={{animationDelay: '0.4s'}}>O</span>
              <span className="inline-block hover:scale-110 hover:text-red-400 transition-all duration-500 cursor-default" style={{animationDelay: '0.5s'}}>N</span>
            </h1>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-red-500/10 to-red-900/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.3s'}}>
            The all-seeing progress report management system. Submit, track, and analyze team progress with intelligent oversight.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <Link to="/submit">
              <Button size="lg" className="px-8 py-4 text-lg transition-all duration-300 hover:scale-105 font-mono group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                <FileText className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Submit Report</span>
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" className="px-8 py-4 text-lg transition-all duration-300 hover:scale-105 font-mono group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                <Shield className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Access Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-red-500/10 group animate-fade-in" style={{animationDelay: '0.9s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white font-mono">
                  <FileText className="w-6 h-6 text-red-500 group-hover:animate-pulse transition-all duration-300" />
                  <span className="group-hover:text-red-400 transition-colors duration-300">Easy Reporting</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                  Submit detailed progress reports with a clean, intuitive interface. Track your weekly accomplishments and challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-red-500/10 group animate-fade-in" style={{animationDelay: '1.2s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white font-mono">
                  <Users className="w-6 h-6 text-red-500 group-hover:animate-pulse transition-all duration-300" />
                  <span className="group-hover:text-red-400 transition-colors duration-300">Role-Based Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                  Contractors submit and view their own reports, while admins have full oversight and management capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-red-500/10 group animate-fade-in" style={{animationDelay: '1.5s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white font-mono">
                  <Bell className="w-6 h-6 text-red-500 group-hover:animate-pulse transition-all duration-300" />
                  <span className="group-hover:text-red-400 transition-colors duration-300">Smart Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                  Receive timely notifications about report deadlines and requirements. Stay on top of your reporting schedule.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed bottom-10 right-10 pointer-events-none">
        <div className="w-4 h-4 bg-red-500/20 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
      </div>
      <div className="fixed bottom-20 right-20 pointer-events-none">
        <div className="w-2 h-2 bg-red-400/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>
      <div className="fixed bottom-16 right-32 pointer-events-none">
        <div className="w-3 h-3 bg-red-600/15 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default Index;
