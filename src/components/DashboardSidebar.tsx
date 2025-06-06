
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { navigationItems } from "./sidebar/navigation-items";
import { SidebarNavItem } from "./sidebar/SidebarNavItem";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { FeedbackForm } from "./FeedbackForm";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { useUserProfile } from "@/hooks/use-user-profile";
import { hasAccess } from "@/utils/roleAccess";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<Set<string>>(new Set());
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const location = useLocation();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on mobile and manage state
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
      // Close mobile menu when screen becomes mobile
      setMobileOpen(false);
    } else {
      setCollapsed(false);
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, mobileOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const filteredNavigationItems = navigationItems.filter(item => {
    const hasItemAccess = hasAccess(profile?.role, item.allowedRoles);
    return hasItemAccess;
  }).map(item => {
    const filteredSubItems = item.subItems?.filter(subItem => {
      const hasSubItemAccess = hasAccess(profile?.role, subItem.allowedRoles);
      return hasSubItemAccess;
    });
    return {
      ...item,
      subItems: filteredSubItems
    };
  });

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

  useEffect(() => {
    const activeParent = getActiveParentMenu(location.pathname);
    if (activeParent) {
      setOpenSubMenus(prev => new Set([...prev, activeParent]));
    }
  }, [location.pathname, filteredNavigationItems]);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const toggleMobileMenu = () => {
    setMobileOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const toggleDesktopSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Auto-close mobile menu when navigation item is clicked
  const handleNavigate = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Mobile overlay menu with slide animation
  if (isMobile && mobileOpen) {
    return (
      <>
        {/* Mobile backdrop */}
        <div 
          className="fixed inset-0 bg-club-black/80 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        >
          {/* Mobile sidebar that slides in from left */}
          <div 
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-club-black border-r border-club-gold/20 transform transition-transform duration-300 ease-in-out translate-x-0"
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-club-gold/20 min-h-[73px]">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/eb223be6-87a6-402c-a270-20313a00080c.png" 
                  alt="Club Logo" 
                  className="w-8 h-8 mr-3 rounded-lg flex-shrink-0" 
                />
                <span className="text-lg font-semibold text-club-gold">SMH Analytics</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeMobileMenu}
                className="text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 min-h-[44px] min-w-[44px]"
                aria-label="Close menu"
              >
                <X size={24} />
              </Button>
            </div>

            {/* Mobile navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-3 space-y-1">
                {filteredNavigationItems.map(item => (
                  <SidebarNavItem 
                    key={item.name}
                    item={item}
                    collapsed={false}
                    openSubMenu={openSubMenus.has(item.name) ? item.name : null}
                    toggleSubMenu={toggleSubMenu}
                    onNavigate={handleNavigate}
                    className="min-h-[48px] touch-manipulation"
                  />
                ))}
              </nav>
            </div>

            {/* Mobile controls */}
            <div className="border-t border-club-gold/20 p-4">
              <div className="flex items-center gap-3 mb-4">
                <LanguageSelector />
                <ThemeToggle />
              </div>
              <SidebarFooter 
                collapsed={false} 
                onFeedbackClick={() => setFeedbackOpen(true)} 
              />
            </div>
          </div>
        </div>
        
        <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      </>
    );
  }

  return (
    <>
      {/* Mobile hamburger button - fixed position */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-40 text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 bg-club-black/90 backdrop-blur-sm lg:hidden min-h-[44px] min-w-[44px] shadow-lg touch-manipulation"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </Button>
      )}

      {/* Desktop sidebar */}
      <TooltipProvider delayDuration={200}>
        <div className={`transition-all duration-300 ease-in-out h-screen flex flex-col border-r border-club-gold/20 bg-club-black ${collapsed ? "w-20" : "w-72"} ${isMobile ? "hidden" : ""}`}>
          <div className="flex items-center justify-between px-4 border-b border-club-gold/20 min-h-[73px] py-[23px]">
            {!collapsed && (
              <div className="flex items-center overflow-hidden">
                <img 
                  src="/lovable-uploads/eb223be6-87a6-402c-a270-20313a00080c.png" 
                  alt="Club Logo" 
                  className="w-8 h-8 mr-3 rounded-lg flex-shrink-0" 
                />
                <span className="text-lg font-semibold text-club-gold truncate">SMH Analytics</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleDesktopSidebar}
              className="text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 min-h-[44px] min-w-[44px] flex-shrink-0"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className={`${collapsed ? 'px-2' : 'px-3'} space-y-1`}>
              {filteredNavigationItems.map(item => (
                <SidebarNavItem 
                  key={item.name}
                  item={item}
                  collapsed={collapsed}
                  openSubMenu={openSubMenus.has(item.name) ? item.name : null}
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
