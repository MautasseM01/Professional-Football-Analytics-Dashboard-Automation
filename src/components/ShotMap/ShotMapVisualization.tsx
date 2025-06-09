import React, { useState } from "react";
import { FootballPitch } from "./FootballPitch";
import { ShotPoint } from "./ShotPoint";
import { Shot } from "@/types/shot";
import { LoadingOverlay } from "../LoadingOverlay";
import { Loader, BarChart3, Target } from "lucide-react";
import { ResponsivePitch } from "@/components/ui/responsive-pitch";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ShotMapVisualizationProps {
  shots: Shot[];
  loading: boolean;
  filterLoading: boolean;
}

export const ShotMapVisualization = ({ shots, loading, filterLoading }: ShotMapVisualizationProps) => {
  const isMobile = useIsMobile();
  const [showSimplified, setShowSimplified] = useState(false);

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

  // Simplified mobile view for shot map
  const SimplifiedShotView = () => {
    if (shots.length === 0) return null;

    const shotStats = {
      total: shots.length,
      onTarget: shots.filter(s => s.outcome === 'Shot on Target').length,
      goals: shots.filter(s => s.outcome === 'Goal').length,
      blocked: shots.filter(s => s.outcome === 'Blocked Shot').length,
      missed: shots.filter(s => s.outcome === 'Shot Off Target').length
    };

    const accuracy = shotStats.total > 0 ? Math.round((shotStats.onTarget / shotStats.total) * 100) : 0;
    const conversionRate = shotStats.total > 0 ? Math.round((shotStats.goals / shotStats.total) * 100) : 0;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Shot Statistics
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSimplified(false)}
            className="text-xs"
          >
            Show Map
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card p-3 rounded-lg border text-center">
            <p className="text-2xl font-bold text-primary">{shotStats.total}</p>
            <p className="text-xs text-muted-foreground">Total Shots</p>
          </div>
          <div className="bg-card p-3 rounded-lg border text-center">
            <p className="text-2xl font-bold text-green-600">{shotStats.goals}</p>
            <p className="text-xs text-muted-foreground">Goals</p>
          </div>
          <div className="bg-card p-3 rounded-lg border text-center">
            <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div className="bg-card p-3 rounded-lg border text-center">
            <p className="text-2xl font-bold text-orange-600">{conversionRate}%</p>
            <p className="text-xs text-muted-foreground">Conversion</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">On Target</span>
            <span className="text-sm font-medium">{shotStats.onTarget}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Blocked</span>
            <span className="text-sm font-medium">{shotStats.blocked}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Missed</span>
            <span className="text-sm font-medium">{shotStats.missed}</span>
          </div>
        </div>
      </div>
    );
  };

  if (isMobile && showSimplified) {
    return (
      <Card className="bg-club-dark-gray">
        <CardContent className="p-4">
          <SimplifiedShotView />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {isMobile && shots.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSimplified(true)}
            className="text-xs flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Stats View
          </Button>
        </div>
      )}

      <ResponsivePitch 
        className="bg-club-dark-gray"
        showZoomControls={!isMobile}
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
