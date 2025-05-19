
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart, Users, Calendar, Menu, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationItem } from "@/types";

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart, current: true },
  { name: "Team Comparison", href: "/team-comparison", icon: Users, current: false },
  { name: "Advanced Analytics", href: "/advanced-analytics", icon: PieChart, current: false },
  { name: "Match Calendar", href: "/calendar", icon: Calendar, current: false },
  { name: "Settings", href: "/settings", icon: Settings, current: false },
];

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();

  const currentNavigation = navigation.map(item => ({
    ...item,
    current: location.pathname === item.href
  }));

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out h-screen flex flex-col border-r border-club-gold/20 bg-club-black",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-club-gold/20">
        {!collapsed && (
          <div className="flex items-center">
            <img
              src="/lovable-uploads/eb223be6-87a6-402c-a270-20313a00080c.png"
              alt="Club Logo"
              className="w-8 h-8 mr-2"
            />
            <span className="text-lg font-semibold text-club-gold truncate">SMH Analytics</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10"
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {currentNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-2 py-3 rounded-md transition-all",
                item.current
                  ? "bg-club-gold/20 text-club-gold"
                  : "text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <item.icon
                className={cn(
                  "flex-shrink-0 h-6 w-6",
                  item.current ? "text-club-gold" : "text-club-light-gray group-hover:text-club-gold"
                )}
              />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-club-gold/20 p-4">
        {!collapsed ? (
          <div className="flex flex-col">
            <div className="text-sm text-club-light-gray mb-2 truncate">
              {user?.email || "User"}
            </div>
            <Button
              variant="outline"
              onClick={signOut}
              className="justify-center border-club-gold/30 hover:bg-club-gold/10 hover:text-club-gold w-full text-sm"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full flex justify-center text-club-light-gray hover:text-club-gold hover:bg-club-gold/10"
          >
            <Settings size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};
