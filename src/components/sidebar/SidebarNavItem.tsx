
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
  const isActive = location.pathname === item.href;
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isSubMenuOpen = openSubMenu === item.name;

  const handleClick = () => {
    if (hasSubItems) {
      toggleSubMenu(item.name);
    } else if (onNavigate) {
      onNavigate();
    }
  };

  const NavButton = ({ children, ...props }: any) => {
    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-center items-center p-3 min-h-[44px] min-w-[44px] touch-manipulation",
                isActive 
                  ? "bg-club-gold/10 text-club-gold" 
                  : "text-club-light-gray hover:text-club-gold hover:bg-club-gold/5",
                className
              )}
              onClick={handleClick}
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
        className={cn(
          "w-full justify-start items-center p-3 min-h-[44px] touch-manipulation",
          isActive 
            ? "bg-club-gold/10 text-club-gold" 
            : "text-club-light-gray hover:text-club-gold hover:bg-club-gold/5",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  };

  if (item.href && !hasSubItems) {
    return (
      <Link to={item.href} onClick={onNavigate}>
        <NavButton>
          <item.icon className="h-6 w-6 mr-3 flex-shrink-0" />
          {!collapsed && <span className="truncate">{item.name}</span>}
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
            <span className="truncate flex-1">{item.name}</span>
            {hasSubItems && (
              <span className="ml-auto">
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

      {/* Sub-menu items */}
      {hasSubItems && isSubMenuOpen && !collapsed && (
        <div className="ml-6 mt-1 space-y-1">
          {item.subItems?.map((subItem: AccessibleSubItem) => {
            const isSubActive = location.pathname === subItem.href;
            return (
              <Link key={subItem.name} to={subItem.href || "#"} onClick={onNavigate}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start items-center p-2 pl-3 min-h-[44px] text-sm touch-manipulation",
                    isSubActive 
                      ? "bg-club-gold/10 text-club-gold" 
                      : "text-club-light-gray/80 hover:text-club-gold hover:bg-club-gold/5"
                  )}
                >
                  <span className="truncate">{subItem.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
