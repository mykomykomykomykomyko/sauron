
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Activity } from "lucide-react";
import { format } from "date-fns";
import { Report, AnalysisResult } from "@/services/supabaseService";

interface RecentActivityProps {
  reports: (Report & { analysis_results: AnalysisResult[] })[];
  isLoading: boolean;
  onReportClick: (report: Report & { analysis_results: AnalysisResult[] }) => void;
  getScoreColor: (score: number) => string;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  formatStatus: (status: string) => string;
}

export const RecentActivity = ({ 
  reports, 
  isLoading, 
  onReportClick, 
  getScoreColor, 
  getPriorityColor, 
  getStatusColor, 
  formatStatus 
}: RecentActivityProps) => {
  if (isLoading) {
    return (
      <Card className="lg:col-span-2 bg-black/40 border-white/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white font-mono flex items-center space-x-2">
            <Activity className="w-5 h-5 text-red-400" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Latest reports and AI analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 bg-black/40 border-white/20 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white font-mono flex items-center space-x-2">
          <Activity className="w-5 h-5 text-red-400" />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription className="text-gray-300">
          Latest reports and AI analysis results
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reports && reports.length > 0 ? (
          <div className="space-y-4">
            {reports.slice(0, 5).map((report) => (
              <div 
                key={report.id} 
                className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10 hover:border-white/20 transition-colors group cursor-pointer"
                onClick={() => onReportClick(report)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{report.title || report.name}</div>
                    <div className="text-gray-400 text-xs">
                      {report.created_at && format(new Date(report.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {report.analysis_results[0] && (
                    <Badge className={`text-xs ${getScoreColor(report.analysis_results[0].score)} bg-white/10`}>
                      AI: {report.analysis_results[0].score}/1000
                    </Badge>
                  )}
                  <Badge className={`text-xs ${getPriorityColor(report.priority || 'low')}`}>
                    {report.priority || 'low'}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(report.status || 'pending')}`}>
                    {formatStatus(report.status || 'pending')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No reports found. Create your first report to get started.</p>
            <div className="text-xs text-gray-500 mt-2">
              If you've created reports but don't see them here, check the browser console for debugging info.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
