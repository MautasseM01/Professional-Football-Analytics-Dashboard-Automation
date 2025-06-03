
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

  // Debug player data
  console.log(`PlayerAvatar Debug - Player: ${player.name}`, {
    id: player.id,
    number: player.number,
    numberType: typeof player.number,
    playerObject: player
  });

  const initials = getInitials(player.name || "Player");
  
  // Only show number badge if player.number exists and is valid
  const playerNumber = player.number && player.number > 0 ? String(player.number) : null;

  console.log(`PlayerAvatar - ${player.name}: using number ${playerNumber || 'none'}`);

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
      
      {/* Player Number Badge - only show if number exists */}
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
