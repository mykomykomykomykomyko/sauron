
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, User, Award, Activity } from "lucide-react";

interface UserLeaderboardProps {
  usersWithReports: any[];
  isLoading: boolean;
  onUserClick: (user: any) => void;
  getScoreColor: (score: number) => string;
}

export const UserLeaderboard = ({ usersWithReports, isLoading, onUserClick, getScoreColor }: UserLeaderboardProps) => {
  if (isLoading) {
    return (
      <Card className="lg:col-span-2 bg-black/40 border-white/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white font-mono flex items-center space-x-2">
            <Activity className="w-5 h-5 text-red-400" />
            <span>Contractor Leaderboard</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Top performing contractors by average score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 bg-black/40 border-white/20 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white font-mono flex items-center space-x-2">
          <Activity className="w-5 h-5 text-red-400" />
          <span>Contractor Leaderboard</span>
        </CardTitle>
        <CardDescription className="text-gray-300">
          Top performing contractors by average score
        </CardDescription>
      </CardHeader>
      <CardContent>
        {usersWithReports && usersWithReports.length > 0 ? (
          <div className="space-y-4">
            {usersWithReports
              .map(user => {
                const reportsWithAnalysis = user.reports.filter((r: any) => r.analysis_results.length > 0);
                const avgScore = reportsWithAnalysis.length > 0 
                  ? reportsWithAnalysis.reduce((sum: number, r: any) => sum + (r.analysis_results[0]?.score || 0), 0) / reportsWithAnalysis.length 
                  : 0;
                return { ...user, avgScore };
              })
              .sort((a, b) => b.avgScore - a.avgScore)
              .slice(0, 10)
              .map((user, index) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10 hover:border-white/20 transition-colors group cursor-pointer"
                  onClick={() => onUserClick(user)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full">
                      <span className="text-blue-400 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{user.full_name}</div>
                      <div className="text-gray-400 text-xs">
                        {user.reports.length} reports • {user.reports.filter((r: any) => r.analysis_results.length > 0).length} analyzed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`text-lg font-bold font-mono ${getScoreColor(user.avgScore)}`}>
                      {Math.round(user.avgScore)}/1000
                    </div>
                    {user.avgScore >= 900 && <Award className="w-4 h-4 text-yellow-400" />}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No contractors found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
