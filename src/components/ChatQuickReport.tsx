
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, MessageSquare, Calendar } from "lucide-react";
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

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Card className={`bg-black/80 border-2 transition-all duration-300 backdrop-blur-sm ${
        isFocused ? 'border-red-500/70 shadow-lg shadow-red-500/20' : 'border-white/20'
      }`}>
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-mono font-semibold">Quick Report</h3>
              <p className="text-gray-400 text-sm">Submit your progress instantly</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-red-400" />
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-48 bg-black/20 border-white/20 text-white font-mono text-sm">
                  <SelectValue placeholder="Select period..." />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3">
              <div className="flex-1">
                <Textarea
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Describe your progress, achievements, challenges, and next steps..."
                  className={`bg-black/20 border-white/20 text-white placeholder:text-gray-500 font-mono resize-none transition-all duration-300 ${
                    isFocused ? 'border-red-500/70' : ''
                  }`}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !report.trim() || !period}
                className={`px-6 py-3 font-mono self-end ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  report.trim() && period ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
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
