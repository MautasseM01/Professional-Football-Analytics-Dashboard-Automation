
import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { TouchFeedbackButton } from "./TouchFeedbackButton";
import { Menu, RefreshCw } from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = "Dashboard",
  description = "Overview",
  onRefresh
}) => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="flex h-screen bg-club-black text-white overflow-hidden w-full">
      {showSidebar && <DashboardSidebar />}
      
      {/* Main content area */}
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300 ease-in-out flex flex-col",
        isMobile && "pt-0" // Remove top padding for mobile
      )}>
        {/* Header bar */}
        <header className="border-b border-club-gold/20 dark:border-club-gold/20 bg-club-black/80 dark:bg-club-black/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="flex justify-between items-center px-2 sm:px-4 lg:px-6 py-3 sm:py-4 gap-2 min-h-[64px] sm:min-h-[72px]">
            {/* Left section - Title and page info */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <h1 className={cn(
                "font-bold text-club-gold dark:text-club-gold truncate",
                "text-base sm:text-lg lg:text-xl xl:text-2xl"
              )}>
                {title}
              </h1>
              <p className={cn(
                "text-gray-400 dark:text-gray-400 truncate",
                "text-xs sm:text-sm lg:text-base",
                "leading-tight"
              )}>
                {description}
              </p>
            </div>
            
            {/* Right section - Controls */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Language Selector - Always visible */}
              <LanguageSelector />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Refresh Button */}
              <TouchFeedbackButton 
                variant="outline" 
                size="icon" 
                className={cn(
                  "bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30",
                  "hover:bg-club-gold/10 dark:hover:bg-club-gold/10 backdrop-blur-sm",
                  "h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                )}
                onClick={handleRefresh} 
                title="Refresh data" 
                hapticType="medium"
              >
                <RefreshCw className={cn(
                  "text-club-gold",
                  "w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                )} />
              </TouchFeedbackButton>
              
              {/* Menu Toggle */}
              <TouchFeedbackButton 
                variant="outline" 
                size="icon" 
                onClick={() => setShowSidebar(!showSidebar)} 
                className={cn(
                  "bg-club-black/50 dark:bg-club-black/50 border-club-gold/30 dark:border-club-gold/30",
                  "hover:bg-club-gold/10 dark:hover:bg-club-gold/10 backdrop-blur-sm",
                  "h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                )}
                title="Toggle sidebar" 
                hapticType="light"
              >
                <Menu className={cn(
                  "text-club-gold",
                  "w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                )} />
              </TouchFeedbackButton>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
