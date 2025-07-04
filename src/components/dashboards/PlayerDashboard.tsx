
import { usePlayerProfile } from "@/hooks/use-player-profile";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Target, TrendingUp, Calendar, Award, Activity } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import { IOSLoadingState } from "../IOSLoadingState";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface PlayerDashboardProps {
  profile: UserProfile;
}

export const PlayerDashboard = ({ profile }: PlayerDashboardProps) => {
  const { playerProfile, loading, error, refreshProfile } = usePlayerProfile();
  const { theme } = useTheme();

  // Calculate performance metrics
  const goalsPerMatch = playerProfile?.matches && playerProfile.matches > 0 
    ? (playerProfile.goals || 0) / playerProfile.matches 
    : 0;
    
  const passAccuracy = playerProfile?.passes_attempted && playerProfile.passes_attempted > 0
    ? ((playerProfile.passes_completed || 0) / playerProfile.passes_attempted) * 100
    : 0;

  const tackleSuccessRate = playerProfile?.tackles_attempted && playerProfile.tackles_attempted > 0
    ? ((playerProfile.tackles_won || 0) / playerProfile.tackles_attempted) * 100
    : 0;

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50/90 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <p className="text-red-800 dark:text-red-200">Error loading your profile: {error}</p>
            <button 
              onClick={refreshProfile}
              className="w-fit px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-club-gold mb-2">
          Welcome back, {playerProfile?.name || profile.full_name || "Player"}
        </h1>
        <p className="text-sm sm:text-base text-club-light-gray/70 dark:text-gray-400">
          Track your performance statistics and development progress
        </p>
      </div>

      {/* Performance Overview Cards */}
      <IOSLoadingState isLoading={loading} suppressDemoLoading={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Matches Played"
            value={playerProfile?.matches || 0}
            subValue="This Season"
            icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20"
          />

          <StatCard
            title="Goals Scored"
            value={playerProfile?.goals || 0}
            subValue={`${goalsPerMatch.toFixed(1)} per match`}
            icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20"
          />

          <StatCard
            title="Match Rating"
            value={playerProfile?.match_rating ? Number(playerProfile.match_rating).toFixed(1) : "0.0"}
            subValue="Average"
            icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="bg-gradient-to-br from-club-gold/10 to-yellow-600/5 border-club-gold/20"
          />

          <StatCard
            title="Pass Accuracy"
            value={`${passAccuracy.toFixed(1)}%`}
            subValue={`${playerProfile?.passes_completed || 0}/${playerProfile?.passes_attempted || 0}`}
            icon={<Activity className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20"
          />
        </div>
      </IOSLoadingState>

      {/* Development Targets */}
      <Card className={cn(
        "border-club-gold/20 backdrop-blur-sm",
        theme === 'dark' ? "bg-club-dark-gray/60" : "bg-white/80",
        "shadow-xl"
      )}>
        <CardHeader className="pb-4">
          <CardTitle className="text-club-gold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Development Targets
          </CardTitle>
          <CardDescription className={cn(
            "text-sm",
            theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
          )}>
            Your current development goals and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className={cn(
              "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 rounded-xl",
              theme === 'dark' ? "bg-club-black/40" : "bg-gray-50/80"
            )}>
              <span className={cn(
                "font-medium",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                Improve Pass Completion
              </span>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-24 h-2 rounded-full",
                  theme === 'dark' ? "bg-club-black" : "bg-gray-200"
                )}>
                  <div 
                    className="bg-club-gold h-2 rounded-full transition-all duration-300" 
                    style={{ width: '75%' }}
                  />
                </div>
                <span className="text-club-gold text-sm font-medium min-w-[3rem]">75%</span>
              </div>
            </div>

            <div className={cn(
              "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 rounded-xl",
              theme === 'dark' ? "bg-club-black/40" : "bg-gray-50/80"
            )}>
              <span className={cn(
                "font-medium",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                Increase Sprint Distance
              </span>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-24 h-2 rounded-full",
                  theme === 'dark' ? "bg-club-black" : "bg-gray-200"
                )}>
                  <div 
                    className="bg-club-gold h-2 rounded-full transition-all duration-300" 
                    style={{ width: '60%' }}
                  />
                </div>
                <span className="text-club-gold text-sm font-medium min-w-[3rem]">60%</span>
              </div>
            </div>

            <div className={cn(
              "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 rounded-xl",
              theme === 'dark' ? "bg-club-black/40" : "bg-gray-50/80"
            )}>
              <span className={cn(
                "font-medium",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                Defensive Positioning
              </span>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-24 h-2 rounded-full",
                  theme === 'dark' ? "bg-club-black" : "bg-gray-200"
                )}>
                  <div 
                    className="bg-club-gold h-2 rounded-full transition-all duration-300" 
                    style={{ width: '85%' }}
                  />
                </div>
                <span className="text-club-gold text-sm font-medium min-w-[3rem]">85%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Stats Component - Only show if we have player profile */}
      {playerProfile && <PlayerStats player={playerProfile} />}
    </div>
  );
};
