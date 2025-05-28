
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

export const submitReport = async (reportData: Omit<Report, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select()
    .single();
    
  if (error) throw error;
  return data as Report;
};

export const createReport = async (reportData: { title: string; description: string; category: string; priority: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  
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

  const { data, error } = await supabase
    .from('reports')
    .insert([reportToInsert])
    .select()
    .single();
    
  if (error) throw error;
  return data as Report;
};

export const getReports = async (): Promise<Report[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
    
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
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      analysis_results (*)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as (Report & { analysis_results: AnalysisResult[] })[];
};

export const getRecentReports = async (limit = 10) => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      analysis_results (*)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
    
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

// Export the service object
export const supabaseService = {
  submitReport,
  createReport,
  getReports,
  saveAnalysisResult,
  updateAnalysisStatus,
  getReportsWithAnalysis,
  getRecentReports,
  exportReportsAsCSV,
  getUserNotifications,
  markNotificationAsRead,
  triggerAIAnalysis
};
