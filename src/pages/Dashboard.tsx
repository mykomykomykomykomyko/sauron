
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

  const avgScore = reports.reduce((sum, report) => sum + report.score, 0) / reports.length;
  const totalFlags = reports.reduce((sum, report) => sum + report.flags, 0);

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
              Oversight Dashboard
            </h1>
            <p className="text-xl text-neutral-400">
              Real-time contractor performance and validation insights
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
                    <p className="text-neutral-400 text-sm font-mono">Red Flags</p>
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
                    <p className="text-3xl font-bold text-white font-mono">
                      {reports.filter(r => r.status === "validated").length}
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
              <CardTitle className="text-2xl text-white font-mono">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {reports.map((report, index) => (
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
                      <p className="text-neutral-300 text-sm">{report.summary}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white font-mono">{report.score}</p>
                        <p className="text-xs text-neutral-400 font-mono">SAURON Score</p>
                      </div>
                      {report.flags > 0 && (
                        <div className="text-right">
                          <p className="text-red-400 font-semibold font-mono">{report.flags}</p>
                          <p className="text-xs text-neutral-400 font-mono">Flags</p>
                        </div>
                      )}
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 font-mono ${getStatusColor(report.status)}`}>
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
