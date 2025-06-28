
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
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-club-gold text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Form */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-club-light-gray">Current Form</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-club-gold">
                {metrics.currentForm.toFixed(1)}
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getFormTrendColor(metrics.formTrend)} flex items-center gap-1`}
              >
                {getFormTrendIcon(metrics.formTrend)}
                {metrics.formTrend}
              </Badge>
            </div>
          </div>
          <Progress value={metrics.currentForm * 10} className="h-2 bg-club-black" />
        </div>

        {/* Injury Risk */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-club-light-gray flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Injury Risk
            </span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getRiskColor(metrics.injuryRisk)}`}
            >
              {metrics.injuryRisk.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Next Match Projection */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-club-light-gray flex items-center gap-1">
              <Target className="h-4 w-4" />
              Next Match
            </span>
            <div className="text-right">
              <div className="text-lg font-bold text-club-gold">
                {metrics.nextMatchProjection.rating}
              </div>
              <div className="text-xs text-club-light-gray/70">
                {metrics.nextMatchProjection.confidence}% confidence
              </div>
            </div>
          </div>
          <Progress 
            value={metrics.nextMatchProjection.confidence} 
            className="h-1 bg-club-black" 
          />
        </div>

        {/* Season Projections */}
        <div className="space-y-3 pt-3 border-t border-club-gold/10">
          <h4 className="text-sm font-medium text-club-gold">Season Projections</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-club-gold">
                {metrics.seasonProjection.goals}
              </div>
              <div className="text-xs text-club-light-gray/70">Goals</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-club-gold">
                {metrics.seasonProjection.assists}
              </div>
              <div className="text-xs text-club-light-gray/70">Assists</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-club-gold">
                {metrics.seasonProjection.rating}
              </div>
              <div className="text-xs text-club-light-gray/70">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-club-gold/10">
          <p className="text-xs text-club-light-gray/60">
            Projections based on recent performance trends and historical data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
