import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { navigationItems } from "./sidebar/navigation-items";
import { SidebarNavItem } from "./sidebar/SidebarNavItem";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { FeedbackForm } from "./FeedbackForm";
import { useUserProfile } from "@/hooks/use-user-profile";
import { hasAccess } from "@/utils/roleAccess";

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const location = useLocation();
  const { profile } = useUserProfile();

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item => 
    hasAccess(profile?.role, item.allowedRoles)
  ).map(item => ({
    ...item,
    subItems: item.subItems?.filter(subItem => 
      hasAccess(profile?.role, subItem.allowedRoles)
    )
  }));

  // Function to determine which parent menu should be open based on current route
  const getActiveParentMenu = (pathname: string) => {
    for (const item of filteredNavigationItems) {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(subItem => 
          pathname === subItem.href || pathname.startsWith(subItem.href + '/')
        );
        if (isSubItemActive) {
          return item.name;
        }
      }
    }
    return null;
  };

  // Update open submenu based on current route
  useEffect(() => {
    const activeParent = getActiveParentMenu(location.pathname);
    if (activeParent) {
      setOpenSubMenu(activeParent);
    }
  }, [location.pathname]);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={`transition-all duration-300 ease-in-out h-screen flex flex-col border-r border-club-gold/20 bg-club-black ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-club-gold/20">
          {!collapsed && (
            <div className="flex items-center">
              <img
                src="/lovable-uploads/eb223be6-87a6-402c-a270-20313a00080c.png"
                alt="Club Logo"
                className="w-8 h-8 mr-2 rounded-lg"
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
            {filteredNavigationItems.map((item) => (
              <SidebarNavItem 
                key={item.name}
                item={item}
                collapsed={collapsed}
                openSubMenu={openSubMenu}
                toggleSubMenu={toggleSubMenu}
              />
            ))}
          </nav>
        </div>

        <SidebarFooter 
          collapsed={collapsed} 
          onFeedbackClick={() => setFeedbackOpen(true)} 
        />
        
        {/* Feedback form dialog */}
        <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      </div>
    </TooltipProvider>
  );
};
