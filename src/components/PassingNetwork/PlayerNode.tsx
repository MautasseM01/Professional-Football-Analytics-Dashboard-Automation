
import React from "react";
import { PlayerPosition } from "./types";

interface PlayerNodeProps {
  player: PlayerPosition;
  x: number;
  y: number;
}

const PlayerNode: React.FC<PlayerNodeProps> = ({ player, x, y }) => {
  // Determine color based on position
  const getPositionColor = (position: string): string => {
    switch (position.toLowerCase()) {
      case "goalkeeper":
        return "#FFC107"; // Yellow
      case "defender":
        return "#2196F3"; // Blue
      case "midfielder":
        return "#4CAF50"; // Green
      case "forward":
        return "#F44336"; // Red
      default:
        return "#9C27B0"; // Purple for other
    }
  };

  const nodeSize = 40; // Base size for the player node
  const bgColor = getPositionColor(player.position || "unknown");
  
  return (
    <>
      {/* Player node */}
      <div
        style={{
          position: "absolute",
          left: `${x - nodeSize / 2}px`,
          top: `${y - nodeSize / 2}px`,
          width: `${nodeSize}px`,
          height: `${nodeSize}px`,
          backgroundColor: bgColor,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "14px",
          border: "2px solid white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          zIndex: 10, // Ensure nodes appear above connections
        }}
        className="transition-transform hover:scale-110 cursor-pointer"
        title={`${player.name} (${player.position || 'Unknown'})`}
      >
        {player.number || '?'}
      </div>
      
      {/* Pass count label */}
      <div
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y + nodeSize / 2 + 5}px`,
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          zIndex: 9,
        }}
      >
        {player.totalPasses}
      </div>
    </>
  );
};

export default PlayerNode;
