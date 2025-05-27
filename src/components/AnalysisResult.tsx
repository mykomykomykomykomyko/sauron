
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock, TrendingUp } from "lucide-react";

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
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Score and Status */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="border-b border-neutral-800">
          <CardTitle className="text-xl text-white font-mono flex items-center justify-between">
            Analysis Results
            <Badge className={`${getStatusColor(status)} border font-mono`}>
              {getStatusIcon(status)}
              <span className="ml-1 capitalize">{status}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="text-center">
              <div className={`text-4xl font-bold font-mono ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-sm text-neutral-400 font-mono">SAURON Score</div>
            </div>
            <div className="flex-1">
              <div className="w-full bg-neutral-800 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(score / 10) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-neutral-400 mt-1 font-mono">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            {flags > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 font-mono">{flags}</div>
                <div className="text-sm text-neutral-400 font-mono">Flags</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="border-b border-neutral-800">
          <CardTitle className="text-xl text-white font-mono flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-red-500" />
            Detailed Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-invert max-w-none">
            <div className="text-neutral-300 whitespace-pre-line font-mono text-sm">
              {feedback}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Improvements */}
      {(strengths.length > 0 || improvements.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {strengths.length > 0 && (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-lg text-green-400 font-mono">
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
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
                  Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {improvements.map((improvement, index) => (
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
