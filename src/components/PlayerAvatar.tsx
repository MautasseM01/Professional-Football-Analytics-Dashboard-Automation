
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

  const numberSizes = {
    sm: "text-lg font-black",
    md: "text-xl font-black",
    lg: "text-3xl font-black"
  };

  // Generate player initials as fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const initials = getInitials(player.name || "Player");
  
  // Debug logging to verify player data
  console.log(`PlayerAvatar Debug - Player: ${player.name}, ID: ${player.id}, Number: ${player.number}`);
  
  // Read player number directly from database field with fallback
  const playerNumber = player.number || null;

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
      {/* Jersey Number (Priority Display) */}
      {playerNumber && playerNumber > 0 ? (
        <span 
          className={`
            ${numberSizes[size]} 
            text-white 
            select-none
            drop-shadow-md
          `}
        >
          {playerNumber}
        </span>
      ) : (
        /* Fallback to Player Initials */
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
      )}
    </div>
  );
};
