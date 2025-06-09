import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { IOSBottomNav } from "./ui/ios-bottom-nav";
import { IOSPageTransition } from "./ui/ios-page-transition";
import { IOSScrollView } from "./ui/ios-scroll-view";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-[#F2F2F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F2F2F7] overflow-hidden w-full">
        {/* iOS-style mobile layout */}
        <IOSScrollView 
          className="flex-1 pb-20" // Bottom padding for tab bar
          bounceVertical={true}
        >
          <IOSPageTransition>
            <div className="min-h-full" style={{ 
              paddingLeft: '16px', 
              paddingRight: '16px',
              paddingTop: '24px',
              paddingBottom: '32px'
            }}>
              {children}
            </div>
          </IOSPageTransition>
        </IOSScrollView>
        
        {/* iOS Bottom Navigation */}
        <IOSBottomNav />
      </div>
    );
  }

  // Desktop layout remains the same
  return (
    <div className="flex h-screen bg-club-black text-white overflow-hidden w-full">
      <DashboardSidebar />
      
      {/* Main content area */}
      <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out flex flex-col">
        {/* Header bar aligned with sidebar */}
        <div className="border-b border-club-gold/20 bg-club-black px-4 py-4 flex items-center justify-between min-h-[73px] flex-shrink-0">
          <div className="flex-1" />
          
          {/* Top-right controls */}
          <div className="flex items-center gap-2">
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
    </div>
  );
};
