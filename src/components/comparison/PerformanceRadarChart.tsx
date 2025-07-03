import { useMemo, useRef } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
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
  const chartRef = useRef<HTMLDivElement>(null);

  // Professional color palette with accessibility in mind
  const playerColors = [
    "#D4AF37", // Club gold for best performer
    "#4A90E2", // Professional blue
    "#E74C3C", // Distinctive red
    "#2ECC71", // Professional green
    "#9B59B6", // Purple
    "#F39C12"  // Orange
  ];

  const radarData = useMemo(() => {
    if (!selectedPlayers || selectedPlayers.length === 0) {
      return [];
    }

    // Create radar data structure for Recharts
    const categories = [
      { category: "Distance", key: "distance_covered" },
      { category: "Shots on Target", key: "shots_on_target" },
      { category: "Passes Completed", key: "passes_completed" },
      { category: "Tackles Won", key: "tackles_won" }
    ];

    // Find max values for normalization
    const maxValues = categories.reduce((acc, cat) => {
      const values = selectedPlayers.map(p => p[cat.key] || 0).filter(v => v > 0);
      acc[cat.key] = values.length > 0 ? Math.max(...values) : 1;
      return acc;
    }, {} as Record<string, number>);

    // Create data points for each category
    return categories.map(cat => {
      const dataPoint: any = { category: cat.category, fullMark: 100 };
      
      selectedPlayers.forEach(player => {
        const value = player[cat.key] || 0;
        const normalizedValue = maxValues[cat.key] > 0 ? (value / maxValues[cat.key]) * 100 : 0;
        dataPoint[player.name] = Math.round(normalizedValue);
      });
      
      return dataPoint;
    });
  }, [selectedPlayers]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { color: string; jerseyNumber?: string }> = {};
    
    selectedPlayers.forEach((player, index) => {
      config[player.name] = { 
        color: playerColors[index % playerColors.length],
        jerseyNumber: player.number?.toString() || (index + 1).toString()
      };
    });
    
    return config;
  }, [selectedPlayers]);

  // Export functionality
  const exportChart = async () => {
    if (!chartRef.current) return;
    
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `performance-radar-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={cn(
          "bg-white/95 dark:bg-gray-900/95 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm",
          "min-w-[150px]"
        )}>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {entry.name}
                </span>
              </div>
              <span className="font-bold text-club-gold">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4 px-4">
        {payload.map((entry: any, index: number) => {
          const player = selectedPlayers[index];
          const jerseyNumber = chartConfig[entry.value]?.jerseyNumber;
          
          return (
            <div 
              key={entry.value}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                "bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50",
                "hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-105"
              )}
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: entry.color }}
              />
              <div className="text-sm">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {entry.value}
                </div>
                {jerseyNumber && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    #{jerseyNumber}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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
          <div className="flex items-center justify-between">
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
        <div className="flex items-center justify-between">
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
                Comprehensive performance comparison across key metrics
              </CardDescription>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportChart}
            className={cn(
              "gap-2 transition-all duration-200",
              "border-club-gold/30 text-club-gold hover:bg-club-gold/10"
            )}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <ChartSkeleton height={400} showLegend={true} />
        ) : (
          <div 
            ref={chartRef}
            className={cn(
              "w-full rounded-2xl p-6 transition-all duration-300 relative overflow-hidden",
              theme === 'dark' 
                ? "bg-gradient-to-br from-club-black/40 via-club-dark-gray/20 to-club-black/40" 
                : "bg-gradient-to-br from-gray-50/60 via-white/40 to-gray-50/60"
            )}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, ${theme === 'dark' ? '#D4AF37' : '#D4AF37'} 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}
              />
            </div>
            
            <div 
              className="w-full relative z-10 flex items-center justify-center"
              style={{ height: isMobile ? '400px' : '500px' }}
            >
                  <RadarChart 
                    data={radarData} 
                    width={isMobile ? 350 : 450}
                    height={isMobile ? 350 : 450}
                    margin={{ 
                      top: 40, 
                      right: isMobile ? 40 : 60, 
                      bottom: 40, 
                      left: isMobile ? 40 : 60 
                    }}
                  >
                  <defs>
                    <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={theme === 'dark' ? '#D4AF37' : '#D4AF37'} stopOpacity={0.1} />
                      <stop offset="100%" stopColor={theme === 'dark' ? '#D4AF37' : '#D4AF37'} stopOpacity={0.05} />
                    </radialGradient>
                  </defs>
                  
                  <PolarGrid 
                    stroke={theme === 'dark' ? "#4A5568" : "#CBD5E0"} 
                    strokeWidth={1.5}
                    gridType="polygon"
                    radialLines={true}
                  />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ 
                      fill: theme === 'dark' ? "#E5E7EB" : "#374151", 
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: 600
                    }}
                    className="text-xs font-medium"
                  />
                  
                  {selectedPlayers.map((player, index) => (
                    <Radar
                      key={`${player.id}-${player.name}`}
                      name={player.name}
                      dataKey={player.name}
                      stroke={playerColors[index % playerColors.length]}
                      fill={playerColors[index % playerColors.length]}
                      fillOpacity={0.15}
                      strokeWidth={3}
                      dot={{ 
                        r: isMobile ? 5 : 6, 
                        fill: playerColors[index % playerColors.length],
                        stroke: "#fff",
                        strokeWidth: 2,
                        style: { 
                          cursor: 'pointer',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }
                      }}
                      animationBegin={index * 200}
                      animationDuration={800}
                    />
                  ))}
                  
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </RadarChart>
            </div>
            
            {/* Performance insights */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white/60 dark:bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Categories</div>
                  <div className="text-lg font-bold text-club-gold">{radarData.length}</div>
                </div>
                <div className="bg-white/60 dark:bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Players</div>
                  <div className="text-lg font-bold text-club-gold">{selectedPlayers.length}</div>
                </div>
                <div className="bg-white/60 dark:bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Best Avg</div>
                  <div className="text-lg font-bold text-club-gold">
                    {radarData.length > 0 ? Math.max(...radarData.map(d => Math.max(...selectedPlayers.map((_, i) => d[selectedPlayers[i].name] || 0)))).toFixed(0) : '0'}
                  </div>
                </div>
                <div className="bg-white/60 dark:bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Range</div>
                  <div className="text-lg font-bold text-club-gold">0-100</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
