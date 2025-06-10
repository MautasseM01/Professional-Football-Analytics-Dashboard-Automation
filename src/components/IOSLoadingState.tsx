
import React from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { TouchFeedbackButton } from './TouchFeedbackButton';

interface IOSLoadingStateProps {
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children?: React.ReactNode;
  className?: string;
  skeletonRows?: number;
}

export const IOSLoadingState = ({
  isLoading,
  error,
  onRetry,
  children,
  className,
  skeletonRows = 3
}: IOSLoadingStateProps) => {
  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Something went wrong
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
            {error}
          </p>
        </div>
        {onRetry && (
          <TouchFeedbackButton
            variant="outline"
            className="bg-white/50 dark:bg-slate-800/50"
            onClick={onRetry}
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </TouchFeedbackButton>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4 p-4", className)}>
        {/* Skeleton animation */}
        {Array.from({ length: skeletonRows }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-4 bg-gray-200/60 dark:bg-gray-700/60 rounded-xl animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200/60 dark:bg-gray-700/60 rounded-2xl animate-pulse" />
              <div className="h-20 bg-gray-200/60 dark:bg-gray-700/60 rounded-2xl animate-pulse" />
              <div className="h-20 bg-gray-200/60 dark:bg-gray-700/60 rounded-2xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <>{children}</>;
};
