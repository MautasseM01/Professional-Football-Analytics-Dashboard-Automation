
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, BarChart3, Medal, Target } from "lucide-react";
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

interface ProfessionalPerformanceTableProps {
  selectedPlayers: Player[];
  loading: boolean;
}

type SortDirection = 'asc' | 'desc' | null;
type SortableMetric = 'name' | 'distance' | 'passCompletion' | 'shots' | 'tackles';

interface MetricConfig {
  key: SortableMetric;
  label: string;
  shortLabel: string;
  mobileLabel: string;
  getValue: (player: Player) => number | null;
  format: (value: number | null) => string;
  unit: string;
  icon: any;
  description: string;
  priority: number; // For responsive column management
}

export const ProfessionalPerformanceTable = ({
  selectedPlayers,
  loading
}: ProfessionalPerformanceTableProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [sortMetric, setSortMetric] = useState<SortableMetric | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const metrics: MetricConfig[] = [
    {
      key: 'distance',
      label: 'Total Distance',
      shortLabel: 'Distance',
      mobileLabel: 'Dist',
      getValue: (player) => player.distance,
      format: (value) => value ? `${value.toFixed(1)} km` : 'N/A',
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
      getValue: (player) => player.passes_attempted && player.passes_attempted > 0 
        ? getPassCompletionPercentage(player) : null,
      format: (value) => value ? formatPercentage(value) : 'N/A',
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
      getValue: (player) => player.shots_on_target,
      format: (value) => value !== null ? value.toString() : 'N/A',
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
      getValue: (player) => player.tackles_won,
      format: (value) => value !== null ? value.toString() : 'N/A',
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
    
    // Mobile: Show high priority metrics only
    if (screenWidth < 640) {
      return metrics.filter(m => m.priority === 1);
    }
    
    // Tablet: Show high and medium priority
    if (screenWidth < 1024) {
      return metrics.filter(m => m.priority <= 2);
    }
    
    // Desktop: Show all metrics
    return metrics;
  }, [typeof window !== 'undefined' ? window.innerWidth : 0]);

  // Calculate highest values for each metric
  const highestValues = useMemo(() => {
    return visibleMetrics.reduce((acc, metric) => {
      acc[metric.key] = getHighestValuesInRow(selectedPlayers, metric.getValue);
      return acc;
    }, {} as Record<SortableMetric, Record<number, boolean>>);
  }, [selectedPlayers, visibleMetrics]);

  // Sort players based on selected metric
  const sortedPlayers = useMemo(() => {
    if (!sortMetric || !sortDirection) return selectedPlayers;

    const metric = visibleMetrics.find(m => m.key === sortMetric);
    if (!metric) return selectedPlayers;

    return [...selectedPlayers].sort((a, b) => {
      if (sortMetric === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      const valueA = metric.getValue(a) ?? -1;
      const valueB = metric.getValue(b) ?? -1;
      
      if (valueA === valueB) return 0;
      const comparison = valueA > valueB ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [selectedPlayers, sortMetric, sortDirection, visibleMetrics]);

  const handleSort = (metric: SortableMetric) => {
    if (sortMetric === metric) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') {
        setSortMetric(null);
      }
    } else {
      setSortMetric(metric);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (metric: SortableMetric) => {
    if (sortMetric !== metric) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    if (sortDirection === 'asc') return <ArrowUp className="w-3 h-3 text-club-gold" />;
    if (sortDirection === 'desc') return <ArrowDown className="w-3 h-3 text-club-gold" />;
    return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  };

  const getPerformanceLevel = (value: number | null, metric: MetricConfig) => {
    if (value === null || value === undefined) return 'none';
    
    // Simple performance categorization
    if (metric.key === 'passCompletion') {
      if (value >= 90) return 'excellent';
      if (value >= 80) return 'good';
      if (value >= 70) return 'average';
      return 'poor';
    }
    
    // For other metrics, use relative comparison
    const allValues = selectedPlayers
      .map(p => metric.getValue(p))
      .filter(v => v !== null && v !== undefined) as number[];
    
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
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'average': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Responsive sizing classes
  const getResponsiveClasses = () => {
    return {
      headerText: cn(
        "text-base font-semibold",
        "sm:text-lg",
        "lg:text-xl"
      ),
      tablePadding: cn(
        "p-2",
        "sm:p-3",
        "lg:p-4"
      ),
      cellPadding: cn(
        "p-1",
        "sm:p-2",
        "lg:p-3"
      ),
      fontSize: cn(
        "text-xs",
        "sm:text-sm",
        "lg:text-base"
      ),
      iconSize: cn(
        "w-3 h-3",
        "sm:w-4 sm:h-4",
        "lg:w-5 lg:h-5"
      )
    };
  };

  const responsiveClasses = getResponsiveClasses();

  return (
    <Card className={cn(
      "border-club-gold/20 overflow-hidden backdrop-blur-sm transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray/60" 
        : "bg-white/80",
      "shadow-xl animate-fade-in"
    )}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className={cn(responsiveClasses.iconSize, "text-club-gold")} />
            <CardTitle className={cn(
              responsiveClasses.headerText,
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              Professional Performance Analysis
            </CardTitle>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Responsive info badge */}
            {isMobile && (
              <Badge variant="outline" className="text-xs bg-club-gold/10 border-club-gold/30 text-club-gold">
                Swipe → to see more metrics
              </Badge>
            )}
            
            {sortMetric && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSortMetric(null);
                  setSortDirection(null);
                }}
                className="text-xs"
              >
                Clear Sort
              </Button>
            )}
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
            <ScrollArea className="w-full">
              <div className="overflow-x-auto">
                <table className={cn(
                  "w-full border-separate border-spacing-0",
                  "min-w-[600px]", // Minimum width for proper display
                  "sm:min-w-[800px]",
                  "lg:min-w-full"
                )}>
                  <thead className="sticky top-0 z-20">
                    <tr className={cn(
                      "border-b transition-colors",
                      theme === 'dark' 
                        ? "border-club-gold/20 bg-club-black/95" 
                        : "border-club-gold/30 bg-gray-50/95",
                      "backdrop-blur-sm"
                    )}>
                      <th className={cn(
                        "text-left sticky left-0 z-30",
                        responsiveClasses.cellPadding,
                        "min-w-[120px] sm:min-w-[160px] lg:min-w-[180px]",
                        theme === 'dark' 
                          ? "text-club-light-gray bg-club-dark-gray/95" 
                          : "text-gray-900 bg-white/95",
                        "border-r border-club-gold/20"
                      )}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('name')}
                          className={cn(
                            "h-auto p-0 font-semibold justify-start gap-1 sm:gap-2",
                            responsiveClasses.fontSize
                          )}
                        >
                          Player
                          {getSortIcon('name')}
                        </Button>
                      </th>
                      
                      {visibleMetrics.map((metric) => (
                        <th key={metric.key} className={cn(
                          "text-center",
                          responsiveClasses.cellPadding,
                          "min-w-[80px] sm:min-w-[120px] lg:min-w-[140px]"
                        )}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort(metric.key)}
                            className={cn(
                              "h-auto p-1 font-semibold flex-col gap-0.5 w-full",
                              responsiveClasses.fontSize
                            )}
                            title={metric.description}
                          >
                            <div className="flex items-center gap-1 justify-center">
                              <metric.icon className={cn(
                                "text-club-gold",
                                "w-3 h-3 sm:w-4 sm:h-4"
                              )} />
                              <span className={cn(
                                "font-medium truncate",
                                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                              )}>
                                {isMobile ? metric.mobileLabel : 
                                 window.innerWidth < 1024 ? metric.shortLabel : metric.label}
                              </span>
                              {getSortIcon(metric.key)}
                            </div>
                            <span className={cn(
                              "text-gray-500",
                              "text-xs"
                            )}>
                              ({metric.unit || 'count'})
                            </span>
                          </Button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  <tbody>
                    {sortedPlayers.map((player, index) => (
                      <tr
                        key={player.id}
                        className={cn(
                          "transition-all duration-200 hover:shadow-md border-b",
                          theme === 'dark' 
                            ? "border-club-gold/10 hover:bg-club-black/20 even:bg-club-black/10" 
                            : "border-club-gold/20 hover:bg-gray-50/50 even:bg-gray-25/25",
                          index % 2 === 0 && "bg-opacity-50"
                        )}
                      >
                        <td className={cn(
                          "sticky left-0 z-10 border-r",
                          responsiveClasses.cellPadding,
                          "min-w-[120px] sm:min-w-[160px] lg:min-w-[180px]",
                          theme === 'dark' 
                            ? "bg-club-dark-gray/95 border-club-gold/10" 
                            : "bg-white/95 border-club-gold/20"
                        )}>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <PlayerAvatar 
                              player={player} 
                              size={isMobile ? "xs" : "sm"} 
                            />
                            <div className="min-w-0 flex-1">
                              <div className={cn(
                                "font-medium truncate",
                                responsiveClasses.fontSize,
                                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                              )}>
                                {player.name}
                              </div>
                              <div className={cn(
                                "text-gray-500 truncate",
                                "text-xs"
                              )}>
                                {player.position || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {visibleMetrics.map((metric) => {
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
                                  isHighest 
                                    ? "text-club-gold" 
                                    : getPerformanceLevelColor(level)
                                )}>
                                  {metric.format(value)}
                                </div>
                                
                                {isHighest && (
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "bg-club-gold/20 text-club-gold border-club-gold/30",
                                      "text-xs px-1 py-0"
                                    )}
                                  >
                                    <Medal className="w-2 h-2 mr-0.5 sm:w-3 sm:h-3 sm:mr-1" />
                                    <span className="hidden sm:inline">Best</span>
                                    <span className="sm:hidden">★</span>
                                  </Badge>
                                )}
                                
                                {/* Performance level indicator for larger screens */}
                                {!isHighest && value !== null && !isMobile && (
                                  <div className={cn(
                                    "text-xs opacity-60",
                                    getPerformanceLevelColor(level)
                                  )}>
                                    {level}
                                  </div>
                                )}
                              </div>
                              
                              {/* Performance bar */}
                              {value !== null && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200">
                                  <div 
                                    className={cn(
                                      "h-full transition-all duration-300",
                                      isHighest ? "bg-club-gold" : getPerformanceLevelColor(level).replace('text-', 'bg-')
                                    )}
                                    style={{
                                      width: `${Math.min(100, Math.max(10, (value / Math.max(...selectedPlayers.map(p => metric.getValue(p) || 0))) * 100))}%`
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
            </ScrollArea>
            
            {/* Enhanced scroll indicators */}
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              {isMobile && (
                <div className="bg-club-gold/20 text-club-gold px-2 py-1 rounded text-xs backdrop-blur-sm flex items-center gap-1">
                  <span>← Scroll →</span>
                </div>
              )}
              {visibleMetrics.length < metrics.length && (
                <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs backdrop-blur-sm">
                  {metrics.length - visibleMetrics.length} more on larger screen
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
