
import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-club-black text-white overflow-hidden w-full">
      <DashboardSidebar />
      
      {/* Main content area */}
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300 ease-in-out flex flex-col",
        isMobile && "pt-16 pb-20" // Add top padding for mobile hamburger button and bottom padding for bottom nav
      )}>
        {/* Header bar aligned with sidebar */}
        <div className="border-b border-club-gold/20 bg-club-black px-4 py-4 flex items-center justify-between min-h-[73px] flex-shrink-0">
          <div className="flex-1" />
          
          {/* Top-right controls - only show on desktop, mobile controls are in sidebar */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
        
        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile bottom navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};
