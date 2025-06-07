
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

  const handleNavigate = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Mobile overlay menu with enhanced slide animation
  if (isMobile) {
    return (
      <>
        {/* Mobile hamburger button - fixed position */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMobileMenu}
          className="fixed top-3 left-3 z-50 text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 bg-club-black/90 backdrop-blur-sm min-h-[44px] min-w-[44px] shadow-lg touch-manipulation rounded-md"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </Button>

        {/* Mobile backdrop and sidebar with improved animations */}
        <div 
          className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
            mobileOpen 
              ? 'opacity-100 visible' 
              : 'opacity-0 invisible'
          }`}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-club-black/80 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile sidebar that slides in from left */}
          <div 
            className={`absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-club-black border-r border-club-gold/20 transform transition-transform duration-300 ease-in-out ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            } overflow-y-auto shadow-2xl`}
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-club-gold/20 min-h-[64px] sticky top-0 bg-club-black z-10">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/eb223be6-87a6-402c-a270-20313a00080c.png" 
                  alt="Club Logo" 
                  className="w-7 h-7 mr-3 rounded-lg flex-shrink-0" 
                />
                <span className="text-base font-semibold text-club-gold truncate">SMH Analytics</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeMobileMenu}
                className="text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 min-h-[44px] min-w-[44px]"
                aria-label="Close menu"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Mobile navigation */}
            <div className="flex-1 py-4">
              <nav className="px-3 space-y-2">
                {filteredNavigationItems.map(item => (
                  <SidebarNavItem 
                    key={item.name}
                    item={item}
                    collapsed={false}
                    openSubMenu={openSubMenus.has(item.name) ? item.name : null}
                    toggleSubMenu={toggleSubMenu}
                    onNavigate={handleNavigate}
                    className="min-h-[48px] touch-manipulation text-base rounded-lg"
                  />
                ))}
              </nav>
            </div>

            {/* Mobile controls */}
            <div className="border-t border-club-gold/20 p-4 bg-club-black">
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

  // Desktop sidebar
  return (
    <TooltipProvider delayDuration={200}>
      <div className={`transition-all duration-300 ease-in-out h-screen flex flex-col border-r border-club-gold/20 bg-club-black ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex items-center justify-between px-3 border-b border-club-gold/20 min-h-[56px] py-2">
          {!collapsed && (
            <div className="flex items-center overflow-hidden">
              <img 
                src="/lovable-uploads/eb223be6-87a6-402c-a270-20313a00080c.png" 
                alt="Club Logo" 
                className="w-6 h-6 mr-2 rounded-lg flex-shrink-0" 
              />
              <span className="text-sm font-semibold text-club-gold truncate">SMH Analytics</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleDesktopSidebar}
            className="text-club-gold hover:text-club-gold/80 hover:bg-club-gold/10 min-h-[44px] min-w-[44px] flex-shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={18} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <nav className={`${collapsed ? 'px-1' : 'px-2'} space-y-1`}>
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
  );
};
