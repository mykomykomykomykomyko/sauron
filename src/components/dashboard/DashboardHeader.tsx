
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, Plus } from "lucide-react";
import { Link } from "react-router-dom";
interface DashboardHeaderProps {
  onRefresh: () => void;
}
export const DashboardHeader = ({
  onRefresh
}: DashboardHeaderProps) => {
  return <nav className="flex items-center justify-between p-4 sm:p-6 md:p-8 border-b border-white/10 backdrop-blur-xl bg-slate-900/30 relative z-10">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
          <Eye className="w-5 h-5 sm:w-7 sm:h-7 text-white relative z-10" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">THE EYE OF JASPER</span>
          <span className="text-xs text-gray-400 font-mono hidden sm:block">OVERSIGHT DASHBOARD</span>
        </div>
      </Link>

      <div className="flex items-center space-x-3">
        <Button onClick={onRefresh} variant="outline" size="sm" className="border-white/20 text-white/90 hover:bg-white/10 font-mono">
          <RefreshCw className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Link to="/submit">
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-mono">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Report</span>
          </Button>
        </Link>
      </div>
    </nav>;
};
