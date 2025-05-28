
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportId } = await req.json();
    
    if (!reportId) {
      return new Response(JSON.stringify({ error: 'Report ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the report data
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      console.error('Error fetching report:', reportError);
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.error('Gemini API key not found');
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhanced analysis prompt with strict evaluation criteria
    const analysisPrompt = `You are SAURON, a strict AI evaluator for contractor progress reports. Your job is to rigorously assess reports and identify contractors who are not delivering real work.

SCORING SYSTEM: Rate from 0-1000 points based on these criteria:

**TECHNICAL CONTENT (300 points max):**
- Specific implementation details, code, algorithms (200 points)
- Technical challenges and problem-solving (50 points)  
- Technology stack and architectural decisions (50 points)

**DELIVERABLES (250 points max):**
- Concrete completed features/modules (200 points)
- Measurable progress and outcomes (50 points)
- RED FLAG: Multiple meetings mentioned without deliverables = 0 points + flags

**CLARITY & COMMUNICATION (200 points max):**
- Report length and detail (100 points)
- Structure and organization (50 points)
- Professional language and formatting (50 points)

**PROACTIVITY & PLANNING (150 points max):**
- Specific next steps and timelines (100 points)
- Initiative and forward-thinking (50 points)

**PROFESSIONALISM (100 points max):**
- Proper formatting and grammar (50 points)
- Professional tone and time specificity (50 points)

**STRICT EVALUATION RULES:**
1. Committee meetings without deliverables = RED FLAG + point deduction
2. Vague progress reports = significant point deduction  
3. No technical details = major point deduction
4. No concrete outputs = flagged status
5. Reports under 50 words = unacceptable

**FLAGS SYSTEM:**
- 0 flags: Validated (score typically 650+)
- 1-2 flags: Needs Review (score typically 400-649)
- 3+ flags: Flagged/Unacceptable (score typically <400)

Report to analyze:
- Name: ${report.name}
- Project: ${report.project}
- Week: ${report.week}
- Content: ${report.report}

Provide analysis in JSON format with markdown-formatted detailed_feedback:

{
  "score": number_0_to_1000,
  "summary": "brief summary with score tier (EXCEPTIONAL/GOOD/NEEDS IMPROVEMENT/UNACCEPTABLE)",
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2"],
  "flags": number_of_red_flags,
  "status": "validated|review|flagged",
  "detailed_feedback": "# SAURON Analysis Report\\n\\n## Overall Score: X/1000\\n\\n**TIER:** Description\\n\\n## Score Breakdown\\n\\n| Category | Score | Max | Percentage |\\n|----------|-------|-----|------------|\\n| Technical Content | X | 300 | X% |\\n| Deliverables | X | 250 | X% |\\n| Clarity & Communication | X | 200 | X% |\\n| Proactivity & Planning | X | 150 | X% |\\n| Professionalism | X | 100 | X% |\\n\\n## 🚩 Red Flags: X\\n\\n[flag descriptions if any]\\n\\n## ✅ Strengths\\n\\n- [list strengths]\\n\\n## 📈 Areas for Improvement\\n\\n- [list improvements]\\n\\n## 🎯 Specific Recommendations\\n\\n[detailed recommendations by category]\\n\\n## 📋 Final Assessment\\n\\n[final assessment paragraph]"
}

Be extremely strict. No work done = low score. Meetings without outputs = flags. Demand concrete technical deliverables.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: analysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to analyze report with Gemini' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error('No candidates in Gemini response:', geminiData);
      return new Response(JSON.stringify({ error: 'No analysis generated' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const analysisText = geminiData.candidates[0].content.parts[0].text;
    
    let analysis;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : analysisText;
      analysis = JSON.parse(jsonText);
      
      // Ensure score is within 0-1000 range
      analysis.score = Math.max(0, Math.min(1000, analysis.score));
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', analysisText);
      
      // Fallback analysis with strict evaluation
      const reportLength = report.report.length;
      const hasDeliverables = report.report.toLowerCase().includes('completed') || 
                             report.report.toLowerCase().includes('implemented');
      
      let fallbackScore = 200; // Start low
      if (hasDeliverables) fallbackScore += 200;
      if (reportLength > 100) fallbackScore += 150;
      
      analysis = {
        score: fallbackScore,
        summary: `Report analyzed with fallback system - Score: ${fallbackScore}/1000`,
        strengths: hasDeliverables ? ["Contains deliverable mentions"] : [],
        improvements: ["Provide more technical implementation details", "Include specific completed features"],
        flags: hasDeliverables ? 1 : 3,
        status: fallbackScore < 400 ? "flagged" : (fallbackScore < 650 ? "review" : "validated"),
        detailed_feedback: `# SAURON Analysis Report\n\n## Overall Score: ${fallbackScore}/1000\n\n**FALLBACK ANALYSIS** - Original AI response could not be parsed.\n\n## Assessment\n\nThis report received a fallback analysis. ${hasDeliverables ? 'Some deliverables mentioned.' : 'No clear deliverables identified.'} Report requires more technical detail and specific implementation information.`
      };
    }

    // Save analysis result to database
    const { data: analysisResult, error: analysisError } = await supabase
      .from('analysis_results')
      .upsert({
        report_id: reportId,
        score: analysis.score,
        status: analysis.status,
        flags: analysis.flags,
        summary: analysis.summary,
        detailed_feedback: {
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          feedback: analysis.detailed_feedback
        }
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error saving analysis:', analysisError);
      return new Response(JSON.stringify({ error: 'Failed to save analysis' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisResult 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-report function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
