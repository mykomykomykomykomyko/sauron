
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Calendar, Edit, Plus, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Report, AnalysisResult } from "@/services/supabaseService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ContractorDashboardProps {
  reports: (Report & { analysis_results: AnalysisResult[] })[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ContractorDashboard = ({ reports, isLoading, onRefresh }: ContractorDashboardProps) => {
  const [selectedReport, setSelectedReport] = useState<(Report & { analysis_results: AnalysisResult[] }) | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'validated':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'pending':
      case 'review':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
      case 'flagged':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'validated':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
      case 'review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
      case 'flagged':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleUpdateReport = async () => {
    if (!selectedReport || !updateText.trim()) {
      toast.error("Please enter an update");
      return;
    }

    setIsUpdating(true);
    try {
      const updatedDescription = `${selectedReport.description || selectedReport.report}

--- UPDATE ---
${updateText.trim()}`;

      const { error } = await supabase
        .from('reports')
        .update({
          description: updatedDescription,
          report: updatedDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedReport.id);

      if (error) throw error;

      toast.success("Report updated successfully!");
      setShowUpdateDialog(false);
      setUpdateText("");
      setSelectedReport(null);
      onRefresh();
    } catch (error: any) {
      console.error('Error updating report:', error);
      toast.error("Failed to update report");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white font-mono">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/5 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white font-mono flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>My Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => {
                const reportStatus = report.analysis_results?.[0]?.status || report.status || 'pending';
                
                return (
                  <Card key={report.id} className="bg-black/20 border-white/10 hover:border-white/30 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-1">
                            {report.title || report.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{report.created_at && format(new Date(report.created_at), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>Category: {report.category || report.project}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(reportStatus)}
                          <Badge className={getStatusColor(reportStatus)}>
                            {formatStatus(reportStatus)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-300">
                          Priority: <span className="text-white">{report.priority || 'medium'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => setSelectedReport(report)}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
                          >
                            View Details
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedReport(report);
                              setShowUpdateDialog(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-white font-mono mb-2">No Reports Yet</h3>
              <p className="text-gray-400 mb-6">Submit your first progress report to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      {selectedReport && !showUpdateDialog && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="bg-black/90 border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-mono flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-400" />
                <span>Report Details</span>
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Your submitted report information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-mono text-red-400 mb-1">TITLE</h4>
                  <p className="text-white">{selectedReport.title || selectedReport.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-mono text-red-400 mb-1">STATUS</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedReport.analysis_results?.[0]?.status || selectedReport.status || 'pending')}
                    <Badge className={getStatusColor(selectedReport.analysis_results?.[0]?.status || selectedReport.status || 'pending')}>
                      {formatStatus(selectedReport.analysis_results?.[0]?.status || selectedReport.status || 'pending')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-mono text-red-400 mb-1">CATEGORY</h4>
                  <p className="text-white">{selectedReport.category || selectedReport.project}</p>
                </div>
                <div>
                  <h4 className="text-sm font-mono text-red-400 mb-1">PRIORITY</h4>
                  <p className="text-white">{selectedReport.priority || 'medium'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-mono text-red-400 mb-1">SUBMITTED</h4>
                  <p className="text-white">
                    {selectedReport.created_at && format(new Date(selectedReport.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-red-400 mb-2">REPORT CONTENT</h4>
                <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                  <pre className="text-white whitespace-pre-wrap text-sm leading-relaxed font-mono">
                    {selectedReport.description || selectedReport.report}
                  </pre>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Report Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-mono flex items-center space-x-2">
              <Edit className="w-5 h-5 text-green-400" />
              <span>Update Report</span>
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Add additional information or updates to your report
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="update" className="text-white font-mono">Additional Information</Label>
              <Textarea
                id="update"
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                placeholder="Add any additional details, clarifications, or updates to your report..."
                rows={6}
                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none mt-2"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => {
                  setShowUpdateDialog(false);
                  setUpdateText("");
                }}
                variant="outline"
                className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateReport}
                disabled={isUpdating || !updateText.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-mono"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isUpdating ? "Updating..." : "Add Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
