
import React, { useState, useRef } from "react";
import { FootballPitch } from "./FootballPitch";
import { ShotPoint } from "./ShotPoint";
import { Shot } from "@/types/shot";
import { LoadingOverlay } from "../LoadingOverlay";
import { Loader, BarChart3, Target, ZoomIn, ZoomOut } from "lucide-react";
import { ResponsivePitch } from "@/components/ui/responsive-pitch";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";

interface ShotMapVisualizationProps {
  shots: Shot[];
  loading: boolean;
  filterLoading: boolean;
}

export const ShotMapVisualization = ({ shots, loading, filterLoading }: ShotMapVisualizationProps) => {
  const isMobile = useIsMobile();
  const [showSimplified, setShowSimplified] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
  const { triggerHaptic } = useHapticFeedback();

  const handleZoomIn = () => {
    triggerHaptic('light');
    setZoomLevel(prev => Math.min(prev * 1.3, 3));
  };

  const handleZoomOut = () => {
    triggerHaptic('light');
    setZoomLevel(prev => Math.max(prev / 1.3, 0.6));
  };

  const handleShotSelect = (shot: Shot) => {
    triggerHaptic('selection');
    setSelectedShot(selectedShot?.id === shot.id ? null : shot);
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-background to-background/80 rounded-xl relative min-h-[300px] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="flex space-x-2 justify-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Enhanced simplified view with iOS-style design
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
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Target className="h-5 w-5" />
            Shot Analysis
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              triggerHaptic('selection');
              setShowSimplified(false);
            }}
            className="text-sm bg-white/10 backdrop-blur-sm"
          >
            Show Map
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Shots", value: shotStats.total, color: "text-primary", bg: "bg-primary/10" },
            { label: "Goals", value: shotStats.goals, color: "text-green-600", bg: "bg-green-500/10" },
            { label: "Accuracy", value: `${accuracy}%`, color: "text-blue-600", bg: "bg-blue-500/10" },
            { label: "Conversion", value: `${conversionRate}%`, color: "text-orange-600", bg: "bg-orange-500/10" }
          ].map((stat, index) => (
            <Card key={index} className={`${stat.bg} border-primary/20 transition-all duration-300 active:scale-95`}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-2 p-4 bg-gradient-to-r from-card to-card/80 rounded-xl">
          <h4 className="font-medium mb-3">Shot Breakdown</h4>
          {[
            { label: "On Target", value: shotStats.onTarget, color: "bg-blue-500" },
            { label: "Blocked", value: shotStats.blocked, color: "bg-gray-500" },
            { label: "Missed", value: shotStats.missed, color: "bg-red-500" }
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm">{item.label}</span>
              </div>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isMobile && showSimplified) {
    return (
      <Card className="bg-gradient-to-br from-background to-background/80">
        <CardContent className="p-4">
          <SimplifiedShotView />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhanced mobile controls */}
      {isMobile && shots.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              triggerHaptic('selection');
              setShowSimplified(true);
            }}
            className="text-sm bg-white/10 backdrop-blur-sm flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Stats View
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="min-h-[44px] min-w-[44px] bg-white/10 backdrop-blur-sm"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="min-h-[44px] min-w-[44px] bg-white/10 backdrop-blur-sm"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ResponsivePitch 
        className="bg-gradient-to-br from-background to-background/80 rounded-xl overflow-hidden"
        showZoomControls={!isMobile}
        aspectRatio={3/2}
      >
        <LoadingOverlay isLoading={filterLoading} />
        
        <div 
          className="relative w-full h-full"
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <FootballPitch>
            {shots.map((shot) => (
              <ShotPoint 
                key={shot.id} 
                shot={shot}
                onSelect={() => handleShotSelect(shot)}
                isSelected={selectedShot?.id === shot.id}
                isMobile={isMobile}
              />
            ))}
          </FootballPitch>
        </div>

        {/* No shots message with enhanced styling */}
        {!loading && !filterLoading && shots.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-sm rounded-xl">
            <div className="text-center space-y-3 p-6 bg-card/80 backdrop-blur-sm rounded-xl border">
              <Target className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-foreground text-sm sm:text-base font-medium">
                No shots found
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Try adjusting your filter criteria
              </p>
            </div>
          </div>
        )}

        {/* Enhanced shot count indicator */}
        {shots.length > 0 && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-primary px-3 py-2 rounded-xl text-sm font-medium border border-primary/20">
            {shots.length} shot{shots.length !== 1 ? 's' : ''}
          </div>
        )}
      </ResponsivePitch>

      {/* Shot details bottom sheet */}
      {selectedShot && isMobile && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedShot.player_name}</h3>
                  <p className="text-muted-foreground text-sm">{selectedShot.minute}' - {selectedShot.outcome}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedShot(null)}
                  className="min-h-[44px] min-w-[44px]"
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <p className="text-lg font-bold text-primary">{selectedShot.distance || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">Distance (m)</p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <p className="text-lg font-bold text-primary">{selectedShot.period}</p>
                  <p className="text-sm text-muted-foreground">Period</p>
                </div>
              </div>
              
              {selectedShot.assisted_by && (
                <div className="p-3 bg-white/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Assisted by</p>
                  <p className="font-medium">{selectedShot.assisted_by}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
