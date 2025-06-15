
import { RefreshCw, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { useUserProfile } from "@/hooks/use-user-profile";

interface PlayerDevelopmentHeaderProps {
  onRefresh: () => void;
  onToggleSidebar: () => void;
}

export const PlayerDevelopmentHeader = ({ onRefresh, onToggleSidebar }: PlayerDevelopmentHeaderProps) => {
  const { profile } = useUserProfile();

  return (
    <header className="border-b border-club-gold/20 dark:border-club-gold/20 bg-club-black/80 dark:bg-club-black/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
      <div className="max-w-[calc(100%-2rem)] mx-auto">
        <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-3 gap-2 sm:gap-4 sm:py-[20px]">
          {/* Left section - Title and page info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-ios-headline font-bold text-club-gold dark:text-club-gold truncate">
              Player Development
            </h1>
            <p className="text-ios-caption text-gray-400 dark:text-gray-400 truncate hidden sm:block">
              {profile?.role === 'player' 
                ? "Track your development goals and progress"
                : "Monitor player development and provide guidance"
              }
            </p>
            <p className="text-ios-caption text-gray-400 dark:text-gray-400 truncate sm:hidden">
              {profile?.role === 'player' ? "Your goals & progress" : "Player development"}
            </p>
          </div>
          
          {/* Right section - Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
            {/* Language Selector - Hidden on very small screens */}
            <div className="hidden xs:block">
              <LanguageSelector />
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Refresh Button */}
            <TouchFeedbackButton 
              variant="outline" 
              size="icon" 
              className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
              onClick={onRefresh} 
              title="Refresh data" 
              hapticType="medium"
            >
              <RefreshCw size={14} className="sm:hidden text-club-gold" />
              <RefreshCw size={16} className="hidden sm:block lg:hidden text-club-gold" />
              <RefreshCw size={18} className="hidden lg:block text-club-gold" />
            </TouchFeedbackButton>
            
            {/* Menu Toggle */}
            <TouchFeedbackButton 
              variant="outline" 
              size="icon" 
              onClick={onToggleSidebar} 
              className="bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30 hover:bg-club-gold/10 dark:hover:bg-club-gold/10 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
              title="Toggle sidebar" 
              hapticType="light"
            >
              <Menu size={16} className="sm:hidden text-club-gold" />
              <Menu size={18} className="hidden sm:block lg:hidden text-club-gold" />
              <Menu size={20} className="hidden lg:block text-club-gold" />
            </TouchFeedbackButton>
          </div>
        </div>
      </div>
    </header>
  );
};
