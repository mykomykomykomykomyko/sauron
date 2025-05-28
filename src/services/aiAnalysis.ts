import { submitReport, saveAnalysisResult } from "./supabaseService";

interface ReportData {
  name: string;
  email: string;
  project: string;
  week: string;
  report: string;
  user_id: string;
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
}

// Helper function to sanitize text for JSON
const sanitizeForJson = (text: string): string => {
  return text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/[\uD800-\uDFFF]/g, '') // Remove surrogate pairs that might be malformed
    .trim();
};

// Helper function to safely create JSON object
const createSafeDetailedFeedback = (analysisData: any) => {
  try {
    // Sanitize all string values in the object
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return sanitizeForJson(obj);
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[sanitizeForJson(key)] = sanitizeObject(value);
        }
        return sanitized;
      }
      return obj;
    };

    const sanitizedData = sanitizeObject(analysisData);
    
    // Test if the object can be safely stringified
    JSON.stringify(sanitizedData);
    
    return sanitizedData;
  } catch (error) {
    console.error('Error creating detailed feedback:', error);
    // Return a safe fallback object
    return {
      error: "Analysis data could not be processed safely",
      timestamp: new Date().toISOString(),
      fallback: true
    };
  }
};

export const analyzeReport = async (reportData: ReportData) => {
  console.log('Starting detailed analysis for report:', reportData.report.substring(0, 100) + '...');
  
  try {
    // Submit the report first
    const submittedReport = await submitReport(reportData);
    console.log('Report submitted successfully:', submittedReport);

    // Perform comprehensive analysis
    const analysisResult = performComprehensiveAnalysis(reportData.report);
    console.log('Score breakdown:', analysisResult.scoreBreakdown);

    // Create comprehensive markdown feedback
    const detailedMarkdownFeedback = generateComprehensiveMarkdownReport(analysisResult, reportData.report);

    // Create safe detailed feedback
    const safeDetailedFeedback = createSafeDetailedFeedback({
      feedback: detailedMarkdownFeedback,
      scoreBreakdown: analysisResult.scoreBreakdown,
      recommendations: analysisResult.recommendations,
      strengths: analysisResult.strengths,
      improvements: analysisResult.improvements,
      executiveSummary: analysisResult.executiveSummary,
      detailedAnalysis: analysisResult.detailedAnalysis,
      strategicAssessment: analysisResult.strategicAssessment,
      timestamp: new Date().toISOString(),
      reportLength: reportData.report.length,
      wordCount: reportData.report.split(/\s+/).length
    });

    // Save analysis result with safe JSON
    const analysisResultData = {
      report_id: submittedReport.id!,
      score: analysisResult.totalScore,
      status: analysisResult.totalScore >= 800 ? 'validated' : 
              analysisResult.totalScore >= 600 ? 'review' : 'flagged' as 'validated' | 'review' | 'flagged',
      flags: analysisResult.flags,
      summary: sanitizeForJson(analysisResult.summary),
      detailed_feedback: safeDetailedFeedback
    };

    console.log('Saving analysis result with safe JSON...');
    await saveAnalysisResult(analysisResultData);
    console.log('Analysis completed and saved successfully');

    return {
      report: submittedReport,
      analysis: analysisResultData
    };
  } catch (error) {
    console.error('Error in analyzeReport:', error);
    throw error;
  }
};

const generateComprehensiveMarkdownReport = (analysisResult: any, reportText: string): string => {
  const { scoreBreakdown, totalScore, flags } = analysisResult;
  const tier = totalScore >= 800 ? "**EXCEPTIONAL**" : totalScore >= 650 ? "**PROFICIENT**" : totalScore >= 500 ? "**DEVELOPING**" : "**NEEDS IMPROVEMENT**";
  const wordCount = reportText.split(/\s+/).length;
  
  return `# 🎯 SAURON Analysis Report

## Overall Performance: ${tier}
**Final Score: ${totalScore}/1000 Points**

### 📊 Performance Metrics Dashboard
| Metric | Score | Maximum | Percentage |
|--------|-------|---------|------------|
| **Technical Content** | ${scoreBreakdown.technicalContentScore} | 300 | ${Math.round((scoreBreakdown.technicalContentScore/300)*100)}% |
| **Deliverables** | ${scoreBreakdown.deliverableScore} | 250 | ${Math.round((scoreBreakdown.deliverableScore/250)*100)}% |
| **Communication Clarity** | ${scoreBreakdown.clarityScore} | 200 | ${Math.round((scoreBreakdown.clarityScore/200)*100)}% |
| **Strategic Planning** | ${scoreBreakdown.proactivityScore} | 150 | ${Math.round((scoreBreakdown.proactivityScore/150)*100)}% |
| **Professionalism** | ${scoreBreakdown.professionalismScore} | 100 | ${Math.round((scoreBreakdown.professionalismScore/100)*100)}% |

---

## 🚩 Quality Assessment: ${flags} Red Flags Identified

${flags > 0 ? `**Areas Requiring Immediate Attention:**
${flags >= 1 ? '• Report length below professional standards' : ''}
${flags >= 2 ? '• Insufficient technical implementation details' : ''}
${flags >= 3 ? '• Lack of concrete deliverable documentation' : ''}` : '✅ **No Critical Issues Detected** - Report meets quality standards'}

---

## 📈 Detailed Category Analysis

### 🔧 **Technical Content Evaluation** (${scoreBreakdown.technicalContentScore}/300)
${scoreBreakdown.technicalContentScore >= 240 ? 
  "🌟 **EXCEPTIONAL PERFORMANCE**: Demonstrates mastery of technical concepts with comprehensive implementation details and advanced problem-solving approaches." :
  scoreBreakdown.technicalContentScore >= 180 ?
  "✅ **STRONG TECHNICAL FOUNDATION**: Solid technical implementation with good coverage of methodologies and problem-solving approaches." :
  scoreBreakdown.technicalContentScore >= 120 ?
  "⚡ **DEVELOPING TECHNICAL SKILLS**: Basic technical concepts present. Recommend expanding on implementation details and technical decision-making processes." :
  "🔧 **TECHNICAL ENHANCEMENT REQUIRED**: Limited technical depth detected. Significant improvement needed in technical documentation and implementation specifics."
}

### 🚀 **Deliverables Assessment** (${scoreBreakdown.deliverableScore}/250)
${scoreBreakdown.deliverableScore >= 200 ?
  "🏆 **OUTSTANDING DELIVERY**: Clear evidence of significant accomplishments with measurable outcomes and concrete results." :
  scoreBreakdown.deliverableScore >= 150 ?
  "✅ **SOLID EXECUTION**: Good deliverable tracking with tangible results and clear completion indicators." :
  scoreBreakdown.deliverableScore >= 100 ?
  "📈 **MODERATE PROGRESS**: Some deliverable evidence present. Consider providing more specific completion metrics and outcomes." :
  "📋 **DELIVERABLE CLARITY NEEDED**: Limited evidence of concrete accomplishments. Requires stronger documentation of completed work and measurable results."
}

### 📝 **Communication Excellence** (${scoreBreakdown.clarityScore}/200)
${scoreBreakdown.clarityScore >= 160 ?
  "🌟 **EXCEPTIONAL COMMUNICATION**: Outstanding clarity, structure, and professional presentation with comprehensive detail." :
  scoreBreakdown.clarityScore >= 120 ?
  "✅ **EFFECTIVE COMMUNICATION**: Well-structured presentation with appropriate detail and professional tone." :
  scoreBreakdown.clarityScore >= 80 ?
  "📖 **ADEQUATE COMMUNICATION**: Basic communication standards met. Consider enhancing structure and detail for greater impact." :
  "💬 **COMMUNICATION ENHANCEMENT NEEDED**: Significant improvement required in report structure, clarity, and professional presentation."
}

### 🎯 **Strategic Planning & Vision** (${scoreBreakdown.proactivityScore}/150)
${scoreBreakdown.proactivityScore >= 120 ?
  "🚀 **STRATEGIC EXCELLENCE**: Exceptional forward-thinking with clear roadmaps, timelines, and strategic vision." :
  scoreBreakdown.proactivityScore >= 90 ?
  "📋 **GOOD PLANNING**: Solid planning elements with reasonable forward-looking perspective and goal setting." :
  scoreBreakdown.proactivityScore >= 60 ?
  "⏭️ **BASIC PLANNING**: Some planning elements present. Consider developing more comprehensive strategic approaches." :
  "🔮 **STRATEGIC DEVELOPMENT NEEDED**: Limited strategic planning evident. Recommend implementing structured goal-setting and timeline development."
}

### 💼 **Professional Standards** (${scoreBreakdown.professionalismScore}/100)
${scoreBreakdown.professionalismScore >= 80 ?
  "🌟 **EXEMPLARY PROFESSIONALISM**: Maintains highest professional standards with polished presentation and attention to detail." :
  scoreBreakdown.professionalismScore >= 60 ?
  "✅ **PROFESSIONAL QUALITY**: Meets professional expectations with appropriate tone, structure, and presentation." :
  scoreBreakdown.professionalismScore >= 40 ?
  "📊 **ACCEPTABLE STANDARDS**: Basic professional requirements met with minor opportunities for enhancement." :
  "🎭 **PROFESSIONAL REFINEMENT NEEDED**: Professional presentation requires significant improvement in tone, structure, and attention to detail."
}

---

## ⚡ Performance Highlights

${totalScore >= 800 ? "🏆 **ELITE PERFORMANCE TIER**" : totalScore >= 650 ? "⭐ **HIGH PERFORMANCE TIER**" : totalScore >= 500 ? "📈 **DEVELOPING PERFORMANCE TIER**" : "🎯 **IMPROVEMENT FOCUS TIER**"}

**Speed & Quality Assessment:**
${wordCount >= 400 ? "🚀 **High-Velocity Delivery**: Comprehensive report demonstrating rapid, high-quality output" : wordCount >= 200 ? "⚡ **Efficient Delivery**: Good balance of speed and detail in report generation" : "🐌 **Paced Delivery**: Consider increasing report comprehensiveness for greater impact"}

**Implementation Velocity:** ${scoreBreakdown.technicalContentScore >= 180 && wordCount >= 300 ? "**RAPID EXECUTION** - Impressive combination of speed and technical depth" : scoreBreakdown.technicalContentScore >= 120 ? "**STEADY PROGRESS** - Consistent technical advancement" : "**BUILDING MOMENTUM** - Focus on accelerating technical implementation"}

---

## 🎯 Strategic Recommendations

${generateTailoredRecommendations(totalScore, scoreBreakdown, flags, wordCount)}

---

## 🏅 Final Assessment & Next Steps

${generateFinalAssessment(totalScore, scoreBreakdown, wordCount)}

---

*Analysis completed by SAURON AI Evaluation System | ${new Date().toISOString().split('T')[0]} | Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}*`;
};

const generateTailoredRecommendations = (totalScore: number, scoreBreakdown: any, flags: number, wordCount: number): string => {
  const recommendations = [];
  
  if (totalScore >= 800) {
    recommendations.push("🌟 **Excellence Maintenance**: Continue this exceptional standard as a performance benchmark for the organization");
    recommendations.push("🧠 **Knowledge Leadership**: Consider mentoring team members and documenting best practices for knowledge transfer");
    recommendations.push("🚀 **Innovation Catalyst**: Explore cutting-edge technologies and lead experimental initiatives");
  } else if (totalScore >= 650) {
    recommendations.push("📊 **Performance Optimization**: Focus on achieving consistency in technical depth and implementation detail");
    recommendations.push("🎯 **Precision Enhancement**: Increase specificity in deliverable documentation and outcome measurement");
    recommendations.push("⚡ **Acceleration Opportunity**: Build on current strengths to achieve elite performance tier");
  } else {
    recommendations.push("🔧 **Technical Foundation Building**: Significantly enhance technical terminology usage and implementation specifics");
    recommendations.push("📋 **Deliverable Documentation**: Establish clear patterns for documenting completed work and measurable outcomes");
    recommendations.push("📈 **Structural Improvement**: Expand report comprehensiveness and organizational clarity");
  }
  
  // Specific tactical recommendations
  if (scoreBreakdown.technicalContentScore < 150) {
    recommendations.push("💻 **Technical Vocabulary Expansion**: Incorporate specific implementation methodologies, algorithms, and architectural decisions");
  }
  if (scoreBreakdown.deliverableScore < 100) {
    recommendations.push("✅ **Completion Tracking**: Implement systematic documentation of finished features, metrics, and business impact");
  }
  if (flags > 1) {
    recommendations.push("🚨 **Quality Assurance**: Address identified quality gaps through structured improvement protocols");
  }
  
  return recommendations.map(rec => `${rec}\n`).join('\n');
};

const generateFinalAssessment = (totalScore: number, scoreBreakdown: any, wordCount: number): string => {
  const velocity = wordCount >= 400 && scoreBreakdown.technicalContentScore >= 180 ? "**HIGH-VELOCITY**" : 
                  wordCount >= 200 && scoreBreakdown.technicalContentScore >= 120 ? "**STEADY-STATE**" : "**BUILDING**";
  
  const impact = totalScore >= 750 ? "**TRANSFORMATIONAL IMPACT**" : 
                totalScore >= 600 ? "**SIGNIFICANT IMPACT**" : 
                totalScore >= 450 ? "**MODERATE IMPACT**" : "**DEVELOPING IMPACT**";
  
  const recommendation = totalScore >= 800 ? "**IMMEDIATE ADVANCEMENT CONSIDERATION** - Ready for leadership responsibilities and complex technical challenges" :
                        totalScore >= 650 ? "**STRONG PERFORMANCE RECOGNITION** - Excellent candidate for increased project ownership and mentorship opportunities" :
                        totalScore >= 500 ? "**CONTINUED DEVELOPMENT PATHWAY** - Focus on technical skill enhancement with structured growth plan" :
                        "**INTENSIVE IMPROVEMENT PROGRAM** - Implement comprehensive development strategy with regular milestone tracking";
  
  return `**Development Velocity:** ${velocity}
**Business Impact Level:** ${impact}

${totalScore >= 800 ? 
  "🏆 **ELITE PERFORMER**: This individual demonstrates exceptional capabilities that significantly accelerate project success. Exhibits mastery-level technical skills combined with outstanding communication and strategic thinking. Recommended for high-visibility initiatives and leadership development programs." :
  totalScore >= 650 ?
  "⭐ **HIGH PERFORMER**: Consistently delivers quality results with strong technical foundation and professional execution. Demonstrates reliable performance with clear growth trajectory toward elite tier. Excellent candidate for expanded responsibilities." :
  totalScore >= 500 ?
  "📈 **DEVELOPING CONTRIBUTOR**: Shows solid potential with established foundation. Focus areas identified for targeted improvement. With proper development support, positioned for significant advancement within defined timeframe." :
  "🎯 **IMPROVEMENT OPPORTUNITY**: Significant development potential identified. Requires structured improvement plan with regular check-ins and mentorship support. Clear pathway to success with focused effort and guidance."
}

**Strategic Recommendation:** ${recommendation}`;
};

const performComprehensiveAnalysis = (report: string) => {
  const reportLower = report.toLowerCase();
  const wordCount = report.split(/\s+/).length;
  const characterCount = report.length;
  
  // Technical Content Analysis (300 points max)
  let technicalContentScore = 0;
  const technicalTerms = ['implemented', 'developed', 'coded', 'built', 'created', 'designed', 'optimized', 'refactored', 'debugged', 'tested', 'deployed', 'integrated', 'api', 'database', 'frontend', 'backend', 'algorithm', 'function', 'feature', 'architecture', 'framework', 'library', 'component', 'module', 'service'];
  const technicalCount = technicalTerms.filter(term => reportLower.includes(term)).length;
  technicalContentScore = Math.min(technicalCount * 12, 300);

  // Deliverable Score (250 points max)
  let deliverableScore = 0;
  const deliverableTerms = ['completed', 'finished', 'delivered', 'deployed', 'launched', 'released', 'achieved', 'accomplished', 'built', 'created', 'implemented'];
  const deliverableCount = deliverableTerms.filter(term => reportLower.includes(term)).length;
  deliverableScore = Math.min(deliverableCount * 25, 250);

  // Clarity Score (200 points max)
  let clarityScore = 0;
  if (wordCount >= 200) clarityScore += 50;
  if (wordCount >= 400) clarityScore += 50;
  if (characterCount >= 1000) clarityScore += 50;
  if (report.includes('\n') || report.includes('.')) clarityScore += 50;

  // Proactivity Score (150 points max)
  let proactivityScore = 0;
  const proactiveTerms = ['next steps', 'planning', 'future', 'roadmap', 'timeline', 'goals', 'objectives', 'strategy', 'vision'];
  const proactiveCount = proactiveTerms.filter(term => reportLower.includes(term)).length;
  proactivityScore = Math.min(proactiveCount * 30, 100);
  if (reportLower.includes('timeline') || reportLower.includes('deadline')) proactivityScore += 25;
  if (reportLower.includes('milestone') || reportLower.includes('deliverable')) proactivityScore += 25;

  // Professionalism Score (100 points max)
  let professionalismScore = 0;
  if (wordCount >= 100) professionalismScore += 25;
  if (!report.includes('lol') && !report.includes('haha') && !report.includes('whatever')) professionalismScore += 25;
  if (report.match(/[A-Z]/)) professionalismScore += 25;
  if (wordCount >= 150) professionalismScore += 25;

  const totalScore = technicalContentScore + deliverableScore + clarityScore + proactivityScore + professionalismScore;
  
  // Determine flags
  let flags = 0;
  if (wordCount < 50) flags += 1;
  if (technicalCount < 3) flags += 1;
  if (deliverableCount < 2) flags += 1;

  // Generate comprehensive analysis components
  const executiveSummary = generateExecutiveSummary(totalScore, technicalCount, deliverableCount, wordCount);
  const detailedAnalysis = generateDetailedAnalysis(technicalContentScore, deliverableScore, clarityScore, proactivityScore, professionalismScore);
  const recommendations = generateRecommendations(totalScore, flags, technicalCount, deliverableCount);
  const strengths = generateStrengths(technicalContentScore, deliverableScore, clarityScore);
  const improvements = generateImprovements(flags, technicalContentScore, deliverableScore);
  const strategicAssessment = generateStrategicAssessment(totalScore, wordCount, technicalCount);

  return {
    totalScore,
    flags,
    summary: executiveSummary,
    scoreBreakdown: {
      technicalContentScore,
      deliverableScore,
      clarityScore,
      proactivityScore,
      professionalismScore,
      totalScore
    },
    executiveSummary,
    detailedAnalysis,
    recommendations,
    strengths,
    improvements,
    strategicAssessment
  };
};

const generateExecutiveSummary = (score: number, techCount: number, deliverableCount: number, wordCount: number): string => {
  const tier = score >= 800 ? "**EXCEPTIONAL**" : score >= 650 ? "**PROFICIENT**" : score >= 500 ? "**DEVELOPING**" : "**NEEDS IMPROVEMENT**";
  
  return `## 🎯 Executive Summary\n\n**Overall Performance: ${tier}** | **Score: ${score}/1000**\n\nThis comprehensive analysis evaluated your report across five critical dimensions. ${score >= 800 ? "Outstanding work demonstrating exceptional technical depth and professional communication." : score >= 650 ? "Strong performance with clear technical contributions and solid delivery focus." : score >= 500 ? "Good foundation with room for enhancement in technical depth and detail." : "Significant opportunities for improvement in technical documentation and deliverable clarity."}\n\n**Key Metrics:**\n- Technical Terminology Usage: ${techCount} terms identified\n- Deliverable Indicators: ${deliverableCount} completion markers\n- Report Comprehensiveness: ${wordCount} words\n- Professional Structure: ${wordCount >= 200 ? "Well-structured" : "Needs expansion"}`;
};

const generateDetailedAnalysis = (tech: number, deliv: number, clarity: number, proact: number, prof: number): string => {
  return `## 📊 Detailed Performance Analysis\n\n### **Technical Content Evaluation** (${tech}/300 points)\n${tech >= 240 ? "🌟 **EXCEPTIONAL**: Demonstrates mastery of technical concepts with comprehensive implementation details." : tech >= 180 ? "✅ **PROFICIENT**: Strong technical foundation with good implementation coverage." : tech >= 120 ? "⚡ **DEVELOPING**: Basic technical concepts present, needs deeper technical exposition." : "🔧 **IMPROVEMENT NEEDED**: Limited technical depth, requires substantial technical detail enhancement."}\n\n### **Deliverables Assessment** (${deliv}/250 points)\n${deliv >= 200 ? "🚀 **OUTSTANDING**: Clear evidence of significant deliverable completion with measurable outcomes." : deliv >= 150 ? "✅ **SOLID**: Good deliverable tracking with tangible results demonstrated." : deliv >= 100 ? "📈 **MODERATE**: Some deliverable evidence present, could benefit from more specific outcomes." : "📋 **NEEDS FOCUS**: Limited deliverable clarity, requires stronger completion documentation."}\n\n### **Communication Clarity** (${clarity}/200 points)\n${clarity >= 160 ? "📝 **EXCELLENT**: Exceptionally clear, well-structured communication with comprehensive detail." : clarity >= 120 ? "✅ **EFFECTIVE**: Good communication structure with adequate detail and clarity." : clarity >= 80 ? "📖 **ADEQUATE**: Basic communication effectiveness, room for structural improvement." : "💬 **ENHANCEMENT NEEDED**: Communication clarity requires significant improvement."}\n\n### **Strategic Planning** (${proact}/150 points)\n${proact >= 120 ? "🎯 **STRATEGIC**: Excellent forward-thinking with clear roadmap and milestone planning." : proact >= 90 ? "📋 **PLANNED**: Good planning elements with reasonable forward-looking perspective." : proact >= 60 ? "⏭️ **BASIC**: Some planning elements present, could benefit from strategic depth." : "🔮 **DEVELOPMENT NEEDED**: Limited strategic planning, requires enhanced future-focus."}\n\n### **Professional Standards** (${prof}/100 points)\n${prof >= 80 ? "💼 **EXEMPLARY**: Maintains highest professional standards with polished presentation." : prof >= 60 ? "✅ **PROFESSIONAL**: Meets professional expectations with appropriate tone and structure." : prof >= 40 ? "📊 **ACCEPTABLE**: Basic professional standards met, minor improvements possible." : "🎭 **REFINEMENT NEEDED**: Professional presentation requires enhancement."}`;
};

const generateRecommendations = (score: number, flags: number, techCount: number, delivCount: number): string => {
  const recs = [];
  
  if (score >= 800) {
    recs.push("🌟 **Continue Excellence**: Maintain this exceptional standard as a benchmark for team performance.");
    recs.push("📚 **Knowledge Sharing**: Consider mentoring others and documenting best practices.");
    recs.push("🚀 **Innovation Focus**: Explore cutting-edge technologies and methodologies.");
  } else if (score >= 650) {
    recs.push("📈 **Optimization**: Focus on increasing technical depth and implementation details.");
    recs.push("🎯 **Precision**: Enhance specific deliverable documentation and metrics.");
  } else {
    recs.push("🔧 **Technical Enhancement**: Significantly increase technical terminology and implementation details.");
    recs.push("📋 **Deliverable Focus**: Clearly document completed features and measurable outcomes.");
    recs.push("📝 **Structure Improvement**: Expand report length and improve organizational clarity.");
  }
  
  if (techCount < 5) recs.push("💻 **Technical Vocabulary**: Incorporate more specific technical terms and methodologies.");
  if (delivCount < 3) recs.push("✅ **Completion Documentation**: Better highlight finished deliverables and achievements.");
  if (flags > 0) recs.push("🚨 **Quality Standards**: Address identified areas for immediate improvement.");
  
  return `## 🎯 Strategic Recommendations\n\n${recs.map(rec => `${rec}\n`).join('\n')}`;
};

const generateStrengths = (tech: number, deliv: number, clarity: number): string => {
  const strengths = [];
  
  if (tech >= 200) strengths.push("🔧 **Technical Mastery**: Demonstrates strong technical implementation capabilities");
  if (deliv >= 180) strengths.push("🚀 **Delivery Excellence**: Shows consistent ability to complete and document deliverables");
  if (clarity >= 140) strengths.push("📝 **Communication Skills**: Exhibits clear, professional communication standards");
  if (tech >= 150 && deliv >= 150) strengths.push("⚡ **Execution Speed**: Balanced technical implementation with rapid delivery");
  
  if (strengths.length === 0) {
    strengths.push("🌱 **Growth Potential**: Foundational elements present for significant improvement");
    strengths.push("📈 **Development Opportunity**: Clear pathway for enhanced performance");
  }
  
  return `## 💪 Key Strengths Identified\n\n${strengths.map(strength => `${strength}\n`).join('\n')}`;
};

const generateImprovements = (flags: number, tech: number, deliv: number): string => {
  const improvements = [];
  
  if (tech < 150) improvements.push("🔧 **Technical Depth**: Expand on implementation methodologies, algorithms, and technical decision-making processes");
  if (deliv < 150) improvements.push("📋 **Deliverable Documentation**: Provide more specific details about completed features, metrics, and outcomes");
  if (flags > 1) improvements.push("📏 **Report Comprehensiveness**: Increase overall detail and length for more thorough analysis");
  
  if (improvements.length === 0) {
    improvements.push("🎯 **Optimization Opportunities**: Fine-tune existing strengths for even higher performance");
  }
  
  return `## 🔄 Areas for Enhancement\n\n${improvements.map(improvement => `${improvement}\n`).join('\n')}`;
};

const generateStrategicAssessment = (score: number, wordCount: number, techCount: number): string => {
  const velocity = wordCount >= 300 && techCount >= 8 ? "**HIGH-VELOCITY**" : 
                  wordCount >= 200 && techCount >= 5 ? "**STEADY**" : "**BUILDING**";
  
  const impact = score >= 750 ? "**HIGH IMPACT**" : score >= 600 ? "**MODERATE IMPACT**" : "**DEVELOPING IMPACT**";
  
  return `## 🎖️ Strategic Performance Assessment\n\n**Development Velocity: ${velocity}**\n**Business Impact: ${impact}**\n\n${score >= 800 ? "🏆 **ELITE PERFORMER**: This individual demonstrates exceptional capabilities that significantly drive project success. Recommend for leadership opportunities and complex technical challenges." : score >= 650 ? "⭐ **STRONG CONTRIBUTOR**: Reliable performer with solid technical skills. Well-positioned for increased responsibilities and project ownership." : score >= 500 ? "📈 **DEVELOPING TALENT**: Shows promise with room for growth. Focus on technical skill development and delivery processes." : "🎯 **GROWTH OPPORTUNITY**: Requires focused development in technical documentation and delivery practices. Recommend mentorship and structured improvement plan."}\n\n**Recommendation Level**: ${score >= 800 ? "Immediate advancement consideration" : score >= 650 ? "Strong performance recognition" : score >= 500 ? "Continued development support" : "Intensive improvement program"}`;
};
