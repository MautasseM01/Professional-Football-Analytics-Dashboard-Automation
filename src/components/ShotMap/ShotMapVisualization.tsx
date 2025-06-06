
import React from "react";
import { FootballPitch } from "./FootballPitch";
import { ShotPoint } from "./ShotPoint";
import { Shot } from "@/types/shot";
import { LoadingOverlay } from "../LoadingOverlay";
import { Loader } from "lucide-react";
import { ResponsivePitch } from "@/components/ui/responsive-pitch";

interface ShotMapVisualizationProps {
  shots: Shot[];
  loading: boolean;
  filterLoading: boolean;
}

export const ShotMapVisualization = ({ shots, loading, filterLoading }: ShotMapVisualizationProps) => {
  if (loading) {
    return (
      <div className="w-full bg-club-dark-gray rounded-lg relative min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader className="h-6 w-6 sm:h-8 sm:w-8 text-club-gold animate-spin" />
          <p className="text-club-light-gray text-sm sm:text-base">Loading shot map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ResponsivePitch 
        className="bg-club-dark-gray"
        showZoomControls={true}
        aspectRatio={3/2}
      >
        <LoadingOverlay isLoading={filterLoading} />
        
        <FootballPitch>
          {shots.map((shot) => (
            <ShotPoint 
              key={shot.id} 
              shot={shot}
            />
          ))}
        </FootballPitch>

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
          <div className="absolute top-2 left-2 bg-club-black/70 text-club-gold px-2 py-1 rounded text-xs sm:text-sm font-medium">
            {shots.length} shot{shots.length !== 1 ? 's' : ''}
          </div>
        )}
      </ResponsivePitch>
    </div>
  );
};
