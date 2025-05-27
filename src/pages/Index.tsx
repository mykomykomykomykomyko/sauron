
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, BarChart3, Shield, Users, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-900 to-red-800 rounded-lg flex items-center justify-center border border-red-800/30">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-mono">SAURON</span>
        </div>
        <div className="flex space-x-4">
          <Link to="/auth">
            <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-900">
              Sign In
            </Button>
          </Link>
          <Link to="/submit">
            <Button className="bg-red-900 hover:bg-red-800 text-white border border-red-800/30">
              Submit Report
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 md:px-8 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight font-mono">
            SAURON
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-3xl mx-auto">
            The all-seeing progress report management system. Submit, track, and analyze team progress with intelligent oversight.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link to="/submit">
              <Button size="lg" className="bg-red-900 hover:bg-red-800 text-white px-8 py-4 text-lg border border-red-800/30 transition-all duration-200 hover:scale-[1.02] font-mono">
                <FileText className="w-5 h-5 mr-2" />
                Submit Report
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-900 px-8 py-4 text-lg transition-all duration-200 hover:scale-[1.02] font-mono">
                <Shield className="w-5 h-5 mr-2" />
                Access Dashboard
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white font-mono">
                  <FileText className="w-6 h-6 text-red-500" />
                  <span>Easy Reporting</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">
                  Submit detailed progress reports with a clean, intuitive interface. Track your weekly accomplishments and challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white font-mono">
                  <Users className="w-6 h-6 text-red-500" />
                  <span>Role-Based Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">
                  Contractors submit and view their own reports, while admins have full oversight and management capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white font-mono">
                  <Bell className="w-6 h-6 text-red-500" />
                  <span>Smart Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">
                  Receive timely notifications about report deadlines and requirements. Stay on top of your reporting schedule.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
