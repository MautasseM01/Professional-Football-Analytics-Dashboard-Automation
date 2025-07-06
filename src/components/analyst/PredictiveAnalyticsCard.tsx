
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
      case 'improving': return 'text-emerald-400 border-emerald-400/30';
      case 'declining': return 'text-rose-400 border-rose-400/30';
      default: return 'text-primary border-primary/30';
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
      case 'high': return 'text-rose-400 border-rose-400/30';
      case 'medium': return 'text-amber-400 border-amber-400/30';
      default: return 'text-emerald-400 border-emerald-400/30';
    }
  };

  return (
    <Card className="bg-card border-border hover:bg-muted/20 transition-all duration-300">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <CardTitle className="text-primary text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
        {/* Current Form */}
        <div className="space-y-3 p-3 rounded-lg bg-muted/10 border border-muted/20">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Current Form</span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-primary">
                {metrics.currentForm.toFixed(1)}
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getFormTrendColor(metrics.formTrend)} flex items-center gap-1 min-h-[var(--touch-target-min)] px-3`}
              >
                {getFormTrendIcon(metrics.formTrend)}
                <span className="font-medium capitalize">{metrics.formTrend}</span>
              </Badge>
            </div>
          </div>
          <Progress value={metrics.currentForm * 10} className="h-3 bg-muted" />
        </div>

        {/* Injury Risk */}
        <div className="space-y-3 p-3 rounded-lg bg-muted/10 border border-muted/20">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Injury Risk Assessment
            </span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getRiskColor(metrics.injuryRisk)} font-medium min-h-[var(--touch-target-min)] px-3`}
            >
              {metrics.injuryRisk.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Next Match Projection */}
        <div className="space-y-3 p-3 rounded-lg bg-muted/10 border border-muted/20">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Next Match Projection
            </span>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">
                {metrics.nextMatchProjection.rating}
              </div>
              <div className="text-xs text-muted-foreground">
                {metrics.nextMatchProjection.confidence}% confidence
              </div>
            </div>
          </div>
          <Progress 
            value={metrics.nextMatchProjection.confidence} 
            className="h-2 bg-muted" 
          />
        </div>

        {/* Season Projections */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-primary">Season Projections</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/10 border border-muted/20">
              <div className="text-2xl font-bold text-primary mb-1">
                {metrics.seasonProjection.goals}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Goals</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/10 border border-muted/20">
              <div className="text-2xl font-bold text-primary mb-1">
                {metrics.seasonProjection.assists}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Assists</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/10 border border-muted/20">
              <div className="text-2xl font-bold text-primary mb-1">
                {metrics.seasonProjection.rating}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center italic">
            Projections based on recent performance trends and historical data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
