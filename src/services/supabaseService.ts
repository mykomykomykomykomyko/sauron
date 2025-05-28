
import { supabase } from "@/integrations/supabase/client";

export interface Report {
  id?: string;
  name: string;
  email: string;
  project: string;
  week: string;
  report: string;
  user_id?: string;
  created_at?: string;
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
}

export interface AnalysisResult {
  id?: string;
  report_id: string;
  score: number;
  status: 'validated' | 'review' | 'flagged' | 'pending';
  flags: number;
  summary: string;
  detailed_feedback: any;
  created_at?: string;
}

export interface Account {
  id?: string;
  email: string;
  full_name: string;
  company_name?: string;
  role: string;
  created_by?: string;
  created_at?: string;
  is_active?: boolean;
}

export const submitReport = async (reportData: Omit<Report, 'id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user in submitReport:', user);
  
  const reportToInsert = {
    ...reportData,
    user_id: user?.id
  };
  
  console.log('Inserting report:', reportToInsert);
  
  const { data, error } = await supabase
    .from('reports')
    .insert([reportToInsert])
    .select()
    .single();
    
  if (error) {
    console.error('Error inserting report:', error);
    throw error;
  }
  
  console.log('Report inserted successfully:', data);
  return data as Report;
};

export const createReport = async (reportData: { title: string; description: string; category: string; priority: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user in createReport:', user);
  
  const reportToInsert = {
    name: user?.user_metadata?.full_name || user?.email || 'Unknown',
    email: user?.email || 'unknown@example.com',
    project: reportData.category,
    week: new Date().toISOString().split('T')[0],
    report: reportData.description,
    user_id: user?.id,
    title: reportData.title,
    description: reportData.description,
    category: reportData.category,
    priority: reportData.priority,
    status: 'pending'
  };

  console.log('Creating report with data:', reportToInsert);

  const { data, error } = await supabase
    .from('reports')
    .insert([reportToInsert])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating report:', error);
    throw error;
  }
  
  console.log('Report created successfully:', data);
  return data as Report;
};

export const getReports = async (): Promise<Report[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user in getReports:', user);
  
  if (!user) {
    console.log('No authenticated user found');
    return [];
  }
  
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  console.log('Filtered reports data for user:', user.id, data);
  console.log('Reports query error:', error);
    
  if (error) throw error;
  return data as Report[];
};

export const saveAnalysisResult = async (analysisData: Omit<AnalysisResult, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .insert([analysisData])
    .select()
    .single();
    
  if (error) throw error;
  return data as AnalysisResult;
};

export const updateAnalysisStatus = async (reportId: string, status: 'validated' | 'review' | 'flagged' | 'pending') => {
  const { data, error } = await supabase
    .from('analysis_results')
    .update({ status })
    .eq('report_id', reportId)
    .select()
    .single();
    
  if (error) throw error;
  return data as AnalysisResult;
};

export const getReportsWithAnalysis = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user in getReportsWithAnalysis:', user);
  console.log('User ID:', user?.id);
  
  if (!user) {
    console.log('No authenticated user found in getReportsWithAnalysis');
    return [];
  }
  
  // Check user role to determine if they should see all reports or just their own
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  console.log('User role:', userRole?.role);
  
  let query = supabase
    .from('reports')
    .select(`
      *,
      analysis_results (*)
    `);
  
  // If user is not an admin, filter by user_id
  if (userRole?.role !== 'admin') {
    query = query.eq('user_id', user.id);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
    
  console.log('Reports with analysis - raw data:', data);
  console.log('Reports with analysis - error:', error);
  console.log('Number of reports found:', data?.length || 0);
  
  if (data && data.length > 0) {
    console.log('Sample report user_ids:', data.slice(0, 3).map(r => ({ id: r.id, user_id: r.user_id, email: r.email })));
  }
    
  if (error) throw error;
  return data as (Report & { analysis_results: AnalysisResult[] })[];
};

export const getRecentReports = async (limit = 10) => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user in getRecentReports:', user);
  
  if (!user) {
    console.log('No authenticated user found in getRecentReports');
    return [];
  }
  
  // Check user role to determine if they should see all reports or just their own
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  console.log('User role in getRecentReports:', userRole?.role);
  
  let query = supabase
    .from('reports')
    .select(`
      *,
      analysis_results (*)
    `);
  
  // If user is not an admin, filter by user_id
  if (userRole?.role !== 'admin') {
    query = query.eq('user_id', user.id);
  }
  
  query = query.order('created_at', { ascending: false }).limit(limit);
  
  const { data, error } = await query;
    
  console.log('Recent reports data:', data);
  console.log('Recent reports error:', error);
    
  if (error) throw error;
  return data as (Report & { analysis_results: AnalysisResult[] })[];
};

// Export reports as CSV format
export const exportReportsAsCSV = async () => {
  const reports = await getReportsWithAnalysis();
  
  const csvHeaders = ['ID', 'Name', 'Email', 'Project', 'Week', 'Report', 'Created At', 'Status', 'Score'];
  const csvRows = reports.map(report => [
    report.id || '',
    report.name,
    report.email,
    report.project,
    report.week,
    `"${report.report.replace(/"/g, '""')}"`, // Escape quotes in report content
    report.created_at || '',
    report.analysis_results[0]?.status || 'pending',
    report.analysis_results[0]?.score || 0
  ]);
  
  const csvContent = [csvHeaders, ...csvRows]
    .map(row => row.join(','))
    .join('\n');
    
  return csvContent;
};

// Get notifications for the current user
export const getUserNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
    
  if (error) throw error;
};

// Trigger AI analysis for a report
export const triggerAIAnalysis = async (reportId: string) => {
  const { data, error } = await supabase.functions.invoke('analyze-report', {
    body: { reportId }
  });
  
  if (error) throw error;
  return data;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  const reports = await getReportsWithAnalysis();
  const totalReports = reports.length;
  const reportsWithAnalysis = reports.filter(r => r.analysis_results.length > 0);
  const analysisRate = totalReports > 0 ? (reportsWithAnalysis.length / totalReports) * 100 : 0;
  const avgScore = reportsWithAnalysis.length > 0 
    ? reportsWithAnalysis.reduce((sum, r) => sum + (r.analysis_results[0]?.score || 0), 0) / reportsWithAnalysis.length 
    : 0;
  
  return {
    totalReports,
    analysisRate: analysisRate.toFixed(1),
    avgProcessingTime: "2.3s", // This would be calculated from actual data
    successRate: avgScore.toFixed(1)
  };
};

// Create account using edge function (admin only)
export const createAccount = async (accountData: Omit<Account, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.functions.invoke('create-account', {
    body: accountData
  });
  
  if (error) throw error;
  return data;
};

// Get all accounts (admin only)
export const getAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as Account[];
};

// Filter reports
export const filterReports = async (filters: { name?: string; sortBy?: 'date' | 'alphabetical'; sortOrder?: 'asc' | 'desc' }) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log('No authenticated user found in filterReports');
    return [];
  }
  
  // Check user role to determine if they should see all reports or just their own
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  
  let query = supabase
    .from('reports')
    .select(`
      *,
      analysis_results (*)
    `);
    
  // If user is not an admin, filter by user_id
  if (userRole?.role !== 'admin') {
    query = query.eq('user_id', user.id);
  }
    
  if (filters.name) {
    query = query.ilike('name', `%${filters.name}%`);
  }
  
  if (filters.sortBy === 'date') {
    query = query.order('created_at', { ascending: filters.sortOrder === 'asc' });
  } else if (filters.sortBy === 'alphabetical') {
    query = query.order('name', { ascending: filters.sortOrder === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as (Report & { analysis_results: AnalysisResult[] })[];
};

export const downloadCSV = async () => {
  const csvContent = await exportReportsAsCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reports_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Send schedule report email
export const scheduleReportEmail = async (userEmail: string) => {
  const subject = "Report Submission Reminder - The Eye of Sauron";
  const body = `Please submit your progress report in The Eye of Sauron system.%0D%0A%0D%0AClick here to submit: ${window.location.origin}/submit`;
  
  window.location.href = `mailto:${userEmail}?subject=${subject}&body=${body}`;
};
