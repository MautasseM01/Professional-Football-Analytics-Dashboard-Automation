
import { useState } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

interface MobilePerformanceTrendsProps {
  player: Player;
}

// iOS-style color palette
const iOS_COLORS = {
  primary: "#007AFF",
  secondary: "#34C759",
  tertiary: "#FF9500",
  gray: "#8E8E93",
  lightGray: "#F2F2F7"
};

export const MobilePerformanceTrends = ({ player }: MobilePerformanceTrendsProps) => {
  const [currentChart, setCurrentChart] = useState(0);

  // Mock performance data for demonstration
  const performanceData = [
    { match: 1, goals: 1, assists: 0, passes: 45, distance: 8.2 },
    { match: 2, goals: 0, assists: 1, passes: 52, distance: 9.1 },
    { match: 3, goals: 2, assists: 0, passes: 38, distance: 7.8 },
    { match: 4, goals: 1, assists: 2, passes: 61, distance: 9.5 },
    { match: 5, goals: 0, assists: 0, passes: 41, distance: 8.0 },
    { match: 6, goals: 1, assists: 1, passes: 55, distance: 8.7 },
    { match: 7, goals: 0, assists: 2, passes: 49, distance: 8.9 },
    { match: 8, goals: 1, assists: 0, passes: 44, distance: 8.3 },
  ];

  const charts = [
    {
      title: "Goals per Match",
      dataKey: "goals",
      color: iOS_COLORS.primary,
      description: "Goals scored in recent matches"
    },
    {
      title: "Assists per Match", 
      dataKey: "assists",
      color: iOS_COLORS.secondary,
      description: "Assists provided in recent matches"
    },
    {
      title: "Pass Completion",
      dataKey: "passes", 
      color: iOS_COLORS.tertiary,
      description: "Successful passes per match"
    },
    {
      title: "Distance Covered",
      dataKey: "distance",
      color: "#FF3B30", 
      description: "Kilometers covered per match"
    }
  ];

  const currentChartData = charts[currentChart];

  const nextChart = () => {
    setCurrentChart((prev) => (prev + 1) % charts.length);
  };

  const prevChart = () => {
    setCurrentChart((prev) => (prev - 1 + charts.length) % charts.length);
  };

  return (
    <Card className="border-[#F2F2F7]/20 bg-[#F2F2F7]/5 backdrop-blur-sm w-full max-w-full overflow-hidden">
      <CardHeader className="p-3 xs:p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm xs:text-base sm:text-lg text-[#007AFF] font-semibold">
              Performance Trends
            </CardTitle>
            <CardDescription className="text-xs text-[#8E8E93] mt-1">
              {currentChartData.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 xs:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevChart}
              className="h-9 w-9 xs:h-11 xs:w-11 text-[#007AFF] hover:bg-[#007AFF]/10 min-h-[44px] min-w-[44px] rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextChart}
              className="h-9 w-9 xs:h-11 xs:w-11 text-[#007AFF] hover:bg-[#007AFF]/10 min-h-[44px] min-w-[44px] rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chart indicator dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {charts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentChart ? 'bg-[#007AFF] scale-125' : 'bg-[#F2F2F7]/40'
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-3 xs:p-4 pt-0">
        <div className="space-y-3 xs:space-y-4">
          {/* Responsive chart container */}
          <div className="w-full">
            <div 
              className="w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] bg-[#F2F2F7]/10 rounded-2xl p-2"
              style={{ maxWidth: '100%' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={performanceData} 
                  margin={{ 
                    top: 10, 
                    right: window.innerWidth < 480 ? 10 : 20, 
                    left: window.innerWidth < 480 ? 5 : 10, 
                    bottom: 10 
                  }}
                >
                  <defs>
                    <linearGradient id={`gradient-${currentChart}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={currentChartData.color} stopOpacity={0.3}/>
                      <stop offset="100%" stopColor={currentChartData.color} stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="match" 
                    stroke="transparent"
                    fontSize={window.innerWidth < 480 ? 9 : 10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: iOS_COLORS.gray }}
                    interval={window.innerWidth < 480 ? 1 : 0}
                  />
                  <YAxis 
                    stroke="transparent"
                    fontSize={window.innerWidth < 480 ? 9 : 10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: iOS_COLORS.gray }}
                    width={window.innerWidth < 480 ? 25 : 30}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      backdropFilter: 'blur(20px)',
                      border: 'none', 
                      borderRadius: '12px',
                      fontSize: window.innerWidth < 480 ? '10px' : '12px',
                      color: '#1D1D1F',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={currentChartData.dataKey}
                    stroke={currentChartData.color}
                    strokeWidth={window.innerWidth < 480 ? 1 : 1.5}
                    fill={`url(#gradient-${currentChart})`}
                    dot={{ 
                      fill: currentChartData.color, 
                      strokeWidth: 0, 
                      r: window.innerWidth < 480 ? 2 : 3 
                    }}
                    activeDot={{ 
                      r: window.innerWidth < 480 ? 4 : 5, 
                      stroke: "#fff",
                      strokeWidth: 2,
                      fill: currentChartData.color,
                      style: { filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart title and navigation info */}
          <div className="text-center space-y-2">
            <h3 className="text-xs xs:text-sm font-semibold text-[#007AFF]">
              {currentChartData.title}
            </h3>
            <p className="text-xs text-[#8E8E93]">
              Swipe or use arrows to view other metrics
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
