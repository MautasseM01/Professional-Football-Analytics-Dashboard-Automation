
import { useState, useMemo } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChartContainer, 
  ChartTooltipContent, 
  ChartTooltip 
} from "@/components/ui/chart";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Legend,
  Tooltip,
  AreaChart,
  Area
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { Monitor, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePerformanceData } from "@/hooks/use-performance-data";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PerformanceTrendsCardProps {
  player: Player;
}

// Enhanced KPI options with club gold theming - now includes all 8 metrics
const KPI_OPTIONS = [
  { value: "distance", label: "Total Distance (km)", color: "#D4AF37" },
  { value: "sprintDistance", label: "Sprint Distance (km)", color: "#D4AF37" },
  { value: "passes_completed", label: "Passes Completed", color: "#D4AF37" },
  { value: "shots_on_target", label: "Shots on Target", color: "#D4AF37" },
  { value: "tackles_won", label: "Tackles Won", color: "#D4AF37" },
  { value: "goals", label: "Goals", color: "#D4AF37" },
  { value: "assists", label: "Assists", color: "#D4AF37" },
  { value: "match_rating", label: "Match Rating", color: "#D4AF37" }
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

// Chart view options
const CHART_VIEW_OPTIONS = [
  { value: "line", label: "Line Chart" },
  { value: "area", label: "Area Chart" }
];

// Calculate moving average
const calculateMovingAverage = (data: Array<{value: number}>, windowSize: number) => {
  return data.map((point, index, array) => {
    if (index < windowSize - 1) return { ...point, movingAvg: null };
    
    let sum = 0;
    for (let i = 0; i < windowSize; i++) {
      sum += array[index - i].value;
    }
    
    return {
      ...point,
      movingAvg: Number((sum / windowSize).toFixed(2))
    };
  });
};

// Calculate performance statistics
const calculateStats = (data: Array<{value: number}>) => {
  const values = data.map(d => d.value).filter(v => v !== undefined && v !== null);
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

export const PerformanceTrendsCard = ({ player }: PerformanceTrendsCardProps) => {
  const [selectedKPI, setSelectedKPI] = useState("distance");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last5");
  const [chartView, setChartView] = useState("area");
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  const { theme } = useTheme();
  
  const currentMetric = KPI_OPTIONS.find(m => m.value === selectedKPI) || KPI_OPTIONS[0];
  
  // Check if screen is too small for optimal chart viewing
  const isVerySmallScreen = typeof window !== 'undefined' && window.innerWidth < 480;
  
  // Get the selected KPI label
  const selectedKPILabel = KPI_OPTIONS.find(option => option.value === selectedKPI)?.label || "";
  
  // Fetch real performance data
  const { data: rawMatchData, loading, error } = usePerformanceData(player, selectedKPI, selectedTimePeriod);

  // Process match data with moving average if needed
  const matchData = useMemo(() => {
    if (!rawMatchData || rawMatchData.length === 0) return [];
    
    return showMovingAverage 
      ? calculateMovingAverage(rawMatchData, 3)
      : rawMatchData;
  }, [rawMatchData, showMovingAverage]);

  // Calculate performance statistics
  const stats = useMemo(() => {
    return calculateStats(matchData);
  }, [matchData]);

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

  // Enhanced tooltip component with better formatting for new metrics
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const formatValue = (value: number, metric: string) => {
        if (metric === "match_rating") {
          return value.toFixed(1);
        } else if (metric === "distance" || metric === "sprintDistance") {
          return value.toFixed(2);
        }
        return value.toString();
      };
      
      return (
        <div className={cn(
          "border rounded-lg shadow-lg backdrop-blur-sm max-w-[200px] p-3",
          theme === 'dark' 
            ? "bg-club-dark-gray/95 border-club-gold/20 text-club-light-gray" 
            : "bg-white/95 border-club-gold/30 text-gray-900"
        )}>
          <p className="font-semibold text-club-gold text-xs sm:text-sm">{data.match}</p>
          <p className={cn(
            "text-xs mb-1",
            theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
          )}>{data.date}</p>
          <p className="text-club-gold font-medium text-xs sm:text-sm">
            {selectedKPILabel}: {formatValue(data.value, selectedKPI)}
          </p>
          {showMovingAverage && data.movingAvg !== null && (
            <p className={cn(
              "text-xs",
              theme === 'dark' ? "text-gray-400" : "text-gray-500"
            )}>
              3-Match Avg: {formatValue(data.movingAvg, selectedKPI)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Show loading state
  if (loading) {
    return (
      <Card className={cn(
        "border-club-gold/20 w-full overflow-hidden",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-club-gold" />
            <span className={cn(
              "text-sm",
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              Loading performance data...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className={cn(
        "border-club-gold/20 w-full overflow-hidden",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardContent className="p-6">
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertDescription className="text-red-600 dark:text-red-400">
              Failed to load performance data: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show no data state
  if (!matchData || matchData.length === 0) {
    return (
      <Card className={cn(
        "border-club-gold/20 w-full overflow-hidden",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className={cn(
            "text-sm sm:text-base lg:text-lg xl:text-xl font-semibold",
            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
          )}>
            {player.name}'s Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="border-yellow-500/20 bg-yellow-500/10">
            <AlertDescription className="text-yellow-600 dark:text-yellow-400">
              No performance data available for the selected time period. Please check if there are matches in the database.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // If screen is too small, show optimized mobile view
  if (isVerySmallScreen) {
    return (
      <Card className={cn(
        "border-club-gold/20 overflow-hidden",
        theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
      )}>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className={cn(
                "text-base font-semibold mb-2",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                Performance Trends
              </h3>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
              )}>
                {player.name}
              </p>
            </div>
            
            <Select value={selectedKPI} onValueChange={setSelectedKPI}>
              <SelectTrigger className={cn(
                "w-full border-club-gold/20 focus:ring-club-gold/50",
                theme === 'dark' 
                  ? "bg-club-black text-club-light-gray" 
                  : "bg-white text-gray-900"
              )}>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent className={cn(
                "border-club-gold/20 z-50",
                theme === 'dark' 
                  ? "bg-club-black text-club-light-gray" 
                  : "bg-white text-gray-900"
              )}>
                {KPI_OPTIONS.map(option => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="focus:bg-club-gold/20"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-3 gap-2">
              <div className={cn(
                "rounded-lg p-2 text-center",
                theme === 'dark' ? "bg-club-black/40" : "bg-gray-100"
              )}>
                <div className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                )}>
                  {stats.avg.toFixed(1)}
                </div>
                <div className={cn(
                  "text-xs",
                  theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                )}>Avg</div>
              </div>
              <div className={cn(
                "rounded-lg p-2 text-center",
                theme === 'dark' ? "bg-club-black/40" : "bg-gray-100"
              )}>
                <div className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                )}>
                  {stats.max}
                </div>
                <div className={cn(
                  "text-xs",
                  theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                )}>Max</div>
              </div>
              <div className={cn(
                "rounded-lg p-2 text-center",
                theme === 'dark' ? "bg-club-black/40" : "bg-gray-100"
              )}>
                <div className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                )}>
                  {stats.min}
                </div>
                <div className={cn(
                  "text-xs",
                  theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                )}>Min</div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/player-stats?player=${player.id}`, '_blank')}
              className="w-full border-club-gold/20 hover:bg-club-gold/10 text-club-gold"
            >
              <Monitor size={16} className="mr-2" />
              View Full Chart
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn(
      "border-club-gold/20 w-full overflow-hidden",
      theme === 'dark' ? "bg-club-dark-gray" : "bg-white"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className={cn(
              "text-sm sm:text-base lg:text-lg xl:text-xl font-semibold",
              theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
            )}>
              {player.name}'s Performance Trends
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {stats.trend !== 'neutral' && (
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full",
                  stats.trend === 'up' 
                    ? "bg-club-gold/20 text-club-gold"
                    : "bg-red-500/20 text-red-400"
                )}>
                  <TrendingUp 
                    size={10} 
                    className={cn(
                      stats.trend === 'down' && "rotate-180"
                    )} 
                  />
                  <span className="text-xs font-medium">
                    {stats.trend === 'up' ? 'Improving' : 'Declining'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-4 pb-4">
          <div className="space-y-3 sm:space-y-4">
            {/* Primary Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="space-y-1">
                <Label className={cn(
                  "text-xs font-medium",
                  theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
                )}>Performance Metric</Label>
                <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                  <SelectTrigger className={cn(
                    "w-full border-club-gold/30 focus:ring-club-gold/50 h-8 sm:h-9 lg:h-10 text-xs sm:text-sm",
                    theme === 'dark' 
                      ? "bg-club-black text-club-light-gray" 
                      : "bg-white text-gray-900"
                  )}>
                    <SelectValue placeholder="Select KPI" />
                  </SelectTrigger>
                  <SelectContent className={cn(
                    "border-club-gold/30 z-50 max-h-60",
                    theme === 'dark' 
                      ? "bg-club-black text-club-light-gray" 
                      : "bg-white text-gray-900"
                  )}>
                    {KPI_OPTIONS.map(option => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value} 
                        className="focus:bg-club-gold/20 text-xs sm:text-sm"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className={cn(
                  "text-xs font-medium",
                  theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
                )}>Time Period</Label>
                <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                  <SelectTrigger className={cn(
                    "w-full border-club-gold/30 focus:ring-club-gold/50 h-8 sm:h-9 lg:h-10 text-xs sm:text-sm",
                    theme === 'dark' 
                      ? "bg-club-black text-club-light-gray" 
                      : "bg-white text-gray-900"
                  )}>
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent className={cn(
                    "border-club-gold/30 z-50",
                    theme === 'dark' 
                      ? "bg-club-black text-club-light-gray" 
                      : "bg-white text-gray-900"
                  )}>
                    {TIME_PERIOD_OPTIONS.map(option => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value} 
                        className="focus:bg-club-gold/20 text-xs sm:text-sm"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className={cn(
                  "text-xs font-medium",
                  theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
                )}>Chart View</Label>
                <Select value={chartView} onValueChange={setChartView}>
                  <SelectTrigger className={cn(
                    "w-full border-club-gold/30 focus:ring-club-gold/50 h-8 sm:h-9 lg:h-10 text-xs sm:text-sm",
                    theme === 'dark' 
                      ? "bg-club-black text-club-light-gray" 
                      : "bg-white text-gray-900"
                  )}>
                    <SelectValue placeholder="Chart View" />
                  </SelectTrigger>
                  <SelectContent className={cn(
                    "border-club-gold/30 z-50",
                    theme === 'dark' 
                      ? "bg-club-black text-club-light-gray" 
                      : "bg-white text-gray-900"
                  )}>
                    {CHART_VIEW_OPTIONS.map(option => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value} 
                        className="focus:bg-club-gold/20 text-xs sm:text-sm"
                      >
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
                      className={cn(
                        "text-xs sm:text-sm cursor-pointer select-none font-medium",
                        theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                      )}
                    >
                      3-Match Moving Average
                    </Label>
                    <Switch 
                      id="movingAverage" 
                      checked={showMovingAverage}
                      onCheckedChange={setShowMovingAverage}
                      className="data-[state=checked]:bg-club-gold data-[state=unchecked]:bg-club-black/40 border-club-gold/30"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor="showStats"
                      className={cn(
                        "text-xs sm:text-sm cursor-pointer select-none font-medium",
                        theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                      )}
                    >
                      Show Statistics
                    </Label>
                    <Switch 
                      id="showStats" 
                      checked={showStats}
                      onCheckedChange={setShowStats}
                      className="data-[state=checked]:bg-club-gold data-[state=unchecked]:bg-club-black/40 border-club-gold/30"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Performance Statistics */}
            {showStats && !isMobile && (
              <div className={cn(
                "grid grid-cols-4 gap-3 p-3 rounded-xl",
                theme === 'dark' ? "bg-club-black/50" : "bg-gray-50"
              )}>
                <div className="text-center">
                  <div className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                  )}>
                    {stats.avg.toFixed(1)}
                  </div>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                  )}>Average</div>
                </div>
                <div className="text-center">
                  <div className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                  )}>
                    {stats.max}
                  </div>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                  )}>Best</div>
                </div>
                <div className="text-center">
                  <div className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                  )}>
                    {stats.min}
                  </div>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                  )}>Worst</div>
                </div>
                <div className="text-center">
                  <div className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
                  )}>
                    {matchData.length}
                  </div>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                  )}>Matches</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Container */}
        <div 
          className="px-4 pb-4"
          style={{ height: chartConfig.height }}
        >
          <div className={cn(
            "w-full rounded-lg p-2 sm:p-3 lg:p-4",
            theme === 'dark' ? "bg-club-black/30" : "bg-gray-50"
          )}>
            <ChartContainer 
              config={{
                value: { color: "#D4AF37" },
                average: { color: "#9CA3AF" }
              }}
              aspectRatio={breakpoint === 'mobile' ? (4/3) : (16/10)}
              minHeight={chartConfig.height}
            >
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'line' ? (
                  <RechartsLineChart data={matchData} margin={chartConfig.margin}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#333" : "#e5e7eb"} opacity={0.3} />
                    <XAxis 
                      dataKey="match" 
                      stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                      tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: chartConfig.fontSize }}
                      tickLine={{ stroke: theme === 'dark' ? "#9CA3AF" : "#6B7280" }}
                      axisLine={{ stroke: theme === 'dark' ? "#9CA3AF" : "#6B7280" }}
                      angle={-45}
                      textAnchor="end"
                      height={chartConfig.margin.bottom}
                      interval={breakpoint === 'mobile' ? 'preserveStartEnd' : 0}
                    />
                    <YAxis 
                      stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                      tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: chartConfig.fontSize }}
                      tickLine={{ stroke: theme === 'dark' ? "#9CA3AF" : "#6B7280" }}
                      axisLine={{ stroke: theme === 'dark' ? "#9CA3AF" : "#6B7280" }}
                      label={!isMobile ? { 
                        value: selectedKPILabel, 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle' }, 
                        fill: theme === 'dark' ? "#9CA3AF" : "#6B7280",
                        fontSize: chartConfig.fontSize
                      } : undefined}
                    />
                    
                    <Tooltip content={<CustomTooltip />} />
                    
                    {!isMobile && (
                      <Legend 
                        verticalAlign="top" 
                        height={36} 
                        formatter={(value) => (
                          <span style={{ 
                            color: theme === 'dark' ? "#9CA3AF" : "#6B7280", 
                            fontSize: `${chartConfig.fontSize}px` 
                          }}>{value}</span>
                        )}
                      />
                    )}
                    
                    <Line
                      type="monotone"
                      dataKey="value"
                      name={selectedKPILabel}
                      stroke="#D4AF37"
                      strokeWidth={chartConfig.strokeWidth}
                      dot={{ r: chartConfig.dotRadius, strokeWidth: 2, fill: "#D4AF37" }}
                      activeDot={{ r: chartConfig.activeDotRadius, strokeWidth: 2, fill: "#D4AF37" }}
                    />

                    {showMovingAverage && !isMobile && (
                      <Line
                        type="monotone"
                        dataKey="movingAvg"
                        name="3-Match Average"
                        stroke="#9CA3AF"
                        strokeDasharray="5 5"
                        strokeWidth={chartConfig.strokeWidth}
                        dot={false}
                      />
                    )}
                  </RechartsLineChart>
                ) : (
                  <AreaChart data={matchData} margin={chartConfig.margin}>
                    <defs>
                      <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#333" : "#e5e7eb"} opacity={0.3} />
                    <XAxis 
                      dataKey="match" 
                      stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                      tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: chartConfig.fontSize }}
                      tickLine={{ stroke: theme === 'dark' ? "#9CA3AF" : "#6B7280" }}
                      axisLine={{ stroke: theme === 'dark' ? "#9CA3AF" : "#6B7280" }}
                      angle={-45}
                      textAnchor="end"
                      height={chartConfig.margin.bottom}
                      interval={breakpoint === 'mobile' ? 'preserveStartEnd' : 0}
                    />
                    <YAxis 
                      stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                      tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: chartConfig.fontSize }}
                      tickLine={{ stroke: theme === 'dark' ? "#9CA3AF" : "#6B7280" }}
                      axisLine={{ stroke: theme === 'dark' ? "#9CA3AF" : "#6B7280" }}
                      label={!isMobile ? { 
                        value: selectedKPILabel, 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle' }, 
                        fill: theme === 'dark' ? "#9CA3AF" : "#6B7280",
                        fontSize: chartConfig.fontSize
                      } : undefined}
                    />
                    
                    <Tooltip content={<CustomTooltip />} />
                    
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#D4AF37"
                      strokeWidth={chartConfig.strokeWidth}
                      fill="url(#metricGradient)"
                      dot={{ fill: "#D4AF37", strokeWidth: 2, r: chartConfig.dotRadius }}
                      activeDot={{ r: chartConfig.activeDotRadius, stroke: "#D4AF37", strokeWidth: 2 }}
                    />

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
            </ChartContainer>
          </div>
        </div>

        {/* Metric indicators */}
        <div className="flex justify-center gap-1 px-4 pb-4">
          {KPI_OPTIONS.map((metric, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 w-6 rounded-full transition-all duration-300",
                metric.value === selectedKPI 
                  ? "bg-club-gold opacity-100" 
                  : theme === 'dark' 
                    ? "bg-gray-600 opacity-30" 
                    : "bg-gray-300 opacity-30"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
