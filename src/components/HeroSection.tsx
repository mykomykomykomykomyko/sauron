
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Send, BarChart3, Eye, Rocket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import EyeOfSauron from "./EyeOfSauron";

interface HeroSectionProps {
  isVisible: boolean;
  mousePosition: {
    x: number;
    y: number;
  };
}

const HeroSection = ({
  isVisible,
  mousePosition
}: HeroSectionProps) => {
  const { user } = useAuth();

  const handleLearnMore = () => {
    const explainerWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    if (explainerWindow) {
      explainerWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>JASPER - How It Works</title>
          <style>
            body { 
              font-family: monospace; 
              background: #0f172a; 
              color: #e2e8f0; 
              padding: 20px; 
              margin: 0;
              line-height: 1.6;
            }
            .container { max-width: 700px; margin: 0 auto; }
            h1 { color: #60a5fa; font-size: 2rem; margin-bottom: 1rem; }
            h2 { color: #fbbf24; font-size: 1.5rem; margin-top: 2rem; }
            .step { 
              background: #1e293b; 
              padding: 15px; 
              margin: 15px 0; 
              border-left: 4px solid #f97316; 
              border-radius: 4px;
            }
            .highlight { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔍 JASPER WORKFLOW</h1>
            <p>The all-seeing AI-powered progress report management system</p>
            
            <h2>How It Works:</h2>
            
            <div class="step">
              <strong>1. Contractor Submits</strong><br>
              Field teams submit progress reports from project sites with simple, guided reporting from anywhere in the field.
            </div>
            
            <div class="step">
              <strong>2. AI Processing</strong><br>
              Intelligent analysis extracts insights and validates data with advanced algorithms ensuring quality and consistency.
            </div>
            
            <div class="step">
              <strong>3. Staff Review</strong><br>
              Government teams receive analyzed reports with insights through a streamlined review process with AI-powered recommendations.
            </div>
            
            <div class="step">
              <strong>4. Dashboard Analytics</strong><br>
              Real-time insights and performance tracking for all stakeholders with comprehensive visibility into project progress and trends.
            </div>
            
            <h2>Key Features:</h2>
            <ul>
              <li class="highlight">AI-powered analysis and validation</li>
              <li class="highlight">Real-time progress tracking</li>
              <li class="highlight">Streamlined approval workflows</li>
              <li class="highlight">Comprehensive analytics dashboard</li>
              <li class="highlight">Mobile-friendly field reporting</li>
            </ul>
            
            <p style="margin-top: 2rem; text-align: center;">
              <em>Ready to get started? Close this window and click "Get Started"</em>
            </p>
          </div>
        </body>
        </html>
      `);
      explainerWindow.document.close();
    }
  };

  return (
    <div className={`text-center mb-16 pt-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="mb-8">
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4 font-mono">
          AI-POWERED PROGRESS TRACKING
        </Badge>
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">JASPER</span>
          <br />
          <span className="text-white/80"></span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-mono">
          The all-seeing AI-powered progress report management system. 
          Submit, track, and analyze team progress with intelligent oversight and real-time insights.
        </p>
      </div>

      <EyeOfSauron mousePosition={mousePosition} />

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        {user ? (
          <>
            <Link to="/submit">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-mono">
                <Send className="w-5 h-5 mr-2" />
                Submit Report
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg font-mono">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-mono">
                <ArrowRight className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg font-mono"
              onClick={handleLearnMore}
            >
              <Eye className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
