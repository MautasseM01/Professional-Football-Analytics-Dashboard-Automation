
import React from "react";

interface FootballPitchProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

const FootballPitch: React.FC<FootballPitchProps> = ({ width, height, children }) => {
  return (
    <div 
      className="relative overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "8px"
      }}
    >
      <svg
        viewBox="0 0 1050 680"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="1050" height="680" fill="#2B8A3E" />

        {/* Field outline */}
        <rect
          x="50"
          y="50"
          width="950"
          height="580"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />

        {/* Half-way line */}
        <line
          x1="525"
          y1="50"
          x2="525"
          y2="630"
          stroke="#FFFFFF"
          strokeWidth="4"
        />

        {/* Center circle */}
        <circle
          cx="525"
          cy="340"
          r="91.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
        <circle cx="525" cy="340" r="4" fill="#FFFFFF" />

        {/* Left penalty area */}
        <rect
          x="50"
          y="195"
          width="165"
          height="290"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
        <rect
          x="50"
          y="240"
          width="60"
          height="200"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
        <circle
          cx="215"
          cy="340"
          r="91.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeDasharray="23 23"
        />
        <circle cx="110" cy="340" r="4" fill="#FFFFFF" />

        {/* Right penalty area */}
        <rect
          x="835"
          y="195"
          width="165"
          height="290"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
        <rect
          x="940"
          y="240"
          width="60"
          height="200"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
        <circle
          cx="835"
          cy="340"
          r="91.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeDasharray="23 23"
        />
        <circle cx="940" cy="340" r="4" fill="#FFFFFF" />

        {/* Left goal */}
        <rect
          x="40"
          y="310"
          width="10"
          height="60"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Right goal */}
        <rect
          x="1000"
          y="310"
          width="10"
          height="60"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Corner arcs */}
        <path
          d="M50,50 Q65,50 65,65"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
        <path
          d="M1000,50 Q985,50 985,65"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
        <path
          d="M50,630 Q65,630 65,615"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
        <path
          d="M1000,630 Q985,630 985,615"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
      </svg>
      
      {/* Children (players, connections, etc.) */}
      {children}
    </div>
  );
};

export default FootballPitch;
