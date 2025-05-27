
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Zap, ArrowRight, Github, Database, Brain } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 md:p-8 border-b border-neutral-800/50 backdrop-blur-xl bg-black/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/lovable-uploads/dd588e4a-8e97-4a25-b069-daa5e68dca1d.png" 
              alt="The Eye of Sauron Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-mono">THE EYE OF SAURON</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/submit">
            <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-neutral-900/50 border border-transparent hover:border-neutral-700 transition-all duration-300">
              Submit Report
            </Button>
          </Link>
        </div>
      </nav>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-800/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-neutral-800/50 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-neutral-800/50 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 md:px-8 py-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm mb-8">
            <Brain className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm text-neutral-300 font-mono">AI-Powered Report Analysis</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-8 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              THE EYE OF SAURON
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-neutral-400 mb-6 leading-relaxed max-w-4xl mx-auto font-light">
            Efficient Yielding Engagement Optimized For Structured Assignments, Urgent Responsibilities, Ongoing Needs
          </p>
          
          <p className="text-lg text-neutral-500 mb-16 leading-relaxed max-w-3xl mx-auto">
            Analyze progress reports with AI-powered insights for better project understanding.
            <br />
            <span className="text-red-400">Clear analysis. Structured feedback. Enhanced productivity.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/submit">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white border-0 px-8 py-4 text-lg font-medium shadow-lg shadow-red-900/30 hover:shadow-red-900/50 transition-all duration-300 group">
                Submit Your Report
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-6 md:px-8 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-mono tracking-tight">
              Enhanced Analysis
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Advanced AI analysis that provides structured feedback and insights on project reports
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-neutral-900/50 to-neutral-900/20 border border-neutral-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-red-900/30 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <Shield className="w-12 h-12 text-red-500 mb-8 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold text-white mb-4 font-mono">Intelligent Analysis</h3>
                <p className="text-neutral-400 leading-relaxed text-lg">
                  AI-powered report analysis with detailed scoring and structured feedback for improvement.
                </p>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-neutral-900/50 to-neutral-900/20 border border-neutral-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-red-900/30 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <TrendingUp className="w-12 h-12 text-red-500 mb-8 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold text-white mb-4 font-mono">Progress Insights</h3>
                <p className="text-neutral-400 leading-relaxed text-lg">
                  Generate comprehensive dashboards with analytics and strategic recommendations.
                </p>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-neutral-900/50 to-neutral-900/20 border border-neutral-800/50 rounded-2xl p-8 backdrop-blur-sm hover:border-red-900/30 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <Zap className="w-12 h-12 text-red-500 mb-8 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold text-white mb-4 font-mono">Smart Feedback</h3>
                <p className="text-neutral-400 leading-relaxed text-lg">
                  Receive actionable insights and suggestions to enhance project reporting quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Preview */}
      <section className="relative px-6 md:px-8 py-32 border-t border-neutral-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
              Seamless Integration
            </h2>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Connect with your existing project workflow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border border-neutral-800/50 bg-neutral-900/20 backdrop-blur-sm">
              <Github className="w-16 h-16 text-neutral-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3 font-mono">Development Integration</h3>
              <p className="text-neutral-400">Connect with development platforms</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl border border-neutral-800/50 bg-neutral-900/20 backdrop-blur-sm">
              <Database className="w-16 h-16 text-neutral-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3 font-mono">Data Analytics</h3>
              <p className="text-neutral-400">Real-time performance metrics</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl border border-neutral-800/50 bg-neutral-900/20 backdrop-blur-sm">
              <Brain className="w-16 h-16 text-neutral-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3 font-mono">AI Analysis</h3>
              <p className="text-neutral-400">Intelligent report processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 md:px-8 py-32 text-center border-t border-neutral-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-mono tracking-tight">
            Ready to Deploy?
          </h2>
          <p className="text-xl text-neutral-400 mb-16 leading-relaxed">
            Join organizations using advanced AI analysis to enhance project reporting and insights.
          </p>
          <Link to="/submit">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white border-0 px-12 py-6 text-xl font-medium shadow-lg shadow-red-900/30 hover:shadow-red-900/50 transition-all duration-300 group">
              Get Started Now
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 px-6 md:px-8 py-16 bg-neutral-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-6 h-6 flex items-center justify-center">
              <img 
                src="/lovable-uploads/dd588e4a-8e97-4a25-b069-daa5e68dca1d.png" 
                alt="The Eye of Sauron Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-white font-mono">THE EYE OF SAURON</span>
          </div>
          <p className="text-neutral-500 text-sm font-mono">
            © 2024 THE EYE OF SAURON. Efficient Yielding Engagement Optimized For Structured Assignments, Urgent Responsibilities, Ongoing Needs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
