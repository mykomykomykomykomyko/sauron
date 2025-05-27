
import { submitReport, saveAnalysisResult } from './supabaseService';

interface AnalysisResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  flags: number;
  status: 'validated' | 'review' | 'flagged';
}

interface ReportData {
  name: string;
  email: string;
  project: string;
  week: string;
  report: string;
}

export const analyzeReport = async (reportData: ReportData): Promise<AnalysisResult> => {
  // First, save the report to the database
  const savedReport = await submitReport(reportData);
  
  // Simulate AI analysis for now - this will be replaced with actual Claude API integration
  const reportLength = reportData.report.length;
  const hasSpecificDetails = reportData.report.includes('completed') || reportData.report.includes('implemented');
  const hasChallenges = reportData.report.toLowerCase().includes('challenge') || reportData.report.toLowerCase().includes('issue');
  const hasNextSteps = reportData.report.toLowerCase().includes('next') || reportData.report.toLowerCase().includes('plan');
  
  // Calculate base score
  let score = 5.0;
  
  // Scoring factors
  if (reportLength > 200) score += 1.5;
  if (hasSpecificDetails) score += 2.0;
  if (hasChallenges) score += 1.0;
  if (hasNextSteps) score += 1.5;
  
  // Cap at 10
  score = Math.min(score, 10);
  
  // Generate feedback
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  if (hasSpecificDetails) {
    strengths.push("Report includes specific technical details");
  } else {
    improvements.push("Add more specific technical implementation details");
  }
  
  if (hasChallenges) {
    strengths.push("Acknowledges challenges faced during development");
  } else {
    improvements.push("Include any challenges or obstacles encountered");
  }
  
  if (hasNextSteps) {
    strengths.push("Clearly outlines next steps and future plans");
  } else {
    improvements.push("Provide clear next steps and upcoming milestones");
  }
  
  if (reportLength > 300) {
    strengths.push("Comprehensive and detailed report");
  } else if (reportLength < 100) {
    improvements.push("Expand report with more details and context");
  }
  
  // Determine status and flags
  let status: 'validated' | 'review' | 'flagged' = 'validated';
  let flags = 0;
  
  if (score < 6) {
    status = 'flagged';
    flags = Math.floor((6 - score) * 2);
  } else if (score < 7.5) {
    status = 'review';
    flags = 1;
  }
  
  const feedback = generateFeedback(score, strengths, improvements);
  
  const analysisResult = {
    score: Math.round(score * 10) / 10,
    feedback,
    strengths,
    improvements,
    flags,
    status
  };
  
  // Save analysis result to database
  await saveAnalysisResult({
    report_id: savedReport.id,
    score: analysisResult.score,
    status: analysisResult.status,
    flags: analysisResult.flags,
    summary: generateSummary(reportData.report, analysisResult.score),
    detailed_feedback: {
      strengths: analysisResult.strengths,
      improvements: analysisResult.improvements,
      feedback: analysisResult.feedback
    }
  });
  
  return analysisResult;
};

const generateFeedback = (score: number, strengths: string[], improvements: string[]): string => {
  let feedback = `Your report has been analyzed and received a score of ${score}/10.\n\n`;
  
  if (strengths.length > 0) {
    feedback += "**Strengths:**\n";
    strengths.forEach(strength => {
      feedback += `• ${strength}\n`;
    });
    feedback += "\n";
  }
  
  if (improvements.length > 0) {
    feedback += "**Areas for Improvement:**\n";
    improvements.forEach(improvement => {
      feedback += `• ${improvement}\n`;
    });
    feedback += "\n";
  }
  
  if (score >= 8) {
    feedback += "Excellent work! Your report demonstrates strong attention to detail and clear communication.";
  } else if (score >= 6) {
    feedback += "Good report overall. Consider the improvement suggestions to enhance future submissions.";
  } else {
    feedback += "This report needs attention. Please review the improvement suggestions and resubmit.";
  }
  
  return feedback;
};

const generateSummary = (reportText: string, score: number): string => {
  const words = reportText.split(' ');
  const firstSentence = reportText.split('.')[0];
  
  if (score >= 8) {
    return `${firstSentence.substring(0, 100)}... - Comprehensive report with detailed technical implementation`;
  } else if (score >= 6) {
    return `${firstSentence.substring(0, 100)}... - Good progress report with room for improvement`;
  } else {
    return `${firstSentence.substring(0, 100)}... - Report lacks sufficient detail and specificity`;
  }
};

// Future: Replace with actual Claude API integration
export const analyzeWithClaude = async (reportData: ReportData): Promise<AnalysisResult> => {
  // This will be implemented when Claude API is integrated
  // For now, use the local analysis
  return analyzeReport(reportData);
};
