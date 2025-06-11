
import { useState } from "react";
import { usePlayerData } from "@/hooks/use-player-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackToTopButton } from "@/components/BackToTopButton";
import { RoleTester } from "@/components/RoleTester";
import { Menu, RefreshCw } from "lucide-react";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";

const Dashboard = () => {
  const {
    loading: playerDataLoading,
    refreshData
  } = usePlayerData();
  const {
    t
  } = useLanguage();
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Mock profile for demo purposes
  const mockProfile = {
    id: 'demo-user',
    email: 'demo@example.com',
    role: 'admin' as const,
    full_name: 'Demo User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refreshData();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {showSidebar && <DashboardSidebar />}
      
      <div className="flex-1 overflow-auto min-w-0">
        <header className="border-b border-white/20 dark:border-slate-700/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
          <div className="flex justify-between items-center px-3 sm:px-4 lg:px-6 py-3 gap-2 sm:gap-4 sm:py-[20px]">
            {/* Left section - Title and page info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-ios-headline font-bold text-blue-600 dark:text-blue-400 truncate">
                {t('header.title')}
              </h1>
              <p className="text-ios-caption text-gray-600 dark:text-gray-400 truncate">
                Admin {t('header.dashboard')} (Demo Mode)
              </p>
            </div>
            
            {/* Right section - Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Refresh Button */}
              <TouchFeedbackButton 
                variant="outline" 
                size="icon" 
                className="bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-600/30 hover:bg-white/70 dark:hover:bg-slate-700/50 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                onClick={handleRefresh} 
                title="Refresh data"
                hapticType="medium"
              >
                <RefreshCw size={14} className="sm:hidden" />
                <RefreshCw size={16} className="hidden sm:block lg:hidden" />
                <RefreshCw size={18} className="hidden lg:block" />
              </TouchFeedbackButton>
              
              {/* Menu Toggle */}
              <TouchFeedbackButton 
                variant="outline"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)} 
                className="bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-600/30 hover:bg-white/70 dark:hover:bg-slate-700/50 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 backdrop-blur-sm" 
                title="Toggle sidebar"
                hapticType="light"
              >
                <Menu size={16} className="sm:hidden" />
                <Menu size={18} className="hidden sm:block lg:hidden" />
                <Menu size={20} className="hidden lg:block" />
              </TouchFeedbackButton>
            </div>
          </div>
        </header>
        
        <main className="bg-transparent transition-colors duration-300 w-full">
          {/* Role Tester for demo */}
          <div className="p-4 sm:p-6 pb-0">
            <RoleTester />
          </div>
          
          {/* Always show Admin Dashboard for demo */}
          <AdminDashboard profile={mockProfile} />
        </main>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};

export default Dashboard;
