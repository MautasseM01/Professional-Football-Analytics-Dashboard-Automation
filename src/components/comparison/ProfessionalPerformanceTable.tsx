
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { TrendingUp, BarChart3, Medal, Target } from "lucide-react";
import { Player } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TableLoadingSkeleton } from "@/components/LoadingStates";
import { getPassCompletionPercentage, getHighestValuesInRow, formatPercentage } from "@/utils/comparisonUtils";
import { useSorting } from "./hooks/useSorting";
import { SortControls } from "./components/SortControls";
import { SortableHeader } from "./components/SortableHeader";
import { MetricConfig } from "./types";

interface ProfessionalPerformanceTableProps {
  selectedPlayers: Player[];
  loading: boolean;
}

export const ProfessionalPerformanceTable = ({
  selectedPlayers,
  loading
}: ProfessionalPerformanceTableProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const metrics: MetricConfig[] = [
    {
      key: 'distance',
      label: 'Total Distance',
      shortLabel: 'Distance',
      mobileLabel: 'Dist',
      getValue: player => player.distance || null,
      format: value => value ? `${value.toFixed(1)} km` : 'N/A',
      unit: 'km',
      icon: TrendingUp,
      description: 'Total distance covered during the match',
      priority: 1
    },
    {
      key: 'passCompletion',
      label: 'Pass Completion',
      shortLabel: 'Pass %',
      mobileLabel: 'Pass',
      getValue: player => player.passes_attempted && player.passes_attempted > 0 ? getPassCompletionPercentage(player) : null,
      format: value => value ? formatPercentage(value) : 'N/A',
      unit: '%',
      icon: Target,
      description: 'Percentage of successful passes',
      priority: 1
    },
    {
      key: 'shots',
      label: 'Shots on Target',
      shortLabel: 'Shots',
      mobileLabel: 'SOT',
      getValue: player => player.shots_on_target || null,
      format: value => value !== null ? value.toString() : 'N/A',
      unit: '',
      icon: BarChart3,
      description: 'Number of shots that were on target',
      priority: 2
    },
    {
      key: 'tackles',
      label: 'Tackles Won',
      shortLabel: 'Tackles',
      mobileLabel: 'Tack',
      getValue: player => player.tackles_won || null,
      format: value => value !== null ? value.toString() : 'N/A',
      unit: '',
      icon: Medal,
      description: 'Number of successful tackles',
      priority: 2
    }
  ];

  // Responsive metric filtering
  const visibleMetrics = useMemo(() => {
    if (typeof window === 'undefined') return metrics;
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) {
      return metrics.filter(m => m.priority === 1);
    }
    if (screenWidth < 1024) {
      return metrics.filter(m => m.priority <= 2);
    }
    return metrics;
  }, [typeof window !== 'undefined' ? window.innerWidth : 0]);

  // Use the sorting hook
  const {
    sortState,
    handleSort,
    clearSort,
    sortedPlayers
  } = useSorting({
    players: selectedPlayers,
    metrics: visibleMetrics
  });

  // Calculate highest values for each metric
  const highestValues = useMemo(() => {
    return visibleMetrics.reduce((acc, metric) => {
      acc[metric.key] = getHighestValuesInRow(selectedPlayers, metric.getValue);
      return acc;
    }, {} as Record<string, Record<number, boolean>>);
  }, [selectedPlayers, visibleMetrics]);

  const getPerformanceLevel = (value: number | null, metric: MetricConfig) => {
    if (value === null || value === undefined) return 'none';
    
    if (metric.key === 'passCompletion') {
      if (value >= 90) return 'excellent';
      if (value >= 80) return 'good';
      if (value >= 70) return 'average';
      return 'poor';
    }
    
    const allValues = selectedPlayers.map(p => metric.getValue(p)).filter(v => v !== null && v !== undefined) as number[];
    if (allValues.length === 0) return 'none';
    
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    const range = max - min;
    
    if (range === 0) return 'average';
    
    const normalized = (value - min) / range;
    if (normalized >= 0.8) return 'excellent';
    if (normalized >= 0.6) return 'good';
    if (normalized >= 0.4) return 'average';
    return 'poor';
  };

  const getPerformanceLevelColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'average':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const responsiveClasses = {
    headerText: cn("text-sm font-semibold", "sm:text-base", "lg:text-lg"),
    tablePadding: cn("p-2", "sm:p-3", "lg:p-4"),
    cellPadding: cn("p-1.5", "sm:p-2", "lg:p-3"),
    fontSize: cn("text-xs", "sm:text-sm", "lg:text-base"),
    iconSize: cn("w-3 h-3", "sm:w-4 sm:h-4", "lg:w-5 lg:h-5")
  };

  return (
    <Card className={cn(
      "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
      theme === 'dark' ? "bg-club-dark-gray/60" : "bg-white/80",
      "shadow-xl animate-fade-in"
    )}>
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className={cn(responsiveClasses.iconSize, "text-club-gold flex-shrink-0")} />
            <CardTitle className={cn(
              responsiveClasses.headerText,
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900",
              "truncate"
            )}>
              Professional Performance Analysis
            </CardTitle>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {isMobile && (
              <Badge variant="outline" className="text-xs bg-club-gold/10 border-club-gold/30 text-club-gold self-start">
                Swipe → to see more metrics
              </Badge>
            )}
            
            <SortControls 
              currentMetric={sortState.metric} 
              currentDirection={sortState.direction} 
              metrics={visibleMetrics} 
              onSort={handleSort} 
              onClear={clearSort} 
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="p-3 sm:p-6">
            <TableLoadingSkeleton rows={6} columns={selectedPlayers.length + 1} />
          </div>
        ) : (
          <div className="relative">
            <div className={cn(
              "w-full overflow-x-auto",
              "professional-scrollbar",
              theme === 'dark' 
                ? "scrollbar-track-club-black/50 scrollbar-thumb-club-gold/60 hover:scrollbar-thumb-club-gold/80" 
                : "scrollbar-track-gray-100/50 scrollbar-thumb-club-gold/70 hover:scrollbar-thumb-club-gold/90"
            )} 
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: theme === 'dark' ? '#D4AF37 #1A1A1A' : '#D4AF37 #F5F5F5'
            }}>
              <table className={cn(
                "w-full border-separate border-spacing-0",
                "min-w-[480px]",
                "sm:min-w-[560px]",
                "lg:min-w-[800px]"
              )}>
                <thead className="sticky top-0 z-20">
                  <tr className={cn(
                    "border-b transition-colors",
                    theme === 'dark' 
                      ? "border-club-gold/20 bg-club-black/95" 
                      : "border-club-gold/30 bg-gray-50/95",
                    "backdrop-blur-sm"
                  )}>
                    <SortableHeader 
                      metric="name" 
                      label="Player" 
                      currentMetric={sortState.metric} 
                      currentDirection={sortState.direction} 
                      onSort={handleSort} 
                      className={cn(
                        "text-left sticky left-0 z-30",
                        responsiveClasses.cellPadding,
                        "w-[120px] sm:w-[140px] lg:w-[160px]",
                        theme === 'dark' 
                          ? "text-club-light-gray bg-club-dark-gray/95" 
                          : "text-gray-900 bg-white/95",
                        "border-r border-club-gold/20"
                      )} 
                    />
                    
                    {visibleMetrics.map(metric => (
                      <SortableHeader 
                        key={metric.key} 
                        metric={metric.key} 
                        label={isMobile ? metric.mobileLabel : window.innerWidth < 1024 ? metric.shortLabel : metric.label} 
                        currentMetric={sortState.metric} 
                        currentDirection={sortState.direction} 
                        onSort={handleSort} 
                        icon={metric.icon} 
                        unit={metric.unit} 
                        description={metric.description} 
                        className={cn(
                          responsiveClasses.cellPadding,
                          "w-[80px] sm:w-[100px] lg:w-[120px]"
                        )} 
                      />
                    ))}
                  </tr>
                </thead>
                
                <tbody>
                  {sortedPlayers.map((player, index) => (
                    <tr key={player.id} className={cn(
                      "transition-all duration-200 hover:shadow-md border-b",
                      theme === 'dark' 
                        ? "border-club-gold/10 hover:bg-club-black/20 even:bg-club-black/10" 
                        : "border-club-gold/20 hover:bg-gray-50/50 even:bg-gray-25/25",
                      index % 2 === 0 && "bg-opacity-50"
                    )}>
                      <td className={cn(
                        "sticky left-0 z-10 border-r",
                        responsiveClasses.cellPadding,
                        "w-[120px] sm:w-[140px] lg:w-[160px]",
                        theme === 'dark' 
                          ? "bg-club-dark-gray/95 border-club-gold/10" 
                          : "bg-white/95 border-club-gold/20"
                      )}>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <PlayerAvatar player={player} size={isMobile ? "xs" : "sm"} />
                          <div className="min-w-0 flex-1">
                            <div className={cn(
                              "font-medium truncate",
                              responsiveClasses.fontSize,
                              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                            )}>
                              {player.name}
                            </div>
                            <div className={cn("text-gray-500 truncate", "text-xs")}>
                              {player.position || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {visibleMetrics.map(metric => {
                        const value = metric.getValue(player);
                        const isHighest = highestValues[metric.key]?.[player.id];
                        const level = getPerformanceLevel(value, metric);
                        
                        return (
                          <td 
                            key={`${player.id}-${metric.key}`} 
                            className={cn(
                              "text-center transition-all duration-200 relative",
                              responsiveClasses.cellPadding,
                              isHighest && "bg-club-gold/10 border-club-gold/20"
                            )}
                          >
                            <div className="space-y-0.5 sm:space-y-1">
                              <div className={cn(
                                "font-bold",
                                responsiveClasses.fontSize,
                                isHighest ? "text-club-gold" : getPerformanceLevelColor(level)
                              )}>
                                {metric.format(value)}
                              </div>
                              
                              {isHighest && (
                                <Badge variant="outline" className={cn(
                                  "bg-club-gold/20 text-club-gold border-club-gold/30",
                                  "text-xs px-1 py-0"
                                )}>
                                  <Medal className="w-2 h-2 mr-0.5 sm:w-3 sm:h-3 sm:mr-1" />
                                  <span className="hidden sm:inline">Best</span>
                                  <span className="sm:hidden">★</span>
                                </Badge>
                              )}
                              
                              {!isHighest && value !== null && !isMobile && (
                                <div className={cn(
                                  "text-xs opacity-60",
                                  getPerformanceLevelColor(level)
                                )}>
                                  {level}
                                </div>
                              )}
                            </div>
                            
                            {value !== null && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200">
                                <div 
                                  className={cn(
                                    "h-full transition-all duration-300",
                                    isHighest 
                                      ? "bg-club-gold" 
                                      : getPerformanceLevelColor(level).replace('text-', 'bg-')
                                  )} 
                                  style={{
                                    width: `${Math.min(100, Math.max(10, value / Math.max(...selectedPlayers.map(p => metric.getValue(p) || 0)) * 100))}%`
                                  }} 
                                />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {visibleMetrics.length < metrics.length && (
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs backdrop-blur-sm">
                  {metrics.length - visibleMetrics.length} more on larger screen
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
