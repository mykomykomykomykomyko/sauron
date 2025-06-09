
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
}

export interface AnalysisResult {
  id?: string;
  report_id: string;
  score: number;
  status: 'validated' | 'review' | 'flagged' | 'pending';
  summary: string;
  created_at?: string;
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
