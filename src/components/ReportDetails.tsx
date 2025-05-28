
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

// Simple markdown-to-JSX renderer for analysis content
const renderAnalysisContent = (content: string) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentTableRows: string[][] = [];
  let tableHeaders: string[] = [];
  let inTable = false;
  let tableKey = 0;

  const finishTable = () => {
    if (currentTableRows.length > 0 && tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${tableKey++}`} className="my-4 overflow-x-auto">
          <table className="w-full border border-gray-600 text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-600">
                {tableHeaders.map((header, index) => (
                  <th key={index} className="border-r border-gray-600 px-3 py-2 text-left text-gray-200 font-medium">
                    {header.replace(/\*\*/g, '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTableRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-700">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border-r border-gray-600 px-3 py-2 text-gray-300">
                      {cell.replace(/\*\*/g, '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    currentTableRows = [];
    tableHeaders = [];
    inTable = false;
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const key = `line-${index}`;
    
    if (!trimmedLine) {
      if (inTable) finishTable();
      elements.push(<div key={key} className="h-2"></div>);
      return;
    }

    // Table detection
    if (trimmedLine.includes('|') && (trimmedLine.includes('Metric') || trimmedLine.includes('Score') || trimmedLine.includes('Category'))) {
      if (inTable) finishTable();
      inTable = true;
      tableHeaders = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell);
      return;
    }
    
    // Table separator line
    if (trimmedLine.includes('|') && trimmedLine.includes('---')) {
      return;
    }
    
    // Table rows
    if (inTable && trimmedLine.includes('|')) {
      const cells = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length > 0) {
        currentTableRows.push(cells);
      }
      return;
    }

    // Finish table if we're no longer in one
    if (inTable) {
      finishTable();
    }

    // Process text formatting
    const processText = (text: string) => {
      // Remove problematic markdown and clean up
      let cleanText = text
        .replace(/\*{3,}/g, '') // Remove excessive asterisks
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold formatting
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic formatting
        .trim();

      return cleanText;
    };

    // Headers
    if (trimmedLine.startsWith('# ')) {
      elements.push(
        <h1 key={key} className="text-xl font-bold text-blue-400 mt-6 mb-4 border-b border-gray-700 pb-2">
          {processText(trimmedLine.substring(2))}
        </h1>
      );
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(
        <h2 key={key} className="text-lg font-semibold text-blue-300 mt-5 mb-3">
          {processText(trimmedLine.substring(3))}
        </h2>
      );
    } else if (trimmedLine.startsWith('### ')) {
      elements.push(
        <h3 key={key} className="text-base font-semibold text-purple-300 mt-4 mb-2">
          {processText(trimmedLine.substring(4))}
        </h3>
      );
    }
    // List items
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      elements.push(
        <div key={key} className="flex items-start space-x-2 mb-2 ml-4">
          <span className="text-blue-400 mt-1 text-xs">•</span>
          <span className="text-gray-300 text-sm flex-1">
            {processText(trimmedLine.substring(2))}
          </span>
        </div>
      );
    }
    // Horizontal rules
    else if (trimmedLine === '---') {
      elements.push(<hr key={key} className="border-gray-600 my-4" />);
    }
    // Regular paragraphs
    else if (trimmedLine) {
      elements.push(
        <p key={key} className="text-gray-300 text-sm mb-3 leading-relaxed">
          {processText(trimmedLine)}
        </p>
      );
    }
  });

  // Finish any remaining table
  if (inTable) {
    finishTable();
  }

  return <div className="space-y-1">{elements}</div>;
};

export const ReportDetails = ({ report, open, onOpenChange }: ReportDetailsProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const analysisMutation = useMutation({
    mutationFn: triggerAIAnalysis,
    onSuccess: () => {
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

  // Extract content from detailed_feedback
  const getDetailedFeedback = () => {
    if (!analysis?.detailed_feedback) return '';
    
    if (typeof analysis.detailed_feedback === 'string') {
      return analysis.detailed_feedback;
    }
    
    if (typeof analysis.detailed_feedback === 'object') {
      // Try different possible field names
      return analysis.detailed_feedback.feedback || 
             analysis.detailed_feedback.detailedFeedback || 
             analysis.detailed_feedback.detailed_feedback || 
             JSON.stringify(analysis.detailed_feedback, null, 2);
    }
    
    return '';
  };

  const detailedFeedbackContent = getDetailedFeedback();

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
                      <div className="bg-black/20 p-4 rounded-lg">
                        {renderAnalysisContent(analysis.summary)}
                      </div>
                    </div>
                  )}
                  
                  {detailedFeedbackContent && (
                    <div>
                      <h4 className="text-white font-mono mb-2">Detailed Feedback</h4>
                      <div className="bg-black/20 p-4 rounded-lg max-h-96 overflow-y-auto">
                        {renderAnalysisContent(detailedFeedbackContent)}
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
