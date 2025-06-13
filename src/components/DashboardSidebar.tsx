
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
import { ScrollArea } from "@/components/ui/scroll-area";

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<Set<string>>(new Set());
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const location = useLocation();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
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

  const handleNavigate = () => {
    // Auto-close mobile menu on navigation for better UX
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Full-screen mobile overlay menu with iOS-style design
  if (isMobile && mobileOpen) {
    return (
      <>
        {/* Full-screen mobile backdrop with iOS-style blur */}
        <div 
          className="fixed inset-0 bg-club-black/95 backdrop-blur-md z-50 lg:hidden transition-all duration-300 ease-in-out" 
          onClick={closeMobileMenu}
        >
          {/* Full-screen mobile menu content with proper scrolling */}
          <div 
            className="h-full w-full flex flex-col relative" 
            onClick={e => e.stopPropagation()}
          >
            {/* Close button - large touch target in top-right */}
            <div className="flex justify-end p-6 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeMobileMenu} 
                className="text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 min-h-[48px] min-w-[48px] touch-manipulation rounded-xl" 
                aria-label="Close menu"
              >
                <X size={28} />
              </Button>
            </div>

            {/* Scrollable content area */}
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col items-center pb-8">
                {/* Logo and branding */}
                <div className="flex flex-col items-center mb-12">
                  <img 
                    src="/lovable-uploads/eb223be6-87a6-402c-a270-20313a00080c.png" 
                    alt="Club Logo" 
                    className="w-16 h-16 mb-4 rounded-xl shadow-lg" 
                  />
                  <span className="text-2xl font-bold text-club-gold">SMH Analytics</span>
                  <span className="text-sm text-gray-400 mt-1">Football Analytics Dashboard</span>
                </div>

                {/* Navigation items - large touch targets with proper spacing */}
                <div className="flex flex-col items-center space-y-3 w-full max-w-sm">
                  {filteredNavigationItems.map(item => (
                    <div key={item.name} className="w-full">
                      <SidebarNavItem 
                        item={item} 
                        collapsed={false} 
                        openSubMenu={openSubMenus.has(item.name) ? item.name : null} 
                        toggleSubMenu={toggleSubMenu} 
                        onNavigate={handleNavigate} 
                        className="min-h-[48px] text-lg justify-center text-center hover:bg-club-gold/10 rounded-xl touch-manipulation py-3 px-6 transition-all duration-200 ease-in-out" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      </>
    );
  }

  return (
    <>
      {/* Mobile hamburger button - large touch target */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileMenu} 
          className="fixed top-4 left-4 z-30 text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 bg-club-black/90 backdrop-blur-sm lg:hidden min-h-[48px] min-w-[48px] touch-manipulation shadow-lg rounded-xl border border-club-gold/20" 
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

          <SidebarFooter collapsed={collapsed} onFeedbackClick={() => setFeedbackOpen(true)} />
          
          <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
        </div>
      </TooltipProvider>
    </>
  );
};
