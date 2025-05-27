
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

export const saveAnalysisResult = async (analysisData: Omit<AnalysisResult, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .insert([analysisData])
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
