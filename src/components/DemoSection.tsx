
import { Card, CardContent } from "@/components/ui/card";
import { Brain, CheckCircle } from "lucide-react";

const DemoSection = () => {
  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold font-mono mb-4">
          EXPERIENCE THE <span className="text-red-400">POWER</span>
        </h2>
        <p className="text-gray-400 font-mono">See how The Eye analyzes and validates reports in real-time</p>
      </div>

      <Card className="bg-black/40 border-white/10 hover:border-red-500/30 transition-all duration-500 group">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 font-mono">AI-Powered Analysis</h3>
              <p className="text-gray-400 mb-6 font-mono">
                Watch as our advanced neural networks process contractor submissions, 
                validate quality standards, and generate intelligent insights in milliseconds.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 font-mono">Quality validation checks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 font-mono">Anomaly detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 font-mono">Performance insights</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-lg p-6 border border-white/10">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <span className="text-white font-mono">Neural Analysis Active</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="bg-black/40 rounded p-3 border-l-4 border-blue-500">
                    <div className="text-blue-400 text-sm font-mono">Processing Report #24601</div>
                    <div className="text-gray-300 text-xs font-mono">Quality Score: 94.7%</div>
                  </div>
                  <div className="bg-black/40 rounded p-3 border-l-4 border-green-500">
                    <div className="text-green-400 text-sm font-mono">Validation Complete</div>
                    <div className="text-gray-300 text-xs font-mono">Status: Approved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoSection;
