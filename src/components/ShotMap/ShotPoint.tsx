
import React from "react";
import { Shot } from "@/types/shot";
import { Circle, CircleCheck, CircleX, Target, Square } from "lucide-react";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";

interface ShotPointProps {
  shot: Shot;
  size?: number;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const ShotPoint = ({ shot, size = 12, onSelect, isSelected = false }: ShotPointProps) => {
  const { triggerHaptic } = useHapticFeedback();

  // Ensure minimum touch target size (44px iOS standard)
  const touchTargetSize = Math.max(44, size * 2.5);
  const iconSize = Math.max(size, 16);

  // Map outcome to icon and color with iOS-style gradients
  const getShotIcon = () => {
    const baseProps = {
      size: iconSize,
      className: "drop-shadow-lg transition-all duration-200",
      style: { filter: isSelected ? 'brightness(1.2) scale(1.1)' : 'brightness(1)' }
    };

    switch (shot.outcome) {
      case "Goal":
        return <CircleCheck {...baseProps} className={`${baseProps.className} text-orange-500 fill-orange-500 stroke-white stroke-2`} />;
      case "Shot on Target":
        return <Target {...baseProps} className={`${baseProps.className} text-blue-500 fill-blue-500 stroke-white stroke-2`} />;
      case "Shot Off Target":
        return <CircleX {...baseProps} className={`${baseProps.className} text-gray-500 fill-gray-500 stroke-white stroke-2`} />;
      case "Blocked Shot":
        return <Square {...baseProps} className={`${baseProps.className} text-gray-600 fill-gray-600 stroke-white stroke-2`} />;
      default:
        return <Circle {...baseProps} className={`${baseProps.className} text-gray-400`} />;
    }
  };

  const handleClick = () => {
    triggerHaptic('medium');
    onSelect?.();
  };

  return (
    <div
      className="absolute cursor-pointer touch-manipulation transition-all duration-200 hover:scale-110 active:scale-95"
      style={{
        left: `${(shot.x_coordinate / 1050) * 100}%`,
        top: `${(shot.y_coordinate / 680) * 100}%`,
        transform: 'translate(-50%, -50%)',
        width: `${touchTargetSize}px`,
        height: `${touchTargetSize}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'transparent',
        backdropFilter: isSelected ? 'blur(10px)' : 'none',
        border: isSelected ? '2px solid rgba(255,255,255,0.5)' : 'none',
        zIndex: isSelected ? 20 : 10,
      }}
      onClick={handleClick}
      title={`${shot.player_name} - ${shot.outcome}`}
    >
      {getShotIcon()}
      
      {/* Selection ring animation */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-full border-2 border-white/60 animate-ping"
          style={{ animationDuration: '2s' }}
        />
      )}
    </div>
  );
};
