
import React from "react";
import { PlayerPosition } from "./types";

interface PlayerNodeProps {
  player: PlayerPosition;
  x: number;
  y: number;
  onSelect?: () => void;
  isSelected?: boolean;
  isMobile?: boolean;
}

const PlayerNode: React.FC<PlayerNodeProps> = ({ 
  player, 
  x, 
  y, 
  onSelect, 
  isSelected = false, 
  isMobile = false 
}) => {
  // Determine color based on position with enhanced gradients
  const getPositionColor = (position: string): { bg: string; shadow: string } => {
    switch (position.toLowerCase()) {
      case "goalkeeper":
        return { 
          bg: "linear-gradient(135deg, #FFC107, #FF8F00)", 
          shadow: "0 4px 12px rgba(255, 193, 7, 0.4)" 
        };
      case "defender":
        return { 
          bg: "linear-gradient(135deg, #2196F3, #1565C0)", 
          shadow: "0 4px 12px rgba(33, 150, 243, 0.4)" 
        };
      case "midfielder":
        return { 
          bg: "linear-gradient(135deg, #4CAF50, #2E7D32)", 
          shadow: "0 4px 12px rgba(76, 175, 80, 0.4)" 
        };
      case "forward":
        return { 
          bg: "linear-gradient(135deg, #F44336, #C62828)", 
          shadow: "0 4px 12px rgba(244, 67, 54, 0.4)" 
        };
      default:
        return { 
          bg: "linear-gradient(135deg, #9C27B0, #6A1B9A)", 
          shadow: "0 4px 12px rgba(156, 39, 176, 0.4)" 
        };
    }
  };

  // Enhanced node size for mobile touch targets
  const nodeSize = isMobile ? 44 : 40; // iOS standard minimum touch target
  const colors = getPositionColor(player.position || "unknown");
  
  return (
    <>
      {/* Enhanced player node with iOS-style design */}
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
          fontSize: isMobile ? "16px" : "14px",
          border: isSelected ? "3px solid #D4AF37" : "2px solid rgba(255, 255, 255, 0.8)",
          boxShadow: isSelected ? "0 6px 20px rgba(212, 175, 55, 0.6)" : colors.shadow,
          zIndex: isSelected ? 20 : 10,
          cursor: "pointer",
          touchAction: "manipulation",
          transform: isSelected ? "scale(1.1)" : "scale(1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="hover:scale-110 active:scale-95"
        title={`${player.name} (${player.position || 'Unknown'})`}
        onClick={onSelect}
      >
        {player.number || '?'}
      </div>
      
      {/* Enhanced pass count label with iOS styling */}
      <div
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y + nodeSize / 2 + 8}px`,
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          color: "white",
          padding: isMobile ? "4px 8px" : "2px 6px",
          borderRadius: "8px",
          fontSize: isMobile ? "13px" : "12px",
          fontWeight: "600",
          zIndex: 9,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        {player.totalPasses}
      </div>
    </>
  );
};

export default PlayerNode;
