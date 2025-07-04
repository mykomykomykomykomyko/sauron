
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Send, BarChart3, Eye, Rocket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import EyeOfSauron from "./EyeOfSauron";
import LearnMoreDialog from "./LearnMoreDialog";

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
  const [showLearnMore, setShowLearnMore] = useState(false);

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
              onClick={() => setShowLearnMore(true)}
            >
              <Eye className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </>
        )}
      </div>

      <LearnMoreDialog 
        open={showLearnMore} 
        onOpenChange={setShowLearnMore} 
      />
    </div>
  );
};

export default HeroSection;
