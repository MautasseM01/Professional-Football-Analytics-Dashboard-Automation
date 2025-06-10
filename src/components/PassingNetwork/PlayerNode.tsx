
import React from "react";
import { PlayerPosition } from "./types";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";

interface PlayerNodeProps {
  player: PlayerPosition;
  x: number;
  y: number;
  onSelect?: () => void;
  isSelected?: boolean;
  detailLevel?: 'overview' | 'detailed';
}

const PlayerNode: React.FC<PlayerNodeProps> = ({ 
  player, 
  x, 
  y, 
  onSelect,
  isSelected = false,
  detailLevel = 'overview'
}) => {
  const { triggerHaptic } = useHapticFeedback();

  // Determine color based on position with iOS-style gradients
  const getPositionColor = (position: string): { bg: string; border: string } => {
    switch (position.toLowerCase()) {
      case "goalkeeper":
        return { 
          bg: "linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)", 
          border: "#FF8F00" 
        };
      case "defender":
        return { 
          bg: "linear-gradient(135deg, #2196F3 0%, #1565C0 100%)", 
          border: "#1565C0" 
        };
      case "midfielder":
        return { 
          bg: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", 
          border: "#2E7D32" 
        };
      case "forward":
        return { 
          bg: "linear-gradient(135deg, #F44336 0%, #C62828 100%)", 
          border: "#C62828" 
        };
      default:
        return { 
          bg: "linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)", 
          border: "#6A1B9A" 
        };
    }
  };

  // Touch-optimized node size (minimum 44px for iOS standards)
  const nodeSize = Math.max(44, detailLevel === 'detailed' ? 56 : 48);
  const colors = getPositionColor(player.position || "unknown");
  
  const handleClick = () => {
    triggerHaptic('medium');
    onSelect?.();
  };

  return (
    <>
      {/* Player node with iOS-style design */}
      <div
        style={{
          position: "absolute",
          left: `${x - nodeSize / 2}px`,
          top: `${y - nodeSize / 2}px`,
          width: `${nodeSize}px`,
          height: `${nodeSize}px`,
          background: colors.bg,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: nodeSize > 48 ? "16px" : "14px",
          border: `3px solid ${isSelected ? '#FFFFFF' : colors.border}`,
          boxShadow: isSelected 
            ? `0 0 20px ${colors.border}40, 0 8px 32px rgba(0,0,0,0.3)` 
            : "0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)",
          zIndex: isSelected ? 20 : 10,
          cursor: "pointer",
          touchAction: "manipulation",
          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
        }}
        className="transition-all duration-300 ease-out hover:scale-110 active:scale-95"
        onClick={handleClick}
        title={`${player.name} (${player.position || 'Unknown'})`}
      >
        {player.number || '?'}
      </div>
      
      {/* Pass count label with iOS styling */}
      <div
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y + nodeSize / 2 + 8}px`,
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          color: "white",
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: detailLevel === 'detailed' ? "13px" : "11px",
          fontWeight: "600",
          zIndex: isSelected ? 19 : 9,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          minWidth: "32px",
          textAlign: "center",
        }}
        className="transition-all duration-300 ease-out"
      >
        {player.totalPasses}
      </div>

      {/* Selection indicator ring */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            left: `${x - (nodeSize + 16) / 2}px`,
            top: `${y - (nodeSize + 16) / 2}px`,
            width: `${nodeSize + 16}px`,
            height: `${nodeSize + 16}px`,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.6)",
            zIndex: 5,
            animation: "pulse 2s infinite",
          }}
        />
      )}
    </>
  );
};

export default PlayerNode;
