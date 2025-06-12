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
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePerformanceData } from "@/hooks/use-performance-data";
import { useSwipeGestures } from "@/hooks/use-swipe-gestures";
import { ResponsiveChartContainer } from "./ResponsiveChartContainer";
import { ChartLoadingSkeleton } from "./LoadingStates";
import { ErrorBoundary } from "./ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PerformanceTrendsCardProps {
  player: Player;
}

// Enhanced KPI options with club gold theming - now includes all 8 metrics
const KPI_OPTIONS = [
  { value: "distance", label: "Total Distance (km)", color: "#D4AF37", shortLabel: "Distance" },
  { value: "sprintDistance", label: "Sprint Distance (km)", color: "#D4AF37", shortLabel: "Sprint" },
  { value: "passes_completed", label: "Passes Completed", color: "#D4AF37", shortLabel: "Passes" },
  { value: "shots_on_target", label: "Shots on Target", color: "#D4AF37", shortLabel: "Shots" },
  { value: "tackles_won", label: "Tackles Won", color: "#D4AF37", shortLabel: "Tackles" },
  { value: "goals", label: "Goals", color: "#D4AF37", shortLabel: "Goals" },
  { value: "assists", label: "Assists", color: "#D4AF37", shortLabel: "Assists" },
  { value: "match_rating", label: "Match Rating", color: "#D4AF37", shortLabel: "Rating" }
];

// Enhanced time period options
const TIME_PERIOD_OPTIONS = [
  { value: "last3", label: "Last 3 Matches", shortLabel: "3M" },
  { value: "last5", label: "Last 5 Matches", shortLabel: "5M" },
  { value: "last10", label: "Last 10 Matches", shortLabel: "10M" },
  { value: "season", label: "Season to Date", shortLabel: "Season" }
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
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  const currentMetric = KPI_OPTIONS.find(m => m.value === selectedKPI) || KPI_OPTIONS[0];
  
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

  // Enhanced navigation with swipe gestures
  const nextMetric = () => {
    const nextIndex = (currentMetricIndex + 1) % KPI_OPTIONS.length;
    setCurrentMetricIndex(nextIndex);
    setSelectedKPI(KPI_OPTIONS[nextIndex].value);
  };

  const prevMetric = () => {
    const prevIndex = (currentMetricIndex - 1 + KPI_OPTIONS.length) % KPI_OPTIONS.length;
    setCurrentMetricIndex(prevIndex);
    setSelectedKPI(KPI_OPTIONS[prevIndex].value);
  };

  // Swipe gestures for mobile
  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: nextMetric,
    onSwipeRight: prevMetric,
    threshold: 50,
    preventScroll: false
  });

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
          "border rounded-xl shadow-2xl backdrop-blur-md max-w-[200px] p-3 transition-all duration-200",
          "animate-scale-in", // Add smooth animation
          theme === 'dark' 
            ? "bg-club-dark-gray/95 border-club-gold/30 text-club-light-gray" 
            : "bg-white/95 border-club-gold/40 text-gray-900"
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

  // Enhanced chart configuration for better mobile experience
  const getChartConfig = () => ({
    value: { color: "#D4AF37" },
    average: { color: "#9CA3AF" }
  });

  // Show loading state
  if (loading) {
    return <ChartLoadingSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <Card className={cn(
        "border-club-gold/20 w-full overflow-hidden backdrop-blur-sm",
        theme === 'dark' 
          ? "bg-club-dark-gray/50" 
          : "bg-white/80",
        "shadow-xl transition-all duration-300"
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
        "border-club-gold/20 w-full overflow-hidden backdrop-blur-sm",
        theme === 'dark' 
          ? "bg-club-dark-gray/50" 
          : "bg-white/80",
        "shadow-xl transition-all duration-300"
      )}>
        <CardHeader className="pb-3">
          <CardTitle className={cn(
            "text-sm sm:text-base lg:text-lg font-semibold",
            theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
          )}>
            {player.name}'s Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="border-yellow-500/20 bg-yellow-500/10">
            <AlertDescription className="text-yellow-600 dark:text-yellow-400">
              No performance data available for the selected time period.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card 
        className={cn(
          "border-club-gold/20 w-full overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl",
          theme === 'dark' 
            ? "bg-club-dark-gray/60 hover:bg-club-dark-gray/70" 
            : "bg-white/80 hover:bg-white/90",
          "shadow-xl animate-fade-in"
        )}
        {...(isMobile ? swipeProps : {})}
      >
        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className={cn(
                "text-sm sm:text-base lg:text-lg font-semibold",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
              )}>
                {player.name}'s Performance
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {stats.trend !== 'neutral' && (
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium animate-scale-in",
                    stats.trend === 'up' 
                      ? "bg-club-gold/20 text-club-gold"
                      : "bg-red-500/20 text-red-400"
                  )}>
                    <TrendingUp 
                      size={10} 
                      className={cn(
                        "transition-transform duration-200",
                        stats.trend === 'down' && "rotate-180"
                      )} 
                    />
                    <span>
                      {stats.trend === 'up' ? 'Improving' : 'Declining'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile navigation controls - iPhone weather style */}
            {isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMetric}
                  className="h-9 w-9 text-club-gold hover:bg-club-gold/10 rounded-full hover-scale"
                  aria-label="Previous metric"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMetric}
                  className="h-9 w-9 text-club-gold hover:bg-club-gold/10 rounded-full hover-scale"
                  aria-label="Next metric"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="px-4 sm:px-6 pb-4">
            <div className="space-y-3 sm:space-y-4">
              {/* Mobile metric display - iPhone weather style */}
              {isMobile ? (
                <div className="text-center space-y-2 animate-fade-in">
                  <h3 className="text-lg font-semibold text-club-gold">
                    {currentMetric.shortLabel}
                  </h3>
                  <div className="text-xs text-club-light-gray/70">
                    {TIME_PERIOD_OPTIONS.find(t => t.value === selectedTimePeriod)?.shortLabel}
                  </div>
                  
                  {/* Metric indicator dots */}
                  <div className="flex justify-center gap-1 mt-3">
                    {KPI_OPTIONS.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          index === currentMetricIndex ? 'bg-club-gold scale-125' : 'bg-club-gold/30'
                        )}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Desktop Controls */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className={cn(
                      "text-xs font-medium",
                      theme === 'dark' ? "text-club-light-gray/80" : "text-gray-600"
                    )}>Performance Metric</Label>
                    <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                      <SelectTrigger className={cn(
                        "w-full border-club-gold/30 focus:ring-club-gold/50 h-9 text-sm rounded-xl transition-all duration-200",
                        theme === 'dark' 
                          ? "bg-club-black/50 text-club-light-gray" 
                          : "bg-white/70 text-gray-900"
                      )}>
                        <SelectValue placeholder="Select KPI" />
                      </SelectTrigger>
                      <SelectContent className={cn(
                        "border-club-gold/30 z-50 max-h-60 rounded-xl backdrop-blur-md",
                        theme === 'dark' 
                          ? "bg-club-black/90 text-club-light-gray" 
                          : "bg-white/90 text-gray-900"
                      )}>
                        {KPI_OPTIONS.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value} 
                            className="focus:bg-club-gold/20 text-sm rounded-lg transition-colors duration-150"
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
                        "w-full border-club-gold/30 focus:ring-club-gold/50 h-9 text-sm rounded-xl transition-all duration-200",
                        theme === 'dark' 
                          ? "bg-club-black/50 text-club-light-gray" 
                          : "bg-white/70 text-gray-900"
                      )}>
                        <SelectValue placeholder="Time Period" />
                      </SelectTrigger>
                      <SelectContent className={cn(
                        "border-club-gold/30 z-50 rounded-xl backdrop-blur-md",
                        theme === 'dark' 
                          ? "bg-club-black/90 text-club-light-gray" 
                          : "bg-white/90 text-gray-900"
                      )}>
                        {TIME_PERIOD_OPTIONS.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value} 
                            className="focus:bg-club-gold/20 text-sm rounded-lg transition-colors duration-150"
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
                        "w-full border-club-gold/30 focus:ring-club-gold/50 h-9 text-sm rounded-xl transition-all duration-200",
                        theme === 'dark' 
                          ? "bg-club-black/50 text-club-light-gray" 
                          : "bg-white/70 text-gray-900"
                      )}>
                        <SelectValue placeholder="Chart View" />
                      </SelectTrigger>
                      <SelectContent className={cn(
                        "border-club-gold/30 z-50 rounded-xl backdrop-blur-md",
                        theme === 'dark' 
                          ? "bg-club-black/90 text-club-light-gray" 
                          : "bg-white/90 text-gray-900"
                      )}>
                        {CHART_VIEW_OPTIONS.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value} 
                            className="focus:bg-club-gold/20 text-sm rounded-lg transition-colors duration-150"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Performance Statistics - iPhone weather style */}
              <div className={cn(
                "grid gap-3 p-4 rounded-2xl transition-all duration-300 animate-fade-in",
                isMobile ? "grid-cols-2" : "grid-cols-4",
                theme === 'dark' 
                  ? "bg-club-black/30 border border-club-gold/10" 
                  : "bg-gray-50/50 border border-club-gold/20"
              )}>
                <div className="text-center">
                  <div className={cn(
                    "text-lg font-bold transition-colors duration-200",
                    theme === 'dark' ? "text-club-gold" : "text-club-gold"
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
                    "text-lg font-bold transition-colors duration-200",
                    theme === 'dark' ? "text-green-400" : "text-green-600"
                  )}>
                    {stats.max}
                  </div>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                  )}>Best</div>
                </div>
                {!isMobile && (
                  <>
                    <div className="text-center">
                      <div className={cn(
                        "text-lg font-bold transition-colors duration-200",
                        theme === 'dark' ? "text-red-400" : "text-red-600"
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
                        "text-lg font-bold transition-colors duration-200",
                        theme === 'dark' ? "text-blue-400" : "text-blue-600"
                      )}>
                        {matchData.length}
                      </div>
                      <div className={cn(
                        "text-xs",
                        theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
                      )}>Matches</div>
                    </div>
                  </>
                )}
              </div>

              {/* Secondary Controls - Desktop only */}
              {!isMobile && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label 
                        htmlFor="movingAverage"
                        className={cn(
                          "text-xs cursor-pointer select-none font-medium transition-colors duration-200",
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
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart Container - iPhone weather style */}
          <div className="px-4 sm:px-6 pb-4">
            <div 
              className={cn(
                "w-full rounded-2xl p-3 sm:p-4 transition-all duration-300",
                theme === 'dark' 
                  ? "bg-club-black/20 border border-club-gold/10" 
                  : "bg-gray-50/30 border border-club-gold/20"
              )}
              style={{ height: isMobile ? '220px' : '300px' }}
            >
              <ResponsiveChartContainer
                config={getChartConfig()}
                aspectRatio={isMobile ? (4/3) : (16/10)}
                minHeight={isMobile ? 200 : 280}
              >
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === 'line' ? (
                    <RechartsLineChart data={matchData} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#333" : "#e5e7eb"} opacity={0.3} />
                      <XAxis 
                        dataKey="match" 
                        stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                        tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: isMobile ? 8 : 10 }}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        interval={isMobile ? 1 : 0}
                      />
                      <YAxis 
                        stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                        tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: isMobile ? 8 : 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={isMobile ? 25 : 30}
                      />
                      
                      <ChartTooltip content={<CustomTooltip />} />
                      
                      <Line
                        type="monotone"
                        dataKey="value"
                        name={selectedKPILabel}
                        stroke="#D4AF37"
                        strokeWidth={isMobile ? 2 : 2.5}
                        dot={{ r: isMobile ? 3 : 4, strokeWidth: 2, fill: "#D4AF37" }}
                        activeDot={{ r: isMobile ? 5 : 6, strokeWidth: 2, fill: "#D4AF37" }}
                      />

                      {showMovingAverage && !isMobile && (
                        <Line
                          type="monotone"
                          dataKey="movingAvg"
                          name="3-Match Average"
                          stroke="#9CA3AF"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                    </RechartsLineChart>
                  ) : (
                    <AreaChart data={matchData} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
                      <defs>
                        <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#333" : "#e5e7eb"} opacity={0.3} />
                      <XAxis 
                        dataKey="match" 
                        stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                        tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: isMobile ? 8 : 10 }}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        interval={isMobile ? 1 : 0}
                      />
                      <YAxis 
                        stroke={theme === 'dark' ? "#9CA3AF" : "#6B7280"}
                        tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#6B7280", fontSize: isMobile ? 8 : 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={isMobile ? 25 : 30}
                      />
                      
                      <ChartTooltip content={<CustomTooltip />} />
                      
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#D4AF37"
                        strokeWidth={isMobile ? 2 : 2.5}
                        fill="url(#metricGradient)"
                        dot={{ fill: "#D4AF37", strokeWidth: 2, r: isMobile ? 3 : 4 }}
                        activeDot={{ r: isMobile ? 5 : 6, stroke: "#D4AF37", strokeWidth: 2 }}
                      />

                      {showMovingAverage && !isMobile && (
                        <Line
                          type="monotone"
                          dataKey="movingAvg"
                          stroke="#9CA3AF"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={false}
                        />
                      )}
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </ResponsiveChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
