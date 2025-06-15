
import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChartLoadingSkeleton } from "@/components/LoadingStates";
import { prepareRadarData } from "@/utils/comparisonUtils";

interface PerformanceRadarChartProps {
  selectedPlayers: Player[];
  loading: boolean;
}

export const PerformanceRadarChart = ({
  selectedPlayers,
  loading
}: PerformanceRadarChartProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Generate chart colors for each player
  const playerColors = [
    "#3498db", // Blue
    "#e74c3c", // Red  
    "#2ecc71", // Green
    "#f39c12"  // Orange
  ];

  const radarData = useMemo(() => {
    console.log("Preparing radar data for players:", selectedPlayers);
    const data = prepareRadarData(selectedPlayers);
    console.log("Radar data prepared:", data);
    return data;
  }, [selectedPlayers]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { color: string }> = {};
    
    selectedPlayers.forEach((player, index) => {
      config[player.name] = { 
        color: playerColors[index % playerColors.length]
      };
    });
    
    return config;
  }, [selectedPlayers]);

  if (selectedPlayers.length === 0) {
    return (
      <Card className={cn(
        "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
        theme === 'dark' 
          ? "bg-club-dark-gray/60" 
          : "bg-white/80",
        "shadow-xl"
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
                Select players to see their performance comparison
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "flex items-center justify-center h-64 rounded-lg border-2 border-dashed",
            theme === 'dark' 
              ? "border-club-gold/20 text-club-light-gray/60" 
              : "border-club-gold/30 text-gray-500"
          )}>
            <p className="text-center">
              Select 2 or more players to display the radar chart
            </p>
          </div>
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
            <div 
              className="w-full"
              style={{ height: isMobile ? '320px' : '400px' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  data={radarData} 
                  className="mx-auto"
                  margin={{ 
                    top: 20, 
                    right: isMobile ? 20 : 30, 
                    bottom: 20, 
                    left: isMobile ? 20 : 30 
                  }}
                >
                  <PolarGrid 
                    stroke={theme === 'dark' ? "#444" : "#e5e7eb"} 
                    strokeWidth={1}
                  />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ 
                      fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
                      fontSize: isMobile ? 11 : 12,
                      fontWeight: 500
                    }}
                    className="text-xs"
                  />
                  
                  {selectedPlayers.map((player, index) => (
                    <Radar
                      key={`${player.id}-${player.name}`}
                      name={player.name}
                      dataKey={player.name}
                      stroke={playerColors[index % playerColors.length]}
                      fill={playerColors[index % playerColors.length]}
                      fillOpacity={0.15}
                      strokeWidth={2.5}
                      dot={{ 
                        r: isMobile ? 4 : 5, 
                        fill: playerColors[index % playerColors.length],
                        stroke: "#fff",
                        strokeWidth: 2
                      }}
                    />
                  ))}
                  
                  {!isMobile && (
                    <Legend 
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontSize: "12px"
                      }}
                    />
                  )}
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Mobile Legend */}
            {isMobile && selectedPlayers.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {selectedPlayers.map((player, index) => (
                  <div key={player.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: playerColors[index % playerColors.length] }}
                    />
                    <span className={cn(
                      "text-xs font-medium truncate",
                      theme === 'dark' ? "text-club-light-gray" : "text-gray-700"
                    )}>
                      {player.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Chart Stats Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Distance</div>
                  <div className="text-sm font-semibold text-club-gold">Max Range</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Shots</div>
                  <div className="text-sm font-semibold text-club-gold">On Target</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Passes</div>
                  <div className="text-sm font-semibold text-club-gold">Completed</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Tackles</div>
                  <div className="text-sm font-semibold text-club-gold">Won</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
