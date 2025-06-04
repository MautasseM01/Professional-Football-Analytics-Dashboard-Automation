
import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-club-black text-white overflow-hidden w-full">
      <DashboardSidebar />
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300 ease-in-out",
        isMobile && "pt-16" // Add top padding for mobile hamburger button
      )}>
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
