
import { useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlayerAttributes, PositionalAverage } from "@/hooks/use-player-attributes";
import { Player } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ResponsiveChartContainer } from "./ResponsiveChartContainer";
import { ChartLoadingSkeleton } from "./LoadingStates";
import { ErrorBoundary } from "./ErrorBoundary";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface RoleRadarChartProps {
  player: Player | null;
  attributes: PlayerAttributes | null;
  positionalAverage: PositionalAverage | null;
  loading: boolean;
  error: string | null;
  players?: Player[];
}

export const RoleRadarChart = ({
  player,
  attributes,
  positionalAverage,
  loading,
  error,
  players = []
}: RoleRadarChartProps) => {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  const { triggerHaptic } = useHapticFeedback();
  const { theme } = useTheme();

  // Player navigation for swipe gesture simulation
  const handlePreviousPlayer = () => {
    if (players.length > 1) {
      setCurrentPlayerIndex(prev => (prev - 1 + players.length) % players.length);
      triggerHaptic('light');
    }
  };

  const handleNextPlayer = () => {
    if (players.length > 1) {
      setCurrentPlayerIndex(prev => (prev + 1) % players.length);
      triggerHaptic('light');
    }
  };

  const chartData = useMemo(() => {
    if (!attributes) return [];

    return [
      {
        attribute: isMobile ? "Finish" : "Finishing",
        player: attributes.finishing,
        average: positionalAverage?.finishing || 0,
        fullMark: 100,
      },
      {
        attribute: isMobile ? "Aerial" : "Aerial Duels",
        player: attributes.aerial_duels_won,
        average: positionalAverage?.aerial_duels_won || 0,
        fullMark: 100,
      },
      {
        attribute: isMobile ? "Hold-up" : "Hold-up Play",
        player: attributes.holdup_play,
        average: positionalAverage?.holdup_play || 0,
        fullMark: 100,
      },
      {
        attribute: "Pace",
        player: attributes.pace,
        average: positionalAverage?.pace || 0,
        fullMark: 100,
      },
      {
        attribute: isMobile ? "Work Rate" : "Work Rate",
        player: attributes.work_rate_attacking,
        average: positionalAverage?.work_rate_attacking || 0,
        fullMark: 100,
      },
    ];
  }, [attributes, positionalAverage, isMobile]);

  const calculateOverallScore = (attrs: PlayerAttributes | null): number => {
    if (!attrs) return 0;
    
    const sum = attrs.finishing + 
                attrs.aerial_duels_won + 
                attrs.holdup_play + 
                attrs.pace + 
                attrs.work_rate_attacking;
    
    return Math.round(sum / 5);
  };

  const playerScore = calculateOverallScore(attributes);
  const averageScore = positionalAverage ? 
    Math.round((positionalAverage.finishing + 
                positionalAverage.aerial_duels_won + 
                positionalAverage.holdup_play + 
                positionalAverage.pace + 
                positionalAverage.work_rate_attacking) / 5) 
    : 0;

  // iOS-style responsive chart configuration
  const getChartConfig = () => {
    if (breakpoint === 'mobile') {
      return {
        outerRadius: "70%",
        fontSize: 11,
        margin: { top: 20, right: 20, bottom: 20, left: 20 }
      };
    }
    if (breakpoint === 'tablet-portrait' || breakpoint === 'tablet-landscape') {
      return {
        outerRadius: "75%",
        fontSize: 12,
        margin: { top: 25, right: 25, bottom: 25, left: 25 }
      };
    }
    return {
      outerRadius: "80%",
      fontSize: 13,
      margin: { top: 30, right: 30, bottom: 30, left: 30 }
    };
  };

  const chartConfig = getChartConfig();

  // Custom touch target for chart points
  const handlePointClick = (attributeName: string) => {
    setSelectedPoint(selectedPoint === attributeName ? null : attributeName);
    triggerHaptic('medium');
  };

  if (loading) {
    return <ChartLoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className={cn(
        "border-0 rounded-2xl shadow-lg overflow-hidden",
        "bg-gradient-to-br from-red-50 to-rose-100 dark:from-slate-900 dark:to-slate-800"
      )}>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white text-lg font-bold">
            Player Role Suitability: Striker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 rounded-xl">
            <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!attributes) {
    return (
      <Card className={cn(
        "border-0 rounded-2xl shadow-lg overflow-hidden",
        "bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-slate-900 dark:to-slate-800"
      )}>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white text-lg font-bold">
            Player Role Suitability: Striker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-amber-500/10 border-amber-500/20 rounded-xl">
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              No attribute data available for {player?.name || 'this player'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className={cn(
        "border-0 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 animate-fade-in",
        "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800"
      )}>
        <CardHeader className="pb-4 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold">
                Player Role Suitability: Striker
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Performance metrics for striker position
              </CardDescription>
            </div>
            
            {/* Player navigation (if multiple players) */}
            {players.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousPlayer}
                  className="rounded-full hover:bg-white/20 dark:hover:bg-black/20 hover-scale"
                  aria-label="Previous player"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                  {currentPlayerIndex + 1}/{players.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextPlayer}
                  className="rounded-full hover:bg-white/20 dark:hover:bg-black/20 hover-scale"
                  aria-label="Next player"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Switch 
                id="show-benchmark" 
                checked={showBenchmark} 
                onCheckedChange={(checked) => {
                  setShowBenchmark(checked);
                  triggerHaptic('light');
                }}
              />
              <Label htmlFor="show-benchmark" className="text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                Show Average
              </Label>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResponsiveChartContainer
                config={{
                  player: { color: "#f97316" },
                  average: { color: "#16a34a" }
                }}
                aspectRatio={isMobile ? 1 : (4/3)}
                minHeight={isMobile ? 280 : 320}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius={chartConfig.outerRadius}
                    data={chartData}
                    margin={chartConfig.margin}
                  >
                    <PolarGrid 
                      stroke="rgba(255,255,255,0.2)" 
                      strokeWidth={1}
                      className="drop-shadow-sm"
                    />
                    <PolarAngleAxis 
                      dataKey="attribute" 
                      stroke="rgba(255,255,255,0.8)" 
                      fontSize={chartConfig.fontSize}
                      tick={{ 
                        fontSize: chartConfig.fontSize,
                        fill: 'currentColor',
                        className: 'font-medium'
                      }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={chartConfig.fontSize - 1}
                      tick={{ 
                        fontSize: chartConfig.fontSize - 1,
                        fill: 'rgba(255,255,255,0.6)'
                      }}
                      tickCount={5}
                    />

                    <Radar
                      name={player?.name || "Player"}
                      dataKey="player"
                      stroke="#f97316"
                      fill="url(#playerGradient)"
                      fillOpacity={0.3}
                      strokeWidth={3}
                      dot={{ 
                        r: isMobile ? 6 : 5, 
                        fill: "#f97316",
                        stroke: "#fff",
                        strokeWidth: 2,
                        style: { cursor: 'pointer' }
                      }}
                    />

                    {showBenchmark && positionalAverage && (
                      <Radar
                        name="Position Average"
                        dataKey="average"
                        stroke="#16a34a"
                        fill="url(#averageGradient)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                        strokeDasharray="5,5"
                      />
                    )}

                    {/* Custom gradients */}
                    <defs>
                      <radialGradient id="playerGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.1} />
                      </radialGradient>
                      <radialGradient id="averageGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#16a34a" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#16a34a" stopOpacity={0.1} />
                      </radialGradient>
                    </defs>

                    {!isMobile && <Legend />}
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: isMobile ? '12px' : '14px',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ResponsiveChartContainer>
            </div>
            
            {/* Stats panel with iOS styling */}
            <div className="space-y-4">
              <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 transition-all duration-300">
                <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
                  Role Fit Score
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="truncate pr-2 font-medium">{player?.name || "Player"}</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">{playerScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full transition-all duration-700 ease-out" 
                        style={{ width: `${playerScore}%` }}
                      />
                    </div>
                  </div>
                  {showBenchmark && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Position Average</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{averageScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-700 ease-out" 
                          style={{ width: `${averageScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-gray-900 dark:text-white font-bold mb-3 text-sm">
                    Key Strengths
                  </h4>
                  <ul className="text-sm space-y-2">
                    {chartData
                      .filter(item => item.player > (showBenchmark ? item.average : 70))
                      .slice(0, 3)
                      .map((item, i) => (
                        <li key={i} className="flex items-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                          <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 mr-3 flex-shrink-0" />
                          <span className="truncate text-gray-700 dark:text-gray-300">
                            {item.attribute} ({item.player})
                          </span>
                        </li>
                      ))
                    }
                    {chartData.filter(item => item.player > (showBenchmark ? item.average : 70)).length === 0 && (
                      <li className="text-gray-500 dark:text-gray-400 text-sm italic">
                        No significant strengths identified
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
