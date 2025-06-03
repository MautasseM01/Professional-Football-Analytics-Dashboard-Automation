
import { usePlayerData } from "@/hooks/use-player-data";
import { UserProfile } from "@/types";
import { PlayerStats } from "@/components/PlayerStats";
import { PlayerSelector } from "@/components/PlayerSelector";
import { RoleBasedContent } from "@/components/RoleBasedContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Target, TrendingUp } from "lucide-react";

interface PlayerDashboardProps {
  profile: UserProfile;
}

export const PlayerDashboard = ({ profile }: PlayerDashboardProps) => {
  const { players, selectedPlayer, selectPlayer, loading } = usePlayerData();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-club-gold mb-2">
          Player Dashboard
        </h1>
        <p className="text-club-light-gray/70">
          View your performance statistics and development progress
        </p>
      </div>

      {/* Player Performance Overview Cards - Player specific */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold text-sm">
              <User className="mr-2 h-4 w-4" />
              Personal Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-club-light-gray">
              {selectedPlayer?.matches || 0}
            </div>
            <p className="text-xs text-club-light-gray/70">Matches Played</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold text-sm">
              <Target className="mr-2 h-4 w-4" />
              Goals This Season
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-club-light-gray">
              {selectedPlayer?.shots_on_target || 0}
            </div>
            <p className="text-xs text-club-light-gray/70">Shots on Target</p>
          </CardContent>
        </Card>

        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-club-gold text-sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Performance Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-club-light-gray">8.2</div>
            <p className="text-xs text-club-light-gray/70">Average Rating</p>
          </CardContent>
        </Card>
      </div>

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
      <Card className="bg-club-dark-gray border-club-gold/20 mb-6">
        <CardHeader>
          <CardTitle className="text-club-gold">Development Targets</CardTitle>
          <CardDescription className="text-club-light-gray/70">
            Your current development goals and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-club-black/40 rounded">
              <span className="text-club-light-gray">Improve Pass Completion</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-club-black rounded-full h-2">
                  <div className="bg-club-gold h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-club-gold text-sm">75%</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-club-black/40 rounded">
              <span className="text-club-light-gray">Increase Sprint Distance</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-club-black rounded-full h-2">
                  <div className="bg-club-gold h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-club-gold text-sm">60%</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-club-black/40 rounded">
              <span className="text-club-light-gray">Defensive Positioning</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-club-black rounded-full h-2">
                  <div className="bg-club-gold h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-club-gold text-sm">85%</span>
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
