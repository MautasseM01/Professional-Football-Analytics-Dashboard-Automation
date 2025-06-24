
import { usePlayerData } from "@/hooks/use-player-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Target, TrendingUp } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import SuspensionRiskWidget from "../SuspensionRiskWidget";
import { IOSLoadingState } from "../IOSLoadingState";

interface CoachDashboardProps {
  profile: UserProfile;
}

export const CoachDashboard = ({ profile }: CoachDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-club-gold mb-2">
          Welcome back, {profile.full_name || "Coach"}
        </h1>
        <p className="text-sm sm:text-base text-club-light-gray/70">
          Manage your team's performance and track player development
        </p>
      </div>

      {/* Team Overview Cards with StatCard Components */}
      <IOSLoadingState isLoading={loading} suppressDemoLoading={false}>
        <ResponsiveGrid 
          minCardWidth="200px"
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
        >
          <StatCard
            title="Squad Size"
            value={players.length}
            subValue="Active Players"
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
          />

          <StatCard
            title="Injuries"
            value="2"
            subValue="Players Injured"
            icon={<AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-orange-500/20 bg-orange-500/10"
          />

          <StatCard
            title="Team Goals"
            value="24"
            subValue="This Season"
            icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-green-500/20 bg-green-500/10"
          />

          <StatCard
            title="Form"
            value="W-W-D"
            subValue="Last 3 Games"
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="border-blue-500/20 bg-blue-500/10"
          />
        </ResponsiveGrid>
      </IOSLoadingState>

      {/* Suspension Risk Widget */}
      <SuspensionRiskWidget />

      {/* Compliance Alerts for Team */}
      <Card className="bg-club-dark-gray border-club-gold/20 light:bg-white light:border-gray-200">
        <CardHeader className="p-4 sm:p-5 lg:p-6">
          <CardTitle className="text-club-gold light:text-yellow-600">Team Compliance Alerts</CardTitle>
          <CardDescription className="text-club-light-gray/70 light:text-gray-600">
            Important notices for your team
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-yellow-900/20 light:bg-yellow-50 border border-yellow-600/30 light:border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500 light:text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-club-light-gray light:text-gray-900 font-medium">Player Registration Reminder</p>
                <p className="text-club-light-gray/70 light:text-gray-600 text-sm mt-1">3 players need registration renewal before next match</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-900/20 light:bg-blue-50 border border-blue-600/30 light:border-blue-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-500 light:text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-club-light-gray light:text-gray-900 font-medium">Medical Checks</p>
                <p className="text-club-light-gray/70 light:text-gray-600 text-sm mt-1">Annual medical assessments due for 5 players</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Selector */}
      <PlayerSelector
        players={players}
        selectedPlayer={selectedPlayer}
        onPlayerSelect={selectPlayer}
        loading={loading}
      />

      {/* Player Stats Component */}
      {selectedPlayer && <PlayerStats player={selectedPlayer} />}
    </div>
  );
};
