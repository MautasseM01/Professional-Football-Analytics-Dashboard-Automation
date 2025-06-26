
import { User } from "lucide-react";
import { Player } from "@/types";

interface PlayerAvatarProps {
  player?: Player | { name?: string; id?: number };
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const PlayerAvatar = ({ player, size = 'md', className = '' }: PlayerAvatarProps) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (!player || !player.name) {
    return (
      <div className={`${sizeClasses[size]} bg-club-dark-gray border border-club-gold/20 rounded-full flex items-center justify-center ${className}`}>
        <User className={`${iconSizes[size]} text-club-light-gray/50`} />
      </div>
    );
  }

  // Generate initials from player name
  const initials = player.name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${sizeClasses[size]} bg-club-gold/20 border border-club-gold/30 rounded-full flex items-center justify-center ${className}`}>
      <span className={`text-club-gold font-medium ${textSizes[size]}`}>{initials}</span>
    </div>
  );
};
