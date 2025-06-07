
import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerSelector } from "@/components/PlayerSelector";
import { MobilePlayerSelector } from "@/components/MobilePlayerSelector";
import { PlayerStats as PlayerStatsComponent } from "@/components/PlayerStats";
import { Player } from "@/types";
import { usePlayerData } from "@/hooks/use-player-data";
import { useIsMobile } from "@/hooks/use-mobile";

export const PlayerStats = () => {
  const { players } = usePlayerData();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const isMobile = useIsMobile();

  console.log("First player structure:", players[0]);
  console.log("Player numbers in database:", players.map(p => ({ name: p.name, id: p.id, number: p.number })));

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handlePlayerSelectById = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      setSelectedPlayer(player);
    }
  };

  return (
    <DashboardLayout>
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'p-2' : 'p-3 sm:p-4 lg:p-6'} space-y-4 sm:space-y-6`}>
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className={`font-bold text-club-gold ${isMobile ? 'text-lg' : 'text-lg sm:text-xl lg:text-2xl xl:text-3xl'}`}>
            Player Analysis
          </h1>
          <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`}>
            Individual player performance and statistics
          </p>
        </div>

        {/* Player Selection */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={isMobile ? 'p-3' : 'p-3 sm:p-4'}>
            <CardTitle className={`text-club-gold ${isMobile ? 'text-base' : 'text-sm sm:text-base'}`}>
              Select Player
            </CardTitle>
            <CardDescription className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              Choose a player to view detailed statistics and performance data
            </CardDescription>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            {isMobile ? (
              <MobilePlayerSelector
                players={players}
                selectedPlayer={selectedPlayer}
                onPlayerSelect={handlePlayerSelect}
              />
            ) : (
              <PlayerSelector
                players={players}
                selectedPlayer={selectedPlayer}
                onPlayerSelect={handlePlayerSelectById}
              />
            )}
          </CardContent>
        </Card>

        {/* Player Statistics */}
        <PlayerStatsComponent player={selectedPlayer} />
      </div>
    </DashboardLayout>
  );
};

export default PlayerStats;
