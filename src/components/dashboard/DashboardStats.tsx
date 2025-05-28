
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Brain, Zap, Target } from "lucide-react";

interface DashboardStatsProps {
  stats: Array<{
    label: string;
    value: string;
    icon: React.ComponentType<any>;
    color: string;
    change: string;
  }>;
  isVisible: boolean;
}

export const DashboardStats = ({ stats, isVisible }: DashboardStatsProps) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      {stats.map((stat, index) => (
        <Card key={index} className="bg-black/40 border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 group backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${stat.color.replace('to-', 'to-').replace('from-', 'from-').replace('-400', '-500/20').replace('-400', '-500/20')} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xs text-green-400 font-mono">
                {stat.change}
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-mono mb-1`}>
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-mono">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
