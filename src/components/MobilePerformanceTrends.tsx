
import { useState } from "react";
import { Player } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, ArrowLeft, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface MobilePerformanceTrendsProps {
  player: Player;
}

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
      color: "#D4AF37",
      description: "Goals scored in recent matches"
    },
    {
      title: "Assists per Match", 
      dataKey: "assists",
      color: "#10B981",
      description: "Assists provided in recent matches"
    },
    {
      title: "Pass Completion",
      dataKey: "passes", 
      color: "#3B82F6",
      description: "Successful passes per match"
    },
    {
      title: "Distance Covered",
      dataKey: "distance",
      color: "#F59E0B", 
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
    <Card className="border-club-gold/20 bg-club-dark-gray w-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg text-club-gold font-semibold">
              Performance Trends
            </CardTitle>
            <CardDescription className="text-xs text-club-light-gray/70 mt-1">
              {currentChartData.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevChart}
              className="h-11 w-11 text-club-gold hover:bg-club-gold/10 min-h-[44px] min-w-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextChart}
              className="h-11 w-11 text-club-gold hover:bg-club-gold/10 min-h-[44px] min-w-[44px]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chart indicator dots */}
        <div className="flex justify-center gap-1 mt-2">
          {charts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentChart ? 'bg-club-gold' : 'bg-club-gold/30'
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {/* Horizontal scroll message */}
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <ArrowLeft className="h-4 w-4" />
            <AlertDescription className="text-xs text-club-light-gray flex items-center gap-2">
              Scroll horizontally to view full chart
              <ArrowRight className="h-4 w-4" />
            </AlertDescription>
          </Alert>

          {/* Chart with horizontal scroll */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px] h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                  <XAxis 
                    dataKey="match" 
                    stroke="#F5F5F5" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#F5F5F5" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: '1px solid #D4AF37', 
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={currentChartData.dataKey}
                    stroke={currentChartData.color}
                    strokeWidth={2}
                    dot={{ fill: currentChartData.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: currentChartData.color, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart title and navigation info */}
          <div className="text-center space-y-2">
            <h3 className="text-sm font-medium text-club-light-gray">
              {currentChartData.title}
            </h3>
            <p className="text-xs text-club-light-gray/60">
              Swipe or use arrows to view other metrics
            </p>
          </div>

          {/* Landscape mode suggestion */}
          <Alert className="bg-amber-500/10 border-amber-500/30">
            <TrendingUp className="h-4 w-4" />
            <AlertDescription className="text-xs text-club-light-gray">
              Rotate to landscape mode for better chart viewing experience
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};
