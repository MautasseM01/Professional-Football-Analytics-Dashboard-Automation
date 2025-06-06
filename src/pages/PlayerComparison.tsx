import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { Player } from "@/types";
import { usePlayerData } from "@/hooks/use-player-data";
import { ResponsiveChart } from "@/components/ui/responsive-chart";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { ResponsiveTable, ResponsiveTableRow, ResponsiveTableCell, ResponsiveTableHead } from "@/components/ui/responsive-table";
import { useIsMobile } from "@/hooks/use-mobile";

interface PlayerComparisonData {
  name: string;
  metric: string;
  value: number;
}

const colors = ['#D4AF37', '#C0C0C0', '#CD7F32', '#B8860B'];

const chartConfig = {
  radar: {
    polarGrid: {
      stroke: '#666',
      strokeOpacity: 0.5
    },
    angleAxis: {
      tick: {
        fill: '#fff'
      }
    },
    radiusAxis: {
      axisLine: false,
      tick: false,
    },
    legend: {
      itemStyle: {
        color: '#fff'
      }
    }
  }
};

export const PlayerComparison = () => {
  const { players } = usePlayerData();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log("Selected Players:", selectedPlayers);
  }, [selectedPlayers]);

  const MultiPlayerSelect = ({
    players,
    selectedPlayers,
    onSelectionChange,
    maxSelection,
  }: {
    players: Player[];
    selectedPlayers: Player[];
    onSelectionChange: (players: Player[]) => void;
    maxSelection: number;
  }) => {
    const options = players.map((player) => ({
      label: player.name,
      value: player.id,
    }));
  
    const selectedValues = selectedPlayers.map((player) => player.id);
  
    const handleChange = (values: string[]) => {
      if (values.length <= maxSelection) {
        const newSelectedPlayers = players.filter((player) =>
          values.includes(player.id)
        );
        onSelectionChange(newSelectedPlayers);
      } else {
        // Optionally, provide feedback to the user that they've reached the limit
        alert(`You can only select up to ${maxSelection} players.`);
      }
    };
  
    return (
      <MultiSelect
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder="Select players"
      />
    );
  };

  const radarData: PlayerComparisonData[] = selectedPlayers.length > 0 ? [
    {
      metric: "Distance",
      ...selectedPlayers.reduce((acc, player) => {
        acc[player.name] = player.distance;
        return acc;
      }, {}),
    },
    {
      metric: "Pass Completion",
      ...selectedPlayers.reduce((acc, player) => {
        // Use passCompletionPct if available, otherwise calculate it
        const passCompletion = player.passCompletionPct ? parseFloat(player.passCompletionPct) : (player.passes_attempted > 0 ? (player.passes_completed / player.passes_attempted) * 100 : 0);
        acc[player.name] = passCompletion;
        return acc;
      }, {}),
    },
    {
      metric: "Shots on Target",
      ...selectedPlayers.reduce((acc, player) => {
        acc[player.name] = player.shots_on_target;
        return acc;
      }, {}),
    },
    {
      metric: "Tackles Won",
      ...selectedPlayers.reduce((acc, player) => {
        acc[player.name] = player.tackles_won;
        return acc;
      }, {}),
    },
  ] : [];

  return (
    <DashboardLayout>
      <div className={`space-y-4 sm:space-y-6 lg:space-y-8 ${isMobile ? 'p-2' : 'p-3 sm:p-4 lg:p-6'} w-full max-w-7xl mx-auto`}>
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className={`font-bold text-club-gold ${isMobile ? 'text-lg' : 'text-lg sm:text-xl lg:text-2xl xl:text-3xl'}`}>
            Player Comparison
          </h1>
          <p className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`}>
            Compare multiple players side by side
          </p>
        </div>

        {/* Player Selection */}
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardHeader className={isMobile ? 'p-3' : 'p-3 sm:p-4'}>
            <CardTitle className={`text-club-gold ${isMobile ? 'text-base' : 'text-sm sm:text-base'}`}>
              Select Players to Compare
            </CardTitle>
            <CardDescription className={`text-club-light-gray/70 ${isMobile ? 'text-sm' : 'text-xs sm:text-sm'}`}>
              Choose 2-4 players for detailed comparison
            </CardDescription>
          </CardHeader>
          <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
            <MultiPlayerSelect
              players={players}
              selectedPlayers={selectedPlayers}
              onSelectionChange={setSelectedPlayers}
              maxSelection={4}
            />
          </CardContent>
        </Card>

        {/* Comparison Content */}
        {selectedPlayers.length >= 2 ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Performance Chart */}
            <Card className="bg-club-dark-gray border-club-gold/20">
              <CardHeader className={isMobile ? 'p-3' : 'p-3 sm:p-4'}>
                <CardTitle className={`text-club-gold ${isMobile ? 'text-base' : 'text-sm sm:text-base'}`}>
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
                <ResponsiveChart
                  config={chartConfig}
                  showZoomControls={true}
                  aspectRatio={isMobile ? 4/3 : 16/9}
                  minHeight={isMobile ? 200 : 300}
                >
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ 
                        fontSize: isMobile ? 10 : 12,
                        fill: '#D4AF37'
                      }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]}
                      tick={{ fontSize: isMobile ? 8 : 10 }}
                    />
                    {selectedPlayers.map((player, index) => (
                      <Radar
                        key={player.id}
                        name={player.name}
                        dataKey={player.name}
                        stroke={colors[index % colors.length]}
                        fill={colors[index % colors.length]}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))}
                    <Legend 
                      wrapperStyle={{ 
                        fontSize: isMobile ? '12px' : '14px',
                        paddingTop: '10px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveChart>
              </CardContent>
            </Card>

            {/* Statistics Table */}
            <Card className="bg-club-dark-gray border-club-gold/20">
              <CardHeader className={isMobile ? 'p-3' : 'p-3 sm:p-4'}>
                <CardTitle className={`text-club-gold ${isMobile ? 'text-base' : 'text-sm sm:text-base'}`}>
                  Detailed Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className={`pt-0 ${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
                <ResponsiveTable cardLayout={isMobile}>
                  {isMobile ? (
                    // Mobile card layout
                    <div className="space-y-3">
                      {selectedPlayers.map((player, index) => (
                        <ResponsiveTableRow
                          key={player.id}
                          title={
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: colors[index % colors.length] }}
                              />
                              <span className="font-medium">{player.name}</span>
                              <span className="text-xs text-club-light-gray/60">#{player.number}</span>
                            </div>
                          }
                          data={{
                            "Total Distance (km)": `${player.distance} km`,
                            "Pass Completion %": player.passCompletionPct ? `${player.passCompletionPct}%` : `${((player.passes_completed / player.passes_attempted) * 100).toFixed(1)}%`,
                            "Shots on Target": player.shots_on_target,
                            "Tackles Won": player.tackles_won
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    // Desktop table layout
                    <>
                      <thead>
                        <tr>
                          <ResponsiveTableHead>Player</ResponsiveTableHead>
                          <ResponsiveTableHead>Position</ResponsiveTableHead>
                          <ResponsiveTableHead>Distance (km)</ResponsiveTableHead>
                          <ResponsiveTableHead>Pass Completion %</ResponsiveTableHead>
                          <ResponsiveTableHead>Shots on Target</ResponsiveTableHead>
                          <ResponsiveTableHead>Tackles Won</ResponsiveTableHead>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlayers.map((player, index) => (
                          <ResponsiveTableRow key={player.id}>
                            <ResponsiveTableCell>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: colors[index % colors.length] }}
                                />
                                <div>
                                  <div className="font-medium">{player.name}</div>
                                  <div className="text-xs text-club-light-gray/60">#{player.number}</div>
                                </div>
                              </div>
                            </ResponsiveTableCell>
                            <ResponsiveTableCell>{player.position}</ResponsiveTableCell>
                            <ResponsiveTableCell>{player.distance} km</ResponsiveTableCell>
                            <ResponsiveTableCell>
                              {player.passCompletionPct ? 
                                `${player.passCompletionPct}%` : 
                                `${((player.passes_completed / player.passes_attempted) * 100).toFixed(1)}%`
                              }
                            </ResponsiveTableCell>
                            <ResponsiveTableCell>{player.shots_on_target}</ResponsiveTableCell>
                            <ResponsiveTableCell>{player.tackles_won}</ResponsiveTableCell>
                          </ResponsiveTableRow>
                        ))}
                      </tbody>
                    </>
                  )}
                </ResponsiveTable>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-club-dark-gray border-club-gold/20">
            <CardContent className={`text-center text-club-light-gray/70 ${isMobile ? 'p-6' : 'p-6 sm:p-8'}`}>
              <p className={isMobile ? 'text-sm' : 'text-base'}>
                Select at least 2 players to begin comparison
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
