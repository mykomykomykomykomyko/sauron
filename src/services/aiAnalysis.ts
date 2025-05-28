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
    strengths.push("Report demonstrates exceptional technical depth with comprehensive implementation details");
  } else if (technicalTermCount >= 3) {
    technicalContentScore += 120;
    strengths.push("Report includes solid technical content and implementation terminology");
  } else if (technicalTermCount >= 1) {
    technicalContentScore += 60;
    improvements.push("Include more specific technical implementation details and methodologies");
  } else {
    technicalContentScore += 0;
    improvements.push("**CRITICAL DEFICIENCY:** Report completely lacks technical content and implementation details");
    flags++;
  }
  
  // Code snippets, specific implementations
  if (lowerReport.includes('code') || lowerReport.includes('implementation') || 
      lowerReport.includes('solution') || lowerReport.includes('approach')) {
    technicalContentScore += 50;
    strengths.push("Report demonstrates technical problem-solving with specific implementation approaches");
  }
  
  // Technical challenges and problem-solving
  if (lowerReport.includes('challenge') || lowerReport.includes('problem') || 
      lowerReport.includes('issue') || lowerReport.includes('bug')) {
    technicalContentScore += 50;
    strengths.push("Report shows excellent technical awareness by addressing challenges and obstacles");
  } else {
    improvements.push("Include detailed discussion of technical challenges faced and resolution strategies");
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
    improvements.push("**🚨 MAJOR RED FLAG:** Multiple meetings mentioned but zero concrete deliverables identified - this is unacceptable");
    flags += 2;
  } else if (deliverableCount >= 3) {
    deliverableScore += 200;
    strengths.push("Outstanding deliverable focus with multiple concrete accomplishments clearly identified");
  } else if (deliverableCount >= 2) {
    deliverableScore += 130;
    strengths.push("Good deliverable reporting with specific completed tasks mentioned");
  } else if (deliverableCount >= 1) {
    deliverableScore += 70;
    improvements.push("Expand on deliverables with more specific outcomes and measurable results");
  } else {
    deliverableScore = 0;
    improvements.push("**🚨 CRITICAL FAILURE:** No concrete deliverables, accomplishments, or tangible outputs identified");
    flags += 2;
  }
  
  // Progress indicators
  if (lowerReport.includes('progress') || lowerReport.includes('advancement') || 
      lowerReport.includes('improvement')) {
    deliverableScore += 50;
  } else {
    improvements.push("Include specific progress metrics, advancement indicators, and measurable outcomes");
  }
  
  // === CLARITY AND COMMUNICATION (200 points) ===
  if (wordCount >= 200) {
    clarityScore += 100;
    strengths.push("Excellent report comprehensiveness with detailed explanations and context");
  } else if (wordCount >= 100) {
    clarityScore += 60;
    strengths.push("Adequate report length with reasonable detail provided");
  } else if (wordCount >= 50) {
    clarityScore += 30;
    improvements.push("Significantly expand report with more detailed explanations and context");
  } else {
    clarityScore = 0;
    improvements.push("**🚨 UNACCEPTABLE:** Report is far too brief and lacks sufficient professional detail");
    flags++;
  }
  
  // Structure and organization
  const sentences = reportText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length >= 5) {
    clarityScore += 50;
    strengths.push("Excellent structural organization with multiple well-developed points");
  } else if (sentences.length >= 3) {
    clarityScore += 30;
    strengths.push("Good sentence structure with adequate point development");
  } else {
    clarityScore += 0;
    improvements.push("Organize report into multiple clear, detailed sentences with better structure");
  }
  
  // Professional language
  if (reportText.match(/[A-Z]/g) && !reportText.match(/^[a-z]/)) {
    clarityScore += 50;
    strengths.push("Professional formatting and language standards maintained throughout");
  } else {
    improvements.push("Implement proper capitalization, grammar, and professional language standards");
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
    strengths.push("Exceptional forward planning with comprehensive goal setting and strategic thinking");
  } else if (futureCount >= 2) {
    proactivityScore += 60;
    strengths.push("Good future planning elements with adequate forward-thinking approach");
  } else if (futureCount >= 1) {
    proactivityScore += 30;
    improvements.push("Expand on future plans, upcoming milestones, and strategic objectives");
  } else {
    proactivityScore = 0;
    improvements.push("**⚠️ MANDATORY REQUIREMENT:** Include specific next steps, future planning, and strategic roadmap");
    flags++;
  }
  
  // Initiative and self-direction
  if (lowerReport.includes('initiative') || lowerReport.includes('proactive') || 
      lowerReport.includes('suggested') || lowerReport.includes('proposed')) {
    proactivityScore += 50;
    strengths.push("Demonstrates exceptional initiative and proactive leadership thinking");
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
    strengths.push("Maintains excellent professional tone and business communication standards");
  } else {
    improvements.push("Eliminate informal expressions and maintain strict professional language standards");
  }
  
  // Time references and specificity
  if (lowerReport.includes('hour') || lowerReport.includes('day') || 
      lowerReport.includes('week') || lowerReport.includes('specific date')) {
    professionalismScore += 25;
    strengths.push("Excellent time management awareness with specific scheduling and time references");
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
    strengths, improvements, flags, wordCount, reportLength);
  
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
  flags: number,
  wordCount: number,
  reportLength: number
): string => {
  let feedback = `# 🔍 SAURON COMPREHENSIVE ANALYSIS REPORT\n\n`;
  
  feedback += `## 📊 Overall Score: **${totalScore}/1000**\n\n`;
  
  // Score interpretation with detailed analysis
  if (totalScore >= 800) {
    feedback += `### 🏆 **EXCEPTIONAL PERFORMANCE - TIER S**\n\n`;
    feedback += `**OUTSTANDING ACHIEVEMENT!** This report demonstrates exceptional quality, comprehensive technical depth, and exemplary professional standards. This contractor is delivering exceptional value and should be recognized for their outstanding work ethic and technical excellence.\n\n`;
    feedback += `**🚀 SPEED & QUALITY COMMENDATION:** This level of detail and technical precision suggests rapid execution combined with meticulous attention to quality - a rare and valuable combination in professional development.\n\n`;
  } else if (totalScore >= 650) {
    feedback += `### ✅ **GOOD PERFORMANCE - TIER A**\n\n`;
    feedback += `**SOLID PROFESSIONAL WORK:** This report meets professional standards with good technical content and deliverable focus. The contractor demonstrates competent work execution and professional communication skills.\n\n`;
    if (totalScore >= 750) {
      feedback += `**⚡ EFFICIENCY RECOGNITION:** The quality and depth achieved indicates efficient work execution and good time management skills.\n\n`;
    }
  } else if (totalScore >= 400) {
    feedback += `### ⚠️ **NEEDS SIGNIFICANT IMPROVEMENT - TIER C**\n\n`;
    feedback += `**BELOW PROFESSIONAL STANDARDS:** This report requires substantial enhancement to meet minimum professional expectations. Critical deficiencies must be addressed immediately.\n\n`;
    feedback += `**📈 URGENT ACTION REQUIRED:** The contractor must dramatically improve reporting quality, technical detail, and deliverable focus to maintain professional standing.\n\n`;
  } else {
    feedback += `### 🚨 **UNACCEPTABLE - TIER F**\n\n`;
    feedback += `**CRITICAL FAILURE:** This report completely fails to meet minimum professional requirements and represents unacceptable work standards. Immediate corrective action and potential performance review required.\n\n`;
    feedback += `**⛔ ESCALATION RECOMMENDED:** This level of reporting suggests serious issues with work execution, professional standards, or commitment that require management intervention.\n\n`;
  }
  
  // Detailed metrics analysis
  feedback += `## 📈 **COMPREHENSIVE SCORING BREAKDOWN**\n\n`;
  feedback += `| **Category** | **Score** | **Max** | **Performance** | **Grade** |\n`;
  feedback += `|--------------|-----------|---------|-----------------|----------|\n`;
  feedback += `| **🔧 Technical Content** | **${technicalScore}** | 300 | ${Math.round((technicalScore/300)*100)}% | ${technicalScore >= 240 ? '🏆 A+' : technicalScore >= 180 ? '✅ B+' : technicalScore >= 120 ? '⚠️ C' : '🚨 F'} |\n`;
  feedback += `| **📦 Deliverables** | **${deliverableScore}** | 250 | ${Math.round((deliverableScore/250)*100)}% | ${deliverableScore >= 200 ? '🏆 A+' : deliverableScore >= 150 ? '✅ B+' : deliverableScore >= 100 ? '⚠️ C' : '🚨 F'} |\n`;
  feedback += `| **💬 Communication** | **${clarityScore}** | 200 | ${Math.round((clarityScore/200)*100)}% | ${clarityScore >= 160 ? '🏆 A+' : clarityScore >= 120 ? '✅ B+' : clarityScore >= 80 ? '⚠️ C' : '🚨 F'} |\n`;
  feedback += `| **🎯 Planning** | **${proactivityScore}** | 150 | ${Math.round((proactivityScore/150)*100)}% | ${proactivityScore >= 120 ? '🏆 A+' : proactivityScore >= 90 ? '✅ B+' : proactivityScore >= 60 ? '⚠️ C' : '🚨 F'} |\n`;
  feedback += `| **👔 Professionalism** | **${professionalismScore}** | 100 | ${Math.round((professionalismScore/100)*100)}% | ${professionalismScore >= 80 ? '🏆 A+' : professionalismScore >= 60 ? '✅ B+' : professionalismScore >= 40 ? '⚠️ C' : '🚨 F'} |\n\n`;
  
  // Report statistics
  feedback += `## 📋 **REPORT ANALYTICS**\n\n`;
  feedback += `- **📝 Word Count:** ${wordCount} words ${wordCount >= 200 ? '(Excellent detail)' : wordCount >= 100 ? '(Adequate)' : '(Insufficient)'}\n`;
  feedback += `- **📏 Character Length:** ${reportLength} characters\n`;
  feedback += `- **⏱️ Estimated Reading Time:** ${Math.ceil(wordCount / 200)} minute(s)\n`;
  feedback += `- **🔍 Detail Density:** ${(wordCount / Math.max(1, reportLength) * 100).toFixed(1)}% word efficiency\n\n`;
  
  // Flags section with detailed analysis
  if (flags > 0) {
    feedback += `## 🚩 **RED FLAGS DETECTED: ${flags}**\n\n`;
    if (flags >= 3) {
      feedback += `### 🚨 **CRITICAL ALERT - MULTIPLE SERIOUS DEFICIENCIES**\n\n`;
      feedback += `**IMMEDIATE INTERVENTION REQUIRED:** This report contains ${flags} serious deficiencies that indicate fundamental issues with work execution, professional standards, or reporting competency. Management review and corrective action plan required immediately.\n\n`;
      feedback += `**📋 RECOMMENDED ACTIONS:**\n`;
      feedback += `- Immediate one-on-one performance discussion\n`;
      feedback += `- Mandatory reporting standards training\n`;
      feedback += `- Weekly check-ins until standards improve\n`;
      feedback += `- Potential performance improvement plan consideration\n\n`;
    } else if (flags >= 1) {
      feedback += `### ⚠️ **WARNING - ISSUES REQUIRING ATTENTION**\n\n`;
      feedback += `**CORRECTIVE ACTION NEEDED:** This report contains ${flags} issue(s) that must be addressed in future submissions to maintain professional standards.\n\n`;
    }
  } else {
    feedback += `## ✅ **NO RED FLAGS - CLEAN PROFESSIONAL REPORT**\n\n`;
    feedback += `**EXCELLENT STANDARDS:** This report maintains professional standards without any critical deficiencies detected.\n\n`;
  }
  
  // Strengths section with detailed commendation
  if (strengths.length > 0) {
    feedback += `## 🌟 **IDENTIFIED STRENGTHS & COMMENDATIONS**\n\n`;
    strengths.forEach((strength, index) => {
      feedback += `### ✅ **Strength ${index + 1}:** ${strength}\n\n`;
    });
    
    if (totalScore >= 800) {
      feedback += `**🏆 SPECIAL RECOGNITION:** The combination of these strengths demonstrates exceptional professional competency and work execution that significantly exceeds standard expectations.\n\n`;
    }
  }
  
  // Improvements section with actionable guidance
  if (improvements.length > 0) {
    feedback += `## 📈 **PRIORITY IMPROVEMENT AREAS**\n\n`;
    improvements.forEach((improvement, index) => {
      feedback += `### 🎯 **Priority ${index + 1}:** ${improvement}\n\n`;
    });
  }
  
  // Specific tactical recommendations by category
  feedback += `## 💡 **TACTICAL IMPROVEMENT RECOMMENDATIONS**\n\n`;
  
  if (technicalScore < 200) {
    feedback += `### 🔧 **Technical Content Enhancement (${technicalScore}/300)**\n\n`;
    feedback += `**CRITICAL TECHNICAL DEFICIENCIES:** Your report severely lacks technical substance. Implement these **mandatory** improvements:\n\n`;
    feedback += `- **🛠️ Implementation Details:** Include specific technical approaches, methodologies, and tools used\n`;
    feedback += `- **⚡ Problem-Solving:** Document technical challenges encountered and exact solutions implemented\n`;
    feedback += `- **💻 Code & Architecture:** Reference specific code snippets, algorithms, or architectural decisions\n`;
    feedback += `- **🔗 Technology Integration:** Detail how different technologies and components work together\n`;
    feedback += `- **📊 Performance Metrics:** Include technical performance indicators and optimization results\n\n`;
  } else if (technicalScore >= 240) {
    feedback += `### 🏆 **Technical Excellence Achieved (${technicalScore}/300)**\n\n`;
    feedback += `**OUTSTANDING TECHNICAL DEPTH:** Your technical reporting demonstrates exceptional competency and attention to implementation detail.\n\n`;
  }
  
  if (deliverableScore < 150) {
    feedback += `### 📦 **Deliverable Focus Critical Upgrade (${deliverableScore}/250)**\n\n`;
    feedback += `**UNACCEPTABLE DELIVERABLE REPORTING:** Transform your approach immediately:\n\n`;
    feedback += `- **🎯 Concrete Outputs:** List specific features, modules, components, or systems completed\n`;
    feedback += `- **📊 Quantifiable Results:** Provide metrics, percentages, and measurable outcomes\n`;
    feedback += `- **🚫 Meeting Reduction:** Minimize meeting mentions unless tied to specific deliverable outcomes\n`;
    feedback += `- **✅ Completion Status:** Clearly state what percentage or stage of completion each deliverable has reached\n`;
    feedback += `- **🔗 Value Demonstration:** Explain how each deliverable contributes to project success\n\n`;
  } else if (deliverableScore >= 200) {
    feedback += `### 🎯 **Exceptional Deliverable Focus (${deliverableScore}/250)**\n\n`;
    feedback += `**OUTSTANDING RESULTS ORIENTATION:** Your deliverable reporting demonstrates excellent focus on concrete outcomes and measurable progress.\n\n`;
  }
  
  if (clarityScore < 120) {
    feedback += `### 💬 **Communication Standards Overhaul (${clarityScore}/200)**\n\n`;
    feedback += `**INADEQUATE PROFESSIONAL COMMUNICATION:** Implement immediate improvements:\n\n`;
    feedback += `- **📝 Length Expansion:** Aim for minimum 150-200 words with comprehensive detail\n`;
    feedback += `- **🏗️ Structure Improvement:** Use clear paragraphs, bullet points, and logical flow\n`;
    feedback += `- **📚 Context Provision:** Include background, methodology, and contextual information\n`;
    feedback += `- **✍️ Professional Language:** Maintain formal business communication standards throughout\n`;
    feedback += `- **🔍 Detail Enhancement:** Provide specific examples, explanations, and supporting information\n\n`;
  }
  
  if (proactivityScore < 90) {
    feedback += `### 🎯 **Strategic Planning Development (${proactivityScore}/150)**\n\n`;
    feedback += `**INSUFFICIENT FORWARD THINKING:** Enhance your strategic approach:\n\n`;
    feedback += `- **📅 Next Steps:** Provide specific, actionable next steps with timelines\n`;
    feedback += `- **🎯 Goal Setting:** Define clear objectives and milestones for upcoming work\n`;
    feedback += `- **💡 Initiative Display:** Show proactive problem-solving and improvement suggestions\n`;
    feedback += `- **📊 Timeline Planning:** Include realistic delivery expectations and scheduling\n`;
    feedback += `- **🔮 Risk Anticipation:** Identify potential challenges and mitigation strategies\n\n`;
  }
  
  // Final strategic assessment
  feedback += `## 🎯 **FINAL STRATEGIC ASSESSMENT**\n\n`;
  
  if (totalScore >= 800) {
    feedback += `### 🚀 **EXCEPTIONAL CONTRACTOR - TIER S PERFORMANCE**\n\n`;
    feedback += `This contractor demonstrates **exceptional professional competency** that significantly exceeds industry standards. The combination of technical excellence, deliverable focus, and professional communication indicates a high-value team member who should be:\n\n`;
    feedback += `- **🏆 Recognized** for outstanding performance\n`;
    feedback += `- **📈 Considered** for advanced responsibilities or leadership roles\n`;
    feedback += `- **💰 Prioritized** for continued engagement and potential rate increases\n`;
    feedback += `- **🎯 Utilized** as a standard-setting example for other contractors\n\n`;
    feedback += `**⚡ EFFICIENCY EXCELLENCE:** The speed and quality combination demonstrated here represents optimal contractor value delivery.\n\n`;
  } else if (totalScore >= 650) {
    feedback += `### ✅ **COMPETENT PROFESSIONAL - TIER A PERFORMANCE**\n\n`;
    feedback += `This contractor meets professional standards with room for growth. Continue engagement while implementing the identified improvements to achieve exceptional performance levels.\n\n`;
  } else if (totalScore >= 400) {
    feedback += `### ⚠️ **PERFORMANCE IMPROVEMENT REQUIRED - TIER C**\n\n`;
    feedback += `This contractor requires **immediate and comprehensive improvement** across all categories. Implement a structured improvement plan with weekly check-ins and specific milestones. Consider additional training and mentorship resources.\n\n`;
  } else {
    feedback += `### 🚨 **CRITICAL PERFORMANCE FAILURE - TIER F**\n\n`;
    feedback += `This contractor demonstrates **unacceptable professional standards** that require immediate intervention. Recommend:\n\n`;
    feedback += `- **📋 Immediate** performance review and improvement plan\n`;
    feedback += `- **🎓 Mandatory** professional development and reporting training\n`;
    feedback += `- **👥 Mentorship** assignment with proven high-performing contractor\n`;
    feedback += `- **⏰ Probationary** period with weekly performance monitoring\n`;
    feedback += `- **💼 Consider** contract renegotiation or alternative arrangements if no improvement\n\n`;
  }
  
  feedback += `---\n\n`;
  feedback += `**🤖 Analysis completed by SAURON AI - The ultimate contractor evaluation system**\n`;
  feedback += `*This analysis uses advanced AI evaluation techniques to ensure no BS reporting passes undetected.*`;
  
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
