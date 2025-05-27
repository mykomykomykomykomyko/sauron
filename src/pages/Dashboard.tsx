
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getReportsWithAnalysis } from "@/services/supabaseService";
import { toast } from "sonner";

interface ReportWithAnalysis {
  id: string;
  name: string;
  project: string;
  week: string;
  created_at: string;
  analysis_results: Array<{
    score: number;
    status: string;
    flags: number;
    summary: string;
  }>;
}

const Dashboard = () => {
  const [reports, setReports] = useState<ReportWithAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "text-green-400 bg-green-900/20 border-green-800/30";
      case "review":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-800/30";
      case "flagged":
        return "text-red-400 bg-red-900/20 border-red-800/30";
      default:
        return "text-neutral-400 bg-neutral-900/20 border-neutral-800/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle className="w-4 h-4" />;
      case "review":
        return <Clock className="w-4 h-4" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const avgScore = reports.length > 0 
    ? reports.reduce((sum, report) => {
        const analysis = report.analysis_results[0];
        return sum + (analysis?.score || 0);
      }, 0) / reports.length 
    : 0;

  const totalFlags = reports.reduce((sum, report) => {
    const analysis = report.analysis_results[0];
    return sum + (analysis?.flags || 0);
  }, 0);

  const validatedCount = reports.filter(report => {
    const analysis = report.analysis_results[0];
    return analysis?.status === "validated";
  }).length;

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
        <Link to="/submit">
          <Button className="bg-red-900 hover:bg-red-800 text-white border border-red-800/30">
            Submit Report
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="px-6 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight font-mono">
              Analysis Dashboard
            </h1>
            <p className="text-xl text-neutral-400">
              AI-powered insights and performance analytics
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm font-mono">Total Reports</p>
                    <p className="text-3xl font-bold text-white font-mono">{reports.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm font-mono">Average Score</p>
                    <p className="text-3xl font-bold text-white font-mono">{avgScore.toFixed(1)}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm font-mono">Issues Found</p>
                    <p className="text-3xl font-bold text-white font-mono">{totalFlags}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800 hover:bg-neutral-800/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm font-mono">Validated</p>
                    <p className="text-3xl font-bold text-white font-mono">{validatedCount}</p>
                  </div>
                  <Eye className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports Table */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="border-b border-neutral-800">
              <CardTitle className="text-2xl text-white font-mono">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {reports.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-neutral-400 text-lg mb-4">No reports submitted yet</p>
                  <Link to="/submit">
                    <Button className="bg-red-900 hover:bg-red-800 text-white">
                      Submit First Report
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-0">
                  {reports.map((report, index) => {
                    const analysis = report.analysis_results[0];
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
                            <span className="text-neutral-400 font-mono text-sm">{report.project}</span>
                            <span className="text-neutral-600">•</span>
                            <span className="text-neutral-400 font-mono text-sm">{report.week}</span>
                          </div>
                          <p className="text-neutral-300 text-sm">
                            {analysis?.summary || "Analysis pending..."}
                          </p>
                        </div>
                        <div className="flex items-center space-x-6">
                          {analysis && (
                            <>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-white font-mono">{analysis.score}</p>
                                <p className="text-xs text-neutral-400 font-mono">SAURON Score</p>
                              </div>
                              {analysis.flags > 0 && (
                                <div className="text-right">
                                  <p className="text-red-400 font-semibold font-mono">{analysis.flags}</p>
                                  <p className="text-xs text-neutral-400 font-mono">Flags</p>
                                </div>
                              )}
                              <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 font-mono ${getStatusColor(analysis.status)}`}>
                                {getStatusIcon(analysis.status)}
                                <span className="capitalize">{analysis.status}</span>
                              </div>
                            </>
                          )}
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
