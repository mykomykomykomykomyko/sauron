
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, Calendar, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionsProps {
  onExport: () => void;
  onShowFilterDialog: () => void;
  onScheduleReport: () => void;
}

export const QuickActions = ({ onExport, onShowFilterDialog, onScheduleReport }: QuickActionsProps) => {
  return (
    <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white font-mono flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link to="/submit" className="block">
          <Button className="w-full justify-start bg-gradient-to-r from-red-600/20 to-purple-600/20 border border-red-500/30 text-white hover:from-red-600/30 hover:to-purple-600/30 font-mono">
            <Plus className="w-4 h-4 mr-2" />
            Submit New Report
          </Button>
        </Link>
        <Button 
          onClick={onExport}
          variant="outline" 
          className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 font-mono"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
        <Button 
          onClick={onShowFilterDialog}
          variant="outline" 
          className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 font-mono"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
        <Button 
          onClick={onScheduleReport}
          variant="outline" 
          className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 font-mono"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Report
        </Button>
      </CardContent>
    </Card>
  );
};
