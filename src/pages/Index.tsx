
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Shield, TrendingUp, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-900 to-red-800 rounded-lg flex items-center justify-center border border-red-800/30">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-mono">SAURON</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/submit">
            <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-neutral-900 transition-all duration-200">
              Submit Report
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="bg-red-900 hover:bg-red-800 text-white border border-red-800/30 transition-all duration-200">
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-8 py-24 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-none">
            System for Assessment Using
            <span className="block text-red-500 mt-4">
              Real-time Oversight
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 mb-16 leading-relaxed max-w-4xl mx-auto">
            AI-powered contractor oversight that validates progress reports against real-world data.
            <br />
            <span className="text-red-400">No more vague claims. No more inflated reports. Just truth.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/submit">
              <Button size="lg" className="bg-red-900 hover:bg-red-800 text-white border border-red-800/30 px-8 py-4 text-lg transition-all duration-200 hover:scale-105">
                Submit Your Report
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-900 px-8 py-4 text-lg transition-all duration-200 hover:scale-105">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-8 py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-20 font-mono">
            SAURON sees through the noise
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 hover:bg-neutral-800/50 hover:border-red-900/30 transition-all duration-300 group">
              <Shield className="w-12 h-12 text-red-500 mb-8 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-white mb-4 font-mono">Real-time Validation</h3>
              <p className="text-neutral-400 leading-relaxed">
                Cross-reference reports with GitHub commits, PRs, and activity logs for instant credibility scoring.
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 hover:bg-neutral-800/50 hover:border-red-900/30 transition-all duration-300 group">
              <TrendingUp className="w-12 h-12 text-red-500 mb-8 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-white mb-4 font-mono">Performance Analytics</h3>
              <p className="text-neutral-400 leading-relaxed">
                Generate trustworthy dashboards with AI-powered insights and strategic recommendations.
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 hover:bg-neutral-800/50 hover:border-red-900/30 transition-all duration-300 group">
              <Zap className="w-12 h-12 text-red-500 mb-8 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-white mb-4 font-mono">Instant Detection</h3>
              <p className="text-neutral-400 leading-relaxed">
                Detect vague, inflated, or false claims with advanced AI analysis and red flag alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-8 py-24 text-center border-t border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-mono">
            Ready to bring clarity to your team?
          </h2>
          <p className="text-xl text-neutral-400 mb-12 leading-relaxed">
            Join forward-thinking organizations using SAURON to maintain accountability and drive results.
          </p>
          <Link to="/submit">
            <Button size="lg" className="bg-red-900 hover:bg-red-800 text-white border border-red-800/30 px-8 py-4 text-lg transition-all duration-200 hover:scale-105">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 px-6 md:px-8 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-red-900 to-red-800 rounded-md flex items-center justify-center border border-red-800/30">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white font-mono">SAURON</span>
          </div>
          <p className="text-neutral-500 text-sm font-mono">
            © 2024 SAURON. System for Assessment Using Real-time Oversight & Navigation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
