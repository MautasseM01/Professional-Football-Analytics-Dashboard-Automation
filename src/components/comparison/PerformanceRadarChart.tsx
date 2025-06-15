
import { useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ResponsiveChartContainer } from "@/components/ResponsiveChartContainer";
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

  const radarData = useMemo(() => prepareRadarData(selectedPlayers), [selectedPlayers]);
  
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
  );
};
