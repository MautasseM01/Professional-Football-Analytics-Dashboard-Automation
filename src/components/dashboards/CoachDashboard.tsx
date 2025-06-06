
import { usePlayerData } from "@/hooks/use-player-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Target, TrendingUp } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";

interface CoachDashboardProps {
  profile: UserProfile;
}

export const CoachDashboard = ({ profile }: CoachDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-club-gold mb-2">
          Coach Dashboard
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-club-light-gray/70">
          Manage your team's performance and track player development
        </p>
      </div>

      {/* Team Overview Cards with Responsive Grid */}
      <ResponsiveGrid mobileCols={2} className="grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="flex items-center text-club-gold text-xs sm:text-sm">
              <Users className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Squad Size</span>
              <span className="xs:hidden">Squad</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-club-light-gray">{players.length}</div>
            <p className="text-xs text-club-light-gray/70">Active Players</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="flex items-center text-club-gold text-xs sm:text-sm">
              <AlertTriangle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Injuries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-club-light-gray">2</div>
            <p className="text-xs text-club-light-gray/70">Players Injured</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="flex items-center text-club-gold text-xs sm:text-sm">
              <Target className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Team Goals</span>
              <span className="xs:hidden">Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-club-light-gray">24</div>
            <p className="text-xs text-club-light-gray/70">This Season</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2 p-3 sm:p-4">
            <CardTitle className="flex items-center text-club-gold text-xs sm:text-sm">
              <TrendingUp className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-club-light-gray">W-W-D</div>
            <p className="text-xs text-club-light-gray/70">Last 3 Games</p>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Compliance Alerts for Team */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-club-gold text-sm sm:text-base">Team Compliance Alerts</CardTitle>
          <CardDescription className="text-club-light-gray/70 text-xs sm:text-sm">
            Important notices for your team
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-club-light-gray font-medium text-sm sm:text-base">Player Registration Reminder</p>
                <p className="text-club-light-gray/70 text-xs sm:text-sm">3 players need registration renewal before next match</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-600/30 rounded">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-club-light-gray font-medium text-sm sm:text-base">Medical Checks</p>
                <p className="text-club-light-gray/70 text-xs sm:text-sm">Annual medical assessments due for 5 players</p>
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
