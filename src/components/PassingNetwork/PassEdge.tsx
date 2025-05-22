
import React from "react";

interface Position {
  x: number;
  y: number;
}

interface PassEdgeProps {
  from: Position;
  to: Position;
  color: string;
  width: number;
  count: number;
}

const PassEdge: React.FC<PassEdgeProps> = ({ from, to, color, width, count }) => {
  // Calculate control point for curved line
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  // Slightly offset the control point to create a subtle curve
  const offsetX = (to.y - from.y) * 0.2;
  const offsetY = (from.x - to.x) * 0.2;
  
  const controlX = midX + offsetX;
  const controlY = midY + offsetY;
  
  // Create SVG path for bezier curve
  const path = `M ${from.x} ${from.y} Q ${controlX} ${controlY}, ${to.x} ${to.y}`;
  
  return (
    <svg 
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5
      }}
    >
      <path
        d={path}
        stroke={color}
        strokeWidth={width}
        fill="transparent"
        strokeLinecap="round"
        opacity={0.8}
      />
      
      {/* Pass count label on edges with high pass count */}
      {count > 3 && (
        <>
          {/* White background for better readability */}
          <text
            x={controlX}
            y={controlY}
            fontSize="10"
            textAnchor="middle"
            dy=".3em"
            stroke="white"
            strokeWidth="3"
            fill="white"
            paintOrder="stroke"
          >
            {count}
          </text>
          {/* Actual text */}
          <text
            x={controlX}
            y={controlY}
            fontSize="10"
            textAnchor="middle"
            dy=".3em"
            fill="black"
          >
            {count}
          </text>
        </>
      )}
    </svg>
  );
};

export default PassEdge;
