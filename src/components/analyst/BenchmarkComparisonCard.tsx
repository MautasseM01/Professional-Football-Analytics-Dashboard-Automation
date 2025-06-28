
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
    { key: 'rating', label: isMobile ? 'Rating' : 'Match Rating', data: benchmarks.rating },
    { key: 'passAccuracy', label: isMobile ? 'Pass %' : 'Pass Accuracy', data: benchmarks.passAccuracy }
  ];

  return (
    <Card className="bg-club-dark-gray border-club-gold/20 touch-manipulation">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-club-gold text-base sm:text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className={isMobile ? "text-sm" : ""}>League Benchmarks</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1 space-y-2' : 'space-y-4'}`}>
          {benchmarkItems.map(({ key, label, data }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-club-light-gray ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {label}
                </span>
                <Badge 
                  variant="outline" 
                  className={`${isMobile ? 'text-xs px-2 py-0.5' : 'text-xs'} ${getStatusColor(data.status)} flex items-center gap-1`}
                >
                  {getStatusIcon(data.status)}
                  {data.status === 'no-data' ? 'No Data' : `${data.percentile}th`}
                </Badge>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={data.percentile} 
                  className={`bg-club-black ${isMobile ? 'h-1.5' : 'h-2'}`}
                />
                <div className={`flex justify-between text-club-light-gray/70 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  <span>Below</span>
                  <span>Average</span>
                  <span>Top 10%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-3 border-t border-club-gold/10 mt-4">
          <p className={`text-club-light-gray/60 ${isMobile ? 'text-xs' : 'text-xs'}`}>
            Benchmarks based on {new Date().getFullYear()}-{(new Date().getFullYear() + 1).toString().slice(-2)} season data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
