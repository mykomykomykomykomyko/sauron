
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Shield, TrendingUp, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">SAURON</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/submit">
            <Button variant="ghost" className="text-white hover:text-orange-400 transition-colors">
              Submit Report
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-8 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            System for Assessment Using
            <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Real-time Oversight
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
            AI-powered contractor oversight that validates progress reports against real-world data.
            <br />
            No more vague claims. No more inflated reports. Just truth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg">
                Submit Your Report
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-slate-400 text-white hover:bg-slate-800 px-8 py-4 text-lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            SAURON sees through the noise
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300">
              <Shield className="w-12 h-12 text-orange-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Real-time Validation</h3>
              <p className="text-slate-400">
                Cross-reference reports with GitHub commits, PRs, and activity logs for instant credibility scoring.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300">
              <TrendingUp className="w-12 h-12 text-orange-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Performance Analytics</h3>
              <p className="text-slate-400">
                Generate trustworthy dashboards with AI-powered insights and strategic recommendations.
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300">
              <Zap className="w-12 h-12 text-orange-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Instant Detection</h3>
              <p className="text-slate-400">
                Detect vague, inflated, or false claims with advanced AI analysis and red flag alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-8 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to bring clarity to your team?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join forward-thinking organizations using SAURON to maintain accountability and drive results.
          </p>
          <Link to="/submit">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 md:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">SAURON</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2024 SAURON. System for Assessment Using Real-time Oversight & Navigation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
