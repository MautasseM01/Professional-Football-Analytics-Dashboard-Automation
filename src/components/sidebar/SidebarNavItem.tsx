
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  allowedRoles: string[];
  subItems?: {
    name: string;
    href: string;
    allowedRoles: string[];
  }[];
}

interface SidebarNavItemProps {
  item: NavigationItem;
  collapsed: boolean;
  openSubMenu: string | null;
  toggleSubMenu: (name: string) => void;
  onNavigate?: () => void;
  className?: string;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  collapsed,
  openSubMenu,
  toggleSubMenu,
  onNavigate,
  className
}) => {
  const location = useLocation();
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isOpen = openSubMenu === item.name;
  
  const isActive = () => {
    if (item.href) {
      return location.pathname === item.href || location.pathname.startsWith(item.href + '/');
    }
    if (hasSubItems) {
      return item.subItems!.some(subItem => 
        location.pathname === subItem.href || location.pathname.startsWith(subItem.href + '/')
      );
    }
    return false;
  };

  const handleClick = () => {
    if (hasSubItems) {
      toggleSubMenu(item.name);
    } else if (onNavigate) {
      onNavigate();
    }
  };

  const iconElement = <item.icon size={20} className="flex-shrink-0" />;

  const buttonContent = (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start text-club-light-gray hover:text-club-gold hover:bg-club-gold/10 transition-colors",
        collapsed ? "px-2" : "px-3",
        isActive() && "bg-club-gold/20 text-club-gold",
        className
      )}
      onClick={handleClick}
    >
      {iconElement}
      {!collapsed && (
        <>
          <span className="ml-3 truncate">{item.name}</span>
          {hasSubItems && (
            <div className="ml-auto">
              {isOpen ? (
                <ChevronDown size={16} className="text-club-light-gray" />
              ) : (
                <ChevronRight size={16} className="text-club-light-gray" />
              )}
            </div>
          )}
        </>
      )}
    </Button>
  );

  const mainElement = item.href && !hasSubItems ? (
    <Link to={item.href} onClick={onNavigate} className="block">
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  );

  return (
    <div className="space-y-1">
      {collapsed && !hasSubItems ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {item.href ? (
              <Link to={item.href} onClick={onNavigate}>
                {buttonContent}
              </Link>
            ) : (
              mainElement
            )}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/20">
            <p className="text-club-light-gray">{item.name}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        mainElement
      )}

      {/* Sub-menu items */}
      {hasSubItems && isOpen && !collapsed && (
        <div className="ml-6 space-y-1">
          {item.subItems!.map((subItem) => {
            const isSubActive = location.pathname === subItem.href || 
                              location.pathname.startsWith(subItem.href + '/');
            return (
              <Link
                key={subItem.name}
                to={subItem.href}
                onClick={onNavigate}
                className="block"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-club-light-gray/80 hover:text-club-gold hover:bg-club-gold/10 transition-colors pl-3",
                    isSubActive && "bg-club-gold/20 text-club-gold",
                    className && "text-base" // Larger text for mobile
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
