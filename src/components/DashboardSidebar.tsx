
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Users, 
  FileBarChart, 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  Settings,
  LayoutDashboard,
  UserRound,
  LineChart,
  ArrowUpRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubNavigationItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: SubNavigationItem[];
}

const navigation: NavigationItem[] = [
  { 
    name: "Dashboard Home", 
    href: "/dashboard", 
    icon: LayoutDashboard
  },
  { 
    name: "Player Analysis", 
    href: "/player-analysis", 
    icon: UserRound,
    subItems: [
      { name: "Individual Player Stats", href: "/player-analysis/stats" },
      { name: "Player Comparison", href: "/player-analysis/comparison" },
      { name: "Player Development", href: "/player-analysis/development" }
    ]
  },
  { 
    name: "Team Performance", 
    href: "/team-performance", 
    icon: Users
  },
  { 
    name: "Reports", 
    href: "/reports", 
    icon: FileBarChart
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings
  },
];

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { signOut, user } = useAuth();
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  return (
    <TooltipProvider delayDuration={200}>
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
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <Collapsible
                    open={openSubMenu === item.name}
                    onOpenChange={() => {}}
                    className="w-full"
                  >
                    <div
                      className={cn(
                        "group flex items-center px-2 py-3 rounded-md transition-all",
                        isActive(item.href)
                          ? "bg-club-gold/20 text-club-gold"
                          : "text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold",
                        collapsed ? "justify-center" : "justify-between"
                      )}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "flex items-center gap-2",
                              collapsed && "justify-center w-full"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "flex-shrink-0 h-6 w-6",
                                isActive(item.href) ? "text-club-gold" : "text-club-light-gray group-hover:text-club-gold"
                              )}
                            />
                            {!collapsed && <span>{item.name}</span>}
                          </Link>
                        </TooltipTrigger>
                        {collapsed && (
                          <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
                            {item.name}
                          </TooltipContent>
                        )}
                      </Tooltip>
                      
                      {!collapsed && (
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-club-light-gray hover:text-club-gold hover:bg-transparent"
                            onClick={() => toggleSubMenu(item.name)}
                          >
                            {openSubMenu === item.name ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      )}
                    </div>
                    
                    {!collapsed && (
                      <CollapsibleContent className="ml-8 space-y-1 mt-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={cn(
                              "group flex items-center px-2 py-2 text-sm rounded-md transition-all",
                              isActive(subItem.href)
                                ? "bg-club-gold/10 text-club-gold"
                                : "text-club-light-gray hover:bg-club-gold/5 hover:text-club-gold"
                            )}
                          >
                            <ArrowUpRight 
                              size={16} 
                              className={cn(
                                "mr-2",
                                isActive(subItem.href) ? "text-club-gold" : "text-club-light-gray/70"
                              )} 
                            />
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "group flex items-center px-2 py-3 rounded-md transition-all",
                          isActive(item.href)
                            ? "bg-club-gold/20 text-club-gold"
                            : "text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold",
                          collapsed ? "justify-center" : "justify-start"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "flex-shrink-0 h-6 w-6",
                            isActive(item.href) ? "text-club-gold" : "text-club-light-gray group-hover:text-club-gold"
                          )}
                        />
                        {!collapsed && <span className="ml-3">{item.name}</span>}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
              </div>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="w-full flex justify-center text-club-light-gray hover:text-club-gold hover:bg-club-gold/10"
                >
                  <Settings size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
                Sign out
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
