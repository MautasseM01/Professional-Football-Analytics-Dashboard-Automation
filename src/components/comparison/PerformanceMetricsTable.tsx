
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { TrendingUp } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TableLoadingSkeleton } from "@/components/LoadingStates";
import { 
  getPassCompletionPercentage, 
  getHighestValuesInRow, 
  formatPercentage 
} from "@/utils/comparisonUtils";

interface PerformanceMetricsTableProps {
  selectedPlayers: Player[];
  loading: boolean;
}

export const PerformanceMetricsTable = ({
  selectedPlayers,
  loading
}: PerformanceMetricsTableProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const highestDistance = getHighestValuesInRow(
    selectedPlayers, 
    player => player.distance
  );
    
  const highestPassCompletion = getHighestValuesInRow(
    selectedPlayers,
    player => {
      if (!player.passes_attempted || player.passes_attempted === 0) return null;
      return (player.passes_completed / player.passes_attempted) * 100;
    }
  );
    
  const highestShotsOnTarget = getHighestValuesInRow(
    selectedPlayers,
    player => player.shots_on_target
  );
    
  const highestTacklesWon = getHighestValuesInRow(
    selectedPlayers,
    player => player.tackles_won
  );

  // Mobile card view for better readability
  if (isMobile && selectedPlayers.length > 2) {
    return (
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
                Performance Metrics
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
        <CardContent className="space-y-4">
          {selectedPlayers.map((player) => (
            <div
              key={player.id}
              className={cn(
                "p-4 rounded-lg border transition-all duration-200",
                theme === 'dark' 
                  ? "bg-club-black/20 border-club-gold/10" 
                  : "bg-gray-50/50 border-club-gold/20"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <PlayerAvatar player={player} size="sm" />
                <span className={cn(
                  "font-medium",
                  theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                )}>
                  {player.name}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Distance:</span>
                  <div className={cn(
                    "font-medium",
                    highestDistance[player.id] && "text-club-gold"
                  )}>
                    {player.distance ? `${player.distance.toFixed(1)} km` : 'N/A'}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500">Pass %:</span>
                  <div className={cn(
                    "font-medium",
                    highestPassCompletion[player.id] && "text-club-gold"
                  )}>
                    {player.passes_attempted && player.passes_attempted > 0 ?
                      formatPercentage(getPassCompletionPercentage(player)) :
                      'N/A'
                    }
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500">Shots:</span>
                  <div className={cn(
                    "font-medium",
                    highestShotsOnTarget[player.id] && "text-club-gold"
                  )}>
                    {player.shots_on_target !== null && player.shots_on_target !== undefined ?
                      player.shots_on_target :
                      'N/A'
                    }
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500">Tackles:</span>
                  <div className={cn(
                    "font-medium",
                    highestTacklesWon[player.id] && "text-club-gold"
                  )}>
                    {player.tackles_won !== null && player.tackles_won !== undefined ?
                      player.tackles_won :
                      'N/A'
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
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
            <div className="min-w-max">
              <Table>
                <TableHeader>
                  <TableRow className={cn(
                    theme === 'dark' 
                      ? "border-club-gold/20" 
                      : "border-club-gold/30"
                  )}>
                    <TableHead 
                      className={cn(
                        "font-semibold sticky left-0 z-10 min-w-[120px]",
                        theme === 'dark' 
                          ? "text-club-light-gray bg-club-dark-gray/80" 
                          : "text-gray-900 bg-white/80"
                      )}
                    >
                      Metric
                    </TableHead>
                    {selectedPlayers.map((player) => (
                      <TableHead 
                        key={player.id} 
                        className={cn(
                          "text-center min-w-[140px] max-w-[160px]",
                          selectedPlayers.length > 3 && "min-w-[120px] max-w-[140px]"
                        )}
                      >
                        <div className="flex items-center justify-center gap-2 px-1">
                          <PlayerAvatar 
                            player={player}
                            size="sm"
                            className="flex-shrink-0"
                          />
                          <span className={cn(
                            "font-medium text-xs truncate",
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
                      "font-medium sticky left-0 z-10",
                      theme === 'dark' 
                        ? "text-club-light-gray bg-club-dark-gray/80" 
                        : "text-gray-900 bg-white/80"
                    )}>
                      {isMobile ? "Distance" : "Total Distance (km)"}
                    </TableCell>
                    {selectedPlayers.map((player) => (
                      <TableCell 
                        key={`distance-${player.id}`} 
                        className={cn(
                          "text-center transition-all duration-200",
                          highestDistance[player.id] 
                            ? "bg-club-gold/20 font-semibold text-club-gold" 
                            : theme === 'dark' 
                            ? "text-club-light-gray" 
                            : "text-gray-900"
                        )}
                      >
                        {player.distance ? 
                          player.distance.toFixed(1) : 
                          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">N/A</Badge>
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
                      "font-medium sticky left-0 z-10",
                      theme === 'dark' 
                        ? "text-club-light-gray bg-club-dark-gray/80" 
                        : "text-gray-900 bg-white/80"
                    )}>
                      {isMobile ? "Pass %" : "Pass Completion %"}
                    </TableCell>
                    {selectedPlayers.map((player) => (
                      <TableCell 
                        key={`passes-${player.id}`} 
                        className={cn(
                          "text-center transition-all duration-200",
                          highestPassCompletion[player.id] 
                            ? "bg-club-gold/20 font-semibold text-club-gold" 
                            : theme === 'dark' 
                            ? "text-club-light-gray" 
                            : "text-gray-900"
                        )}
                      >
                        {player.passes_attempted && player.passes_attempted > 0 ?
                          formatPercentage(getPassCompletionPercentage(player)) :
                          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">N/A</Badge>
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
                      "font-medium sticky left-0 z-10",
                      theme === 'dark' 
                        ? "text-club-light-gray bg-club-dark-gray/80" 
                        : "text-gray-900 bg-white/80"
                    )}>
                      {isMobile ? "Shots" : "Shots on Target"}
                    </TableCell>
                    {selectedPlayers.map((player) => (
                      <TableCell 
                        key={`shots-${player.id}`} 
                        className={cn(
                          "text-center transition-all duration-200",
                          highestShotsOnTarget[player.id] 
                            ? "bg-club-gold/20 font-semibold text-club-gold" 
                            : theme === 'dark' 
                            ? "text-club-light-gray" 
                            : "text-gray-900"
                        )}
                      >
                        {player.shots_on_target !== null && player.shots_on_target !== undefined ?
                          player.shots_on_target :
                          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">N/A</Badge>
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
                      "font-medium sticky left-0 z-10",
                      theme === 'dark' 
                        ? "text-club-light-gray bg-club-dark-gray/80" 
                        : "text-gray-900 bg-white/80"
                    )}>
                      {isMobile ? "Tackles" : "Tackles Won"}
                    </TableCell>
                    {selectedPlayers.map((player) => (
                      <TableCell 
                        key={`tackles-${player.id}`} 
                        className={cn(
                          "text-center transition-all duration-200",
                          highestTacklesWon[player.id] 
                            ? "bg-club-gold/20 font-semibold text-club-gold" 
                            : theme === 'dark' 
                            ? "text-club-light-gray" 
                            : "text-gray-900"
                        )}
                      >
                        {player.tackles_won !== null && player.tackles_won !== undefined ?
                          player.tackles_won :
                          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">N/A</Badge>
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
