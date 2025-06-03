import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { navigationItems } from "./sidebar/navigation-items";
import { SidebarNavItem } from "./sidebar/SidebarNavItem";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { FeedbackForm } from "./FeedbackForm";
import { useUserProfile } from "@/hooks/use-user-profile";
import { hasAccess } from "@/utils/roleAccess";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const location = useLocation();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  // Keep sidebar open and expanded for navigation awareness
  // Only close mobile overlay when navigating, but keep desktop sidebar open
  useEffect(() => {
    if (isMobile && mobileOpen) {
      // Close mobile overlay after a delay to allow user to see the navigation
      const timer = setTimeout(() => {
        setMobileOpen(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    
    // For desktop: keep sidebar expanded and don't auto-collapse when navigating
    if (!isMobile && collapsed) {
      setCollapsed(false);
    }
  }, [location.pathname, isMobile, mobileOpen, collapsed]);

  // Debug: Log the current user role and navigation filtering
  console.log('Current user role:', profile?.role);
  console.log('All navigation items:', navigationItems);

  const filteredNavigationItems = navigationItems.filter(item => {
    const hasItemAccess = hasAccess(profile?.role, item.allowedRoles);
    console.log(`Item "${item.name}" - Role: ${profile?.role}, Has Access: ${hasItemAccess}`, item.allowedRoles);
    return hasItemAccess;
  }).map(item => {
    const filteredSubItems = item.subItems?.filter(subItem => {
      const hasSubItemAccess = hasAccess(profile?.role, subItem.allowedRoles);
      console.log(`SubItem "${subItem.name}" - Role: ${profile?.role}, Has Access: ${hasSubItemAccess}`, subItem.allowedRoles);
      return hasSubItemAccess;
    });
    
    return {
      ...item,
      subItems: filteredSubItems
    };
  });

  console.log('Filtered navigation items:', filteredNavigationItems);

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

  // Set the active parent menu when location changes and keep it open
  useEffect(() => {
    const activeParent = getActiveParentMenu(location.pathname);
    console.log('Current pathname:', location.pathname);
    console.log('Active parent menu:', activeParent);
    if (activeParent) {
      setOpenSubMenu(activeParent);
    }
  }, [location.pathname, filteredNavigationItems]);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile overlay with smooth animations
  if (isMobile && mobileOpen) {
    return (
      <>
        {/* Mobile overlay with transition */}
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
        
        {/* Mobile sidebar with slide animation */}
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-club-black border-r border-club-gold/20 lg:hidden transform transition-transform duration-300 ease-in-out">
          <TooltipProvider delayDuration={200}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-5 border-b border-club-gold/20">
                <div className="flex items-center">
                  <img
                    src="/lovable-uploads/eb223be6-87a6-402c-a270-20313a00080c.png"
                    alt="Club Logo"
                    className="w-8 h-8 mr-2 rounded-lg"
                  />
                  <span className="text-lg font-semibold text-club-gold">SMH Analytics</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 min-h-[44px] min-w-[44px]"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-2 space-y-1">
                  {filteredNavigationItems.map((item) => (
                    <SidebarNavItem 
                      key={item.name}
                      item={item}
                      collapsed={false}
                      openSubMenu={openSubMenu}
                      toggleSubMenu={toggleSubMenu}
                    />
                  ))}
                </nav>
              </div>

              <SidebarFooter 
                collapsed={false} 
                onFeedbackClick={() => setFeedbackOpen(true)} 
              />
            </div>
          </TooltipProvider>
        </div>
        
        <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      </>
    );
  }

  return (
    <>
      {/* Mobile hamburger button - touch-friendly */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-30 text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 bg-club-black/80 backdrop-blur-sm lg:hidden min-h-[44px] min-w-[44px]"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </Button>
      )}

      {/* Desktop sidebar - keep expanded for navigation awareness */}
      <TooltipProvider delayDuration={200}>
        <div
          className={`transition-all duration-300 ease-in-out h-screen flex flex-col border-r border-club-gold/20 bg-club-black ${
            collapsed ? "w-16" : "w-64"
          } ${isMobile ? "hidden" : ""}`}
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
              className="text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 min-h-[44px] min-w-[44px]"
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
          
          <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
        </div>
      </TooltipProvider>
    </>
  );
};
