
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DataLoadingSkeletonProps {
  count?: number;
  showHeader?: boolean;
  className?: string;
}

export const DataLoadingSkeleton = ({ 
  count = 1, 
  showHeader = true, 
  className = "" 
}: DataLoadingSkeletonProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`skeleton-${index}`} className="bg-club-dark-gray/50 border-club-gold/20">
          {showHeader && (
            <CardHeader className="pb-3">
              <div className="animate-pulse">
                <div className="h-6 bg-club-gold/20 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-club-gold/10 rounded w-1/2"></div>
              </div>
            </CardHeader>
          )}
          <CardContent>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-club-gold/20 rounded"></div>
              <div className="h-4 bg-club-gold/20 rounded w-3/4"></div>
              <div className="h-4 bg-club-gold/20 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
