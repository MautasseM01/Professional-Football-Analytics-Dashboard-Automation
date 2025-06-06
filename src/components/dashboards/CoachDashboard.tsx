
import { usePlayerData } from "@/hooks/use-player-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Target, TrendingUp } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface CoachDashboardProps {
  profile: UserProfile;
}

export const CoachDashboard = ({ profile }: CoachDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();
  const isMobile = useIsMobile();

  return (
    <div className={`space-y-3 sm:space-y-4 lg:space-y-6 ${isMobile ? 'p-2' : 'p-3 sm:p-4 lg:p-6'} w-full max-w-7xl mx-auto`}>
      <div className="mb-3 sm:mb-4 lg:mb-6">
        <h1 className={`font-bold text-club-gold mb-1 sm:mb-2 ${isMobile ? 'text-lg' : 'text-lg sm:text-xl lg:text-2xl xl:text-3xl'}`}>
          Coach Dashboard
        </h1>
        <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`}>
          Manage your team's performance and track player development
        </p>
      </div>

      {/* Team Overview Cards with Responsive Grid */}
      <ResponsiveGrid mobileCols={1} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <Users className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Squad Size
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>{players.length}</div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>Active Players</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <AlertTriangle className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Injuries
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>2</div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>Players Injured</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <Target className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Team Goals
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>24</div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>This Season</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <TrendingUp className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Form
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>W-W-D</div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>Last 3 Games</p>
          </CardContent>
        </Card>
      </ResponsiveGrid>

      {/* Compliance Alerts for Team */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader className={isMobile ? 'p-3' : 'p-3 sm:p-4'}>
          <CardTitle className={`text-club-gold ${isMobile ? 'text-base' : 'text-sm sm:text-base'}`}>Team Compliance Alerts</CardTitle>
          <CardDescription className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
            Important notices for your team
          </CardDescription>
        </CardHeader>
        <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
          <div className="space-y-3">
            <div className={`flex items-start gap-3 bg-yellow-900/20 border border-yellow-600/30 rounded ${isMobile ? 'p-3' : 'p-3'}`}>
              <AlertTriangle className={`flex-shrink-0 mt-0.5 text-yellow-500 ${isMobile ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
              <div className="min-w-0">
                <p className={`text-club-light-gray font-medium ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}>Player Registration Reminder</p>
                <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>3 players need registration renewal before next match</p>
              </div>
            </div>
            <div className={`flex items-start gap-3 bg-blue-900/20 border border-blue-600/30 rounded ${isMobile ? 'p-3' : 'p-3'}`}>
              <AlertTriangle className={`flex-shrink-0 mt-0.5 text-blue-500 ${isMobile ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
              <div className="min-w-0">
                <p className={`text-club-light-gray font-medium ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}>Medical Checks</p>
                <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>Annual medical assessments due for 5 players</p>
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
