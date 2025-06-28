
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
      case 'excellent': return 'text-green-400 border-green-400/30';
      case 'above-average': return 'text-blue-400 border-blue-400/30';
      case 'average': return 'text-club-gold border-club-gold/30';
      case 'below-average': return 'text-orange-400 border-orange-400/30';
      default: return 'text-club-light-gray border-club-light-gray/30';
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
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-club-gold text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          League Benchmarks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {benchmarkItems.map(({ key, label, data }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-club-light-gray">{label}</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(data.status)} flex items-center gap-1`}
              >
                {getStatusIcon(data.status)}
                {data.status === 'no-data' ? 'No Data' : `${data.percentile}th`}
              </Badge>
            </div>
            <div className="space-y-1">
              <Progress 
                value={data.percentile} 
                className="h-2 bg-club-black"
              />
              <div className="flex justify-between text-xs text-club-light-gray/70">
                <span>Below Avg</span>
                <span>League Avg</span>
                <span>Top 10%</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-3 border-t border-club-gold/10">
          <p className="text-xs text-club-light-gray/60">
            Benchmarks based on {new Date().getFullYear()}-{(new Date().getFullYear() + 1).toString().slice(-2)} season data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
