
import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-club-black text-white">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
