
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Award, FileText, TrendingUp, Calendar, Star } from "lucide-react";
import { format } from "date-fns";
import { Report, AnalysisResult } from "@/services/supabaseService";

interface UserProfileProps {
  user: {
    id: string;
    email: string;
    full_name: string;
    company_name?: string;
    reports: (Report & { analysis_results: AnalysisResult[] })[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfile = ({ user, open, onOpenChange }: UserProfileProps) => {
  const reportsWithAnalysis = user.reports.filter(r => r.analysis_results.length > 0);
  const avgScore = reportsWithAnalysis.length > 0 
    ? reportsWithAnalysis.reduce((sum, r) => sum + (r.analysis_results[0]?.score || 0), 0) / reportsWithAnalysis.length 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 600) return 'text-yellow-400';
    if (score >= 400) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 900) return { label: 'Excellent', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (score >= 800) return { label: 'Very Good', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (score >= 700) return { label: 'Good', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (score >= 600) return { label: 'Average', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { label: 'Needs Improvement', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  const scoreBadge = getScoreBadge(avgScore);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono flex items-center space-x-2">
            <User className="w-6 h-6 text-blue-400" />
            <span>Contractor Profile</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Performance overview and report history
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Header */}
          <Card className="bg-black/40 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-white font-mono">
                    {user.full_name}
                  </CardTitle>
                  <p className="text-gray-400">{user.email}</p>
                  {user.company_name && (
                    <p className="text-gray-500 text-sm">{user.company_name}</p>
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold font-mono mb-1 ${getScoreColor(avgScore)}`}>
                    {Math.round(avgScore)}/1000
                  </div>
                  <Badge className={scoreBadge.color}>
                    {scoreBadge.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/40 border-white/20">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white font-mono">
                  {user.reports.length}
                </div>
                <div className="text-sm text-gray-400">Total Reports</div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-white/20">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white font-mono">
                  {reportsWithAnalysis.length}
                </div>
                <div className="text-sm text-gray-400">Analyzed Reports</div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-white/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className={`text-2xl font-bold font-mono ${getScoreColor(avgScore)}`}>
                  {Math.round(avgScore)}
                </div>
                <div className="text-sm text-gray-400">Avg Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card className="bg-black/40 border-white/20">
            <CardHeader>
              <CardTitle className="text-white font-mono flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Recent Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.reports.length > 0 ? (
                <div className="space-y-3">
                  {user.reports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10">
                      <div>
                        <div className="text-white font-medium text-sm">
                          {report.title || report.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {report.created_at && format(new Date(report.created_at), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {report.analysis_results[0] && (
                          <Badge className={`text-xs ${getScoreColor(report.analysis_results[0].score)} bg-white/10`}>
                            {report.analysis_results[0].score}/1000
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No reports submitted yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
