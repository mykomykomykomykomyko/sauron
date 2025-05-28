import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileText, Brain, Clock, User, Building, Calendar, Target, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Report, AnalysisResult, triggerAIAnalysis } from "@/services/supabaseService";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReportDetailsProps {
  report: Report & { analysis_results?: AnalysisResult[] };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Improved markdown renderer with better formatting
const renderMarkdownText = (text: string) => {
  if (!text) return null;

  // Split by lines and process each line
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];

  let inTable = false;
  let tableHeaders: string[] = [];

  lines.forEach((line, index) => {
    const key = `line-${index}`;
    
    // Skip empty lines
    if (!line.trim()) {
      elements.push(<div key={key} className="h-2"></div>);
      return;
    }

    // Headers with proper styling
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key} className="text-xl font-bold text-white mt-6 mb-4 border-b border-gray-700 pb-2">
          {line.substring(2).replace(/\*+/g, '')}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key} className="text-lg font-semibold text-blue-300 mt-5 mb-3">
          {line.substring(3).replace(/\*+/g, '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key} className="text-base font-semibold text-purple-300 mt-4 mb-2">
          {line.substring(4).replace(/\*+/g, '')}
        </h3>
      );
    }
    // Table detection and rendering
    else if (line.includes('|') && line.includes('Metric')) {
      inTable = true;
      tableHeaders = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      elements.push(
        <div key={key} className="overflow-x-auto mt-4 mb-4">
          <table className="w-full border-collapse border border-gray-600 text-sm">
            <thead>
              <tr className="bg-gray-800">
                {tableHeaders.map((header, cellIndex) => (
                  <th key={cellIndex} className="border border-gray-600 px-3 py-2 text-left text-gray-200 font-medium">
                    {header.replace(/\*+/g, '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id={`table-body-${index}`}>
            </tbody>
          </table>
        </div>
      );
    }
    // Table separator line (ignore)
    else if (line.includes('|') && line.includes('---')) {
      return;
    }
    // Table rows
    else if (inTable && line.includes('|')) {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length > 0) {
        // Find the previous table and add row
        const lastTableIndex = elements.length - 1;
        const tableElement = elements[lastTableIndex];
        if (tableElement && tableElement.props.children.props.children.length > 1) {
          const tbody = tableElement.props.children.props.children[1];
          const newRow = (
            <tr key={`row-${index}`}>
              {cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-gray-600 px-3 py-2 text-gray-300">
                  {cell.replace(/\*+/g, '')}
                </td>
              ))}
            </tr>
          );
          // This is a workaround - in practice, we'd need a more sophisticated table builder
        }
      }
    } else {
      inTable = false;
    }

    // Process other content if not in table
    if (!inTable && !line.startsWith('#') && !(line.includes('|') && line.includes('Metric'))) {
      // Bold text processing
      let processedLine = line;
      
      // Clean up multiple asterisks and formatting
      processedLine = processedLine.replace(/\*{3,}/g, '**');
      processedLine = processedLine.replace(/\*{1}\s*/g, '');
      
      // Process bold text
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(processedLine)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(processedLine.substring(lastIndex, match.index));
        }
        // Add the bold text
        parts.push(<strong key={`bold-${match.index}`} className="text-white font-semibold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      // Add remaining text
      if (lastIndex < processedLine.length) {
        parts.push(processedLine.substring(lastIndex));
      }

      // List items
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        elements.push(
          <div key={key} className="flex items-start space-x-2 mb-2 ml-4">
            <span className="text-blue-400 mt-1 text-xs">•</span>
            <span className="text-gray-300 text-sm flex-1">{parts.length > 0 ? parts : line.substring(2).replace(/\*+/g, '')}</span>
          </div>
        );
      }
      // Horizontal rules
      else if (line.trim() === '---') {
        elements.push(<hr key={key} className="border-gray-600 my-4" />);
      }
      // Regular paragraphs
      else if (line.trim()) {
        elements.push(
          <p key={key} className="text-gray-300 text-sm mb-3 leading-relaxed">
            {parts.length > 0 ? parts : line.replace(/\*+/g, '')}
          </p>
        );
      }
    }
  });

  return <div className="space-y-1">{elements}</div>;
};

export const ReportDetails = ({ report, open, onOpenChange }: ReportDetailsProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const analysisMutation = useMutation({
    mutationFn: triggerAIAnalysis,
    onSuccess: () => {
      // Invalidate and refetch both reports and the specific report data
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', report.id] });
      toast.success("AI analysis completed successfully");
      setIsAnalyzing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to analyze report");
      setIsAnalyzing(false);
    },
  });

  const handleAnalyze = async () => {
    if (!report.id) return;
    setIsAnalyzing(true);
    analysisMutation.mutate(report.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-500/20 text-green-400';
      case 'review': return 'bg-yellow-500/20 text-yellow-400';
      case 'flagged': return 'bg-red-500/20 text-red-400';
      case 'pending': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const analysis = report.analysis_results?.[0];

  // Extract the feedback content from the detailed_feedback
  const getFeedbackContent = (detailedFeedback: any) => {
    if (typeof detailedFeedback === 'string') {
      return detailedFeedback;
    }
    if (detailedFeedback && typeof detailedFeedback === 'object') {
      return detailedFeedback.feedback || JSON.stringify(detailedFeedback, null, 2);
    }
    return 'No detailed feedback available';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <span>Report Details</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Comprehensive report information and AI analysis results
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Report Header */}
          <Card className="bg-black/40 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white font-mono">
                  {report.title || report.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getPriorityColor(report.priority || 'medium')}`}>
                    {report.priority || 'medium'}
                  </Badge>
                  <Badge className={`${getStatusColor(report.status || 'pending')}`}>
                    {report.status || 'pending'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{report.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Building className="w-4 h-4" />
                  <span>{report.category || report.project}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{report.created_at && format(new Date(report.created_at), 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </div>
              
              <Separator className="bg-white/20 my-4" />
              
              <div>
                <h4 className="text-white font-mono mb-2">Description</h4>
                <p className="text-gray-300 leading-relaxed">
                  {report.description || report.report}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Section */}
          <Card className="bg-black/40 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white font-mono flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>AI Analysis</span>
                </CardTitle>
                {!analysis && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-black/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 font-mono">
                        {analysis.score}/1000
                      </div>
                      <div className="text-sm text-gray-400">Quality Score</div>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 font-mono">
                        {analysis.flags}
                      </div>
                      <div className="text-sm text-gray-400">Flags Raised</div>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-lg">
                      <div className={`text-2xl font-bold font-mono ${analysis.status === 'validated' ? 'text-green-400' : analysis.status === 'flagged' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {analysis.status === 'validated' ? <CheckCircle className="w-8 h-8 mx-auto" /> : 
                         analysis.status === 'flagged' ? <AlertCircle className="w-8 h-8 mx-auto" /> :
                         <Clock className="w-8 h-8 mx-auto" />}
                      </div>
                      <div className="text-sm text-gray-400 capitalize">{analysis.status}</div>
                    </div>
                  </div>
                  
                  {analysis.summary && (
                    <div>
                      <h4 className="text-white font-mono mb-2">Summary</h4>
                      <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-lg text-sm">
                        {analysis.summary}
                      </p>
                    </div>
                  )}
                  
                  {analysis.detailed_feedback && (
                    <div>
                      <h4 className="text-white font-mono mb-2">Detailed Feedback</h4>
                      <div className="bg-black/20 p-4 rounded-lg max-h-96 overflow-y-auto">
                        {renderMarkdownText(getFeedbackContent(analysis.detailed_feedback))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">No AI analysis available for this report</p>
                  <p className="text-gray-500 text-sm">Click "Run Analysis" to generate AI insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
