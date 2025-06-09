import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  TrendingUp, 
  Shield, 
  Brain, 
  BarChart3, 
  Zap,
  Target,
  Plus,
  Filter,
  Download,
  Clock,
  Users
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getReportsWithAnalysis, getDashboardStats, downloadCSV, filterReports, getUsersWithReports, Report, AnalysisResult } from "@/services/supabaseService";
import { FilterDialog } from "@/components/FilterDialog";
import { SimpleAccountDialog } from "@/components/SimpleAccountDialog";
import { ReportDetails } from "@/components/ReportDetails";
import { UserProfile } from "@/components/UserProfile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UserLeaderboard } from "@/components/dashboard/UserLeaderboard";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { toast } from "sonner";
import { format } from "date-fns";

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
    queryFn: () => getUsersWithReports(),
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
    toast.info("Use the Schedule Report button in Quick Actions for full functionality");
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
      case 'validated': return 'bg-green-500/20 text-green-400';
      case 'review': return 'bg-yellow-500/20 text-yellow-400';
      case 'flagged': return 'bg-red-500/20 text-red-400';
      case 'pending': return 'bg-gray-500/20 text-gray-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 600) return 'text-yellow-400';
    if (score >= 400) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to get the actual status from analysis results
  const getReportStatus = (report: Report & { analysis_results: AnalysisResult[] }) => {
    if (report.analysis_results && report.analysis_results.length > 0) {
      return report.analysis_results[0].status || 'pending';
    }
    return report.status || 'pending';
  };

  // Calculate success rate as percentage based on 1000-point scale
  const calculateSuccessRate = (stats: any) => {
    if (!stats || !reports.length) return 0;
    
    const reportsWithAnalysis = reports.filter(r => r.analysis_results && r.analysis_results.length > 0);
    if (reportsWithAnalysis.length === 0) return 0;
    
    const totalScore = reportsWithAnalysis.reduce((sum, report) => {
      return sum + (report.analysis_results[0]?.score || 0);
    }, 0);
    
    const averageScore = totalScore / reportsWithAnalysis.length;
    // Convert score out of 1000 to percentage
    return (averageScore / 1000) * 100;
  };

  const successRate = calculateSuccessRate(dashboardStats);

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
      value: `${successRate.toFixed(1)}%`, 
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
      <DashboardHeader onRefresh={() => refetch()} />

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 py-8 sm:py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Section with Debug Info */}
          <WelcomeSection 
            user={user}
            reports={reports}
            isLoading={isLoading}
            isVisible={isVisible}
          />

          {/* Stats Grid */}
          <DashboardStats stats={stats} isVisible={isVisible} />

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
                  
                  {/* Recent Activity / User Leaderboard */}
                  {userRole === 'admin' ? (
                    <UserLeaderboard 
                      usersWithReports={usersWithReports}
                      isLoading={isLoading}
                      onUserClick={setSelectedUser}
                      getScoreColor={getScoreColor}
                    />
                  ) : (
                    <RecentActivity 
                      reports={reports}
                      isLoading={isLoading}
                      onReportClick={setSelectedReport}
                      getScoreColor={getScoreColor}
                      getPriorityColor={getPriorityColor}
                      getStatusColor={getStatusColor}
                      formatStatus={formatStatus}
                    />
                  )}

                  {/* Quick Actions */}
                  <QuickActions 
                    onExport={handleExport}
                    onShowFilterDialog={() => setShowFilterDialog(true)}
                  />
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
                        {reports.map((report) => {
                          const reportStatus = getReportStatus(report);
                          const aiScore = report.analysis_results?.[0]?.score;
                          
                          return (
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
                                    <Badge className={`${getStatusColor(reportStatus)}`}>
                                      {formatStatus(reportStatus)}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                                  {report.description || report.report}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1 text-white/90">
                                      <Clock className="w-4 h-4 text-blue-400" />
                                      <span className="font-medium">Processing: 2.3s</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Brain className="w-4 h-4 text-purple-400" />
                                      <span className={`font-medium ${aiScore ? getScoreColor(aiScore) : 'text-gray-400'}`}>
                                        AI Score: {aiScore ? `${aiScore}/1000` : 'N/A'}
                                      </span>
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
                          );
                        })}
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
                            {successRate.toFixed(1)}%
                          </div>
                          <div className="text-gray-300">Overall Success Rate</div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Report Quality</span>
                            <span className="text-white">{successRate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                              style={{width: `${Math.min(successRate, 100)}%`}}
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
