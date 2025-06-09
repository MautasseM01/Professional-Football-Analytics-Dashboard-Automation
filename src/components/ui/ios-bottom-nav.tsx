
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, BarChart3, Users, FileText } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useUserProfile } from '@/hooks/use-user-profile';
import { hasAccess } from '@/utils/roleAccess';
import { UserRole } from '@/types';

interface TabItem {
  name: string;
  href: string;
  icon: React.ElementType;
  allowedRoles: UserRole[];
}

const tabItems: TabItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player', 'unassigned']
  },
  {
    name: "Players",
    href: "/player-analysis",
    icon: BarChart3,
    allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player']
  },
  {
    name: "Team",
    href: "/team-performance",
    icon: Users,
    allowedRoles: ['admin', 'management', 'performance_director', 'coach']
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    allowedRoles: ['admin', 'management', 'analyst']
  }
];

export const IOSBottomNav = () => {
  const location = useLocation();
  const { triggerHaptic } = useHapticFeedback();
  const { profile } = useUserProfile();

  const filteredItems = tabItems.filter(item => 
    hasAccess(profile?.role, item.allowedRoles)
  );

  const handleTabPress = () => {
    triggerHaptic('selection');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border-t border-[#E5E5EA] dark:border-[#38383A] safe-area-pb">
      <nav className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href || 
                          location.pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleTabPress}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 min-w-[60px] min-h-[50px]",
                "touch-manipulation transition-all duration-200 ease-out",
                "active:scale-95 hover:scale-105",
                "rounded-lg"
              )}
            >
              <div className={cn(
                "transition-all duration-200 ease-out mb-1",
                isActive ? "text-[#007AFF] scale-110" : "text-[#8E8E93] scale-100"
              )}>
                <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-200 ease-out",
                isActive ? "text-[#007AFF] scale-105" : "text-[#8E8E93] scale-100"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
