import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, ArrowLeft, TrendingUp, Download, CheckCircle, Clock, Users, LogOut, WandSparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getReportsWithAnalysis, exportReportsAsCSV, updateAnalysisStatus, triggerAIAnalysis } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ReportWithAnalysis {
  id?: string;
  name: string;
  project: string;
  week: string;
  email: string;
  report: string;
  created_at?: string;
  analysis_results: Array<{
    id?: string;
    score: number;
    status: string;
    flags: number;
    summary: string;
  }>;
}

const Dashboard = () => {
  const [reports, setReports] = useState<ReportWithAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingReports, setAnalyzingReports] = useState<Set<string>>(new Set());
  const [selectedReport, setSelectedReport] = useState<ReportWithAnalysis | null>(null);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole !== 'admin') {
      navigate('/submit');
      return;
    }

    const fetchReports = async () => {
      try {
        const data = await getReportsWithAnalysis();
        setReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user, userRole, navigate]);

  const handleExportCSV = async () => {
    try {
      const csvContent = await exportReportsAsCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reports_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Reports exported successfully!");
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error("Failed to export reports");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      await updateAnalysisStatus(reportId, newStatus as 'validated' | 'review' | 'flagged' | 'pending');
      
      // Update the local state immediately for better UX
      setReports(prev => prev.map(report => {
        if (report.id === reportId) {
          return {
            ...report,
            analysis_results: report.analysis_results.map(analysis => ({
              ...analysis,
              status: newStatus
            }))
          };
        }
        return report;
      }));
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };

  const handleAIAnalysis = async (reportId: string) => {
    if (!reportId) {
      toast.error("Invalid report ID");
      return;
    }

    setAnalyzingReports(prev => new Set([...prev, reportId]));
    
    try {
      await triggerAIAnalysis(reportId);
      
      // Refresh the reports data to get the updated analysis
      const updatedData = await getReportsWithAnalysis();
      setReports(updatedData || []);
      
      toast.success("AI analysis completed successfully!");
    } catch (error) {
      console.error('Error analyzing report:', error);
      toast.error("Failed to analyze report with AI");
    } finally {
      setAnalyzingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "text-green-400 bg-green-900/20 border-green-800/30";
      case "review":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-800/30";
      case "flagged":
        return "text-red-400 bg-red-900/20 border-red-800/30";
      default:
        return "text-blue-400 bg-blue-900/20 border-blue-800/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle className="w-4 h-4" />;
      case "review":
        return <Clock className="w-4 h-4" />;
      case "flagged":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const totalReports = reports.length;
  const uniqueProjects = new Set(reports.map(r => r.project)).size;
  const uniqueUsers = new Set(reports.map(r => r.email)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-800">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5 text-neutral-400" />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-900 to-red-800 rounded-lg flex items-center justify-center border border-red-800/30">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight font-mono">SAURON</span>
          </div>
        </Link>
        <div className="flex space-x-4">
          <Button
            onClick={handleExportCSV}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Link to="/submit">
            <Button>
              Submit Report
            </Button>
          </Link>
          <Button
            onClick={handleSignOut}
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-6 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight font-mono">
              Admin Dashboard
            </h1>
            <p className="text-xl text-neutral-400">
              Manage and review submitted progress reports
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm font-mono">Total Reports</p>
                    <p className="text-3xl font-bold text-white font-mono">{totalReports}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm font-mono">Active Projects</p>
                    <p className="text-3xl font-bold text-white font-mono">{uniqueProjects}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm font-mono">Active Users</p>
                    <p className="text-3xl font-bold text-white font-mono">{uniqueUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm font-mono">This Week</p>
                    <p className="text-3xl font-bold text-white font-mono">
                      {reports.filter(r => {
                        const weekDate = new Date(r.week);
                        const now = new Date();
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return weekDate >= weekAgo;
                      }).length}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports Table */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="border-b border-neutral-800">
              <CardTitle className="text-2xl text-white font-mono">All Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {reports.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-neutral-400 text-lg mb-4">No reports submitted yet</p>
                  <Link to="/submit">
                    <Button>
                      Submit First Report
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-0">
                  {reports.map((report, index) => {
                    const analysis = report.analysis_results[0];
                    const status = analysis?.status || 'pending';
                    const isAnalyzing = analyzingReports.has(report.id!);
                    return (
                      <div
                        key={report.id}
                        className={`flex items-center justify-between p-6 hover:bg-neutral-800/50 transition-colors ${
                          index !== reports.length - 1 ? 'border-b border-neutral-800' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="font-semibold text-white font-mono">{report.name}</h3>
                            <span className="text-neutral-600">•</span>
                            <span className="text-neutral-400 font-mono text-sm">{report.email}</span>
                            <span className="text-neutral-600">•</span>
                            <span className="text-neutral-400 font-mono text-sm">{report.project}</span>
                            <span className="text-neutral-600">•</span>
                            <span className="text-neutral-400 font-mono text-sm">{report.week}</span>
                          </div>
                          <p className="text-neutral-300 text-sm line-clamp-2">
                            {report.report.substring(0, 150)}...
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-neutral-400 text-xs font-mono">
                              {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'Unknown'}
                            </p>
                            <p className="text-xs text-neutral-500 font-mono">Submitted</p>
                          </div>
                          
                          {/* AI Analysis Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAIAnalysis(report.id!)}
                            disabled={isAnalyzing}
                            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-800/30 hover:from-purple-900/30 hover:to-blue-900/30"
                          >
                            <WandSparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                          </Button>
                          
                          {/* Status Selector */}
                          <Select value={status} onValueChange={(value) => handleStatusChange(report.id!, value)}>
                            <SelectTrigger className={`w-32 h-8 text-xs border ${getStatusColor(status)} bg-transparent`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-700">
                              <SelectItem value="pending" className="text-blue-400">Pending</SelectItem>
                              <SelectItem value="review" className="text-yellow-400">Review</SelectItem>
                              <SelectItem value="validated" className="text-green-400">Validated</SelectItem>
                              <SelectItem value="flagged" className="text-red-400">Flagged</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* View Full Report Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedReport(report)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-neutral-900 border-neutral-700">
                              <DialogHeader>
                                <DialogTitle className="text-white font-mono">
                                  Full Report - {report.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-neutral-400 font-mono">Project:</span>
                                    <span className="text-white ml-2">{report.project}</span>
                                  </div>
                                  <div>
                                    <span className="text-neutral-400 font-mono">Week:</span>
                                    <span className="text-white ml-2">{report.week}</span>
                                  </div>
                                  <div>
                                    <span className="text-neutral-400 font-mono">Email:</span>
                                    <span className="text-white ml-2">{report.email}</span>
                                  </div>
                                  <div>
                                    <span className="text-neutral-400 font-mono">Status:</span>
                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-neutral-400 font-mono mb-2">Report Content:</h4>
                                  <div className="bg-neutral-800 p-4 rounded-lg">
                                    <p className="text-white whitespace-pre-wrap">{report.report}</p>
                                  </div>
                                </div>
                                {analysis && (
                                  <div>
                                    <h4 className="text-neutral-400 font-mono mb-2">Analysis Summary:</h4>
                                    <div className="bg-neutral-800 p-4 rounded-lg">
                                      <p className="text-white">{analysis.summary}</p>
                                      <div className="mt-2 flex items-center space-x-4 text-sm">
                                        <span className="text-neutral-400">Score: <span className="text-white">{analysis.score}</span></span>
                                        <span className="text-neutral-400">Flags: <span className="text-white">{analysis.flags}</span></span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
