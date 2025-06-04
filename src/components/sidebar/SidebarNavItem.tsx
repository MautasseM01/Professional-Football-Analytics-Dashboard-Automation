
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NavigationItem } from "./navigation-items";

interface SidebarNavItemProps {
  item: NavigationItem;
  collapsed: boolean;
  openSubMenu: string | null;
  toggleSubMenu: (name: string) => void;
  onNavigate?: () => void;
}

export const SidebarNavItem = ({ 
  item, 
  collapsed, 
  openSubMenu, 
  toggleSubMenu,
  onNavigate 
}: SidebarNavItemProps) => {
  const location = useLocation();
  const isOpen = openSubMenu === item.name;

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleSubMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSubMenu(item.name);
  };

  const hasSubItems = item.subItems && item.subItems.length > 0;

  if (hasSubItems) {
    const SubMenuButton = (
      <Button
        variant="ghost"
        className={`w-full transition-all duration-200 hover:bg-club-gold/10 hover:text-club-gold group ${
          collapsed 
            ? 'h-12 w-12 p-0 flex items-center justify-center mx-auto' 
            : 'h-auto p-3 justify-between text-left'
        }`}
        onClick={handleSubMenuToggle}
      >
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'}`}>
          <item.icon size={20} className="flex-shrink-0" />
          {!collapsed && (
            <span className="font-medium text-sm">{item.name}</span>
          )}
        </div>
        {!collapsed && (
          <div className="flex-shrink-0">
            {isOpen ? (
              <ChevronDown size={16} className="transition-transform duration-200" />
            ) : (
              <ChevronRight size={16} className="transition-transform duration-200" />
            )}
          </div>
        )}
      </Button>
    );

    return (
      <div className="space-y-1">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              {SubMenuButton}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30">
              <p>{item.name}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          SubMenuButton
        )}
        
        {isOpen && !collapsed && (
          <div className="ml-6 space-y-1">
            {item.subItems?.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                onClick={handleNavigate}
                className={`block p-2 text-sm rounded-md transition-all duration-200 hover:bg-club-gold/10 hover:text-club-gold min-h-[44px] flex items-center ${
                  isActive(subItem.href)
                    ? 'bg-club-gold/20 text-club-gold font-medium'
                    : 'text-club-light-gray/80'
                }`}
              >
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Single item without sub-items
  const SingleItem = (
    <Link
      to={item.href || '#'}
      onClick={handleNavigate}
      className={`flex items-center rounded-md transition-all duration-200 hover:bg-club-gold/10 hover:text-club-gold group min-h-[44px] ${
        item.href && isActive(item.href)
          ? 'bg-club-gold/20 text-club-gold font-medium'
          : 'text-club-light-gray'
      } ${collapsed ? 'h-12 w-12 p-0 justify-center mx-auto' : 'gap-3 p-3'}`}
    >
      <item.icon size={20} className="flex-shrink-0" />
      {!collapsed && (
        <span className="font-medium text-sm">{item.name}</span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {SingleItem}
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30">
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return SingleItem;
};
