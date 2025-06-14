
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Eye, 
  EyeOff, 
  Minimize2, 
  Maximize2, 
  User,
  BarChart3,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

export type ViewMode = 'standard' | 'compact' | 'focus';

interface ViewToggleButtonProps {
  showPlayerIllustration: boolean;
  onTogglePlayerIllustration: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export const ViewToggleButton = ({
  showPlayerIllustration,
  onTogglePlayerIllustration,
  viewMode,
  onViewModeChange,
  className
}: ViewToggleButtonProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const viewModeOptions = [
    { value: 'standard', label: 'Standard', icon: BarChart3, tooltip: 'Show all information' },
    { value: 'compact', label: 'Compact', icon: Minimize2, tooltip: 'Hide less important details' },
    { value: 'focus', label: 'Focus', icon: Activity, tooltip: 'Focus on heatmap only' }
  ];

  if (isMobile) {
    // Mobile: Floating action button style
    return (
      <div className={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col gap-2",
        className
      )}>
        <TooltipProvider>
          {/* View Mode Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const modes: ViewMode[] = ['standard', 'compact', 'focus'];
                  const currentIndex = modes.indexOf(viewMode);
                  const nextIndex = (currentIndex + 1) % modes.length;
                  onViewModeChange(modes[nextIndex]);
                }}
                className={cn(
                  "h-12 w-12 rounded-full shadow-lg border-2 backdrop-blur-md transition-all duration-200 active:scale-95",
                  theme === 'dark'
                    ? "bg-club-black/90 border-club-gold/40 hover:border-club-gold/60 text-club-light-gray hover:bg-club-black"
                    : "bg-white/95 border-club-gold/50 hover:border-club-gold/70 text-gray-900 hover:bg-white"
                )}
              >
                {viewMode === 'standard' && <BarChart3 size={20} className="text-club-gold" />}
                {viewMode === 'compact' && <Minimize2 size={20} className="text-club-gold" />}
                {viewMode === 'focus' && <Activity size={20} className="text-club-gold" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Current: {viewMode} view</p>
              <p className="text-xs opacity-70">Tap to cycle</p>
            </TooltipContent>
          </Tooltip>

          {/* Player Toggle Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onTogglePlayerIllustration}
                className={cn(
                  "h-12 w-12 rounded-full shadow-lg border-2 backdrop-blur-md transition-all duration-200 active:scale-95",
                  theme === 'dark'
                    ? "bg-club-black/90 border-club-gold/40 hover:border-club-gold/60 text-club-light-gray hover:bg-club-black"
                    : "bg-white/95 border-club-gold/50 hover:border-club-gold/70 text-gray-900 hover:bg-white"
                )}
              >
                {showPlayerIllustration ? (
                  <User size={20} className="text-club-gold" />
                ) : (
                  <EyeOff size={20} className="text-club-gold" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{showPlayerIllustration ? 'Hide' : 'Show'} player avatar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Desktop: Inline controls
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TooltipProvider>
        {/* View Mode Toggle Group */}
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
          className="border rounded-lg p-1"
        >
          {viewModeOptions.map(({ value, icon: Icon, tooltip }) => (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value={value}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-1 transition-all duration-200",
                    theme === 'dark'
                      ? "data-[state=on]:bg-club-gold/20 data-[state=on]:text-club-gold hover:bg-club-gold/10"
                      : "data-[state=on]:bg-club-gold/20 data-[state=on]:text-club-gold hover:bg-club-gold/10"
                  )}
                >
                  <Icon size={14} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>

        {/* Player Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePlayerIllustration}
              className={cn(
                "h-8 w-8 p-1 transition-all duration-200 hover:bg-club-gold/20",
                theme === 'dark' ? "text-club-light-gray" : "text-gray-700"
              )}
            >
              {showPlayerIllustration ? (
                <Eye size={14} className="text-club-gold" />
              ) : (
                <EyeOff size={14} className="text-club-gold" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showPlayerIllustration ? 'Hide' : 'Show'} player avatar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
