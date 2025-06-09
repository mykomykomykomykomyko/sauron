
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface LearnMoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LearnMoreDialog = ({ open, onOpenChange }: LearnMoreDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 font-mono text-2xl">
            <Eye className="w-6 h-6 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              JASPER WORKFLOW
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 font-mono">
          <p className="text-lg text-gray-300">
            The all-seeing AI-powered progress report management system
          </p>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-yellow-400">How It Works:</h2>
            
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-4 rounded border-l-4 border-orange-500">
                <div className="font-bold text-white mb-2">1. Contractor Submits</div>
                <p className="text-gray-300">
                  Field teams submit progress reports from project sites with simple, guided reporting from anywhere in the field.
                </p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded border-l-4 border-orange-500">
                <div className="font-bold text-white mb-2">2. AI Processing</div>
                <p className="text-gray-300">
                  Intelligent analysis extracts insights and validates data with advanced algorithms ensuring quality and consistency.
                </p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded border-l-4 border-orange-500">
                <div className="font-bold text-white mb-2">3. Staff Review</div>
                <p className="text-gray-300">
                  Government teams receive analyzed reports with insights through a streamlined review process with AI-powered recommendations.
                </p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded border-l-4 border-orange-500">
                <div className="font-bold text-white mb-2">4. Dashboard Analytics</div>
                <p className="text-gray-300">
                  Real-time insights and performance tracking for all stakeholders with comprehensive visibility into project progress and trends.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-yellow-400">Key Features:</h2>
            <ul className="space-y-2 text-emerald-400">
              <li className="flex items-center space-x-2">
                <span>•</span>
                <span>AI-powered analysis and validation</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>•</span>
                <span>Real-time progress tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>•</span>
                <span>Streamlined approval workflows</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>•</span>
                <span>Comprehensive analytics dashboard</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>•</span>
                <span>Mobile-friendly field reporting</span>
              </li>
            </ul>
          </div>
          
          <div className="text-center pt-4 text-gray-400">
            <em>Ready to get started? Click "Get Started" to begin</em>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreDialog;
