import { useMemo, useRef } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();
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
    console.log("Preparing radar data for players:", selectedPlayers);
    const data = prepareRadarData(selectedPlayers);
    console.log("Radar data prepared:", data);
    return data;
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

  // Custom player legend cards component (rendered separately below chart)
  const PlayerLegendCards = () => {
    if (selectedPlayers.length === 0) return null;

    return (
      <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <h4 className={cn(
          "text-sm font-semibold mb-4 text-center",
          theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
        )}>
          {t('comparison.playersComparison')}
        </h4>
        <div className={cn(
          "grid gap-3",
          // Responsive grid: 2 cols on mobile, 3 on tablet, 4 on desktop
          "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          selectedPlayers.length === 2 && "max-w-md mx-auto",
          selectedPlayers.length === 3 && "max-w-lg mx-auto"
        )}>
          {selectedPlayers.map((player, index) => {
            const playerColor = playerColors[index % playerColors.length];
            const jerseyNumber = chartConfig[player.name]?.jerseyNumber;
            
            return (
              <div 
                key={player.id}
                className={cn(
                  "relative p-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50",
                  "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm",
                  "hover:bg-white/80 dark:hover:bg-gray-800/80",
                  "hover:scale-105 transition-all duration-200",
                  "shadow-sm hover:shadow-md"
                )}
              >
                {/* Color indicator */}
                <div 
                  className="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: playerColor }}
                />
                
                {/* Player info */}
                <div className="pr-5">
                  <div className={cn(
                    "font-semibold text-sm truncate mb-1",
                    theme === 'dark' ? "text-white" : "text-gray-900"
                  )}>
                    {player.name}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    {jerseyNumber && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-medium",
                        "bg-club-gold/20 text-club-gold border border-club-gold/30"
                      )}>
                        #{jerseyNumber}
                      </span>
                    )}
                    
                    {player.position && (
                      <span className={cn(
                        "text-xs",
                        theme === 'dark' ? "text-gray-400" : "text-gray-600"
                      )}>
                        {player.position}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
                  {t('comparison.radarChart')}
                </CardTitle>
                <CardDescription className={cn(
                  "text-sm",
                  theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
                )}>
                  {t('comparison.selectTwoOrMore')}
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
              {t('comparison.selectTwoOrMore')}
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
                {t('comparison.radarChart')}
              </CardTitle>
              <CardDescription className={cn(
                "text-sm",
                theme === 'dark' ? "text-club-light-gray/60" : "text-gray-600"
              )}>
                {t('comparison.comprehensiveComparison')}
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
            {t('comparison.export')}
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
              className="w-full relative z-10"
              style={{ height: isMobile ? '300px' : '400px' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  data={radarData} 
                  className="mx-auto"
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
                    stroke={theme === 'dark' ? "#555" : "#e2e8f0"} 
                    strokeWidth={1}
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
                  <PolarRadiusAxis 
                    angle={90}
                    domain={[0, 100]}
                    tick={{ 
                      fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
                      fontSize: 10 
                    }}
                  />
                  
                  {selectedPlayers.map((player, index) => (
                    <Radar
                      key={`${player.id}-${player.name}`}
                      name={player.name}
                      dataKey={player.name}
                      stroke={playerColors[index % playerColors.length]}
                      fill={playerColors[index % playerColors.length]}
                      fillOpacity={0.1}
                      strokeWidth={2.5}
                      dot={{ 
                        r: isMobile ? 4 : 5, 
                        fill: playerColors[index % playerColors.length],
                        stroke: "#fff",
                        strokeWidth: 1.5,
                        style: { 
                          cursor: 'pointer'
                        }
                      }}
                    />
                  ))}
                  
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Performance insights */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white/60 dark:bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('comparison.categories')}</div>
                  <div className="text-lg font-bold text-club-gold">{radarData.length}</div>
                </div>
                <div className="bg-white/60 dark:bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('comparison.players')}</div>
                  <div className="text-lg font-bold text-club-gold">{selectedPlayers.length}</div>
                </div>
                <div className="bg-white/60 dark:bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('comparison.bestAvg')}</div>
                  <div className="text-lg font-bold text-club-gold">
                    {radarData.length > 0 ? Math.max(...radarData.map(d => Math.max(...selectedPlayers.map((_, i) => d[selectedPlayers[i].name] || 0)))).toFixed(0) : '0'}
                  </div>
                </div>
                <div className="bg-white/60 dark:bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('comparison.range')}</div>
                  <div className="text-lg font-bold text-club-gold">0-100</div>
                </div>
              </div>
            </div>
            
            {/* Player Legend Cards - Below Chart */}
            <PlayerLegendCards />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
