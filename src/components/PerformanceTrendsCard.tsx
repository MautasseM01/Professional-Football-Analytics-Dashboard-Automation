
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
import { ResponsiveChart } from "@/components/ui/responsive-chart";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Area,
  AreaChart
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { Monitor } from "lucide-react";

interface PerformanceTrendsCardProps {
  player: Player;
}

// KPI options for the dropdown
const KPI_OPTIONS = [
  { value: "sprintDistance", label: "Sprint Distance (km)" },
  { value: "passes_completed", label: "Passes Completed" },
  { value: "shots_on_target", label: "Shots on Target" },
  { value: "tackles_won", label: "Tackles Won" },
  { value: "distance", label: "Total Distance (km)" }
];

// Time period options
const TIME_PERIOD_OPTIONS = [
  { value: "last5", label: "Last 5 Matches" },
  { value: "last10", label: "Last 10 Matches" },
  { value: "season", label: "Season to Date" }
];

// iOS-style color palette
const iOS_COLORS = {
  primary: "#007AFF",
  secondary: "#34C759",
  tertiary: "#FF9500",
  background: "#F2F2F7",
  gray: "#8E8E93",
  lightGray: "#F2F2F7"
};

// Helper function to generate mock match data based on a player stat
const generateMatchData = (player: Player, kpi: string, numMatches: number) => {
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
      match: `Match ${numMatches - i}`,
      date: matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: roundedValue,
    };
  }).reverse();
};

// Calculate moving average for a dataset
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

export const PerformanceTrendsCard = ({ player }: PerformanceTrendsCardProps) => {
  const [selectedKPI, setSelectedKPI] = useState("distance");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last5");
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  
  // Check if screen is too small for optimal chart viewing
  const isVerySmallScreen = typeof window !== 'undefined' && window.innerWidth < 350;
  
  // Get the selected KPI label
  const selectedKPILabel = KPI_OPTIONS.find(option => option.value === selectedKPI)?.label || "";
  
  // Determine the number of matches based on selected time period
  const getMatchCount = () => {
    switch (selectedTimePeriod) {
      case "last5": return 5;
      case "last10": return 10;
      case "season": return 15;
      default: return 5;
    }
  };
  
  // Generate match data based on selected KPI and time period
  const matchData = useMemo(() => {
    const numMatches = getMatchCount();
    const rawData = generateMatchData(player, selectedKPI, numMatches);
    
    return showMovingAverage 
      ? calculateMovingAverage(rawData, 3)
      : rawData;
  }, [player, selectedKPI, selectedTimePeriod, showMovingAverage]);

  const chartConfig = {
    value: { color: iOS_COLORS.primary },
    average: { color: iOS_COLORS.gray }
  };

  // If screen is too small, show message to use larger screen
  if (isVerySmallScreen) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <Monitor className="w-10 h-10 sm:w-12 sm:h-12 text-club-gold/60" />
            <div className="space-y-2">
              <h3 className="text-[length:clamp(14px,4vw,18px)] font-semibold text-club-light-gray">
                Screen Too Small
              </h3>
              <p className="text-[length:clamp(10px,2.5vw,12px)] text-club-light-gray/70 max-w-sm">
                Please use a larger screen or rotate your device for optimal chart viewing. 
                The performance trends chart requires at least 350px width for proper display.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-club-light-gray text-[length:clamp(14px,4vw,18px)] font-medium">
              {player.name}'s Performance
            </CardTitle>
            {!isMobile && (
              <div className="text-[length:clamp(9px,2vw,11px)] text-[#8E8E93] bg-white/10 dark:bg-[#1C1C1E]/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                {selectedKPILabel}
              </div>
            )}
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {/* Controls Container */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {/* Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-1">
                  <Label className="text-[length:clamp(9px,2vw,11px)] text-club-light-gray/80 font-medium">Metric</Label>
                  <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                    <SelectTrigger className="w-full bg-white/5 dark:bg-[#1C1C1E]/20 backdrop-blur-sm border-white/20 dark:border-[#1C1C1E]/30 text-club-light-gray h-8 sm:h-9 lg:h-10 text-[length:clamp(10px,2.5vw,12px)] focus:ring-[#007AFF]/50 rounded-xl">
                      <SelectValue placeholder="Select KPI" />
                    </SelectTrigger>
                    <SelectContent className="bg-club-black border-[#F2F2F7]/20 text-club-light-gray z-50 max-h-60 rounded-xl backdrop-blur-xl">
                      {KPI_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-[#007AFF]/20 text-[length:clamp(10px,2.5vw,12px)] rounded-lg">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-[length:clamp(9px,2vw,11px)] text-club-light-gray/80 font-medium">Period</Label>
                  <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                    <SelectTrigger className="w-full bg-white/5 dark:bg-[#1C1C1E]/20 backdrop-blur-sm border-white/20 dark:border-[#1C1C1E]/30 text-club-light-gray h-8 sm:h-9 lg:h-10 text-[length:clamp(10px,2.5vw,12px)] focus:ring-[#007AFF]/50 rounded-xl">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent className="bg-club-black border-[#F2F2F7]/20 text-club-light-gray z-50 rounded-xl backdrop-blur-xl">
                      {TIME_PERIOD_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value} className="focus:bg-[#007AFF]/20 text-[length:clamp(10px,2.5vw,12px)] rounded-lg">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Switch Row - Hide on very small screens */}
              {!isMobile && (
                <div className="flex items-center justify-between pt-1">
                  <Label 
                    htmlFor="movingAverage"
                    className="text-club-light-gray text-[length:clamp(10px,2.5vw,12px)] cursor-pointer select-none font-medium"
                  >
                    3-Match Average
                  </Label>
                  <Switch 
                    id="movingAverage" 
                    checked={showMovingAverage}
                    onCheckedChange={setShowMovingAverage}
                    className="data-[state=checked]:bg-[#007AFF] data-[state=unchecked]:bg-white/20 dark:data-[state=unchecked]:bg-[#1C1C1E]/30"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4 lg:p-6 pt-1 sm:pt-2">
        <ResponsiveChart
          config={chartConfig}
          showZoomControls={false}
          aspectRatio={isMobile ? 1.2 : 1.8}
        >
          <AreaChart
            data={matchData}
            margin={{ 
              top: isMobile ? 15 : 25, 
              right: isMobile ? 15 : 30, 
              bottom: isMobile ? 25 : 35, 
              left: isMobile ? 20 : 30 
            }}
          >
            <defs>
              <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={iOS_COLORS.primary} stopOpacity={0.3}/>
                <stop offset="100%" stopColor={iOS_COLORS.primary} stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={iOS_COLORS.gray} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={iOS_COLORS.gray} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="match" 
              stroke="transparent"
              tick={{ 
                fill: iOS_COLORS.gray, 
                fontSize: 'clamp(9px, 2vw, 11px)' 
              }}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={isMobile ? 40 : 50}
              interval={isMobile ? 'preserveStartEnd' : 0}
            />
            <YAxis 
              stroke="transparent"
              tick={{ 
                fill: iOS_COLORS.gray, 
                fontSize: 'clamp(9px, 2vw, 11px)' 
              }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <ChartTooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl p-3 border-0 rounded-2xl shadow-2xl text-gray-800 dark:text-[#F2F2F7] max-w-[200px]">
                      <p className="font-semibold text-[#007AFF] text-[length:clamp(11px,3vw,14px)]">{payload[0].payload.match}</p>
                      <p className="text-[#8E8E93] text-[length:clamp(9px,2vw,11px)] mb-2">{payload[0].payload.date}</p>
                      <p className="text-gray-800 dark:text-[#F2F2F7] font-medium text-[length:clamp(11px,3vw,14px)]">{selectedKPILabel}: {payload[0].value}</p>
                      {showMovingAverage && payload[0].payload.movingAvg !== null && (
                        <p className="text-[#8E8E93] text-[length:clamp(9px,2vw,11px)]">3-Match Avg: {payload[0].payload.movingAvg}</p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={iOS_COLORS.primary}
              strokeWidth={isMobile ? 1.5 : 2}
              fill="url(#valueGradient)"
              dot={{ r: isMobile ? 2 : 3, strokeWidth: 0, fill: iOS_COLORS.primary }}
              activeDot={{ 
                r: isMobile ? 4 : 5, 
                strokeWidth: 2, 
                stroke: "#fff",
                fill: iOS_COLORS.primary,
                style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
              }}
            />
            {showMovingAverage && !isMobile && (
              <Area
                type="monotone"
                dataKey="movingAvg"
                stroke={iOS_COLORS.gray}
                strokeDasharray="3 3"
                strokeWidth={1.5}
                fill="url(#averageGradient)"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveChart>
      </CardContent>
    </Card>
  );
};
