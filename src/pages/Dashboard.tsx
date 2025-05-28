
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  FileText, 
  TrendingUp, 
  Users, 
  Shield, 
  Brain, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Activity,
  Target,
  Zap,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Calendar,
  Star,
  Award,
  User
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getReportsWithAnalysis, getDashboardStats, downloadCSV, filterReports, getUsersWithReports, Report, AnalysisResult } from "@/services/supabaseService";
import { format } from "date-fns";
import { FilterDialog } from "@/components/FilterDialog";
import { SimpleAccountDialog } from "@/components/SimpleAccountDialog";
import { ReportDetails } from "@/components/ReportDetails";
import { UserProfile } from "@/components/UserProfile";
import { toast } from "sonner";

const Dashboard = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<(Report & { analysis_results: AnalysisResult[] }) | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [filters, setFilters] = useState<{ name?: string; sortBy?: 'date' | 'alphabetical'; sortOrder?: 'asc' | 'desc' }>({});

  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    console.log('Dashboard - Current user:', user);
    console.log('Dashboard - User ID:', user.id);
    console.log('Dashboard - User email:', user.email);
    
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [user, navigate]);

  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ['reportsWithAnalysis', filters],
    queryFn: () => {
      console.log('Dashboard - Fetching reports with filters:', filters);
      return Object.keys(filters).length > 0 ? filterReports(filters) : getReportsWithAnalysis();
    },
    enabled: !!user,
  });

  const { data: usersWithReports = [] } = useQuery({
    queryKey: ['usersWithReports'],
    queryFn: getUsersWithReports,
    enabled: !!user && userRole === 'admin',
  });

  // Add effect to log reports data
  useEffect(() => {
    console.log('Dashboard - Reports data updated:', reports);
    console.log('Dashboard - Number of reports:', reports.length);
    if (reports.length > 0) {
      console.log('Dashboard - Sample reports:', reports.slice(0, 2));
    }
  }, [reports]);

  const { data: dashboardStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    enabled: !!user,
  });

  const handleExport = async () => {
    try {
      await downloadCSV();
      toast.success("Reports exported successfully!");
    } catch (error) {
      toast.error("Failed to export reports");
    }
  };

  const handleScheduleReport = async () => {
    if (user?.email) {
      const { scheduleReportEmail } = await import("@/services/supabaseService");
      await scheduleReportEmail(user.email);
      toast.success("Email client opened with report reminder");
    }
  };

  const handleApplyFilters = (newFilters: { name?: string; sortBy?: 'date' | 'alphabetical'; sortOrder?: 'asc' | 'desc' }) => {
    setFilters(newFilters);
  };

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10,
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const stats = dashboardStats ? [
    { 
      label: "Total Reports", 
      value: dashboardStats.totalReports.toString(), 
      icon: FileText, 
      color: "from-blue-400 to-cyan-400",
      change: "+12%"
    },
    { 
      label: "AI Analysis Rate", 
      value: `${dashboardStats.analysisRate}%`, 
      icon: Brain, 
      color: "from-purple-400 to-pink-400",
      change: "+0.3%"
    },
    { 
      label: "Avg Processing Time", 
      value: dashboardStats.avgProcessingTime, 
      icon: Zap, 
      color: "from-green-400 to-emerald-400",
      change: "-15%"
    },
    { 
      label: "Success Rate", 
      value: `${dashboardStats.successRate}%`, 
      icon: Target, 
      color: "from-red-400 to-orange-400",
      change: "+2.1%"
    }
  ] : [];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/30"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-orange-900/10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-transparent"></div>

      {/* Animated mesh gradient */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Dynamic cursor glow */}
      <div 
        className="fixed w-96 h-96 bg-gradient-radial from-red-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none z-0 transition-all duration-500 hidden md:block"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `linear-gradient(45deg, #ef4444, #8b5cf6, #06b6d4)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: 0.3,
          }}
        />
      ))}

      {/* Header */}
      <nav className="flex items-center justify-between p-4 sm:p-6 md:p-8 border-b border-white/10 backdrop-blur-xl bg-black/30 relative z-10">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 via-purple-600 to-red-700 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
            <Eye className="w-5 h-5 sm:w-7 sm:h-7 text-white relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
              THE EYE OF SAURON
            </span>
            <span className="text-xs text-gray-400 font-mono hidden sm:block">OVERSIGHT DASHBOARD</span>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm" 
            className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Link to="/submit">
            <Button size="sm" className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Report</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Section with Debug Info */}
          <div className={`mb-8 sm:mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl sm:text-5xl font-bold font-mono mb-2 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                  MISSION CONTROL
                </h1>
                <p className="text-gray-300 text-lg">
                  Welcome back, {user?.user_metadata?.full_name || user?.email}. Your oversight dashboard is ready.
                </p>
                {/* Debug info */}
                <div className="mt-2 text-xs text-gray-500">
                  Debug: User ID: {user?.id} | Reports found: {reports.length} | Loading: {isLoading ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-4 py-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-mono text-green-400">SYSTEM ONLINE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {stats.map((stat, index) => (
              <Card key={index} className="bg-black/40 border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 group backdrop-blur-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${stat.color.replace('to-', 'to-').replace('from-', 'from-').replace('-400', '-500/20').replace('-400', '-500/20')} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="text-xs text-green-400 font-mono">
                      {stat.change}
                    </div>
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-mono mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 font-mono">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Dashboard Tabs */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-black/20 border border-white/20 mb-8">
                <TabsTrigger 
                  value="overview" 
                  className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="reports"
                  className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Reports</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="settings"
                  className="font-mono data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  
                  {/* Recent Activity */}
                  <Card className="lg:col-span-2 bg-black/40 border-white/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white font-mono flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-red-400" />
                        <span>{userRole === 'admin' ? 'Contractor Leaderboard' : 'Recent Activity'}</span>
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {userRole === 'admin' ? 'Top performing contractors by average score' : 'Latest reports and AI analysis results'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-white/5 rounded w-1/2"></div>
                            </div>
                          ))}
                        </div>
                      ) : userRole === 'admin' ? (
                        // Admin view - User leaderboard
                        usersWithReports && usersWithReports.length > 0 ? (
                          <div className="space-y-4">
                            {usersWithReports
                              .map(user => {
                                const reportsWithAnalysis = user.reports.filter((r: any) => r.analysis_results.length > 0);
                                const avgScore = reportsWithAnalysis.length > 0 
                                  ? reportsWithAnalysis.reduce((sum: number, r: any) => sum + (r.analysis_results[0]?.score || 0), 0) / reportsWithAnalysis.length 
                                  : 0;
                                return { ...user, avgScore };
                              })
                              .sort((a, b) => b.avgScore - a.avgScore)
                              .slice(0, 10)
                              .map((user, index) => (
                                <div 
                                  key={user.id} 
                                  className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10 hover:border-white/20 transition-colors group cursor-pointer"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full">
                                      <span className="text-blue-400 font-bold text-sm">#{index + 1}</span>
                                    </div>
                                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                      <User className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div>
                                      <div className="text-white font-medium text-sm">{user.full_name}</div>
                                      <div className="text-gray-400 text-xs">
                                        {user.reports.length} reports • {user.reports.filter((r: any) => r.analysis_results.length > 0).length} analyzed
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className={`text-lg font-bold font-mono ${getScoreColor(user.avgScore)}`}>
                                      {user.avgScore.toFixed(1)}%
                                    </div>
                                    {user.avgScore >= 90 && <Award className="w-4 h-4 text-yellow-400" />}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No contractors found</p>
                          </div>
                        )
                      ) : (
                        // Contractor view - Recent activity with scores and clickable reports
                        reports && reports.length > 0 ? (
                          <div className="space-y-4">
                            {reports.slice(0, 5).map((report) => (
                              <div 
                                key={report.id} 
                                className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10 hover:border-white/20 transition-colors group cursor-pointer"
                                onClick={() => setSelectedReport(report)}
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
                                      AI: {report.analysis_results[0].score}%
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
                        )
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
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
                        onClick={handleExport}
                        variant="outline" 
                        className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 font-mono"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button 
                        onClick={() => setShowFilterDialog(true)}
                        variant="outline" 
                        className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 font-mono"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Advanced Filters
                      </Button>
                      <Button 
                        onClick={handleScheduleReport}
                        variant="outline" 
                        className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 font-mono"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6">
                <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white font-mono flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <span>All Reports</span>
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                          Manage and review all submitted reports
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          onClick={() => setShowFilterDialog(true)}
                          variant="outline" 
                          size="sm" 
                          className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                        <Button 
                          onClick={handleExport}
                          variant="outline" 
                          size="sm" 
                          className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-6 bg-white/10 rounded w-full mb-2"></div>
                            <div className="h-4 bg-white/5 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : reports && reports.length > 0 ? (
                      <div className="space-y-4">
                        {reports.map((report) => (
                          <Card key={report.id} className="bg-black/20 border-white/10 hover:border-white/30 transition-all duration-300 group">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                  </div>
                                  <div>
                                    <h3 className="text-white font-semibold text-lg">{report.title || report.name}</h3>
                                    <p className="text-gray-400 text-sm">
                                      Category: {report.category || report.project} • Created {report.created_at && format(new Date(report.created_at), 'MMM dd, yyyy')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Badge className={`${getPriorityColor(report.priority || 'low')}`}>
                                    {report.priority || 'low'}
                                  </Badge>
                                  <Badge className={`${getStatusColor(report.status || 'pending')}`}>
                                    {formatStatus(report.status || 'pending')}
                                  </Badge>
                                </div>
                              </div>
                              
                              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                                {report.description || report.report}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-xs text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Processing: 2.3s</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Brain className="w-3 h-3" />
                                    <span>AI Score: {report.analysis_results[0]?.score || 'N/A'}%</span>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => setSelectedReport(report)}
                                  variant="outline" 
                                  size="sm" 
                                  className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl text-white font-mono mb-2">No Reports Yet</h3>
                        <p className="text-gray-400 mb-6">Start by submitting your first progress report</p>
                        <Link to="/submit">
                          <Button className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono">
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Report
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white font-mono flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span>Performance Metrics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-400 font-mono mb-2">
                            {dashboardStats?.successRate || '0'}%
                          </div>
                          <div className="text-gray-300">Overall Success Rate</div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Report Quality</span>
                            <span className="text-white">{dashboardStats?.successRate || '0'}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                              style={{width: `${dashboardStats?.successRate || 0}%`}}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">AI Validation Rate</span>
                            <span className="text-white">{dashboardStats?.analysisRate || '0'}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" 
                              style={{width: `${dashboardStats?.analysisRate || 0}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white font-mono flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                        <span>Category Distribution</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['Development', 'Testing', 'Design', 'Deployment'].map((category, index) => {
                          const categoryReports = reports.filter(r => r.category === category.toLowerCase());
                          const percentage = reports.length > 0 ? (categoryReports.length / reports.length) * 100 : 0;
                          const colors = ['from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-pink-500', 'from-red-500 to-orange-500'];
                          
                          return (
                            <div key={category} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">{category}</span>
                                <span className="text-white">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div 
                                  className={`bg-gradient-to-r ${colors[index]} h-2 rounded-full transition-all duration-1000`} 
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white font-mono flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      <span>Account Settings</span>
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage your account preferences and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userRole === 'admin' ? (
                      <div className="space-y-4">
                        <Button 
                          onClick={() => setShowAccountDialog(true)}
                          className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Manage Accounts
                        </Button>
                        <p className="text-gray-400 text-sm">
                          Create and manage user accounts for your organization
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl text-white font-mono mb-2">Settings Panel</h3>
                        <p className="text-gray-400">Account management features available for admins</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <FilterDialog 
        open={showFilterDialog} 
        onOpenChange={setShowFilterDialog}
        onApplyFilters={handleApplyFilters}
      />
      
      <SimpleAccountDialog 
        open={showAccountDialog} 
        onOpenChange={setShowAccountDialog}
      />
      
      {selectedReport && (
        <ReportDetails 
          report={selectedReport}
          open={!!selectedReport}
          onOpenChange={() => setSelectedReport(null)}
        />
      )}

      {selectedUser && (
        <UserProfile 
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        />
      )}

      {/* Custom styles */}
      <style>{`
        .bg-gradient-radial {
          background: radial-gradient(var(--tw-gradient-stops));
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
