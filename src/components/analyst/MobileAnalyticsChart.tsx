
import React, { useMemo } from 'react';
import { ResponsiveChartContainer } from '../ResponsiveChartContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOrientation } from '@/hooks/use-orientation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MobileAnalyticsChartProps {
  title: string;
  description?: string;
  children: React.ReactElement;
  allowZoom?: boolean;
  allowReset?: boolean;
  className?: string;
}

export const MobileAnalyticsChart = ({
  title,
  description,
  children,
  allowZoom = true,
  allowReset = false,
  className = ""
}: MobileAnalyticsChartProps) => {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  const [zoomLevel, setZoomLevel] = React.useState(1);

  const chartHeight = useMemo(() => {
    if (!isMobile) return 400;
    return orientation === 'landscape' ? 280 : 320;
  }, [isMobile, orientation]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleReset = () => {
    setZoomLevel(1);
  };

  return (
    <Card className={`bg-club-dark-gray border-club-gold/20 ${className}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-club-gold text-sm sm:text-base">
              {title}
            </CardTitle>
            {description && (
              <p className="text-xs text-club-light-gray/70 mt-1">
                {description}
              </p>
            )}
          </div>
          
          {isMobile && (allowZoom || allowReset) && (
            <div className="flex gap-1">
              {allowZoom && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    className="h-8 w-8 p-0 text-club-light-gray hover:text-club-gold"
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    className="h-8 w-8 p-0 text-club-light-gray hover:text-club-gold"
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </>
              )}
              {allowReset && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0 text-club-light-gray hover:text-club-gold"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {isMobile ? (
          <ScrollArea className="w-full">
            <div 
              style={{ 
                height: `${chartHeight}px`,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                width: `${100 / zoomLevel}%`,
                minWidth: '100%'
              }}
            >
              <ResponsiveChartContainer
                minHeight={chartHeight}
                className="w-full h-full"
              >
                {children}
              </ResponsiveChartContainer>
            </div>
          </ScrollArea>
        ) : (
          <ResponsiveChartContainer
            minHeight={chartHeight}
            className="w-full"
          >
            {children}
          </ResponsiveChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
