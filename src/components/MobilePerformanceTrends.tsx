
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobilePerformanceTrendsProps {
  player: Player;
}

export const MobilePerformanceTrends = ({ player }: MobilePerformanceTrendsProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Mock trend data - in real implementation, this would come from props or API
  const trendData = [
    { label: "Goals", current: 8, previous: 6, trend: "up" },
    { label: "Assists", current: 12, previous: 10, trend: "up" },
    { label: "Distance", current: 11.2, previous: 10.8, trend: "up" },
    { label: "Pass Accuracy", current: 87, previous: 89, trend: "down" }
  ];

  return (
    <Card className={cn(
      "w-full overflow-hidden transition-all duration-300",
      theme === 'dark' 
        ? "bg-club-dark-gray/50 border-club-gold/20" 
        : "bg-white/90 border-club-gold/30"
    )}>
      <CardHeader className={cn(
        "border-b pb-4",
        theme === 'dark' 
          ? "bg-club-black/40 border-club-gold/20" 
          : "bg-blue-50/80 border-club-gold/30",
        isMobile ? "p-4" : "p-6"
      )}>
        <CardTitle className={cn(
          "font-bold tracking-tight flex items-center gap-2",
          isMobile ? "text-base" : "text-lg",
          theme === 'dark' ? "text-club-light-gray" : "text-gray-900"
        )}>
          <Activity className={cn(
            "text-club-gold",
            isMobile ? "w-4 h-4" : "w-5 h-5"
          )} />
          Key Performance Trends
        </CardTitle>
      </CardHeader>

      <CardContent className={cn(
        "w-full",
        isMobile ? "p-4 space-y-3" : "p-6 space-y-4"
      )}>
        <div className={cn(
          "grid gap-3 w-full",
          isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
        )}>
          {trendData.map((item, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg p-3 border border-club-gold/20 transition-all duration-200",
                theme === 'dark' 
                  ? "bg-club-black/30 hover:bg-club-black/40" 
                  : "bg-white/50 hover:bg-white/70",
                isMobile && "min-h-[80px] flex flex-col justify-center"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "font-medium",
                  isMobile ? "text-sm" : "text-base",
                  theme === 'dark' ? "text-club-light-gray" : "text-gray-700"
                )}>
                  {item.label}
                </span>
                {item.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              <div className="space-y-1">
                <div className={cn(
                  "font-bold text-club-gold",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  {typeof item.current === 'number' && item.current % 1 !== 0 
                    ? item.current.toFixed(1) 
                    : item.current}
                  {item.label === "Pass Accuracy" && "%"}
                  {item.label === "Distance" && "km"}
                </div>
                
                <div className={cn(
                  "text-xs",
                  theme === 'dark' ? "text-club-light-gray/60" : "text-gray-500"
                )}>
                  Previous: {item.previous}
                  {item.label === "Pass Accuracy" && "%"}
                  {item.label === "Distance" && "km"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Chart Placeholder */}
        <div className={cn(
          "rounded-lg border-2 border-dashed border-club-gold/30 p-6 text-center w-full",
          isMobile ? "min-h-[200px]" : "min-h-[300px]",
          theme === 'dark' 
            ? "bg-club-black/20" 
            : "bg-gray-50/50"
        )}>
          <LineChart className={cn(
            "mx-auto mb-3 text-club-gold/50",
            isMobile ? "w-8 h-8" : "w-12 h-12"
          )} />
          <p className={cn(
            "font-medium mb-2",
            isMobile ? "text-sm" : "text-base",
            theme === 'dark' ? "text-club-light-gray/70" : "text-gray-600"
          )}>
            Performance Trend Chart
          </p>
          <p className={cn(
            "text-xs",
            theme === 'dark' ? "text-club-light-gray/50" : "text-gray-500"
          )}>
            Interactive chart showing {player.name}'s performance over time
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
