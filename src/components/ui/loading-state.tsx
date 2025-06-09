
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface LoadingStateProps {
  variant?: 'dashboard' | 'chart' | 'table' | 'grid' | 'profile';
  count?: number;
  className?: string;
}

export const LoadingState = ({ variant = 'dashboard', count = 3, className }: LoadingStateProps) => {
  const isMobile = useIsMobile();

  const renderSkeleton = () => {
    switch (variant) {
      case 'dashboard':
        return (
          <div className={`space-y-4 ${className}`}>
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-6 w-32' : 'h-8 w-48'}`} />
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-8 w-20' : 'h-10 w-24'}`} />
            </div>
            
            {/* Stats cards skeleton */}
            <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-club-dark-bg border-club-gold/20">
                  <CardContent className={isMobile ? "p-4" : "p-6"}>
                    <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-8 w-16' : 'h-10 w-20'} mb-2`} />
                    <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-full' : 'h-4 w-full'}`} />
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Content skeleton */}
            <Card className="bg-club-dark-bg border-club-gold/20">
              <CardHeader>
                <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-5 w-40' : 'h-6 w-48'}`} />
              </CardHeader>
              <CardContent>
                <Skeleton className={`bg-club-gold/10 w-full ${isMobile ? 'h-48' : 'h-64'}`} />
              </CardContent>
            </Card>
          </div>
        );

      case 'chart':
        return (
          <Card className={`bg-club-dark-bg border-club-gold/20 ${className}`}>
            <CardHeader>
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-5 w-32' : 'h-6 w-40'}`} />
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-48' : 'h-4 w-56'}`} />
            </CardHeader>
            <CardContent>
              <Skeleton className={`bg-club-gold/10 w-full ${isMobile ? 'h-48' : 'h-64'}`} />
            </CardContent>
          </Card>
        );

      case 'grid':
        return (
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <Card key={i} className="bg-club-dark-bg border-club-gold/20">
                <CardContent className={isMobile ? "p-4" : "p-6"}>
                  <div className="space-y-3">
                    <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-4 w-24' : 'h-5 w-32'}`} />
                    <Skeleton className={`bg-club-gold/10 w-full ${isMobile ? 'h-20' : 'h-24'}`} />
                    <div className="space-y-2">
                      <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-full' : 'h-4 w-full'}`} />
                      <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-3/4' : 'h-4 w-3/4'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'table':
        return (
          <Card className={`bg-club-dark-bg border-club-gold/20 ${className}`}>
            <CardContent className="p-0">
              <div className="space-y-0">
                {Array.from({ length: count }).map((_, i) => (
                  <div key={i} className={`flex items-center justify-between ${isMobile ? 'p-3' : 'p-4'} border-b border-club-gold/10 last:border-b-0`}>
                    <div className="flex items-center space-x-3">
                      <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-8 w-8' : 'h-10 w-10'} rounded-full`} />
                      <div className="space-y-1">
                        <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-20' : 'h-4 w-24'}`} />
                        <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-2 w-16' : 'h-3 w-20'}`} />
                      </div>
                    </div>
                    <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-6 w-12' : 'h-8 w-16'}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'profile':
        return (
          <Card className={`bg-club-dark-bg border-club-gold/20 ${className}`}>
            <CardContent className={isMobile ? "p-4" : "p-6"}>
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-16 w-16' : 'h-20 w-20'} rounded-full`} />
                <div className="space-y-2 flex-1">
                  <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-5 w-32' : 'h-6 w-40'}`} />
                  <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-24' : 'h-4 w-32'}`} />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-full' : 'h-4 w-full'}`} />
                <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-5/6' : 'h-4 w-5/6'}`} />
                <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-4/6' : 'h-4 w-4/6'}`} />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <Skeleton key={i} className={`bg-club-gold/10 w-full ${isMobile ? 'h-12' : 'h-16'}`} />
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
};
