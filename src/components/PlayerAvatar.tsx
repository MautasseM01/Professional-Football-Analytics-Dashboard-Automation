
import { Player } from "@/types";

interface PlayerAvatarProps {
  player: Player;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PlayerAvatar = ({ player, size = "md", className = "" }: PlayerAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-24 w-24"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl"
  };

  const numberBadgeSizes = {
    sm: "h-3 w-3 text-[8px]",
    md: "h-4 w-4 text-[10px]",
    lg: "h-6 w-6 text-xs"
  };

  // Generate player initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Extract player number from name or use a consistent hash-based number
  const getPlayerNumber = (playerName: string): string | null => {
    // Try to extract number from name if it contains one
    const numberMatch = playerName.match(/\d+/);
    if (numberMatch) {
      return numberMatch[0];
    }
    
    // Check if player object has a number field (assuming it might be added to Player type)
    if ('number' in player && player.number) {
      return String(player.number);
    }
    
    // Generate a consistent number based on player ID or name hash
    const hash = playerName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return String(Math.abs(hash % 99) + 1);
  };

  const initials = getInitials(player.name || "Player");
  const playerNumber = getPlayerNumber(player.name || "Player");

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${className} 
        relative flex items-center justify-center 
        rounded-full
        bg-gradient-to-br from-club-gold to-club-gold/80
        border-2 border-white
        shadow-lg
        transition-all duration-200
        hover:scale-110 hover:shadow-xl hover:shadow-club-gold/30
        cursor-pointer
      `}
    >
      {/* Player Initials */}
      <span 
        className={`
          ${textSizes[size]} 
          font-bold text-white 
          select-none
          drop-shadow-sm
        `}
      >
        {initials}
      </span>
      
      {/* Player Number Badge */}
      {playerNumber && (
        <div 
          className={`
            ${numberBadgeSizes[size]}
            absolute -bottom-0.5 -right-0.5
            bg-club-black
            border border-white
            rounded-full
            flex items-center justify-center
            font-bold text-club-gold
            shadow-sm
          `}
        >
          {playerNumber}
        </div>
      )}
    </div>
  );
};
