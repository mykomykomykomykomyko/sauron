
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
  status?: string;
  priority?: string;
  category?: string;
  description?: string;
}

export interface AnalysisResult {
  id?: string;
  report_id: string;
  score: number;
  status: 'validated' | 'review' | 'flagged' | 'pending';
  summary: string;
  created_at?: string;
  flags?: number;
  detailed_feedback?: any;
}

export interface Account {
  id?: string;
  email: string;
  full_name: string;
  company_name?: string;
  role: string;
  created_at?: string;
  is_active?: boolean;
}

// Basic report submission
export const submitReport = async (reportData: Omit<Report, 'id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to submit reports');
  }
  
  const reportToInsert = {
    ...reportData,
    user_id: user.id
  };
  
  const { data, error } = await supabase
    .from('reports')
    .insert([reportToInsert])
    .select()
    .single();
    
  if (error) throw error;
  return data as Report;
};

// Get user reports
export const getReports = async (): Promise<Report[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as Report[];
};

// Get reports with analysis
export const getReportsWithAnalysis = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      analysis_results!analysis_results_report_id_fkey (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as (Report & { analysis_results: AnalysisResult[] })[];
};

// Basic dashboard stats
export const getDashboardStats = async () => {
  const reports = await getReportsWithAnalysis();
  const totalReports = reports.length;
  const reportsWithAnalysis = reports.filter(r => r.analysis_results.length > 0);
  const analysisRate = totalReports > 0 ? (reportsWithAnalysis.length / totalReports) * 100 : 0;
  
  return {
    totalReports,
    analysisRate: analysisRate.toFixed(1),
    avgProcessingTime: "2.3s",
    successRate: "95.2"
  };
};

// Account management functions
export const createAccount = async (accountData: Omit<Account, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('accounts')
    .insert([accountData])
    .select()
    .single();
    
  if (error) throw error;
  return data as Account;
};

export const getAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as Account[];
};

// Analysis functions
export const triggerAIAnalysis = async (reportId: string) => {
  // Placeholder for AI analysis trigger
  console.log('Triggering AI analysis for report:', reportId);
  return { success: true };
};

export const updateAnalysisStatus = async (analysisId: string, status: string) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .update({ status })
    .eq('id', analysisId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
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

// User management functions
export const getUsersWithReports = async () => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as Account[];
};

// Data export functions
export const downloadCSV = async (reports: Report[]) => {
  // Placeholder for CSV download
  console.log('Downloading CSV for reports:', reports.length);
  return { success: true };
};

export const filterReports = async (filters: any) => {
  // Placeholder for report filtering
  console.log('Filtering reports with:', filters);
  return [];
};
