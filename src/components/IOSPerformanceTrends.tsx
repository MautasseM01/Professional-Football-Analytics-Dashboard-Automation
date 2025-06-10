
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TouchFeedbackButton } from './TouchFeedbackButton';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, TrendingUp, Users, Calendar, Monitor } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart, ReferenceLine } from 'recharts';
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

// KPI options for the dropdown - complete list from original component
const KPI_OPTIONS = [
  { id: 'rating', label: 'Match Rating', color: '#3B82F6', unit: '' },
  { id: 'goals', label: 'Goals', color: '#D4AF37', unit: '' },
  { id: 'assists', label: 'Assists', color: '#10B981', unit: '' },
  { id: 'passes', label: 'Passes Completed', color: '#8B5CF6', unit: '' },
  { id: 'distance', label: 'Distance', color: '#F59E0B', unit: 'km' },
  { id: 'sprintDistance', label: 'Sprint Distance', color: '#EF4444', unit: 'km' },
  { id: 'shots_on_target', label: 'Shots on Target', color: '#06B6D4', unit: '' },
  { id: 'tackles_won', label: 'Tackles Won', color: '#84CC16', unit: '' }
];

// Time period options from original component
const TIME_PERIOD_OPTIONS = [
  { value: "last5", label: "Last 5 Matches" },
  { value: "last10", label: "Last 10 Matches" },
  { value: "season", label: "Season to Date" }
];

// Helper function to generate mock match data based on a player stat
const generateMatchData = (player: Player, kpi: string, numMatches: number): PerformanceDataPoint[] => {
  const baseValue = player[kpi as keyof Player] as number || 0;
  
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
      [kpi]: roundedValue,
    };
  }).reverse();
};

// Calculate moving average for a dataset
const calculateMovingAverage = (data: PerformanceDataPoint[], windowSize: number) => {
  return data.map((point, index, array) => {
    if (index < windowSize - 1) return { ...point, movingAvg: null };
    
    let sum = 0;
    for (let i = 0; i < windowSize; i++) {
      sum += array[index - i][point.match as keyof PerformanceDataPoint] as number;
    }
    
    return {
      ...point,
      movingAvg: Number((sum / windowSize).toFixed(2))
    };
  });
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
  const [showComparison, setShowComparison] = useState(false);
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      case "last5": return 5;
      case "last10": return 10;
      case "season": return 15;
      default: return 5;
    }
  };

  // Generate or use provided performance data
  const performanceData = useMemo(() => {
    if (providedData && providedData.length > 0) {
      return providedData;
    }
    
    if (!player) {
      return [];
    }

    try {
      const numMatches = getMatchCount();
      const rawData = generateMatchData(player, activeMetric, numMatches);
      
      return showMovingAverage 
        ? calculateMovingAverage(rawData, 3)
        : rawData;
    } catch (err) {
      console.error('Error generating performance data:', err);
      setError('Failed to load performance data');
      return [];
    }
  }, [player, activeMetric, selectedTimePeriod, showMovingAverage, providedData]);

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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-2xl p-3 sm:p-4 shadow-xl">
          <div className="text-ios-caption2 font-medium text-gray-900 dark:text-white mb-2">
            Match {data.match} • {data.date}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-ios-caption text-gray-600 dark:text-gray-400">
                {currentMetric.label}
              </span>
              <span className="text-ios-caption font-medium text-gray-900 dark:text-white">
                {data[activeMetric]}{currentMetric.unit}
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
                  {data.movingAvg}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate trend direction
  const getTrendDirection = () => {
    if (performanceData.length < 2) return 'neutral';
    const recent = performanceData.slice(-3);
    const older = performanceData.slice(-6, -3);
    if (older.length === 0) return 'neutral';
    
    const recentAvg = recent.reduce((sum, d) => sum + (d[activeMetric as keyof PerformanceDataPoint] as number), 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + (d[activeMetric as keyof PerformanceDataPoint] as number), 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'up';
    if (recentAvg < olderAvg * 0.9) return 'down';
    return 'neutral';
  };

  const trendDirection = getTrendDirection();

  // If screen is too small, show message to use larger screen (like original component)
  if (isVerySmallScreen) {
    return (
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <Monitor className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500/60" />
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Screen Too Small
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                Please use a larger screen or rotate your device for optimal chart viewing. 
                The performance trends chart requires at least 480px width for proper display.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/20 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <div className="text-red-500 text-2xl">⚠️</div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Error Loading Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error}
              </p>
              <TouchFeedbackButton
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
                className="mt-2"
              >
                Retry
              </TouchFeedbackButton>
            </div>
          </div>
        </CardContent>
      </Card>
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
                {trendDirection !== 'neutral' && (
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full",
                    trendDirection === 'up' 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  )}>
                    <TrendingUp 
                      size={10} 
                      className={cn(
                        trendDirection === 'down' && "rotate-180"
                      )} 
                    />
                    <span className="text-ios-caption2 font-medium">
                      {trendDirection === 'up' ? 'Improving' : 'Declining'}
                    </span>
                  </div>
                )}
              </div>
            </div>

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
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Controls from original component */}
          <div className="px-4 pb-4">
            <div className="space-y-3 sm:space-y-4">
              {/* Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
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
              </div>
              
              {/* Switch Row - Show on larger screens */}
              {!isMobile && (
                <div className="flex items-center justify-between pt-1">
                  <Label 
                    htmlFor="movingAverage"
                    className="text-gray-900 dark:text-white text-xs sm:text-sm cursor-pointer select-none font-medium"
                  >
                    Show 3-Match Moving Average
                  </Label>
                  <Switch 
                    id="movingAverage" 
                    checked={showMovingAverage}
                    onCheckedChange={setShowMovingAverage}
                    className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                  />
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
