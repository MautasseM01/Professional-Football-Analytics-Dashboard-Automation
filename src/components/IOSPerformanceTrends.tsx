
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TouchFeedbackButton } from './TouchFeedbackButton';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, TrendingUp, Users, Calendar, Monitor, Filter, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart, ReferenceLine, Legend } from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Player } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { IOSLoadingState } from './IOSLoadingState';

interface PerformanceDataPoint {
  match: number;
  date: string;
  goals: number;
  assists: number;
  passes: number;
  distance: number;
  rating: number;
  sprintDistance?: number;
  shots_on_target?: number;
  tackles_won?: number;
  movingAvg?: number | null;
  opponent?: string;
  result?: string;
}

interface IOSPerformanceTrendsProps {
  playerId: string;
  playerName: string;
  player?: Player;
  performanceData?: PerformanceDataPoint[];
  comparisonData?: PerformanceDataPoint[];
  comparisonPlayerName?: string;
  className?: string;
}

// Enhanced KPI options with additional metrics
const KPI_OPTIONS = [
  { id: 'rating', label: 'Match Rating', color: '#3B82F6', unit: '', format: (val: number) => val.toFixed(1) },
  { id: 'goals', label: 'Goals', color: '#D4AF37', unit: '', format: (val: number) => val.toString() },
  { id: 'assists', label: 'Assists', color: '#10B981', unit: '', format: (val: number) => val.toString() },
  { id: 'passes', label: 'Passes Completed', color: '#8B5CF6', unit: '', format: (val: number) => val.toString() },
  { id: 'distance', label: 'Distance', color: '#F59E0B', unit: 'km', format: (val: number) => val.toFixed(1) },
  { id: 'sprintDistance', label: 'Sprint Distance', color: '#EF4444', unit: 'km', format: (val: number) => val.toFixed(1) },
  { id: 'shots_on_target', label: 'Shots on Target', color: '#06B6D4', unit: '', format: (val: number) => val.toString() },
  { id: 'tackles_won', label: 'Tackles Won', color: '#84CC16', unit: '', format: (val: number) => val.toString() }
];

// Enhanced time period options
const TIME_PERIOD_OPTIONS = [
  { value: "last3", label: "Last 3 Matches" },
  { value: "last5", label: "Last 5 Matches" },
  { value: "last10", label: "Last 10 Matches" },
  { value: "last15", label: "Last 15 Matches" },
  { value: "season", label: "Season to Date" },
  { value: "home", label: "Home Matches" },
  { value: "away", label: "Away Matches" }
];

// Date range filter options
const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "last30", label: "Last 30 Days" },
  { value: "last60", label: "Last 60 Days" },
  { value: "last90", label: "Last 90 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" }
];

// Chart view options
const CHART_VIEW_OPTIONS = [
  { value: "line", label: "Line Chart" },
  { value: "area", label: "Area Chart" },
  { value: "comparison", label: "Comparison View" }
];

// Helper function to generate comprehensive mock match data
const generateEnhancedMatchData = (player: Player, kpi: string, numMatches: number, filter?: string): PerformanceDataPoint[] => {
  const baseValue = player[kpi as keyof Player] as number || 0;
  const opponents = ['Arsenal', 'Chelsea', 'Liverpool', 'Man City', 'Man United', 'Tottenham', 'Leicester', 'West Ham'];
  const results = ['W', 'L', 'D'];
  
  return Array.from({ length: numMatches }, (_, i) => {
    let variationFactor = 0.2;
    
    if (kpi === "sprintDistance" || kpi === "distance") {
      variationFactor = 0.15;
    } else if (kpi === "tackles_won" || kpi === "shots_on_target") {
      variationFactor = 0.3;
    }
    
    const variation = (Math.random() * 2 - 1) * variationFactor;
    const value = Math.max(0, baseValue * (1 + variation));
    
    const roundedValue = kpi === "sprintDistance" || kpi === "distance" 
      ? Number(value.toFixed(2)) 
      : Math.round(value);
    
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() - (i * 7));
    
    const isHome = Math.random() > 0.5;
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    const result = results[Math.floor(Math.random() * results.length)];
    
    // Apply filters
    if (filter === 'home' && !isHome) return null;
    if (filter === 'away' && isHome) return null;
    
    return {
      match: numMatches - i,
      date: matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      goals: Math.floor(Math.random() * 3),
      assists: Math.floor(Math.random() * 3),
      passes: Math.floor(Math.random() * 50) + 30,
      distance: Math.round((Math.random() * 3 + 7) * 10) / 10,
      rating: Math.round((Math.random() * 3 + 6) * 10) / 10,
      sprintDistance: Math.round((Math.random() * 1 + 2) * 10) / 10,
      shots_on_target: Math.floor(Math.random() * 4),
      tackles_won: Math.floor(Math.random() * 6),
      opponent,
      result,
      [kpi]: roundedValue,
    };
  }).filter(Boolean).reverse() as PerformanceDataPoint[];
};

// Calculate moving average for enhanced data analysis
const calculateMovingAverage = (data: PerformanceDataPoint[], windowSize: number, metric: string) => {
  return data.map((point, index, array) => {
    if (index < windowSize - 1) return { ...point, movingAvg: null };
    
    let sum = 0;
    for (let i = 0; i < windowSize; i++) {
      const value = array[index - i][metric as keyof PerformanceDataPoint] as number;
      sum += value || 0;
    }
    
    return {
      ...point,
      movingAvg: Number((sum / windowSize).toFixed(2))
    };
  });
};

// Calculate performance statistics
const calculateStats = (data: PerformanceDataPoint[], metric: string) => {
  const values = data.map(d => d[metric as keyof PerformanceDataPoint] as number).filter(v => v !== undefined);
  if (values.length === 0) return { avg: 0, min: 0, max: 0, trend: 'neutral' };
  
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Calculate trend (last 3 vs previous 3)
  const recent = values.slice(-3);
  const previous = values.slice(-6, -3);
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const previousAvg = previous.length > 0 ? previous.reduce((sum, val) => sum + val, 0) / previous.length : recentAvg;
  
  let trend = 'neutral';
  if (recentAvg > previousAvg * 1.1) trend = 'up';
  else if (recentAvg < previousAvg * 0.9) trend = 'down';
  
  return { avg, min, max, trend };
};

export const IOSPerformanceTrends = ({
  playerId,
  playerName,
  player,
  performanceData: providedData,
  comparisonData,
  comparisonPlayerName,
  className
}: IOSPerformanceTrendsProps) => {
  const [activeMetric, setActiveMetric] = useState('rating');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last5");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [chartView, setChartView] = useState("area");
  const [showComparison, setShowComparison] = useState(false);
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();

  const currentMetric = KPI_OPTIONS.find(m => m.id === activeMetric) || KPI_OPTIONS[0];

  // Check if screen is too small for optimal chart viewing
  const isVerySmallScreen = typeof window !== 'undefined' && window.innerWidth < 480;

  // Determine the number of matches based on selected time period
  const getMatchCount = () => {
    switch (selectedTimePeriod) {
      case "last3": return 3;
      case "last5": return 5;
      case "last10": return 10;
      case "last15": return 15;
      case "season": return 20;
      case "home": return 10;
      case "away": return 10;
      default: return 5;
    }
  };

  // Generate or use provided performance data with enhanced filtering
  const performanceData = useMemo(() => {
    if (providedData && providedData.length > 0) {
      return providedData;
    }
    
    if (!player) {
      return [];
    }

    try {
      const numMatches = getMatchCount();
      const filter = selectedTimePeriod.includes('home') ? 'home' : 
                   selectedTimePeriod.includes('away') ? 'away' : undefined;
      
      const rawData = generateEnhancedMatchData(player, activeMetric, numMatches, filter);
      
      return showMovingAverage 
        ? calculateMovingAverage(rawData, 3, activeMetric)
        : rawData;
    } catch (err) {
      console.error('Error generating performance data:', err);
      setError('Failed to load performance data');
      return [];
    }
  }, [player, activeMetric, selectedTimePeriod, selectedDateRange, showMovingAverage, providedData]);

  // Calculate performance statistics
  const stats = useMemo(() => {
    return calculateStats(performanceData, activeMetric);
  }, [performanceData, activeMetric]);

  // Swipe gestures for metric switching
  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: () => {
      const currentIndex = KPI_OPTIONS.findIndex(m => m.id === activeMetric);
      if (currentIndex < KPI_OPTIONS.length - 1) {
        setActiveMetric(KPI_OPTIONS[currentIndex + 1].id);
        triggerHaptic('light');
      }
    },
    onSwipeRight: () => {
      const currentIndex = KPI_OPTIONS.findIndex(m => m.id === activeMetric);
      if (currentIndex > 0) {
        setActiveMetric(KPI_OPTIONS[currentIndex - 1].id);
        triggerHaptic('light');
      }
    },
    threshold: 50
  });

  // Refresh data handler
  const handleRefresh = async () => {
    setRefreshing(true);
    triggerHaptic('light');
    
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRefreshing(false);
    setError(null);
  };

  // Responsive chart configuration
  const getChartConfig = () => {
    if (breakpoint === 'mobile') {
      return {
        height: 220,
        fontSize: 9,
        strokeWidth: 1.5,
        dotRadius: 2,
        activeDotRadius: 3,
        margin: { top: 10, right: 15, left: 10, bottom: 30 }
      };
    }
    if (breakpoint === 'tablet-portrait') {
      return {
        height: 280,
        fontSize: 10,
        strokeWidth: 2,
        dotRadius: 2.5,
        activeDotRadius: 4,
        margin: { top: 15, right: 20, left: 15, bottom: 40 }
      };
    }
    if (breakpoint === 'tablet-landscape') {
      return {
        height: 320,
        fontSize: 11,
        strokeWidth: 2,
        dotRadius: 3,
        activeDotRadius: 5,
        margin: { top: 20, right: 25, left: 20, bottom: 50 }
      };
    }
    return {
      height: 380,
      fontSize: 12,
      strokeWidth: 2.5,
      dotRadius: 3,
      activeDotRadius: 6,
      margin: { top: 25, right: 30, left: 25, bottom: 60 }
    };
  };

  const chartConfig = getChartConfig();

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-2xl p-3 sm:p-4 shadow-xl">
          <div className="text-ios-caption2 font-medium text-gray-900 dark:text-white mb-2">
            Match {data.match} • {data.date}
          </div>
          {data.opponent && (
            <div className="text-ios-caption text-gray-600 dark:text-gray-400 mb-2">
              vs {data.opponent} ({data.result})
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-ios-caption text-gray-600 dark:text-gray-400">
                {currentMetric.label}
              </span>
              <span className="text-ios-caption font-medium text-gray-900 dark:text-white">
                {currentMetric.format(data[activeMetric])}{currentMetric.unit}
              </span>
            </div>
            {showComparison && comparisonData && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-ios-caption text-gray-600 dark:text-gray-400">
                  {comparisonPlayerName}
                </span>
                <span className="text-ios-caption font-medium text-orange-600 dark:text-orange-400">
                  {comparisonData.find(d => d.match === data.match)?.[activeMetric as keyof PerformanceDataPoint] || 0}{currentMetric.unit}
                </span>
              </div>
            )}
            {showMovingAverage && data.movingAvg !== null && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-ios-caption text-gray-600 dark:text-gray-400">
                  3-Match Avg
                </span>
                <span className="text-ios-caption font-medium text-gray-400">
                  {currentMetric.format(data.movingAvg)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // If screen is too small, show optimized mobile view
  if (isVerySmallScreen) {
    return (
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Performance Trends
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {playerName}
              </p>
            </div>
            
            {/* Mobile-optimized metric selector */}
            <Select value={activeMetric} onValueChange={setActiveMetric}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {KPI_OPTIONS.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile stats cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentMetric.format(stats.avg)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Avg</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentMetric.format(stats.max)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Max</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentMetric.format(stats.min)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Min</div>
              </div>
            </div>

            <TouchFeedbackButton
              variant="outline"
              size="sm"
              onClick={() => window.open(`/player-stats?player=${playerId}`, '_blank')}
              className="w-full"
            >
              <Monitor size={16} className="mr-2" />
              View Full Chart
            </TouchFeedbackButton>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <IOSLoadingState 
        isLoading={true}
        className="min-h-[400px]"
        skeletonRows={4}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <IOSLoadingState 
        error={error}
        onRetry={() => {
          setError(null);
          handleRefresh();
        }}
        className="min-h-[400px]"
      />
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-ios-headline font-semibold text-gray-900 dark:text-white">
                Performance Trends
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-ios-caption text-gray-600 dark:text-gray-400">
                  {playerName}
                </p>
                {stats.trend !== 'neutral' && (
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full",
                    stats.trend === 'up' 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  )}>
                    <TrendingUp 
                      size={10} 
                      className={cn(
                        stats.trend === 'down' && "rotate-180"
                      )} 
                    />
                    <span className="text-ios-caption2 font-medium">
                      {stats.trend === 'up' ? 'Improving' : 'Declining'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {comparisonData && (
                <TouchFeedbackButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowComparison(!showComparison);
                    triggerHaptic('light');
                  }}
                  className={cn(
                    "h-8 px-3",
                    showComparison ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : ""
                  )}
                >
                  <Users size={14} className="mr-1" />
                  Compare
                </TouchFeedbackButton>
              )}
              
              <TouchFeedbackButton
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-8 px-3"
              >
                <RefreshCw size={14} className={cn("mr-1", refreshing && "animate-spin")} />
                Refresh
              </TouchFeedbackButton>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Enhanced Controls */}
          <div className="px-4 pb-4">
            <div className="space-y-3 sm:space-y-4">
              {/* Primary Controls Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Performance Metric</Label>
                  <Select value={activeMetric} onValueChange={setActiveMetric}>
                    <SelectTrigger className="w-full bg-white/50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white h-8 sm:h-9 lg:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Select KPI" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white z-50 max-h-60">
                      {KPI_OPTIONS.map(option => (
                        <SelectItem key={option.id} value={option.id} className="focus:bg-blue-100 dark:focus:bg-blue-900/30 text-xs sm:text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Time Period</Label>
                  <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                    <SelectTrigger className="w-full bg-white/50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white h-8 sm:h-9 lg:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white z-50">
                      {TIME_PERIOD_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-blue-100 dark:focus:bg-blue-900/30 text-xs sm:text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Chart View</Label>
                  <Select value={chartView} onValueChange={setChartView}>
                    <SelectTrigger className="w-full bg-white/50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white h-8 sm:h-9 lg:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Chart View" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white z-50">
                      {CHART_VIEW_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-blue-100 dark:focus:bg-blue-900/30 text-xs sm:text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Secondary Controls Row */}
              {!isMobile && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label 
                        htmlFor="movingAverage"
                        className="text-gray-900 dark:text-white text-xs sm:text-sm cursor-pointer select-none font-medium"
                      >
                        3-Match Moving Average
                      </Label>
                      <Switch 
                        id="movingAverage" 
                        checked={showMovingAverage}
                        onCheckedChange={setShowMovingAverage}
                        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label 
                        htmlFor="showStats"
                        className="text-gray-900 dark:text-white text-xs sm:text-sm cursor-pointer select-none font-medium"
                      >
                        Show Statistics
                      </Label>
                      <Switch 
                        id="showStats" 
                        checked={showStats}
                        onCheckedChange={setShowStats}
                        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Statistics */}
              {showStats && !isMobile && (
                <div className="grid grid-cols-4 gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentMetric.format(stats.avg)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentMetric.format(stats.max)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Best</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentMetric.format(stats.min)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Worst</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {performanceData.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Matches</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart Container */}
          <div 
            ref={chartRef}
            className="px-4 pb-4"
            style={{ height: chartConfig.height }}
            {...swipeProps}
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'line' ? (
                <LineChart data={performanceData} margin={chartConfig.margin}>
                  <XAxis 
                    dataKey="match" 
                    stroke="#9CA3AF"
                    fontSize={chartConfig.fontSize}
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={chartConfig.margin.bottom}
                    interval={breakpoint === 'mobile' ? 'preserveStartEnd' : 0}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={chartConfig.fontSize}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                    label={!isMobile ? { 
                      value: currentMetric.label, 
                      angle: -90, 
                      position: 'insideLeft', 
                      style: { textAnchor: 'middle' }, 
                      fill: '#9CA3AF',
                      fontSize: chartConfig.fontSize
                    } : undefined}
                  />
                  
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Line
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={currentMetric.color}
                    strokeWidth={chartConfig.strokeWidth}
                    dot={{ fill: currentMetric.color, strokeWidth: 2, r: chartConfig.dotRadius }}
                    activeDot={{ r: chartConfig.activeDotRadius, stroke: currentMetric.color, strokeWidth: 2 }}
                  />
                  
                  {showComparison && comparisonData && (
                    <Line
                      type="monotone"
                      dataKey={activeMetric}
                      data={comparisonData}
                      stroke="#F97316"
                      strokeWidth={chartConfig.strokeWidth}
                      strokeDasharray="5 5"
                      dot={{ fill: "#F97316", strokeWidth: 2, r: chartConfig.dotRadius }}
                    />
                  )}

                  {showMovingAverage && !isMobile && (
                    <Line
                      type="monotone"
                      dataKey="movingAvg"
                      stroke="#9CA3AF"
                      strokeDasharray="5 5"
                      strokeWidth={chartConfig.strokeWidth}
                      dot={false}
                    />
                  )}
                </LineChart>
              ) : (
                <AreaChart data={performanceData} margin={chartConfig.margin}>
                  <defs>
                    <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.05}/>
                    </linearGradient>
                    {showComparison && (
                      <linearGradient id="comparisonGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.05}/>
                      </linearGradient>
                    )}
                  </defs>
                  
                  <XAxis 
                    dataKey="match" 
                    stroke="#9CA3AF"
                    fontSize={chartConfig.fontSize}
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={chartConfig.margin.bottom}
                    interval={breakpoint === 'mobile' ? 'preserveStartEnd' : 0}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={chartConfig.fontSize}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                    label={!isMobile ? { 
                      value: currentMetric.label, 
                      angle: -90, 
                      position: 'insideLeft', 
                      style: { textAnchor: 'middle' }, 
                      fill: '#9CA3AF',
                      fontSize: chartConfig.fontSize
                    } : undefined}
                  />
                  
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={currentMetric.color}
                    strokeWidth={chartConfig.strokeWidth}
                    fill="url(#metricGradient)"
                    dot={{ fill: currentMetric.color, strokeWidth: 2, r: chartConfig.dotRadius }}
                    activeDot={{ r: chartConfig.activeDotRadius, stroke: currentMetric.color, strokeWidth: 2 }}
                  />
                  
                  {showComparison && comparisonData && (
                    <Line
                      type="monotone"
                      dataKey={activeMetric}
                      data={comparisonData}
                      stroke="#F97316"
                      strokeWidth={chartConfig.strokeWidth}
                      strokeDasharray="5 5"
                      dot={{ fill: "#F97316", strokeWidth: 2, r: chartConfig.dotRadius }}
                    />
                  )}

                  {showMovingAverage && !isMobile && (
                    <Line
                      type="monotone"
                      dataKey="movingAvg"
                      stroke="#9CA3AF"
                      strokeDasharray="5 5"
                      strokeWidth={chartConfig.strokeWidth}
                      dot={false}
                    />
                  )}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Metric indicators */}
          <div className="flex justify-center gap-1 px-4 pb-4">
            {KPI_OPTIONS.map((metric, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 w-6 rounded-full transition-all duration-300",
                  metric.id === activeMetric 
                    ? "opacity-100" 
                    : "bg-gray-300 dark:bg-gray-600 opacity-30"
                )}
                style={{
                  backgroundColor: metric.id === activeMetric ? currentMetric.color : undefined
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
