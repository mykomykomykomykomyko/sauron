
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Zap, Code, Wrench, Calendar, Brain } from "lucide-react";
import { toast } from "sonner";
import { analyzeReport } from "@/services/aiAnalysis";
import { useAuth } from "@/contexts/AuthContext";

const QuickReportForm = () => {
  const { user } = useAuth();
  const [report, setReport] = useState("");
  const [period, setPeriod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!report.trim() || !period) {
      toast.error("Please fill in both the report and select a period");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to submit reports");
      return;
    }

    // Check if report meets minimum requirements for good scoring
    if (report.trim().length < 100) {
      toast.error("Report too brief. Please include more detail for better AI analysis (minimum 100 characters).");
      return;
    }

    const technicalTerms = ['implemented', 'developed', 'coded', 'built', 'created', 'designed', 'optimized', 'refactored', 'debugged', 'tested', 'deployed', 'integrated'];
    const hasTechnicalContent = technicalTerms.some(term => report.toLowerCase().includes(term));
    
    if (!hasTechnicalContent) {
      toast.error("Please include technical implementation details for better scoring.");
      return;
    }

    setIsSubmitting(true);

    try {
      const periodMap: { [key: string]: string } = {
        today: new Date().toISOString().split('T')[0],
        "this-week": new Date().toISOString().split('T')[0],
        "last-week": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "last-two-weeks": new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "last-month": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "last-quarter": new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "last-year": new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      const reportData = {
        name: user.user_metadata?.full_name || user.email || "Unknown User",
        email: user.email || "",
        project: "Quick Report",
        week: periodMap[period],
        report: report.trim(),
        user_id: user.id,
      };

      await analyzeReport(reportData);
      
      toast.success("Report submitted successfully! AI analysis complete.");
      setReport("");
      setPeriod("");
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const periodOptions = [
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "last-week", label: "Last Week" },
    { value: "last-two-weeks", label: "Last Two Weeks" },
    { value: "last-month", label: "Last Month" },
    { value: "last-quarter", label: "Last Quarter" },
    { value: "last-year", label: "Last Year" },
  ];

  // Character count and quality indicators
  const characterCount = report.length;
  const wordCount = report.split(/\s+/).filter(word => word.length > 0).length;
  const technicalTerms = ['implemented', 'developed', 'coded', 'built', 'created', 'designed', 'optimized', 'refactored', 'debugged', 'tested', 'deployed', 'integrated', 'api', 'database', 'frontend', 'backend', 'algorithm', 'function', 'feature'];
  const technicalScore = technicalTerms.filter(term => report.toLowerCase().includes(term)).length;

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 md:mb-20 px-4 sm:px-0">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 font-mono">
          Quick Report Submission
        </h2>
        <p className="text-gray-300 text-base md:text-lg px-2">
          Submit your progress report instantly with AI-powered analysis optimized for comprehensive scoring
        </p>
      </div>

      <Card className={`bg-black/80 border-2 transition-all duration-500 backdrop-blur-sm relative overflow-hidden ${
        isFocused ? 'border-red-500/70 shadow-2xl shadow-red-500/20' : 'border-red-700/50'
      }`}>
        {/* Animated glow effect */}
        {isFocused && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-600/30 to-red-500/20 animate-pulse pointer-events-none" />
        )}
        
        {/* Animated border glow */}
        {isFocused && (
          <div className="absolute inset-0 border-2 border-red-400/50 animate-pulse rounded-lg pointer-events-none border-glow" />
        )}

        <div className="p-4 sm:p-6 md:p-8 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Period Selector */}
            <div className="space-y-2 md:space-y-3">
              <label className="text-red-400 font-mono text-xs sm:text-sm uppercase tracking-wider">
                Report Period
              </label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className={`h-10 sm:h-12 bg-neutral-900/50 border-red-700/50 text-white font-mono transition-all duration-300 text-sm sm:text-base ${
                  period ? 'border-red-500/70 bg-red-900/20' : ''
                }`}>
                  <SelectValue placeholder="Select reporting period..." />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Report Text Field */}
            <div className="space-y-2 md:space-y-3">
              <label className="text-red-400 font-mono text-xs sm:text-sm uppercase tracking-wider">
                Comprehensive Progress Report
              </label>
              <div className="relative">
                <Textarea
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="For optimal AI scoring, include:
• Technical implementation details (algorithms, code, architecture)
• Specific completed features and deliverables
• Challenges solved and problem-solving approach
• Technology stack used (languages, frameworks, tools)
• Measurable progress and outcomes
• Next steps and future planning
• Time spent and specific achievements"
                  className={`min-h-[150px] sm:min-h-[180px] bg-neutral-900/50 border-red-700/50 text-white placeholder:text-gray-500 font-mono resize-none transition-all duration-300 text-sm sm:text-base ${
                    isFocused ? 'border-red-500/70 bg-red-900/10' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {isFocused && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 via-red-600/40 to-red-500/30 rounded-lg blur-sm pointer-events-none -z-10 animate-pulse" />
                )}
              </div>
              
              {/* Quality Indicators */}
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                <div className={`flex items-center space-x-1 ${characterCount >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                  <span>Characters: {characterCount}</span>
                  <span className="opacity-60">(min 100)</span>
                </div>
                <div className={`flex items-center space-x-1 ${wordCount >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                  <span>Words: {wordCount}</span>
                  <span className="opacity-60">(min 50)</span>
                </div>
                <div className={`flex items-center space-x-1 ${technicalScore >= 3 ? 'text-green-400' : 'text-yellow-400'}`}>
                  <Code className="w-3 h-3" />
                  <span>Technical Terms: {technicalScore}</span>
                  <span className="opacity-60">(min 3)</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-2 md:pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !report.trim() || !period}
                className={`px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-mono group relative overflow-hidden transition-all duration-300 w-full sm:w-auto ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                } ${
                  report.trim() && period ? 'bg-red-600 hover:bg-red-700 border-red-500/50' : 'bg-gray-600 hover:bg-gray-700 border-gray-500/50'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                
                {isSubmitting ? (
                  <>
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 relative z-10 animate-spin" />
                    <span className="relative z-10">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2 relative z-10 group-hover:animate-pulse" />
                    <span className="relative z-10">Submit Report</span>
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2 relative z-10 group-hover:animate-spin" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Scoring Guidelines */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Code, label: "Technical", points: "30pts", desc: "Implementation details" },
          { icon: Wrench, label: "Deliverables", points: "25pts", desc: "Completed features" },
          { icon: Brain, label: "Clarity", points: "20pts", desc: "Communication quality" },
          { icon: Calendar, label: "Planning", points: "15pts", desc: "Next steps" },
        ].map((item, index) => (
          <div key={index} className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
            <item.icon className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <div className="text-xs font-mono text-white">{item.label}</div>
            <div className="text-xs text-red-400 font-bold">{item.points}</div>
            <div className="text-xs text-gray-400">{item.desc}</div>
          </div>
        ))}
      </div>

      <style>{`
        .border-glow {
          animation: border-glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes border-glow {
          0% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
          }
          100% {
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default QuickReportForm;
