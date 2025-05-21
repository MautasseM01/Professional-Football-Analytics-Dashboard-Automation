
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
}

export const ShotPoint = ({ shot, size = 6 }: ShotPointProps) => {
  // Map outcome to icon and color
  const getShotIcon = () => {
    switch (shot.outcome) {
      case "Goal":
        return <CircleCheck size={size} className="text-[#F97316] fill-[#F97316] stroke-white" />;
      case "Shot on Target":
        return <Target size={size} className="text-[#0EA5E9] fill-[#0EA5E9] stroke-white" />;
      case "Shot Off Target":
        return <CircleX size={size} className="text-[#888888] fill-[#888888] stroke-white" />;
      case "Blocked Shot":
        return <Square size={size} className="text-[#555555] fill-[#555555] stroke-white" />;
      default:
        return <Circle size={size} className="text-gray-400" />;
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `${(shot.x_coordinate / 1050) * 100}%`,
            top: `${(shot.y_coordinate / 680) * 100}%`,
          }}
        >
          {getShotIcon()}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="bg-club-dark-gray border-club-gold/30 text-club-light-gray w-64">
        <div className="space-y-2">
          <div className="border-b border-club-gold/20 pb-2">
            <span className="font-bold text-club-gold">{shot.player_name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-club-light-gray/70">Time:</div>
            <div>{shot.minute}' ({shot.period})</div>
            <div className="text-club-light-gray/70">Outcome:</div>
            <div className="font-semibold">
              <span 
                className={
                  shot.outcome === "Goal" ? "text-[#F97316]" :
                  shot.outcome === "Shot on Target" ? "text-[#0EA5E9]" :
                  "text-gray-300"
                }
              >
                {shot.outcome}
              </span>
            </div>
            {shot.assisted_by && (
              <>
                <div className="text-club-light-gray/70">Assisted by:</div>
                <div>{shot.assisted_by}</div>
              </>
            )}
            {shot.distance && (
              <>
                <div className="text-club-light-gray/70">Distance:</div>
                <div>{shot.distance} meters</div>
              </>
            )}
            <div className="text-club-light-gray/70">Match:</div>
            <div>{shot.match_name}</div>
            <div className="text-club-light-gray/70">Date:</div>
            <div>{new Date(shot.date).toLocaleDateString()}</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
