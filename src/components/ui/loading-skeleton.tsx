
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'chart' | 'heatmap' | 'profile' | 'stats';
  className?: string;
}

export const LoadingSkeleton = ({ variant = 'card', className }: LoadingSkeletonProps) => {
  const isMobile = useIsMobile();

  const renderSkeleton = () => {
    switch (variant) {
      case 'profile':
        return (
          <Card className={`bg-club-dark-bg border-club-gold/20 ${className}`}>
            <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
              <div className="flex items-center space-x-4">
                <Skeleton className={`rounded-full bg-club-gold/10 ${isMobile ? 'h-12 w-12' : 'h-16 w-16'}`} />
                <div className="space-y-2 flex-1">
                  <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-4 w-32' : 'h-5 w-40'}`} />
                  <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-24' : 'h-4 w-32'}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className={isMobile ? "pt-0" : ""}>
              <div className="space-y-2">
                <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-full' : 'h-4 w-full'}`} />
                <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-3/4' : 'h-4 w-3/4'}`} />
              </div>
            </CardContent>
          </Card>
        );

      case 'stats':
        return (
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} ${className}`}>
            {Array.from({ length: isMobile ? 4 : 4 }).map((_, i) => (
              <Card key={i} className="bg-club-dark-bg border-club-gold/20">
                <CardContent className={isMobile ? "p-4" : "p-6"}>
                  <div className="space-y-2">
                    <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-6 w-16' : 'h-8 w-20'}`} />
                    <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-full' : 'h-4 w-full'}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'chart':
        return (
          <Card className={`bg-club-dark-bg border-club-gold/20 ${className}`}>
            <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-4 w-40' : 'h-5 w-48'}`} />
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-32' : 'h-4 w-40'}`} />
            </CardHeader>
            <CardContent className={isMobile ? "pt-0" : ""}>
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-48' : 'h-64'} w-full`} />
            </CardContent>
          </Card>
        );

      case 'heatmap':
        return (
          <Card className={`bg-club-dark-bg border-club-gold/20 ${className}`}>
            <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-4 w-32' : 'h-5 w-40'}`} />
                  <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-40' : 'h-4 w-48'}`} />
                </div>
                <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-11 w-32' : 'h-10 w-40'}`} />
              </div>
            </CardHeader>
            <CardContent className={isMobile ? "pt-0" : ""}>
              <Skeleton 
                className={`bg-club-gold/10 w-full ${isMobile ? 'h-48' : 'h-80'}`}
                style={{ aspectRatio: isMobile ? '4/3' : '16/10' }}
              />
            </CardContent>
          </Card>
        );

      case 'table':
        return (
          <Card className={`bg-club-dark-bg border-club-gold/20 ${className}`}>
            <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-4 w-32' : 'h-5 w-40'}`} />
            </CardHeader>
            <CardContent className={isMobile ? "pt-0" : ""}>
              <div className="space-y-3">
                {Array.from({ length: isMobile ? 3 : 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-24' : 'h-4 w-32'}`} />
                    <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-16' : 'h-4 w-20'}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className={`bg-club-dark-bg border-club-gold/20 ${className}`}>
            <CardHeader className={isMobile ? "pb-2" : "pb-3"}>
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-4 w-32' : 'h-5 w-40'}`} />
              <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-48' : 'h-4 w-56'}`} />
            </CardHeader>
            <CardContent className={isMobile ? "pt-0" : ""}>
              <div className="space-y-3">
                <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-24' : 'h-32'} w-full`} />
                <div className="space-y-2">
                  <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-full' : 'h-4 w-full'}`} />
                  <Skeleton className={`bg-club-gold/10 ${isMobile ? 'h-3 w-3/4' : 'h-4 w-3/4'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return renderSkeleton();
};
