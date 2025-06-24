
import { usePlayerData } from "@/hooks/use-player-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Target, TrendingUp, Calendar } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import { IOSLoadingState } from "../IOSLoadingState";

interface PlayerDashboardProps {
  profile: UserProfile;
}

export const PlayerDashboard = ({ profile }: PlayerDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();

  // Get current user's player data for personal stats
  const currentPlayer = selectedPlayer || players[0];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold mb-2">
          Welcome back, {profile.full_name || "Player"}
        </h1>
        <p className="text-sm sm:text-base text-club-light-gray/70">
          Track your performance statistics and development progress
        </p>
      </div>

      {/* Player Performance Overview Cards with StatCard Components */}
      <IOSLoadingState isLoading={loading} suppressDemoLoading={false}>
        <ResponsiveGrid 
          minCardWidth="200px"
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          <StatCard
            title="Matches Played"
            value={currentPlayer?.matches || 0}
            subValue="This Season"
            icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
          />

          <StatCard
            title="Goals Scored"
            value={currentPlayer?.goals || 0}
            subValue={`${((currentPlayer?.goals || 0) / Math.max(currentPlayer?.matches || 1, 1)).toFixed(1)} per match`}
            icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-green-500/20 bg-green-500/10"
          />

          <StatCard
            title="Match Rating"
            value={currentPlayer?.match_rating ? Number(currentPlayer.match_rating).toFixed(1) : "0.0"}
            subValue="Average"
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-blue-500/20 bg-blue-500/10"
          />
        </ResponsiveGrid>
      </IOSLoadingState>

      {/* Player Selector - Hidden for player role */}
      <RoleBasedContent allowedRoles={['admin', 'management', 'coach', 'analyst', 'performance_director']}>
        <PlayerSelector
          players={players}
          selectedPlayer={selectedPlayer}
          onPlayerSelect={selectPlayer}
          loading={loading}
        />
      </RoleBasedContent>

      {/* Development Targets - Player specific */}
      <Card className="bg-club-dark-gray border-club-gold/20 light:bg-white light:border-gray-200">
        <CardHeader className="p-4 sm:p-5 lg:p-6">
          <CardTitle className="text-club-gold light:text-yellow-600">Development Targets</CardTitle>
          <CardDescription className="text-club-light-gray/70 light:text-gray-600">
            Your current development goals and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <span className="text-club-light-gray light:text-gray-900 font-medium">Improve Pass Completion</span>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-20 sm:w-24 bg-club-black light:bg-gray-200 rounded-full h-2">
                  <div className="bg-club-gold light:bg-yellow-600 h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                </div>
                <span className="text-club-gold light:text-yellow-600 text-sm font-medium min-w-[3rem]">75%</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <span className="text-club-light-gray light:text-gray-900 font-medium">Increase Sprint Distance</span>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-20 sm:w-24 bg-club-black light:bg-gray-200 rounded-full h-2">
                  <div className="bg-club-gold light:bg-yellow-600 h-2 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
                </div>
                <span className="text-club-gold light:text-yellow-600 text-sm font-medium min-w-[3rem]">60%</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-club-black/40 light:bg-gray-50 rounded-lg">
              <span className="text-club-light-gray light:text-gray-900 font-medium">Defensive Positioning</span>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-20 sm:w-24 bg-club-black light:bg-gray-200 rounded-full h-2">
                  <div className="bg-club-gold light:bg-yellow-600 h-2 rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
                </div>
                <span className="text-club-gold light:text-yellow-600 text-sm font-medium min-w-[3rem]">85%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Stats Component */}
      {selectedPlayer && <PlayerStats player={selectedPlayer} />}
    </div>
  );
};
