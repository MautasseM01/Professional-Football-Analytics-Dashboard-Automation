
import React from "react";
import { FootballPitch } from "./FootballPitch";
import { ShotPoint } from "./ShotPoint";
import { Shot } from "@/types/shot";
import { LoadingOverlay } from "../LoadingOverlay";
import { Loader, RotateCcw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useResponsiveBreakpoint } from "@/hooks/use-orientation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShotMapVisualizationProps {
  shots: Shot[];
  loading: boolean;
  filterLoading: boolean;
}

export const ShotMapVisualization = ({ shots, loading, filterLoading }: ShotMapVisualizationProps) => {
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveBreakpoint();

  // Responsive container styling
  const getContainerClasses = () => {
    const baseClasses = "w-full bg-club-dark-gray rounded-lg relative transition-all duration-300 ease-in-out";
    
    if (breakpoint === 'mobile') {
      return `${baseClasses} p-3 min-h-[250px]`;
    }
    if (breakpoint === 'tablet-portrait') {
      return `${baseClasses} p-4 min-h-[350px]`;
    }
    if (breakpoint === 'tablet-landscape') {
      return `${baseClasses} p-5 min-h-[450px]`;
    }
    return `${baseClasses} p-6 min-h-[500px]`;
  };

  // Responsive pitch dimensions
  const getPitchDimensions = () => {
    if (typeof window === 'undefined') return { width: 800, height: 500 };
    
    const screenWidth = window.innerWidth;
    
    if (breakpoint === 'mobile') {
      return {
        width: Math.min(screenWidth - 40, 320),
        height: Math.min((screenWidth - 40) * 0.625, 200)
      };
    }
    if (breakpoint === 'tablet-portrait') {
      return {
        width: Math.min(screenWidth - 80, 600),
        height: Math.min((screenWidth - 80) * 0.625, 375)
      };
    }
    if (breakpoint === 'tablet-landscape') {
      return {
        width: Math.min(screenWidth - 100, 800),
        height: Math.min((screenWidth - 100) * 0.625, 500)
      };
    }
    return {
      width: Math.min(screenWidth - 120, 1000),
      height: Math.min((screenWidth - 120) * 0.625, 625)
    };
  };

  if (loading) {
    return (
      <div className={getContainerClasses()}>
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center space-y-3">
            <Loader className="h-6 w-6 sm:h-8 sm:w-8 text-club-gold animate-spin" />
            <p className="text-club-light-gray text-sm sm:text-base">Loading shot map...</p>
          </div>
        </div>
      </div>
    );
  }

  const pitchDimensions = getPitchDimensions();

  return (
    <div className="space-y-3">
      {/* Mobile orientation suggestion */}
      {isMobile && (
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <RotateCcw className="h-4 w-4" />
          <AlertDescription className="text-club-light-gray text-xs sm:text-sm">
            For better viewing, try rotating your device to landscape mode
          </AlertDescription>
        </Alert>
      )}
      
      <div className={getContainerClasses()}>
        <LoadingOverlay isLoading={filterLoading} />
        
        {/* Responsive pitch container */}
        <div className="flex justify-center items-center w-full h-full">
          <div 
            className="max-w-full max-h-full"
            style={{
              width: pitchDimensions.width,
              height: pitchDimensions.height,
              minWidth: breakpoint === 'mobile' ? '280px' : '400px',
              minHeight: breakpoint === 'mobile' ? '175px' : '250px'
            }}
          >
            <FootballPitch>
              {shots.map((shot) => (
                <ShotPoint 
                  key={shot.id} 
                  shot={shot}
                />
              ))}
            </FootballPitch>
          </div>
        </div>

        {/* No shots message */}
        {!loading && !filterLoading && shots.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-club-dark-gray/50 rounded-lg">
            <div className="text-center space-y-2 p-4">
              <p className="text-club-light-gray text-sm sm:text-base">
                No shots found for the selected filters
              </p>
              <p className="text-club-light-gray/60 text-xs sm:text-sm">
                Try adjusting your filter criteria
              </p>
            </div>
          </div>
        )}

        {/* Shot count indicator */}
        {shots.length > 0 && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-club-black/70 text-club-gold px-2 py-1 rounded text-xs sm:text-sm font-medium">
            {shots.length} shot{shots.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};
