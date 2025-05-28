
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock, TrendingUp, Flag } from "lucide-react";

interface AnalysisResultProps {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  flags: number;
  status: 'validated' | 'review' | 'flagged';
}

const AnalysisResult = ({ score, feedback, strengths, improvements, flags, status }: AnalysisResultProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "bg-green-900/20 text-green-400 border-green-800/30";
      case "review":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-800/30";
      case "flagged":
        return "bg-red-900/20 text-red-400 border-red-800/30";
      default:
        return "bg-neutral-900/20 text-neutral-400 border-neutral-800/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle className="w-4 h-4" />;
      case "review":
        return <Clock className="w-4 h-4" />;
      case "flagged":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return "text-green-400";
    if (score >= 650) return "text-blue-400";
    if (score >= 400) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreTier = (score: number) => {
    if (score >= 800) return "EXCEPTIONAL";
    if (score >= 650) return "GOOD";
    if (score >= 400) return "NEEDS IMPROVEMENT";
    return "UNACCEPTABLE";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 800) return "Outstanding performance with comprehensive technical detail";
    if (score >= 650) return "Good performance meeting professional standards";
    if (score >= 400) return "Below standards, requires significant improvement";
    return "Fails to meet minimum professional requirements";
  };

  return (
    <div className="space-y-6">
      {/* Score and Status */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="border-b border-neutral-800">
          <CardTitle className="text-xl text-white font-mono flex items-center justify-between">
            SAURON Analysis Results
            <div className="flex items-center gap-3">
              {flags > 0 && (
                <Badge className="bg-red-900/20 text-red-400 border-red-800/30 border font-mono">
                  <Flag className="w-3 h-3 mr-1" />
                  {flags} Flag{flags > 1 ? 's' : ''}
                </Badge>
              )}
              <Badge className={`${getStatusColor(status)} border font-mono`}>
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="text-center">
              <div className={`text-5xl font-bold font-mono ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-lg text-neutral-400 font-mono">/ 1000</div>
              <div className={`text-sm font-mono mt-1 ${getScoreColor(score)}`}>
                {getScoreTier(score)}
              </div>
            </div>
            <div className="flex-1">
              <div className="w-full bg-neutral-800 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    score >= 800 ? 'bg-green-500' : 
                    score >= 650 ? 'bg-blue-500' :
                    score >= 400 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(score / 1000) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-neutral-400 mt-2 font-mono">
                <span>0</span>
                <span>400</span>
                <span>650</span>
                <span>800</span>
                <span>1000</span>
              </div>
              <div className="text-sm text-neutral-300 mt-2 font-mono">
                {getScoreDescription(score)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="border-b border-neutral-800">
          <CardTitle className="text-xl text-white font-mono flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
            Detailed Analysis Report
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-invert max-w-none">
            <div 
              className="text-neutral-300 font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: feedback
                  .replace(/\n/g, '<br>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em class="text-yellow-400">$1</em>')
                  .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-red-400 mb-4 mt-6">$1</h1>')
                  .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-red-300 mb-3 mt-5">$1</h2>')
                  .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-red-200 mb-2 mt-4">$1</h3>')
                  .replace(/^\| (.*$)/gm, '<div class="font-mono text-xs bg-neutral-800 p-2 border-l-2 border-red-500">$1</div>')
                  .replace(/^- (.*$)/gm, '<div class="flex items-start space-x-2 mb-1"><span class="text-red-400 mt-1">•</span><span>$1</span></div>')
                  .replace(/🏆/g, '<span class="text-yellow-400">🏆</span>')
                  .replace(/✅/g, '<span class="text-green-400">✅</span>')
                  .replace(/⚠️/g, '<span class="text-yellow-400">⚠️</span>')
                  .replace(/🚨/g, '<span class="text-red-400">🚨</span>')
                  .replace(/🚩/g, '<span class="text-red-400">🚩</span>')
                  .replace(/📈/g, '<span class="text-blue-400">📈</span>')
                  .replace(/🎯/g, '<span class="text-purple-400">🎯</span>')
                  .replace(/📋/g, '<span class="text-cyan-400">📋</span>')
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Improvements Summary */}
      {(strengths.length > 0 || improvements.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {strengths.length > 0 && (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-lg text-green-400 font-mono">
                  ✅ Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {strengths.slice(0, 5).map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-300 text-sm font-mono">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {improvements.length > 0 && (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-lg text-yellow-400 font-mono">
                  📈 Priority Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {improvements.slice(0, 5).map((improvement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-300 text-sm font-mono">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
