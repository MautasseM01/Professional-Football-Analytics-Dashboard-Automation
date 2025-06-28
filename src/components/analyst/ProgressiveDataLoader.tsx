
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface DataLoadingStage {
  name: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
  progress: number;
  message?: string;
}

interface ProgressiveDataLoaderProps {
  stages: DataLoadingStage[];
  title?: string;
  className?: string;
}

export const ProgressiveDataLoader = ({ 
  stages, 
  title = "Loading Analytics Data",
  className 
}: ProgressiveDataLoaderProps) => {
  const overallProgress = stages.reduce((sum, stage) => sum + stage.progress, 0) / stages.length;
  const hasError = stages.some(stage => stage.status === 'error');
  const isComplete = stages.every(stage => stage.status === 'complete');

  const getStageIcon = (stage: DataLoadingStage) => {
    switch (stage.status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'loading':
        return <Clock className="h-4 w-4 text-club-gold animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-club-gold/30" />;
    }
  };

  const getStageColor = (stage: DataLoadingStage) => {
    switch (stage.status) {
      case 'complete':
        return 'text-green-400';
      case 'loading':
        return 'text-club-gold';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-club-light-gray/60';
    }
  };

  return (
    <Card className={`bg-club-dark-gray border-club-gold/20 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-club-gold flex items-center gap-2">
          {hasError ? (
            <AlertCircle className="h-5 w-5 text-red-400" />
          ) : isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <Clock className="h-5 w-5 text-club-gold animate-pulse" />
          )}
          {title}
        </CardTitle>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-club-light-gray/70">
              Overall Progress
            </span>
            <span className="text-sm text-club-gold font-medium">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-2 bg-club-black/50"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {stages.map((stage, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStageIcon(stage)}
                <span className={`text-sm font-medium ${getStageColor(stage)}`}>
                  {stage.name}
                </span>
              </div>
              <span className="text-xs text-club-light-gray/60">
                {stage.progress}%
              </span>
            </div>
            
            {stage.status === 'loading' && (
              <Progress 
                value={stage.progress} 
                className="h-1 bg-club-black/30"
              />
            )}
            
            {stage.message && (
              <p className="text-xs text-club-light-gray/60 ml-7">
                {stage.message}
              </p>
            )}
          </div>
        ))}

        {/* Skeleton placeholders for loading states */}
        {stages.some(stage => stage.status === 'loading') && (
          <div className="space-y-3 pt-4 border-t border-club-gold/10">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-club-gold/20" />
              <Skeleton className="h-4 w-1/2 bg-club-gold/10" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-20 bg-club-gold/10" />
              <Skeleton className="h-20 bg-club-gold/10" />
              <Skeleton className="h-20 bg-club-gold/10" />
            </div>
          </div>
        )}

        {hasError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-4">
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Some data failed to load. Please try refreshing.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
