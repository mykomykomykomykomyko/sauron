import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const FinalCTASection = () => {
  const {
    user
  } = useAuth();
  return <div className="text-center py-16 border-t border-white/10">
      <div className="mb-8">
        <h2 className="text-4xl font-bold font-mono mb-4">
          READY TO EXPERIENCE <span className="text-red-400">THE POWER</span>?
        </h2>
        <p className="text-xl text-gray-300 font-mono">Join thousands of teams already using The Eye of Jasper</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        {user ? <>
            <Link to="/submit">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg font-mono">
                <Rocket className="w-5 h-5 mr-2" />
                Start Submitting Reports
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-mono">
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Dashboard
              </Button>
            </Link>
          </> : <Link to="/auth">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4 text-lg font-mono">
              <Rocket className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </Link>}
      </div>

      <p className="text-gray-400 font-mono">JASPER - Advanced Reporting Intelligence System</p>
      <p className="text-gray-600 text-sm font-mono mt-2">
        Powered by AI • Built for Excellence • Designed for Control
      </p>
    </div>;
};
export default FinalCTASection;