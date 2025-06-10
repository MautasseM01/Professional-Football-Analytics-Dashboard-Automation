
import React from "react";
import { Shot } from "@/types/shot";
import { Circle, CircleCheck, CircleX, Target, Square } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ShotPointProps {
  shot: Shot;
  size?: number;
  onSelect?: () => void;
  isSelected?: boolean;
  isMobile?: boolean;
}

export const ShotPoint = ({ 
  shot, 
  size = 8, 
  onSelect, 
  isSelected = false, 
  isMobile = false 
}: ShotPointProps) => {
  // Enhanced responsive size with iOS touch standards
  const getResponsiveSize = () => {
    if (isMobile) {
      return Math.max(size + 8, 16); // Larger for mobile touch
    }
    return Math.max(size + 2, 10);
  };

  const responsiveSize = getResponsiveSize();

  // Enhanced shot icon with better styling
  const getShotIcon = () => {
    const iconProps = {
      size: responsiveSize,
      className: `transition-all duration-200 ${isSelected ? 'scale-125' : 'scale-100'}`,
      style: {
        filter: isSelected ? 'drop-shadow(0 0 8px currentColor)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }
    };

    switch (shot.outcome) {
      case "Goal":
        return <CircleCheck {...iconProps} className={`${iconProps.className} text-[#F97316] fill-[#F97316] stroke-white`} />;
      case "Shot on Target":
        return <Target {...iconProps} className={`${iconProps.className} text-[#0EA5E9] fill-[#0EA5E9] stroke-white`} />;
      case "Shot Off Target":
        return <CircleX {...iconProps} className={`${iconProps.className} text-[#888888] fill-[#888888] stroke-white`} />;
      case "Blocked Shot":
        return <Square {...iconProps} className={`${iconProps.className} text-[#555555] fill-[#555555] stroke-white`} />;
      default:
        return <Circle {...iconProps} className={`${iconProps.className} text-gray-400`} />;
    }
  };

  const shotElement = (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-manipulation transition-all duration-200 ${
        isSelected ? 'z-20' : 'z-10'
      } ${isMobile ? 'active:scale-90' : 'hover:scale-110'}`}
      style={{
        left: `${(shot.x_coordinate / 1050) * 100}%`,
        top: `${(shot.y_coordinate / 680) * 100}%`,
        // Enhanced touch target for mobile
        padding: isMobile ? '8px' : '4px',
        margin: isMobile ? '-8px' : '-4px',
        borderRadius: '50%',
        background: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
        backdropFilter: isSelected ? 'blur(4px)' : 'none',
      }}
      onClick={isMobile ? onSelect : undefined}
    >
      {getShotIcon()}
    </div>
  );

  // For mobile, return just the element with click handler
  if (isMobile) {
    return shotElement;
  }

  // For desktop, wrap with hover card
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {shotElement}
      </HoverCardTrigger>
      <HoverCardContent className="bg-card/95 backdrop-blur-sm border-primary/20 text-foreground w-64 shadow-xl">
        <div className="space-y-3">
          <div className="border-b border-primary/20 pb-2">
            <span className="font-bold text-primary text-base">{shot.player_name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Time:</div>
            <div>{shot.minute}' ({shot.period})</div>
            <div className="text-muted-foreground">Outcome:</div>
            <div className="font-semibold">
              <span 
                className={
                  shot.outcome === "Goal" ? "text-[#F97316]" :
                  shot.outcome === "Shot on Target" ? "text-[#0EA5E9]" :
                  "text-muted-foreground"
                }
              >
                {shot.outcome}
              </span>
            </div>
            {shot.assisted_by && (
              <>
                <div className="text-muted-foreground">Assisted by:</div>
                <div>{shot.assisted_by}</div>
              </>
            )}
            {shot.distance && (
              <>
                <div className="text-muted-foreground">Distance:</div>
                <div>{shot.distance} meters</div>
              </>
            )}
            <div className="text-muted-foreground">Match:</div>
            <div className="truncate">{shot.match_name}</div>
            <div className="text-muted-foreground">Date:</div>
            <div>{new Date(shot.date).toLocaleDateString()}</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
