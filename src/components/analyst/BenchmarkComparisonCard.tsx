
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

interface BenchmarkData {
  percentile: number;
  status: 'excellent' | 'above-average' | 'average' | 'below-average' | 'no-data';
}

interface BenchmarkComparisonCardProps {
  benchmarks: {
    goals: BenchmarkData;
    assists: BenchmarkData;
    rating: BenchmarkData;
    passAccuracy: BenchmarkData;
  };
}

export const BenchmarkComparisonCard = ({ benchmarks }: BenchmarkComparisonCardProps) => {
  const getStatusColor = (status: BenchmarkData['status']) => {
    switch (status) {
      case 'excellent': return 'text-emerald-400 border-emerald-400/30';
      case 'above-average': return 'text-sky-400 border-sky-400/30';
      case 'average': return 'text-primary border-primary/30';
      case 'below-average': return 'text-amber-400 border-amber-400/30';
      default: return 'text-muted-foreground border-muted/30';
    }
  };

  const getStatusIcon = (status: BenchmarkData['status']) => {
    switch (status) {
      case 'excellent':
      case 'above-average': 
        return <TrendingUp className="h-3 w-3" />;
      case 'below-average': 
        return <TrendingDown className="h-3 w-3" />;
      default: 
        return <Minus className="h-3 w-3" />;
    }
  };

  const benchmarkItems = [
    { key: 'goals', label: 'Goals', data: benchmarks.goals },
    { key: 'assists', label: 'Assists', data: benchmarks.assists },
    { key: 'rating', label: 'Match Rating', data: benchmarks.rating },
    { key: 'passAccuracy', label: 'Pass Accuracy', data: benchmarks.passAccuracy }
  ];

  return (
    <Card className="bg-card border-border hover:bg-muted/20 transition-all duration-300">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <CardTitle className="text-primary text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          League Benchmarks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
        {benchmarkItems.map(({ key, label, data }) => (
          <div 
            key={key} 
            className="space-y-3 p-3 rounded-lg bg-muted/10 border border-muted/20 hover:bg-muted/20 transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{label}</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(data.status)} flex items-center gap-1 min-h-[var(--touch-target-min)] px-3`}
              >
                {getStatusIcon(data.status)}
                <span className="font-medium">
                  {data.status === 'no-data' ? 'No Data' : `${data.percentile}th`}
                </span>
              </Badge>
            </div>
            <div className="space-y-2">
              <Progress 
                value={data.percentile} 
                className="h-3 bg-muted"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Below Avg</span>
                <span className="font-medium">League Avg</span>
                <span>Top 10%</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Benchmarks based on {new Date().getFullYear()}-{(new Date().getFullYear() + 1).toString().slice(-2)} season data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
