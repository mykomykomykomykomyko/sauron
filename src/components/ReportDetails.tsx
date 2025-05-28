
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Brain, Clock, User, Building, Calendar, Target, Zap, CheckCircle, AlertCircle, Flag, AlertTriangle, Edit, Save, X } from "lucide-react";
import { format } from "date-fns";
import { Report, AnalysisResult, triggerAIAnalysis, updateAnalysisStatus } from "@/services/supabaseService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

interface ReportDetailsProps {
  report: Report & { analysis_results?: AnalysisResult[] };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to render markdown-like text as JSX
const renderMarkdownText = (text: string) => {
  if (!text) return null;

  // Split by lines and process each line
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];

  lines.forEach((line, index) => {
    const key = `line-${index}`;
    
    // Headers
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key} className="text-2xl font-bold text-white mt-6 mb-3">{line.substring(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key} className="text-xl font-bold text-blue-400 mt-5 mb-2">{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key} className="text-lg font-bold text-purple-400 mt-4 mb-2">{line.substring(4)}</h3>);
    }
    // Table headers
    else if (line.includes('|') && line.includes('Category')) {
      elements.push(
        <div key={key} className="overflow-x-auto mt-3 mb-3">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-800">
                {line.split('|').filter(cell => cell.trim()).map((cell, cellIndex) => (
                  <th key={cellIndex} className="border border-gray-600 px-3 py-2 text-left text-gray-300 font-semibold">
                    {cell.trim()}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
      );
    }
    // Table separator line (ignore)
    else if (line.includes('|') && line.includes('---')) {
      return;
    }
    // Table rows
    else if (line.includes('|') && !line.includes('Category')) {
      const cells = line.split('|').filter(cell => cell.trim());
      if (cells.length > 1) {
        elements.push(
          <div key={key} className="overflow-x-auto -mt-3 mb-3">
            <table className="w-full border-collapse border border-gray-600">
              <tbody>
                <tr>
                  {cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-600 px-3 py-2 text-gray-300">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
    }
    // Bold text
    else if (line.includes('**')) {
      const parts = line.split('**');
      const processed = parts.map((part, partIndex) => 
        partIndex % 2 === 1 ? <strong key={partIndex} className="text-yellow-400 font-bold">{part}</strong> : part
      );
      elements.push(<p key={key} className="text-gray-300 mb-2">{processed}</p>);
    }
    // List items
    else if (line.startsWith('- ')) {
      elements.push(<li key={key} className="text-gray-300 ml-4 mb-1 list-disc">{line.substring(2)}</li>);
    }
    // Regular paragraphs
    else if (line.trim()) {
      elements.push(<p key={key} className="text-gray-300 mb-2">{line}</p>);
    }
    // Empty lines
    else {
      elements.push(<br key={key} />);
    }
  });

  return <div className="space-y-1">{elements}</div>;
};

// Helper function to get flag explanations - one for each flag
const getFlagExplanations = (flags: number) => {
  const explanations = [];
  
  const flagTypes = [
    "Insufficient technical detail or clarity",
    "Missing deliverable indicators or completion markers", 
    "Inadequate professional documentation standards",
    "Poor structure or organization",
    "Lack of measurable outcomes or metrics"
  ];
  
  // Return exactly the number of flags raised
  for (let i = 0; i < Math.min(flags, flagTypes.length); i++) {
    explanations.push(flagTypes[i]);
  }
  
  // If more flags than predefined types, add generic ones
  for (let i = flagTypes.length; i < flags; i++) {
    explanations.push(`Additional quality issue #${i + 1} identified`);
  }
  
  return explanations;
};

export const ReportDetails = ({ report, open, onOpenChange }: ReportDetailsProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScore, setEditedScore] = useState(0);
  const [editedStatus, setEditedStatus] = useState<'validated' | 'review' | 'flagged' | 'pending'>('pending');
  const [editedFlags, setEditedFlags] = useState(0);
  const [editedSummary, setEditedSummary] = useState('');
  const queryClient = useQueryClient();

  // Fetch fresh analysis results for this specific report
  const { data: freshAnalysis, refetch: refetchAnalysis } = useQuery({
    queryKey: ['analysis', report.id],
    queryFn: async () => {
      if (!report.id) return null;
      
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('report_id', report.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching analysis:', error);
        return null;
      }
      
      return data as AnalysisResult | null;
    },
    enabled: open && !!report.id,
  });

  const analysisMutation = useMutation({
    mutationFn: triggerAIAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['analysis', report.id] });
      refetchAnalysis();
      toast.success("AI analysis completed successfully");
      setIsAnalyzing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to analyze report");
      setIsAnalyzing(false);
    },
  });

  const updateAnalysisMutation = useMutation({
    mutationFn: async (updates: { score: number; status: string; flags: number; summary: string }) => {
      if (!freshAnalysis?.id) throw new Error('No analysis found to update');
      
      const { data, error } = await supabase
        .from('analysis_results')
        .update({
          score: updates.score,
          status: updates.status,
          flags: updates.flags,
          summary: updates.summary
        })
        .eq('id', freshAnalysis.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['analysis', report.id] });
      refetchAnalysis();
      toast.success("Analysis updated successfully");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update analysis");
    },
  });

  const handleAnalyze = async () => {
    if (!report.id) return;
    setIsAnalyzing(true);
    analysisMutation.mutate(report.id);
  };

  const handleEditStart = () => {
    if (freshAnalysis) {
      setEditedScore(freshAnalysis.score);
      setEditedStatus(freshAnalysis.status as 'validated' | 'review' | 'flagged' | 'pending');
      setEditedFlags(freshAnalysis.flags);
      setEditedSummary(freshAnalysis.summary || '');
    }
    setIsEditing(true);
  };

  const handleEditSave = () => {
    updateAnalysisMutation.mutate({
      score: editedScore,
      status: editedStatus,
      flags: editedFlags,
      summary: editedSummary
    });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
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

  // Use fresh analysis data or fallback to report data
  const analysis = freshAnalysis || report.analysis_results?.[0];

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
                <div className="flex items-center space-x-2">
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
                  {analysis && !isEditing && (
                    <Button
                      onClick={handleEditStart}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Manual Override
                    </Button>
                  )}
                  {isEditing && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleEditSave}
                        disabled={updateAnalysisMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleEditCancel}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-4">
                  {isEditing ? (
                    // Manual editing interface
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="score" className="text-white">Quality Score</Label>
                          <Input
                            id="score"
                            type="number"
                            min="0"
                            max="1000"
                            value={editedScore}
                            onChange={(e) => setEditedScore(Number(e.target.value))}
                            className="bg-black/20 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="flags" className="text-white">Flags</Label>
                          <Input
                            id="flags"
                            type="number"
                            min="0"
                            max="10"
                            value={editedFlags}
                            onChange={(e) => setEditedFlags(Number(e.target.value))}
                            className="bg-black/20 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="status" className="text-white">Status</Label>
                          <Select value={editedStatus} onValueChange={(value: 'validated' | 'review' | 'flagged' | 'pending') => setEditedStatus(value)}>
                            <SelectTrigger className="bg-black/20 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="validated">Validated</SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                              <SelectItem value="flagged">Flagged</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="summary" className="text-white">Summary</Label>
                        <Textarea
                          id="summary"
                          value={editedSummary}
                          onChange={(e) => setEditedSummary(e.target.value)}
                          className="bg-black/20 border-white/20 text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    // Display interface
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-black/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-400 font-mono">
                          {analysis.score}/1000
                        </div>
                        <div className="text-sm text-gray-400">Quality Score</div>
                      </div>
                      <div className="text-center p-4 bg-black/20 rounded-lg">
                        <div className="text-2xl font-bold text-red-400 font-mono flex items-center justify-center space-x-2">
                          <Flag className="w-6 h-6" />
                          <span>{analysis.flags}</span>
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
                  )}

                  {/* Flags Explanation Section */}
                  {analysis.flags > 0 && !isEditing && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h4 className="text-red-400 font-mono font-bold">Quality Flags Detected ({analysis.flags})</h4>
                      </div>
                      <div className="space-y-2">
                        {getFlagExplanations(analysis.flags).map((explanation, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Flag className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-red-300 text-sm">{explanation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis.summary && !isEditing && (
                    <div>
                      <h4 className="text-white font-mono mb-2">Summary</h4>
                      <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-lg">
                        {analysis.summary}
                      </p>
                    </div>
                  )}
                  
                  {analysis.detailed_feedback && !isEditing && (
                    <div>
                      <h4 className="text-white font-mono mb-2">Detailed Feedback</h4>
                      <div className="bg-black/20 p-4 rounded-lg">
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
