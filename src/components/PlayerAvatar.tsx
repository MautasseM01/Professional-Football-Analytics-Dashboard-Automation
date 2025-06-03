
import { Player } from "@/types";

interface PlayerAvatarProps {
  player: Player;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PlayerAvatar = ({ player, size = "md", className = "" }: PlayerAvatarProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-24 w-24"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg"
  };

  // Extract player number from name or use a default
  const getPlayerNumber = (playerName: string): string => {
    // Try to extract number from name if it contains one
    const numberMatch = playerName.match(/\d+/);
    if (numberMatch) {
      return numberMatch[0];
    }
    
    // Generate a consistent number based on player ID or name hash
    const hash = playerName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return String(Math.abs(hash % 99) + 1);
  };

  // Generate player initials as fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const playerNumber = getPlayerNumber(player.name || "Player");
  const initials = getInitials(player.name || "Player");
  const displayText = playerNumber || initials;

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}>
      {/* Jersey SVG Background */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Jersey Shape */}
        <path
          d="M25 20 L35 15 L40 15 L40 25 L60 25 L60 15 L65 15 L75 20 L75 85 L25 85 Z"
          fill="#1A1A1A"
          stroke="#D4AF37"
          strokeWidth="2"
        />
        
        {/* Jersey sleeves */}
        <path
          d="M25 20 L20 25 L20 40 L25 35 Z"
          fill="#1A1A1A"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
        <path
          d="M75 20 L80 25 L80 40 L75 35 Z"
          fill="#1A1A1A"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
        
        {/* Jersey collar */}
        <path
          d="M40 15 L40 25 L45 20 L55 20 L60 25 L60 15"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
      </svg>
      
      {/* Player Number/Initials Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center ${textSizes[size]} font-bold text-club-gold`}
        style={{ marginTop: size === 'lg' ? '8px' : size === 'md' ? '4px' : '2px' }}
      >
        {displayText}
      </div>
    </div>
  );
};
