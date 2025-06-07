
import { useLocation, Link } from "react-router-dom";
import { Home, BarChart3, Users, Settings } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { hasAccess } from "@/utils/roleAccess";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

const bottomNavItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player', 'unassigned'] as UserRole[]
  },
  {
    name: "Player Stats",
    href: "/player-analysis",
    icon: BarChart3,
    allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player'] as UserRole[]
  },
  {
    name: "Team",
    href: "/team-performance",
    icon: Users,
    allowedRoles: ['admin', 'management', 'performance_director', 'coach'] as UserRole[]
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    allowedRoles: ['admin', 'management', 'performance_director', 'analyst', 'coach', 'player'] as UserRole[]
  }
];

export const MobileBottomNav = () => {
  const location = useLocation();
  const { profile } = useUserProfile();

  const filteredItems = bottomNavItems.filter(item => 
    hasAccess(profile?.role, item.allowedRoles)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-club-black/95 backdrop-blur-sm border-t border-club-gold/20 safe-area-pb">
      <nav className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href || 
                          location.pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg",
                "touch-manipulation transition-all duration-200 active:scale-95",
                isActive 
                  ? "text-club-gold bg-club-gold/10" 
                  : "text-club-light-gray/70 hover:text-club-gold hover:bg-club-gold/5"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
