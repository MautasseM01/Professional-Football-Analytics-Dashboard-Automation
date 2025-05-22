
import React from "react";

interface FootballPitchProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

const FootballPitch: React.FC<FootballPitchProps> = ({ width, height, children }) => {
  const pitchColor = "#305030"; // Dark green
  const lineColor = "rgba(255, 255, 255, 0.7)";
  const lineWidth = 2;

  // Responsive scaling
  const scaleFactor = Math.min(width, height) / 100;

  return (
    <div 
      className="relative overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: pitchColor,
        borderRadius: "8px"
      }}
    >
      {/* Outer border */}
      <div
        style={{
          position: "absolute",
          top: `${2 * scaleFactor}px`,
          left: `${2 * scaleFactor}px`,
          width: `calc(100% - ${4 * scaleFactor}px)`,
          height: `calc(100% - ${4 * scaleFactor}px)`,
          border: `${lineWidth}px solid ${lineColor}`,
          borderRadius: "4px"
        }}
      />

      {/* Center circle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${30 * scaleFactor}px`,
          height: `${30 * scaleFactor}px`,
          border: `${lineWidth}px solid ${lineColor}`,
          borderRadius: "50%"
        }}
      />

      {/* Center spot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${2 * scaleFactor}px`,
          height: `${2 * scaleFactor}px`,
          backgroundColor: lineColor,
          borderRadius: "50%"
        }}
      />

      {/* Center line */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: `${lineWidth}px`,
          height: "100%",
          backgroundColor: lineColor
        }}
      />

      {/* Penalty areas */}
      {[0, 100].map((pos, i) => (
        <div
          key={`penalty-${i}`}
          style={{
            position: "absolute",
            left: i === 0 ? `${2 * scaleFactor}px` : "auto",
            right: i === 1 ? `${2 * scaleFactor}px` : "auto",
            top: "50%",
            transform: "translateY(-50%)",
            width: `${18 * scaleFactor}px`,
            height: `${50 * scaleFactor}px`,
            border: `${lineWidth}px solid ${lineColor}`,
            borderLeft: i === 0 ? "none" : `${lineWidth}px solid ${lineColor}`,
            borderRight: i === 1 ? "none" : `${lineWidth}px solid ${lineColor}`,
          }}
        />
      ))}

      {/* Goal areas */}
      {[0, 100].map((pos, i) => (
        <div
          key={`goal-${i}`}
          style={{
            position: "absolute",
            left: i === 0 ? `${2 * scaleFactor}px` : "auto",
            right: i === 1 ? `${2 * scaleFactor}px` : "auto",
            top: "50%",
            transform: "translateY(-50%)",
            width: `${6 * scaleFactor}px`,
            height: `${20 * scaleFactor}px`,
            border: `${lineWidth}px solid ${lineColor}`,
            borderLeft: i === 0 ? "none" : `${lineWidth}px solid ${lineColor}`,
            borderRight: i === 1 ? "none" : `${lineWidth}px solid ${lineColor}`,
          }}
        />
      ))}

      {/* Penalty spots */}
      {[0, 100].map((pos, i) => (
        <div
          key={`spot-${i}`}
          style={{
            position: "absolute",
            left: i === 0 ? `${12 * scaleFactor}px` : "auto",
            right: i === 1 ? `${12 * scaleFactor}px` : "auto",
            top: "50%",
            transform: "translateY(-50%)",
            width: `${2 * scaleFactor}px`,
            height: `${2 * scaleFactor}px`,
            backgroundColor: lineColor,
            borderRadius: "50%"
          }}
        />
      ))}

      {/* Corner arcs */}
      {[[0, 0], [0, 100], [100, 0], [100, 100]].map(([x, y], i) => (
        <div
          key={`corner-${i}`}
          style={{
            position: "absolute",
            left: x === 0 ? `${2 * scaleFactor}px` : "auto",
            right: x === 100 ? `${2 * scaleFactor}px` : "auto",
            top: y === 0 ? `${2 * scaleFactor}px` : "auto",
            bottom: y === 100 ? `${2 * scaleFactor}px` : "auto",
            width: `${5 * scaleFactor}px`,
            height: `${5 * scaleFactor}px`,
            border: `${lineWidth}px solid ${lineColor}`,
            borderRadius: "50%",
            borderTopLeftRadius: x === 0 && y === 0 ? "0" : "50%",
            borderTopRightRadius: x === 100 && y === 0 ? "0" : "50%",
            borderBottomLeftRadius: x === 0 && y === 100 ? "0" : "50%",
            borderBottomRightRadius: x === 100 && y === 100 ? "0" : "50%",
          }}
        />
      ))}
      
      {/* Children (players, connections, etc.) */}
      {children}
    </div>
  );
};

export default FootballPitch;
