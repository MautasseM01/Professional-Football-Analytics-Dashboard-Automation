
import React from 'react';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { Loader, ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  enabled?: boolean;
  threshold?: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  enabled = true,
  threshold = 100
}) => {
  const isMobile = useIsMobile();
  const { 
    isRefreshing, 
    pullDistance, 
    isPulling, 
    bindToElement, 
    shouldShowIndicator 
  } = usePullToRefresh({ onRefresh, threshold, enabled: enabled && isMobile });

  const refreshProgress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div 
      ref={bindToElement}
      className="relative w-full h-full overflow-hidden"
      style={{
        transform: isPulling ? `translateY(${Math.min(pullDistance * 0.5, 50)}px)` : 'none',
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Pull indicator */}
      {shouldShowIndicator && isMobile && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-50 bg-club-black/90 text-club-gold"
          style={{
            height: '60px',
            transform: `translateY(-60px) translateY(${Math.min(pullDistance * 0.8, 60)}px)`,
            transition: isRefreshing ? 'transform 0.3s ease-out' : 'none'
          }}
        >
          <div className="flex items-center space-x-2">
            {isRefreshing ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Refreshing...</span>
              </>
            ) : (
              <>
                <ArrowDown 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    shouldTrigger ? 'rotate-180' : ''
                  }`}
                  style={{
                    transform: `rotate(${refreshProgress * 180}deg)`
                  }}
                />
                <span className="text-sm font-medium">
                  {shouldTrigger ? 'Release to refresh' : 'Pull to refresh'}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
};
