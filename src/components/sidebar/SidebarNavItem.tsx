
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AccessibleNavigationItem, AccessibleSubItem } from "@/utils/roleAccess";

interface SidebarNavItemProps {
  item: AccessibleNavigationItem;
  collapsed: boolean;
  openSubMenu: string | null;
  toggleSubMenu: (name: string) => void;
  onNavigate?: () => void;
  className?: string;
}

export const SidebarNavItem = ({ 
  item, 
  collapsed, 
  openSubMenu, 
  toggleSubMenu, 
  onNavigate,
  className 
}: SidebarNavItemProps) => {
  const location = useLocation();
  const [isPressed, setIsPressed] = useState(false);
  const isActive = location.pathname === item.href;
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isSubMenuOpen = openSubMenu === item.name;

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasSubItems) {
      toggleSubMenu(item.name);
    } else if (onNavigate) {
      onNavigate();
    }
  };

  const NavButton = ({ children, ...props }: any) => {
    const baseClasses = cn(
      "w-full justify-start items-center touch-manipulation transition-all duration-200",
      "active:scale-95 select-none",
      isPressed && "scale-95",
      isActive 
        ? "bg-club-gold/10 text-club-gold shadow-sm" 
        : "text-club-light-gray hover:text-club-gold hover:bg-club-gold/5",
      className
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(baseClasses, "justify-center p-3 min-h-[44px] min-w-[44px]")}
              onClick={handleClick}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              {...props}
            >
              <item.icon className="h-6 w-6 flex-shrink-0" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/20">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Button
        variant="ghost"
        className={cn(baseClasses, "p-3 min-h-[48px]")}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {children}
      </Button>
    );
  };

  if (item.href && !hasSubItems) {
    return (
      <Link to={item.href} onClick={onNavigate} className="block">
        <NavButton>
          <item.icon className="h-6 w-6 mr-3 flex-shrink-0" />
          {!collapsed && <span className="truncate font-medium">{item.name}</span>}
        </NavButton>
      </Link>
    );
  }

  return (
    <div>
      <NavButton>
        <item.icon className="h-6 w-6 mr-3 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="truncate flex-1 font-medium">{item.name}</span>
            {hasSubItems && (
              <span className="ml-auto transition-transform duration-200">
                {isSubMenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
          </>
        )}
      </NavButton>

      {/* Sub-menu items with smooth animation */}
      {hasSubItems && !collapsed && (
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isSubMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="ml-6 mt-2 space-y-1 border-l border-club-gold/20 pl-4">
            {item.subItems?.map((subItem: AccessibleSubItem) => {
              const isSubActive = location.pathname === subItem.href;
              return (
                <Link key={subItem.name} to={subItem.href || "#"} onClick={onNavigate} className="block">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start items-center p-3 min-h-[44px] text-sm touch-manipulation",
                      "transition-all duration-200 active:scale-95",
                      isSubActive 
                        ? "bg-club-gold/10 text-club-gold font-medium" 
                        : "text-club-light-gray/80 hover:text-club-gold hover:bg-club-gold/5"
                    )}
                  >
                    <span className="truncate">{subItem.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
