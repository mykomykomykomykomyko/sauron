
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data for demonstration
  const reports = [
    {
      id: 1,
      name: "Alex Chen",
      project: "Project Alpha",
      week: "2024-01-15",
      score: 8.5,
      status: "validated",
      flags: 0,
      summary: "Completed user authentication system with OAuth integration"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      project: "Project Beta",
      week: "2024-01-15",
      score: 6.2,
      status: "review",
      flags: 2,
      summary: "Infrastructure improvements and performance optimizations"
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      project: "Project Gamma",
      week: "2024-01-15",
      score: 9.1,
      status: "validated",
      flags: 0,
      summary: "API development with comprehensive testing suite"
    },
    {
      id: 4,
      name: "Emma Thompson",
      project: "Project Delta",
      week: "2024-01-15",
      score: 4.8,
      status: "flagged",
      flags: 4,
      summary: "General development work and bug fixes"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "review":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "flagged":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
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

  const avgScore = reports.reduce((sum, report) => sum + report.score, 0) / reports.length;
  const totalFlags = reports.reduce((sum, report) => sum + report.flags, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SAURON</span>
          </div>
        </Link>
        <Link to="/submit">
          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
            Submit Report
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="px-6 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Oversight Dashboard
            </h1>
            <p className="text-xl text-slate-300">
              Real-time contractor performance and validation insights
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Reports</p>
                    <p className="text-3xl font-bold text-white">{reports.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Average Score</p>
                    <p className="text-3xl font-bold text-white">{avgScore.toFixed(1)}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Red Flags</p>
                    <p className="text-3xl font-bold text-white">{totalFlags}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Validated</p>
                    <p className="text-3xl font-bold text-white">
                      {reports.filter(r => r.status === "validated").length}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports Table */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-white">{report.name}</h3>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400">{report.project}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400">{report.week}</span>
                      </div>
                      <p className="text-slate-300 text-sm">{report.summary}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{report.score}</p>
                        <p className="text-xs text-slate-400">SAURON Score</p>
                      </div>
                      {report.flags > 0 && (
                        <div className="text-right">
                          <p className="text-red-400 font-semibold">{report.flags}</p>
                          <p className="text-xs text-slate-400">Flags</p>
                        </div>
                      )}
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="capitalize">{report.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
