
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  getValue: (player: Player) => number | null;
  format: (value: number | null) => string;
  unit: string;
  icon: any;
  description: string;
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
      getValue: (player) => player.distance,
      format: (value) => value ? `${value.toFixed(1)} km` : 'N/A',
      unit: 'km',
      icon: TrendingUp,
      description: 'Total distance covered during the match'
    },
    {
      key: 'passCompletion',
      label: 'Pass Completion',
      shortLabel: 'Pass %',
      getValue: (player) => player.passes_attempted && player.passes_attempted > 0 
        ? getPassCompletionPercentage(player) : null,
      format: (value) => value ? formatPercentage(value) : 'N/A',
      unit: '%',
      icon: Target,
      description: 'Percentage of successful passes'
    },
    {
      key: 'shots',
      label: 'Shots on Target',
      shortLabel: 'Shots',
      getValue: (player) => player.shots_on_target,
      format: (value) => value !== null ? value.toString() : 'N/A',
      unit: '',
      icon: BarChart3,
      description: 'Number of shots that were on target'
    },
    {
      key: 'tackles',
      label: 'Tackles Won',
      shortLabel: 'Tackles',
      getValue: (player) => player.tackles_won,
      format: (value) => value !== null ? value.toString() : 'N/A',
      unit: '',
      icon: Medal,
      description: 'Number of successful tackles'
    }
  ];

  // Calculate highest values for each metric
  const highestValues = useMemo(() => {
    return metrics.reduce((acc, metric) => {
      acc[metric.key] = getHighestValuesInRow(selectedPlayers, metric.getValue);
      return acc;
    }, {} as Record<SortableMetric, Record<number, boolean>>);
  }, [selectedPlayers]);

  // Sort players based on selected metric
  const sortedPlayers = useMemo(() => {
    if (!sortMetric || !sortDirection) return selectedPlayers;

    const metric = metrics.find(m => m.key === sortMetric);
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
  }, [selectedPlayers, sortMetric, sortDirection, metrics]);

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

  // Mobile card view for small screens
  if (isMobile) {
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
            <CardTitle className={cn(
              "text-lg font-semibold",
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              Performance Metrics
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <TableLoadingSkeleton rows={4} columns={2} />
          ) : (
            sortedPlayers.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-300 hover:shadow-lg",
                  theme === 'dark' 
                    ? "bg-club-black/30 border-club-gold/10 hover:border-club-gold/20" 
                    : "bg-gray-50/50 border-club-gold/20 hover:border-club-gold/30"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <PlayerAvatar player={player} size="sm" />
                  <div>
                    <span className={cn(
                      "font-semibold text-sm",
                      theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                    )}>
                      {player.name}
                    </span>
                    <div className="text-xs text-gray-500">{player.position || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {metrics.map((metric) => {
                    const value = metric.getValue(player);
                    const isHighest = highestValues[metric.key]?.[player.id];
                    const level = getPerformanceLevel(value, metric);
                    
                    return (
                      <div key={metric.key} className="space-y-1">
                        <div className="flex items-center gap-1">
                          <metric.icon className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{metric.shortLabel}:</span>
                        </div>
                        <div className={cn(
                          "font-semibold text-sm",
                          isHighest && "text-club-gold",
                          !isHighest && getPerformanceLevelColor(level)
                        )}>
                          {metric.format(value)}
                          {isHighest && (
                            <Badge variant="outline" className="ml-1 text-xs bg-club-gold/20 text-club-gold border-club-gold/30">
                              Best
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  }

  // Desktop table view
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
            <TrendingUp className="h-5 w-5 text-club-gold" />
            <CardTitle className={cn(
              "text-lg font-semibold",
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              Professional Performance Analysis
            </CardTitle>
          </div>
          
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
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6">
            <TableLoadingSkeleton rows={6} columns={selectedPlayers.length + 1} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn(
                  "border-b transition-colors",
                  theme === 'dark' 
                    ? "border-club-gold/20 bg-club-black/20" 
                    : "border-club-gold/30 bg-gray-50/50"
                )}>
                  <th className={cn(
                    "text-left p-4 font-semibold sticky left-0 z-10",
                    theme === 'dark' 
                      ? "text-club-light-gray bg-club-dark-gray/80" 
                      : "text-gray-900 bg-white/90"
                  )}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('name')}
                      className="h-auto p-0 font-semibold justify-start gap-2"
                    >
                      Player
                      {getSortIcon('name')}
                    </Button>
                  </th>
                  
                  {metrics.map((metric) => (
                    <th key={metric.key} className="text-center p-4 min-w-[140px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(metric.key)}
                        className="h-auto p-1 font-semibold flex-col gap-1 w-full"
                        title={metric.description}
                      >
                        <div className="flex items-center gap-2">
                          <metric.icon className="w-4 h-4 text-club-gold" />
                          <span className={cn(
                            "text-xs font-medium",
                            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                          )}>
                            {metric.label}
                          </span>
                          {getSortIcon(metric.key)}
                        </div>
                        <span className="text-xs text-gray-500">({metric.unit})</span>
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
                      "transition-all duration-200 hover:shadow-md",
                      theme === 'dark' 
                        ? "border-club-gold/10 hover:bg-club-black/20 even:bg-club-black/10" 
                        : "border-club-gold/20 hover:bg-gray-50/50 even:bg-gray-25/25",
                      index % 2 === 0 && "bg-opacity-50"
                    )}
                  >
                    <td className={cn(
                      "p-4 sticky left-0 z-10 border-r",
                      theme === 'dark' 
                        ? "bg-club-dark-gray/80 border-club-gold/10" 
                        : "bg-white/90 border-club-gold/20"
                    )}>
                      <div className="flex items-center gap-3">
                        <PlayerAvatar player={player} size="sm" />
                        <div>
                          <div className={cn(
                            "font-medium text-sm",
                            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                          )}>
                            {player.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {player.position || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {metrics.map((metric) => {
                      const value = metric.getValue(player);
                      const isHighest = highestValues[metric.key]?.[player.id];
                      const level = getPerformanceLevel(value, metric);
                      
                      return (
                        <td
                          key={`${player.id}-${metric.key}`}
                          className={cn(
                            "text-center p-4 transition-all duration-200 relative",
                            isHighest && "bg-club-gold/10 border-club-gold/20"
                          )}
                        >
                          <div className="space-y-1">
                            <div className={cn(
                              "font-bold text-sm",
                              isHighest 
                                ? "text-club-gold" 
                                : getPerformanceLevelColor(level)
                            )}>
                              {metric.format(value)}
                            </div>
                            
                            {isHighest && (
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-club-gold/20 text-club-gold border-club-gold/30"
                              >
                                <Medal className="w-3 h-3 mr-1" />
                                Best
                              </Badge>
                            )}
                            
                            {/* Performance level indicator */}
                            {!isHighest && value !== null && (
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
        )}
      </CardContent>
    </Card>
  );
};
