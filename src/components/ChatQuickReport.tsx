
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, MessageSquare, Calendar, AlertTriangle, Code } from "lucide-react";
import { toast } from "sonner";
import { analyzeReport } from "@/services/aiAnalysis";
import { useAuth } from "@/contexts/AuthContext";

const ChatQuickReport = () => {
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

    // Quality checks for better scoring
    if (report.trim().length < 80) {
      toast.error("Report too brief for accurate AI analysis. Please add more detail.");
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

  // Quality indicators
  const characterCount = report.length;
  const technicalTerms = ['implemented', 'developed', 'coded', 'built', 'created', 'designed', 'completed', 'deployed', 'tested'];
  const hasTechnicalContent = technicalTerms.some(term => report.toLowerCase().includes(term));
  const qualityScore = characterCount >= 80 && hasTechnicalContent ? 'good' : characterCount >= 50 ? 'fair' : 'poor';

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <Card className={`bg-black/80 border-2 transition-all duration-300 backdrop-blur-sm ${
        isFocused ? 'border-red-500/70 shadow-lg shadow-red-500/20' : 'border-white/20'
      }`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-mono font-semibold text-sm sm:text-base">Quick Report</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Submit progress optimized for AI scoring</p>
            </div>
            {qualityScore === 'poor' && characterCount > 0 && (
              <div className="flex items-center space-x-1 text-yellow-400 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Add more detail</span>
              </div>
            )}
            {hasTechnicalContent && (
              <div className="flex items-center space-x-1 text-green-400 text-xs">
                <Code className="w-3 h-3" />
                <span>Technical content detected</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-red-400" />
                <span className="text-white font-mono text-xs sm:text-sm">Period:</span>
              </div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full sm:w-48 bg-black/20 border-white/20 text-white font-mono text-xs sm:text-sm">
                  <SelectValue placeholder="Select period..." />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white text-xs sm:text-sm">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex-1">
                <Textarea
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="For better AI scoring include: technical implementation details, specific completed features, challenges solved, technology stack, measurable progress, and next steps..."
                  className={`bg-black/20 border-white/20 text-white placeholder:text-gray-500 font-mono resize-none transition-all duration-300 text-xs sm:text-sm ${
                    isFocused ? 'border-red-500/70' : ''
                  }`}
                  rows={4}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between mt-1 text-xs">
                  <span className={`${characterCount >= 80 ? 'text-green-400' : characterCount >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {characterCount} chars (min 80 recommended)
                  </span>
                  <span className={`${hasTechnicalContent ? 'text-green-400' : 'text-gray-400'}`}>
                    {hasTechnicalContent ? '✓ Technical content' : 'Add technical details'}
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !report.trim() || !period}
                className={`px-4 sm:px-6 py-2 sm:py-3 font-mono self-end w-full sm:w-auto text-xs sm:text-sm ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  report.trim() && period ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Analyzing...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="hidden sm:inline">Submit</span>
                    <span className="sm:hidden">Send</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ChatQuickReport;
