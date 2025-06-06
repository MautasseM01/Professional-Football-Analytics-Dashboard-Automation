
import { usePlayerData } from "@/hooks/use-player-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Target, TrendingUp } from "lucide-react";
import { ResponsiveGrid } from "../ResponsiveLayout";
import { useIsMobile } from "@/hooks/use-mobile";

interface PlayerDashboardProps {
  profile: UserProfile;
}

export const PlayerDashboard = ({ profile }: PlayerDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();
  const isMobile = useIsMobile();

  return (
    <div className={`space-y-3 sm:space-y-4 lg:space-y-6 ${isMobile ? 'p-2' : 'p-3 sm:p-4 lg:p-6'} w-full max-w-7xl mx-auto`}>
      <div className="mb-3 sm:mb-4 lg:mb-6">
        <h1 className={`font-bold text-club-gold mb-1 sm:mb-2 ${isMobile ? 'text-lg' : 'text-lg sm:text-xl lg:text-2xl xl:text-3xl'}`}>
          Player Dashboard
        </h1>
        <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`}>
          View your performance statistics and development progress
        </p>
      </div>

      {/* Player Performance Overview Cards with Responsive Grid */}
      <ResponsiveGrid mobileCols={1} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <User className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Personal Stats
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>
              {selectedPlayer?.matches || 0}
            </div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>Matches Played</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <Target className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Goals This Season
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>
              {selectedPlayer?.shots_on_target || 0}
            </div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>Shots on Target</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={`pb-2 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <CardTitle className={`flex items-center text-club-gold ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              <TrendingUp className={`mr-2 flex-shrink-0 ${isMobile ? 'h-4 w-4' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
              Performance Rating
            </CardTitle>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <div className={`font-bold text-club-light-gray ${isMobile ? 'text-xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>8.2</div>
            <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs'}`}>Average Rating</p>
          </CardContent>
        </Card>
      </ResponsiveGrid>

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
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader className={isMobile ? 'p-3' : 'p-3 sm:p-4'}>
          <CardTitle className={`text-club-gold ${isMobile ? 'text-base' : 'text-sm sm:text-base'}`}>Development Targets</CardTitle>
          <CardDescription className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
            Your current development goals and progress
          </CardDescription>
        </CardHeader>
        <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
          <div className={`space-y-3 ${isMobile ? '' : 'sm:space-y-4'}`}>
            <div className={`flex flex-col gap-2 bg-club-black/40 rounded ${isMobile ? 'p-3' : 'p-3'}`}>
              <span className={`text-club-light-gray ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}>Improve Pass Completion</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-club-black rounded-full h-2">
                  <div className="bg-club-gold h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className={`text-club-gold min-w-[3rem] ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>75%</span>
              </div>
            </div>
            <div className={`flex flex-col gap-2 bg-club-black/40 rounded ${isMobile ? 'p-3' : 'p-3'}`}>
              <span className={`text-club-light-gray ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}>Increase Sprint Distance</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-club-black rounded-full h-2">
                  <div className="bg-club-gold h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className={`text-club-gold min-w-[3rem] ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>60%</span>
              </div>
            </div>
            <div className={`flex flex-col gap-2 bg-club-black/40 rounded ${isMobile ? 'p-3' : 'p-3'}`}>
              <span className={`text-club-light-gray ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}>Defensive Positioning</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-club-black rounded-full h-2">
                  <div className="bg-club-gold h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className={`text-club-gold min-w-[3rem] ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>85%</span>
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
