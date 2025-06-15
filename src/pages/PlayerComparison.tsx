import { useState, useMemo } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { usePlayerData } from "@/hooks/use-player-data";
import { Player } from "@/types";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { MultiPlayerSelect } from "@/components/MultiPlayerSelect";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Badge } from "@/components/ui/badge";
import { UserRound, TrendingUp, BarChart3, Menu, RefreshCw, Sparkles } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { BackToTopButton } from "@/components/BackToTopButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { ResponsiveChartContainer } from "@/components/ResponsiveChartContainer";
import { TableLoadingSkeleton, ChartLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export default function PlayerComparison() {
  const { players, loading, refreshData } = usePlayerData();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshData();
  };

  const selectedPlayers = useMemo(() => {
    if (!players?.length || !selectedPlayerIds.length) return [];
    
    return players.filter(player => selectedPlayerIds.includes(player.id));
  }, [players, selectedPlayerIds]);

  const handlePlayerSelectionChange = (playerIds: number[]) => {
    // Limit to a maximum of 4 players
    if (playerIds.length <= 4) {
      setSelectedPlayerIds(playerIds);
    }
  };

  // Calculate pass completion percentages
  const getPassCompletionPercentage = (player: Player): number => {
    if (!player.passes_attempted || player.passes_attempted === 0) return 0;
    return (player.passes_completed / player.passes_attempted) * 100;
  };

  // Determine the highest value in a row for highlighting
  const getHighestValuesInRow = (statFunction: (player: Player) => number | null | undefined) => {
    if (!selectedPlayers.length) return {};
    
    const validValues = selectedPlayers
      .map(player => ({ id: player.id, value: statFunction(player) }))
      .filter(item => item.value !== null && item.value !== undefined);
      
    if (!validValues.length) return {};
    
    const maxValue = Math.max(...validValues.map(item => Number(item.value)));
    
    return validValues.reduce((acc, item) => {
      if (Number(item.value) === maxValue) {
        acc[item.id] = true;
      }
      return acc;
    }, {} as Record<number, boolean>);
  };

  // Get highest values for each stat type
  const highestDistance = useMemo(() => 
    getHighestValuesInRow(player => player.distance), [selectedPlayers]);
    
  const highestPassCompletion = useMemo(() => 
    getHighestValuesInRow(player => {
      if (!player.passes_attempted || player.passes_attempted === 0) return null;
      return (player.passes_completed / player.passes_attempted) * 100;
    }), [selectedPlayers]);
    
  const highestShotsOnTarget = useMemo(() => 
    getHighestValuesInRow(player => player.shots_on_target), [selectedPlayers]);
    
  const highestTacklesWon = useMemo(() => 
    getHighestValuesInRow(player => player.tackles_won), [selectedPlayers]);

  // Prepare data for radar chart
  const prepareRadarData = () => {
    const radarData = [
      { category: "Distance", fullMark: 100 },
      { category: "Shots on Target", fullMark: 100 },
      { category: "Passes Completed", fullMark: 100 },
      { category: "Tackles Won", fullMark: 100 }
    ];

    // Find max values to normalize data
    const maxValues = {
      distance: Math.max(...selectedPlayers.map(p => p.distance || 0), 1),
      shots_on_target: Math.max(...selectedPlayers.map(p => p.shots_on_target || 0), 1),
      passes_completed: Math.max(...selectedPlayers.map(p => p.passes_completed || 0), 1),
      tackles_won: Math.max(...selectedPlayers.map(p => p.tackles_won || 0), 1)
    };

    // Add player data to radar chart
    selectedPlayers.forEach(player => {
      radarData[0][player.name] = player.distance 
        ? (player.distance / maxValues.distance) * 100 
        : 0;
        
      radarData[1][player.name] = player.shots_on_target 
        ? (player.shots_on_target / maxValues.shots_on_target) * 100 
        : 0;
        
      radarData[2][player.name] = player.passes_completed 
        ? (player.passes_completed / maxValues.passes_completed) * 100 
        : 0;
        
      radarData[3][player.name] = player.tackles_won 
        ? (player.tackles_won / maxValues.tackles_won) * 100 
        : 0;
    });

    return radarData;
  };

  // Generate chart colors for each player
  const playerColors = [
    "#3498db", // Blue
    "#e74c3c", // Red
    "#2ecc71", // Green
    "#f39c12"  // Orange
  ];

  const radarData = useMemo(() => prepareRadarData(), [selectedPlayers]);
  const chartConfig = useMemo(() => {
    const config: Record<string, { color: string }> = {};
    
    selectedPlayers.forEach((player, index) => {
      config[player.name] = { 
        color: playerColors[index % playerColors.length]
      };
    });
    
    return config;
  }, [selectedPlayers]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-club-black to-slate-900 dark:from-slate-900 dark:via-club-black dark:to-slate-900 text-gray-100 dark:text-gray-100 transition-colors duration-300">
        {showSidebar && <DashboardSidebar />}
        
        <div className="flex-1 overflow-auto min-w-0">
          {/* Prominent Demo Banner */}
          <div className="bg-gradient-to-r from-club-gold to-yellow-600 text-club-black p-2 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <Sparkles size={16} />
              <span>Football Analytics Dashboard - Interactive Demo</span>
              <Sparkles size={16} />
            </div>
          </div>

          <header className="border-b border-club-gold/20 dark:border-club-gold/20 bg-club-black/80 dark:bg-club-black/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
            <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-3 gap-2 sm:gap-4 sm:py-[20px]">
              {/* Left section - Title and page info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-ios-headline font-bold text-club-gold dark:text-club-gold truncate">
                  Player Comparison
                </h1>
                <p className="text-ios-caption text-gray-400 dark:text-gray-400 truncate">
                  Compare performance metrics between multiple players
                </p>
              </div>
              
              {/* Right section - Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
                {/* Language Selector */}
                <LanguageSelector />
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Refresh Button */}
                <TouchFeedbackButton 
                  variant="outline" 
                  size="icon" 
                  className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                  onClick={handleRefresh} 
                  title="Refresh data"
                  hapticType="medium"
                >
                  <RefreshCw size={14} className="sm:hidden text-club-gold" />
                  <RefreshCw size={16} className="hidden sm:block lg:hidden text-club-gold" />
                  <RefreshCw size={18} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
                
                {/* Menu Toggle */}
                <TouchFeedbackButton 
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSidebar(!showSidebar)} 
                  className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                  title="Toggle sidebar"
                  hapticType="light"
                >
                  <Menu size={16} className="sm:hidden text-club-gold" />
                  <Menu size={18} className="hidden sm:block lg:hidden text-club-gold" />
                  <Menu size={20} className="hidden lg:block text-club-gold" />
                </TouchFeedbackButton>
              </div>
            </div>
          </header>
          
          <main className="bg-transparent transition-colors duration-300 w-full">
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Player Selection Card - iPhone weather style */}
              <Card className={cn(
                "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
                theme === 'dark' 
                  ? "bg-club-dark-gray/60" 
                  : "bg-white/80",
                "shadow-xl"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-club-gold" />
                    <div>
                      <CardTitle className={cn(
                        "text-lg font-semibold",
                        theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                      )}>
                        Player Selection
                      </CardTitle>
                      <CardDescription className={cn(
                        "text-sm",
                        theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
                      )}>
                        Select 2 to 4 players to compare their performance metrics
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <MultiPlayerSelect 
                    players={players || []}
                    selectedPlayerIds={selectedPlayerIds}
                    onChange={handlePlayerSelectionChange}
                    loading={loading}
                    maxSelections={4}
                  />
                </CardContent>
              </Card>

              {selectedPlayers.length > 0 && (
                <>
                  {/* Performance Metrics Table - iPhone weather style */}
                  <Card className={cn(
                    "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
                    theme === 'dark' 
                      ? "bg-club-dark-gray/60" 
                      : "bg-white/80",
                    "shadow-xl animate-fade-in"
                  )}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-club-gold" />
                        <div>
                          <CardTitle className={cn(
                            "text-lg font-semibold",
                            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                          )}>
                            Performance Metrics Comparison
                          </CardTitle>
                          <CardDescription className={cn(
                            "text-sm",
                            theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
                          )}>
                            Key performance indicators for the selected players
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <TableLoadingSkeleton rows={4} columns={selectedPlayers.length + 1} />
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className={cn(
                                theme === 'dark' 
                                  ? "border-club-gold/20" 
                                  : "border-club-gold/30"
                              )}>
                                <TableHead className={cn(
                                  "font-semibold",
                                  theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                                )}>
                                  Metric
                                </TableHead>
                                {selectedPlayers.map((player) => (
                                  <TableHead key={player.id} className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <PlayerAvatar 
                                        player={player}
                                        size="sm"
                                      />
                                      <span className={cn(
                                        "font-medium text-sm",
                                        theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                                      )}>
                                        {isMobile ? player.name.split(' ')[0] : player.name}
                                      </span>
                                    </div>
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className={cn(
                                "transition-colors duration-200",
                                theme === 'dark' 
                                  ? "border-club-gold/10 hover:bg-club-black/20" 
                                  : "border-club-gold/20 hover:bg-gray-50/50"
                              )}>
                                <TableCell className={cn(
                                  "font-medium",
                                  theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                                )}>
                                  {isMobile ? "Distance" : "Total Distance (km)"}
                                </TableCell>
                                {selectedPlayers.map((player) => (
                                  <TableCell 
                                    key={`distance-${player.id}`} 
                                    className={cn(
                                      "text-center transition-all duration-200",
                                      highestDistance[player.id] 
                                        ? "bg-club-gold/20 font-semibold text-club-gold rounded-lg" 
                                        : theme === 'dark' 
                                        ? "text-club-light-gray" 
                                        : "text-gray-900"
                                    )}
                                  >
                                    {player.distance ? 
                                      player.distance.toFixed(1) : 
                                      <Badge variant="outline" className="bg-muted text-muted-foreground">N/A</Badge>
                                    }
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow className={cn(
                                "transition-colors duration-200",
                                theme === 'dark' 
                                  ? "border-club-gold/10 hover:bg-club-black/20" 
                                  : "border-club-gold/20 hover:bg-gray-50/50"
                              )}>
                                <TableCell className={cn(
                                  "font-medium",
                                  theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                                )}>
                                  {isMobile ? "Pass %" : "Pass Completion %"}
                                </TableCell>
                                {selectedPlayers.map((player) => (
                                  <TableCell 
                                    key={`passes-${player.id}`} 
                                    className={cn(
                                      "text-center transition-all duration-200",
                                      highestPassCompletion[player.id] 
                                        ? "bg-club-gold/20 font-semibold text-club-gold rounded-lg" 
                                        : theme === 'dark' 
                                        ? "text-club-light-gray" 
                                        : "text-gray-900"
                                    )}
                                  >
                                    {player.passes_attempted && player.passes_attempted > 0 ?
                                      formatPercentage(getPassCompletionPercentage(player)) :
                                      <Badge variant="outline" className="bg-muted text-muted-foreground">N/A</Badge>
                                    }
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow className={cn(
                                "transition-colors duration-200",
                                theme === 'dark' 
                                  ? "border-club-gold/10 hover:bg-club-black/20" 
                                  : "border-club-gold/20 hover:bg-gray-50/50"
                              )}>
                                <TableCell className={cn(
                                  "font-medium",
                                  theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                                )}>
                                  {isMobile ? "Shots" : "Shots on Target"}
                                </TableCell>
                                {selectedPlayers.map((player) => (
                                  <TableCell 
                                    key={`shots-${player.id}`} 
                                    className={cn(
                                      "text-center transition-all duration-200",
                                      highestShotsOnTarget[player.id] 
                                        ? "bg-club-gold/20 font-semibold text-club-gold rounded-lg" 
                                        : theme === 'dark' 
                                        ? "text-club-light-gray" 
                                        : "text-gray-900"
                                    )}
                                  >
                                    {player.shots_on_target !== null && player.shots_on_target !== undefined ?
                                      player.shots_on_target :
                                      <Badge variant="outline" className="bg-muted text-muted-foreground">N/A</Badge>
                                    }
                                  </TableCell>
                                ))}
                              </TableRow>
                              <TableRow className={cn(
                                "transition-colors duration-200",
                                theme === 'dark' 
                                  ? "border-club-gold/10 hover:bg-club-black/20" 
                                  : "border-club-gold/20 hover:bg-gray-50/50"
                              )}>
                                <TableCell className={cn(
                                  "font-medium",
                                  theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                                )}>
                                  {isMobile ? "Tackles" : "Tackles Won"}
                                </TableCell>
                                {selectedPlayers.map((player) => (
                                  <TableCell 
                                    key={`tackles-${player.id}`} 
                                    className={cn(
                                      "text-center transition-all duration-200",
                                      highestTacklesWon[player.id] 
                                        ? "bg-club-gold/20 font-semibold text-club-gold rounded-lg" 
                                        : theme === 'dark' 
                                        ? "text-club-light-gray" 
                                        : "text-gray-900"
                                    )}
                                  >
                                    {player.tackles_won !== null && player.tackles_won !== undefined ?
                                      player.tackles_won :
                                      <Badge variant="outline" className="bg-muted text-muted-foreground">N/A</Badge>
                                    }
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Radar Chart - iPhone weather style */}
                  <Card className={cn(
                    "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
                    theme === 'dark' 
                      ? "bg-club-dark-gray/60" 
                      : "bg-white/80",
                    "shadow-xl animate-fade-in"
                  )}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-club-gold" />
                        <div>
                          <CardTitle className={cn(
                            "text-lg font-semibold",
                            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                          )}>
                            Performance Radar Chart
                          </CardTitle>
                          <CardDescription className={cn(
                            "text-sm",
                            theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
                          )}>
                            Visual comparison of player attributes across key categories
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <ChartLoadingSkeleton showHeader={false} />
                      ) : (
                        <div className={cn(
                          "w-full rounded-2xl p-4 transition-all duration-300",
                          theme === 'dark' 
                            ? "bg-club-black/20 border border-club-gold/10" 
                            : "bg-gray-50/30 border border-club-gold/20"
                        )}>
                          <ResponsiveChartContainer 
                            config={chartConfig}
                            aspectRatio={isMobile ? 1 : 1.5}
                            minHeight={isMobile ? 300 : 400}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={radarData} className="mx-auto">
                                <PolarGrid stroke={theme === 'dark' ? "#333" : "#e5e7eb"} />
                                <PolarAngleAxis 
                                  dataKey="category" 
                                  tick={{ 
                                    fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
                                    fontSize: isMobile ? 10 : 12 
                                  }}
                                />
                                
                                {selectedPlayers.map((player, index) => (
                                  <Radar
                                    key={player.id}
                                    name={player.name}
                                    dataKey={player.name}
                                    stroke={playerColors[index % playerColors.length]}
                                    fill={playerColors[index % playerColors.length]}
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                  />
                                ))}
                              </RadarChart>
                            </ResponsiveContainer>
                          </ResponsiveChartContainer>
                          
                          {/* Legend for mobile */}
                          {isMobile && selectedPlayers.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                              {selectedPlayers.map((player, index) => (
                                <div key={player.id} className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: playerColors[index % playerColors.length] }}
                                  />
                                  <span className="text-xs font-medium text-club-light-gray truncate">
                                    {player.name.split(' ')[0]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </main>
        </div>

        {/* Back to Top Button */}
        <BackToTopButton />
      </div>
    </ErrorBoundary>
  );
}
