
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
import { BarChart3, Radar as RadarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleRadarChartProps {
  player: Player | null;
  attributes: PlayerAttributes | null;
  positionalAverage: PositionalAverage | null;
  loading: boolean;
  error: string | null;
}

export const RoleRadarChart = ({
  player,
  attributes,
  positionalAverage,
  loading,
  error
}: RoleRadarChartProps) => {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [showSimplified, setShowSimplified] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();
  const { triggerHaptic } = useHapticFeedback();

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

  // Enhanced simplified mobile view with swipe navigation
  const SimplifiedRadarView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Player Analysis
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            triggerHaptic('selection');
            setShowSimplified(false);
          }}
          className="text-sm bg-white/10 backdrop-blur-sm"
        >
          Show Radar
        </Button>
      </div>

      {/* Swipeable attribute cards */}
      <div className="space-y-3">
        {chartData.map((item, index) => (
          <Card 
            key={index} 
            className={`transition-all duration-300 active:scale-95 ${
              selectedAttribute === index ? 'bg-primary/10 border-primary/40' : 'bg-card/80 border-primary/20'
            }`}
            onClick={() => {
              triggerHaptic('light');
              setSelectedAttribute(selectedAttribute === index ? null : index);
            }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-lg">{item.attribute}</span>
                <span className="text-2xl font-bold text-primary">{item.player}</span>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${item.player}%` }}
                  />
                </div>
                
                {showBenchmark && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg: {item.average}</span>
                    <span className={`font-medium ${
                      item.player > item.average ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {item.player > item.average ? '+' : ''}{item.player - item.average}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall score card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4 text-center">
          <h4 className="text-lg font-medium mb-2">Overall Score</h4>
          <div className="text-4xl font-bold text-primary mb-2">{playerScore}/100</div>
          {showBenchmark && (
            <p className="text-sm text-muted-foreground">
              Position average: {averageScore}/100
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-background to-background/80">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-background to-background/80">
        <CardHeader>
          <CardTitle className="text-primary text-lg">
            Player Role Suitability: Striker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!attributes) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-background to-background/80">
        <CardHeader>
          <CardTitle className="text-primary text-lg">
            Player Role Suitability: Striker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-primary/10 border-primary/20">
            <AlertDescription>
              No attribute data available for {player?.name || 'this player'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isMobile && showSimplified) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-background to-background/80">
        <CardContent className="p-4">
          <SimplifiedRadarView />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-background/80 overflow-hidden">
      <CardHeader className="pb-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-primary text-lg lg:text-xl">
              Player Role Suitability: Striker
            </CardTitle>
            <CardDescription>
              Performance metrics for striker position
            </CardDescription>
          </div>
          <div className="flex items-center justify-between gap-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  triggerHaptic('selection');
                  setShowSimplified(true);
                }}
                className="text-sm flex items-center gap-2 bg-white/10 backdrop-blur-sm"
              >
                <BarChart3 className="h-4 w-4" />
                List View
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <Switch 
                id="show-benchmark" 
                checked={showBenchmark} 
                onCheckedChange={(checked) => {
                  triggerHaptic('light');
                  setShowBenchmark(checked);
                }}
              />
              <Label htmlFor="show-benchmark" className="text-sm whitespace-nowrap">
                Show Average
              </Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          <div className={isMobile ? 'order-2' : 'lg:col-span-2'}>
            <div 
              className="w-full rounded-xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm p-4 border border-primary/10"
              style={{
                height: isMobile ? '320px' : '380px',
                minHeight: isMobile ? '280px' : '320px'
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  data={chartData}
                  margin={{ 
                    top: isMobile ? 15 : 25, 
                    right: isMobile ? 15 : 25, 
                    bottom: isMobile ? 15 : 25, 
                    left: isMobile ? 15 : 25 
                  }}
                >
                  <PolarGrid 
                    stroke="rgba(212, 175, 55, 0.2)" 
                    strokeWidth={1}
                    radialLines={true}
                  />
                  <PolarAngleAxis 
                    dataKey="attribute" 
                    stroke="rgba(255, 255, 255, 0.8)" 
                    fontSize={isMobile ? 11 : 13}
                    tick={{ 
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: 500 
                    }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    stroke="rgba(212, 175, 55, 0.3)" 
                    fontSize={isMobile ? 10 : 12}
                    tick={{ 
                      fontSize: isMobile ? 10 : 12,
                      fill: "rgba(255, 255, 255, 0.6)"
                    }}
                    tickCount={isMobile ? 3 : 5}
                  />

                  <Radar
                    name={player?.name || "Player"}
                    dataKey="player"
                    stroke="#D4AF37"
                    fill="rgba(212, 175, 55, 0.2)"
                    fillOpacity={0.6}
                    strokeWidth={2.5}
                    dot={{ fill: "#D4AF37", strokeWidth: 2, r: 4 }}
                  />

                  {showBenchmark && positionalAverage && (
                    <Radar
                      name="Position Average"
                      dataKey="average"
                      stroke="rgba(59, 130, 246, 0.8)"
                      fill="rgba(59, 130, 246, 0.1)"
                      fillOpacity={0.4}
                      strokeWidth={2}
                      strokeDasharray="5,5"
                      dot={{ fill: "rgba(59, 130, 246, 0.8)", strokeWidth: 1, r: 3 }}
                    />
                  )}

                  {!isMobile && <Legend wrapperStyle={{ paddingTop: '20px' }} />}
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '12px',
                      fontSize: isMobile ? '12px' : '14px',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}
                    labelStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className={`space-y-4 ${isMobile ? 'order-1' : ''}`}>
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h3 className="text-primary text-lg font-bold mb-4">
                  Role Fit Score
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="truncate pr-2 font-medium">{player?.name || "Player"}</span>
                      <span className="font-bold text-lg text-primary">{playerScore}/100</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-700 ease-out" 
                        style={{ width: `${playerScore}%` }}
                      />
                    </div>
                  </div>
                  {showBenchmark && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Position Average</span>
                        <span className="font-bold text-blue-400">{averageScore}/100</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-700 ease-out" 
                          style={{ width: `${averageScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-primary/20">
                  <h4 className="text-primary font-semibold mb-3 text-sm">
                    Key Strengths
                  </h4>
                  <ul className="space-y-2">
                    {chartData
                      .filter(item => item.player > (showBenchmark ? item.average : 70))
                      .slice(0, 3)
                      .map((item, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/80 mr-3 flex-shrink-0" />
                          <span className="truncate">
                            {item.attribute} ({item.player})
                          </span>
                        </li>
                      ))
                    }
                    {chartData.filter(item => item.player > (showBenchmark ? item.average : 70)).length === 0 && (
                      <li className="text-muted-foreground text-sm">
                        Focus on skill development
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
