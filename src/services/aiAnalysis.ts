
import { submitReport, saveAnalysisResult, Report } from './supabaseService';

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
  user_id?: string;
}

export const analyzeReport = async (reportData: ReportData): Promise<AnalysisResult> => {
  try {
    // First, save the report to the database
    const savedReport: Report = await submitReport(reportData);
    
    // Check if savedReport exists and has an id
    if (!savedReport?.id) {
      throw new Error('Failed to save report to database');
    }
    
    // Enhanced AI analysis with stricter evaluation criteria
    const analysis = performDetailedAnalysis(reportData.report);
    
    // Save analysis result to database
    await saveAnalysisResult({
      report_id: savedReport.id,
      score: analysis.score,
      status: analysis.status,
      flags: analysis.flags,
      summary: generateSummary(reportData.report, analysis.score),
      detailed_feedback: {
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        feedback: analysis.feedback
      }
    });
    
    return analysis;
  } catch (error) {
    console.error('Error in analyzeReport:', error);
    throw error;
  }
};

const performDetailedAnalysis = (reportText: string): AnalysisResult => {
  console.log('Starting detailed analysis for report:', reportText.substring(0, 100));
  
  const reportLength = reportText.length;
  const wordCount = reportText.split(/\s+/).filter(word => word.length > 0).length;
  
  // Initialize scoring components (total: 1000 points)
  let technicalContentScore = 0; // 300 points max
  let deliverableScore = 0; // 250 points max
  let clarityScore = 0; // 200 points max
  let proactivityScore = 0; // 150 points max
  let professionalismScore = 0; // 100 points max
  
  const strengths: string[] = [];
  const improvements: string[] = [];
  let flags = 0;
  
  // Convert to lowercase for analysis
  const lowerReport = reportText.toLowerCase();
  
  // === TECHNICAL CONTENT ANALYSIS (300 points) ===
  const technicalTerms = [
    'implemented', 'developed', 'coded', 'built', 'created', 'designed',
    'optimized', 'refactored', 'debugged', 'tested', 'deployed', 'integrated',
    'api', 'database', 'frontend', 'backend', 'algorithm', 'function', 'feature'
  ];
  
  const technicalTermCount = technicalTerms.filter(term => 
    lowerReport.includes(term)
  ).length;
  
  if (technicalTermCount >= 5) {
    technicalContentScore += 200;
    strengths.push("Report demonstrates strong technical vocabulary and implementation details");
  } else if (technicalTermCount >= 3) {
    technicalContentScore += 120;
    strengths.push("Report includes adequate technical terminology");
  } else if (technicalTermCount >= 1) {
    technicalContentScore += 60;
    improvements.push("Include more specific technical implementation details");
  } else {
    technicalContentScore += 0;
    improvements.push("**CRITICAL:** Report lacks technical content and implementation details");
    flags++;
  }
  
  // Code snippets, specific implementations
  if (lowerReport.includes('code') || lowerReport.includes('implementation') || 
      lowerReport.includes('solution') || lowerReport.includes('approach')) {
    technicalContentScore += 50;
    strengths.push("Report mentions specific implementation approaches");
  }
  
  // Technical challenges and problem-solving
  if (lowerReport.includes('challenge') || lowerReport.includes('problem') || 
      lowerReport.includes('issue') || lowerReport.includes('bug')) {
    technicalContentScore += 50;
    strengths.push("Report acknowledges and addresses technical challenges");
  } else {
    improvements.push("Include challenges faced and how they were resolved");
  }
  
  // === DELIVERABLE ANALYSIS (250 points) ===
  const deliverableKeywords = [
    'completed', 'finished', 'delivered', 'shipped', 'deployed', 'released',
    'milestone', 'task', 'feature', 'functionality', 'module', 'component'
  ];
  
  const deliverableCount = deliverableKeywords.filter(keyword => 
    lowerReport.includes(keyword)
  ).length;
  
  // STRICT: Meetings without deliverables are flagged
  const meetingKeywords = ['meeting', 'call', 'discussion', 'standup', 'sync', 'committee'];
  const meetingMentions = meetingKeywords.filter(keyword => 
    lowerReport.includes(keyword)
  ).length;
  
  if (meetingMentions > 2 && deliverableCount === 0) {
    deliverableScore = 0;
    improvements.push("**RED FLAG:** Multiple meetings mentioned but no concrete deliverables identified");
    flags += 2;
  } else if (deliverableCount >= 3) {
    deliverableScore += 200;
    strengths.push("Report clearly identifies multiple concrete deliverables");
  } else if (deliverableCount >= 2) {
    deliverableScore += 130;
    strengths.push("Report mentions specific deliverables");
  } else if (deliverableCount >= 1) {
    deliverableScore += 70;
    improvements.push("Include more specific deliverables and outcomes");
  } else {
    deliverableScore = 0;
    improvements.push("**CRITICAL:** No concrete deliverables or accomplishments identified");
    flags += 2;
  }
  
  // Progress indicators
  if (lowerReport.includes('progress') || lowerReport.includes('advancement') || 
      lowerReport.includes('improvement')) {
    deliverableScore += 50;
  } else {
    improvements.push("Include specific progress metrics and advancement indicators");
  }
  
  // === CLARITY AND COMMUNICATION (200 points) ===
  if (wordCount >= 200) {
    clarityScore += 100;
    strengths.push("Report provides comprehensive detail and context");
  } else if (wordCount >= 100) {
    clarityScore += 60;
  } else if (wordCount >= 50) {
    clarityScore += 30;
    improvements.push("Expand report with more detailed explanations");
  } else {
    clarityScore = 0;
    improvements.push("**CRITICAL:** Report is too brief and lacks sufficient detail");
    flags++;
  }
  
  // Structure and organization
  const sentences = reportText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length >= 5) {
    clarityScore += 50;
    strengths.push("Report is well-structured with multiple detailed points");
  } else if (sentences.length >= 3) {
    clarityScore += 30;
  } else {
    clarityScore += 0;
    improvements.push("Organize report into multiple clear, detailed sentences");
  }
  
  // Professional language
  if (reportText.match(/[A-Z]/g) && !reportText.match(/^[a-z]/)) {
    clarityScore += 50;
    strengths.push("Report uses proper capitalization and professional formatting");
  } else {
    improvements.push("Use proper capitalization and professional language");
  }
  
  // === PROACTIVITY AND PLANNING (150 points) ===
  const futureKeywords = [
    'next', 'plan', 'will', 'going to', 'upcoming', 'future', 'schedule',
    'roadmap', 'timeline', 'goals', 'objectives', 'targets'
  ];
  
  const futureCount = futureKeywords.filter(keyword => 
    lowerReport.includes(keyword)
  ).length;
  
  if (futureCount >= 3) {
    proactivityScore += 100;
    strengths.push("Report demonstrates strong forward planning and goal setting");
  } else if (futureCount >= 2) {
    proactivityScore += 60;
    strengths.push("Report includes future planning elements");
  } else if (futureCount >= 1) {
    proactivityScore += 30;
    improvements.push("Expand on future plans and upcoming milestones");
  } else {
    proactivityScore = 0;
    improvements.push("**REQUIRED:** Include specific next steps and future planning");
    flags++;
  }
  
  // Initiative and self-direction
  if (lowerReport.includes('initiative') || lowerReport.includes('proactive') || 
      lowerReport.includes('suggested') || lowerReport.includes('proposed')) {
    proactivityScore += 50;
    strengths.push("Report shows initiative and proactive thinking");
  }
  
  // === PROFESSIONALISM (100 points) ===
  // Proper formatting and structure
  if (reportText.length > 0 && reportText.trim() === reportText) {
    professionalismScore += 25;
  }
  
  // No obvious typos or grammar issues (basic check)
  if (!reportText.includes('  ') && reportText.split(' ').every(word => word.length > 0)) {
    professionalismScore += 25;
  }
  
  // Professional tone
  if (!lowerReport.includes('kinda') && !lowerReport.includes('sorta') && 
      !lowerReport.includes('dunno') && !lowerReport.includes('gonna')) {
    professionalismScore += 25;
    strengths.push("Report maintains professional tone and language");
  } else {
    improvements.push("Use more professional language and avoid informal expressions");
  }
  
  // Time references and specificity
  if (lowerReport.includes('hour') || lowerReport.includes('day') || 
      lowerReport.includes('week') || lowerReport.includes('specific date')) {
    professionalismScore += 25;
    strengths.push("Report includes specific time references and scheduling details");
  }
  
  // === CALCULATE FINAL SCORE ===
  const totalScore = technicalContentScore + deliverableScore + clarityScore + 
                     proactivityScore + professionalismScore;
  
  console.log('Score breakdown:', {
    technicalContentScore,
    deliverableScore,
    clarityScore,
    proactivityScore,
    professionalismScore,
    totalScore
  });
  
  // === DETERMINE STATUS ===
  let status: 'validated' | 'review' | 'flagged' = 'validated';
  
  if (totalScore < 400 || flags >= 3) {
    status = 'flagged';
    flags = Math.max(flags, 3);
  } else if (totalScore < 650 || flags >= 1) {
    status = 'review';
    flags = Math.max(flags, 1);
  }
  
  // === GENERATE DETAILED FEEDBACK ===
  const feedback = generateDetailedFeedback(totalScore, technicalContentScore, 
    deliverableScore, clarityScore, proactivityScore, professionalismScore, 
    strengths, improvements, flags);
  
  return {
    score: totalScore,
    feedback,
    strengths,
    improvements,
    flags,
    status
  };
};

const generateDetailedFeedback = (
  totalScore: number,
  technicalScore: number,
  deliverableScore: number,
  clarityScore: number,
  proactivityScore: number,
  professionalismScore: number,
  strengths: string[],
  improvements: string[],
  flags: number
): string => {
  let feedback = `# SAURON Analysis Report\n\n`;
  
  feedback += `## Overall Score: ${totalScore}/1000\n\n`;
  
  // Score interpretation
  if (totalScore >= 800) {
    feedback += `**🏆 EXCEPTIONAL PERFORMANCE** - This report demonstrates outstanding quality and professionalism.\n\n`;
  } else if (totalScore >= 650) {
    feedback += `**✅ GOOD PERFORMANCE** - This report meets professional standards with room for enhancement.\n\n`;
  } else if (totalScore >= 400) {
    feedback += `**⚠️ NEEDS IMPROVEMENT** - This report requires significant enhancement to meet professional standards.\n\n`;
  } else {
    feedback += `**🚨 UNACCEPTABLE** - This report fails to meet minimum professional requirements and must be resubmitted.\n\n`;
  }
  
  // Detailed score breakdown
  feedback += `## Score Breakdown\n\n`;
  feedback += `| Category | Score | Max | Percentage |\n`;
  feedback += `|----------|-------|-----|------------|\n`;
  feedback += `| Technical Content | ${technicalScore} | 300 | ${Math.round((technicalScore/300)*100)}% |\n`;
  feedback += `| Deliverables | ${deliverableScore} | 250 | ${Math.round((deliverableScore/250)*100)}% |\n`;
  feedback += `| Clarity & Communication | ${clarityScore} | 200 | ${Math.round((clarityScore/200)*100)}% |\n`;
  feedback += `| Proactivity & Planning | ${proactivityScore} | 150 | ${Math.round((proactivityScore/150)*100)}% |\n`;
  feedback += `| Professionalism | ${professionalismScore} | 100 | ${Math.round((professionalismScore/100)*100)}% |\n\n`;
  
  // Flags section
  if (flags > 0) {
    feedback += `## 🚩 Red Flags: ${flags}\n\n`;
    if (flags >= 3) {
      feedback += `**CRITICAL ISSUES DETECTED** - This report contains multiple serious deficiencies that require immediate attention.\n\n`;
    } else if (flags >= 1) {
      feedback += `**WARNING** - This report contains issues that need to be addressed in future submissions.\n\n`;
    }
  }
  
  // Strengths section
  if (strengths.length > 0) {
    feedback += `## ✅ Strengths\n\n`;
    strengths.forEach(strength => {
      feedback += `- ${strength}\n`;
    });
    feedback += `\n`;
  }
  
  // Improvements section
  if (improvements.length > 0) {
    feedback += `## 📈 Areas for Improvement\n\n`;
    improvements.forEach(improvement => {
      feedback += `- ${improvement}\n`;
    });
    feedback += `\n`;
  }
  
  // Specific recommendations
  feedback += `## 🎯 Specific Recommendations\n\n`;
  
  if (technicalScore < 200) {
    feedback += `**Technical Content (${technicalScore}/300):** Your report lacks sufficient technical detail. Include specific:\n`;
    feedback += `- Implementation approaches and methodologies\n`;
    feedback += `- Technical challenges encountered and solutions applied\n`;
    feedback += `- Code snippets, algorithms, or technical specifications\n`;
    feedback += `- Technology stack details and architectural decisions\n\n`;
  }
  
  if (deliverableScore < 150) {
    feedback += `**Deliverables (${deliverableScore}/250):** Focus on concrete outputs rather than activities:\n`;
    feedback += `- List specific features, modules, or components completed\n`;
    feedback += `- Quantify your accomplishments with metrics\n`;
    feedback += `- Avoid excessive focus on meetings without corresponding deliverables\n`;
    feedback += `- Demonstrate tangible progress and outcomes\n\n`;
  }
  
  if (clarityScore < 120) {
    feedback += `**Clarity (${clarityScore}/200):** Enhance communication effectiveness:\n`;
    feedback += `- Expand report length with detailed explanations\n`;
    feedback += `- Use clear, structured sentences and proper formatting\n`;
    feedback += `- Provide context and background for your work\n`;
    feedback += `- Ensure professional language and grammar\n\n`;
  }
  
  if (proactivityScore < 90) {
    feedback += `**Planning (${proactivityScore}/150):** Demonstrate forward-thinking:\n`;
    feedback += `- Include specific next steps and upcoming milestones\n`;
    feedback += `- Set clear goals and objectives for future work\n`;
    feedback += `- Show initiative and proactive problem-solving\n`;
    feedback += `- Provide timelines and delivery expectations\n\n`;
  }
  
  // Final assessment
  feedback += `## 📋 Final Assessment\n\n`;
  
  if (totalScore >= 800) {
    feedback += `This report exemplifies professional excellence. Continue maintaining this high standard of reporting and technical execution.`;
  } else if (totalScore >= 650) {
    feedback += `This report meets professional standards. Address the identified improvement areas to achieve exceptional performance.`;
  } else if (totalScore >= 400) {
    feedback += `This report requires significant improvement. Please review all recommendations and resubmit with enhanced technical detail and deliverable focus.`;
  } else {
    feedback += `This report is unacceptable for professional standards. Immediate and comprehensive improvements are required across all categories before resubmission.`;
  }
  
  return feedback;
};

const generateSummary = (reportText: string, score: number): string => {
  const firstSentence = reportText.split('.')[0];
  const truncated = firstSentence.substring(0, 100);
  
  if (score >= 800) {
    return `${truncated}... - EXCEPTIONAL: Comprehensive technical report with outstanding deliverable focus`;
  } else if (score >= 650) {
    return `${truncated}... - GOOD: Professional report with adequate technical content and deliverables`;
  } else if (score >= 400) {
    return `${truncated}... - NEEDS IMPROVEMENT: Report lacks sufficient technical detail and deliverable focus`;
  } else {
    return `${truncated}... - UNACCEPTABLE: Report fails to meet minimum professional standards`;
  }
};

// Future: Replace with actual Claude API integration
export const analyzeWithClaude = async (reportData: ReportData): Promise<AnalysisResult> => {
  // This will be implemented when Claude API is integrated
  // For now, use the enhanced local analysis
  return analyzeReport(reportData);
};
