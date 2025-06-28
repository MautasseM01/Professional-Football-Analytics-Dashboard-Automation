
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Activity,
  Zap
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PredictiveMetrics {
  currentForm: number;
  formTrend: 'improving' | 'declining' | 'stable';
  injuryRisk: 'low' | 'medium' | 'high';
  nextMatchProjection: { rating: number; confidence: number };
  seasonProjection: { goals: number; assists: number; rating: number };
}

interface PredictiveAnalyticsCardProps {
  metrics: PredictiveMetrics;
}

export const PredictiveAnalyticsCard = ({ metrics }: PredictiveAnalyticsCardProps) => {
  const isMobile = useIsMobile();
  
  const getFormTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-400 border-green-400/30';
      case 'declining': return 'text-red-400 border-red-400/30';
      default: return 'text-club-gold border-club-gold/30';
    }
  };

  const getFormTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-3 w-3" />;
      case 'declining': return <TrendingDown className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 border-red-400/30';
      case 'medium': return 'text-orange-400 border-orange-400/30';
      default: return 'text-green-400 border-green-400/30';
    }
  };

  return (
    <Card className="bg-club-dark-gray border-club-gold/20 touch-manipulation">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-club-gold text-base sm:text-lg font-semibold flex items-center gap-2">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className={isMobile ? "text-sm" : ""}>Predictive Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className={`space-y-${isMobile ? '4' : '6'}`}>
          {/* Current Form */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-club-light-gray ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Current Form
              </span>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-club-gold ${isMobile ? 'text-base' : 'text-lg'}`}>
                  {metrics.currentForm.toFixed(1)}
                </span>
                <Badge 
                  variant="outline" 
                  className={`${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'} ${getFormTrendColor(metrics.formTrend)} flex items-center gap-1`}
                >
                  {getFormTrendIcon(metrics.formTrend)}
                  {isMobile ? metrics.formTrend.slice(0, 3) : metrics.formTrend}
                </Badge>
              </div>
            </div>
            <Progress value={metrics.currentForm * 10} className={`bg-club-black ${isMobile ? 'h-1.5' : 'h-2'}`} />
          </div>

          {/* Injury Risk */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-club-light-gray flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <AlertTriangle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                Injury Risk
              </span>
              <Badge 
                variant="outline" 
                className={`${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'} ${getRiskColor(metrics.injuryRisk)}`}
              >
                {metrics.injuryRisk.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Next Match Projection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-club-light-gray flex items-center gap-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <Target className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                Next Match
              </span>
              <div className="text-right">
                <div className={`font-bold text-club-gold ${isMobile ? 'text-base' : 'text-lg'}`}>
                  {metrics.nextMatchProjection.rating}
                </div>
                <div className={`text-club-light-gray/70 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  {metrics.nextMatchProjection.confidence}% confidence
                </div>
              </div>
            </div>
            <Progress 
              value={metrics.nextMatchProjection.confidence} 
              className={`bg-club-black ${isMobile ? 'h-1' : 'h-1'}`}
            />
          </div>

          {/* Season Projections */}
          <div className={`space-y-3 pt-3 border-t border-club-gold/10`}>
            <h4 className={`font-medium text-club-gold ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Season Projections
            </h4>
            <div className={`grid grid-cols-3 gap-${isMobile ? '2' : '4'}`}>
              <div className="text-center">
                <div className={`font-bold text-club-gold ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  {metrics.seasonProjection.goals}
                </div>
                <div className={`text-club-light-gray/70 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  Goals
                </div>
              </div>
              <div className="text-center">
                <div className={`font-bold text-club-gold ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  {metrics.seasonProjection.assists}
                </div>
                <div className={`text-club-light-gray/70 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  Assists
                </div>
              </div>
              <div className="text-center">
                <div className={`font-bold text-club-gold ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  {metrics.seasonProjection.rating}
                </div>
                <div className={`text-club-light-gray/70 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  Avg Rating
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-club-gold/10">
            <p className={`text-club-light-gray/60 ${isMobile ? 'text-xs' : 'text-xs'}`}>
              Projections based on recent performance trends and historical data
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
