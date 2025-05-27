
import { supabase } from "@/integrations/supabase/client";

export interface Report {
  id?: string;
  name: string;
  email: string;
  project: string;
  week: string;
  report: string;
  created_at?: string;
}

export interface AnalysisResult {
  id?: string;
  report_id: string;
  score: number;
  status: 'validated' | 'review' | 'flagged';
  flags: number;
  summary: string;
  detailed_feedback: any;
  created_at?: string;
}

export const submitReport = async (reportData: Omit<Report, 'id' | 'created_at'>) => {
  const { data, error } = await (supabase as any)
    .from('reports')
    .insert([reportData])
    .select()
    .single();
    
  if (error) throw error;
  return data as Report;
};

export const saveAnalysisResult = async (analysisData: Omit<AnalysisResult, 'id' | 'created_at'>) => {
  const { data, error } = await (supabase as any)
    .from('analysis_results')
    .insert([analysisData])
    .select()
    .single();
    
  if (error) throw error;
  return data as AnalysisResult;
};

export const getReportsWithAnalysis = async () => {
  const { data, error } = await (supabase as any)
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
  const { data, error } = await (supabase as any)
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
