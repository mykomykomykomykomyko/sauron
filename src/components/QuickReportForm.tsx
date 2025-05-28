
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Zap } from "lucide-react";
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

    setIsSubmitting(true);

    try {
      // Convert period to a date format
      const periodMap: { [key: string]: string } = {
        today: new Date().toISOString().split('T')[0],
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
    { value: "last-week", label: "Last Week" },
    { value: "last-two-weeks", label: "Last Two Weeks" },
    { value: "last-month", label: "Last Month" },
    { value: "last-quarter", label: "Last Quarter" },
    { value: "last-year", label: "Last Year" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono">
          Quick Report Submission
        </h2>
        <p className="text-gray-300 text-lg">
          Submit your progress report instantly with AI-powered analysis
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

        <div className="p-8 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Period Selector */}
            <div className="space-y-3">
              <label className="text-red-400 font-mono text-sm uppercase tracking-wider">
                Report Period
              </label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className={`h-12 bg-neutral-900/50 border-red-700/50 text-white font-mono transition-all duration-300 ${
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
            <div className="space-y-3">
              <label className="text-red-400 font-mono text-sm uppercase tracking-wider">
                Progress Report
              </label>
              <div className="relative">
                <Textarea
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Describe your progress, achievements, challenges, and next steps..."
                  className={`min-h-[120px] bg-neutral-900/50 border-red-700/50 text-white placeholder:text-gray-500 font-mono resize-none transition-all duration-300 ${
                    isFocused ? 'border-red-500/70 bg-red-900/10' : ''
                  }`}
                  disabled={isSubmitting}
                />
                {isFocused && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 via-red-600/40 to-red-500/30 rounded-lg blur-sm pointer-events-none -z-10 animate-pulse" />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !report.trim() || !period}
                className={`px-8 py-4 text-lg font-mono group relative overflow-hidden transition-all duration-300 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                } ${
                  report.trim() && period ? 'bg-red-600 hover:bg-red-700 border-red-500/50' : 'bg-gray-600 hover:bg-gray-700 border-gray-500/50'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                
                {isSubmitting ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 relative z-10 animate-spin" />
                    <span className="relative z-10">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2 relative z-10 group-hover:animate-pulse" />
                    <span className="relative z-10">Submit Report</span>
                    <Sparkles className="w-4 h-4 ml-2 relative z-10 group-hover:animate-spin" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>

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
