
import { Activity } from "lucide-react";

interface WelcomeSectionProps {
  user: any;
  reports: any[];
  isLoading: boolean;
  isVisible: boolean;
}

export const WelcomeSection = ({ user, reports, isLoading, isVisible }: WelcomeSectionProps) => {
  return (
    <div className={`mb-8 sm:mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-5xl font-bold font-mono mb-2 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
            MISSION CONTROL
          </h1>
          <p className="text-gray-300 text-lg">
            Welcome back, {user?.user_metadata?.full_name || user?.email}. Your oversight dashboard is ready.
          </p>
          {/* Debug info */}
          <div className="mt-2 text-xs text-gray-500">
            Debug: User ID: {user?.id} | Reports found: {reports.length} | Loading: {isLoading ? 'Yes' : 'No'}
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-4 py-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono text-green-400">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
