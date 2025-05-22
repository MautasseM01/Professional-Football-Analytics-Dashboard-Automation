
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavigationItem } from "./navigation-items";

interface SidebarNavItemProps {
  item: NavigationItem;
  collapsed: boolean;
  openSubMenu: string | null;
  toggleSubMenu: (name: string) => void;
}

export function SidebarNavItem({ 
  item, 
  collapsed, 
  openSubMenu, 
  toggleSubMenu 
}: SidebarNavItemProps) {
  const location = useLocation();
  
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  if (item.subItems) {
    return (
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
    );
  }

  return (
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
  );
}
