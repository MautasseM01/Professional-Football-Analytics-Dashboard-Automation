
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
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isParentActive = (item: NavigationItem) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => isActive(subItem.href));
  };

  // Enhanced touch targets for mobile
  const touchTargetClasses = isMobile ? "min-h-[48px] py-3" : "py-2.5";
  const iconSize = isMobile ? 24 : 20;

  if (item.subItems) {
    const parentIsActive = isParentActive(item);
    const isOpen = openSubMenu === item.name;

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={() => {}}
        className="w-full"
      >
        <div
          className={cn(
            "group flex items-center rounded-lg transition-all duration-200",
            parentIsActive || isActive(item.href)
              ? "bg-club-gold/20 text-club-gold"
              : "text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold",
            collapsed ? "justify-center px-2" : "justify-between px-3",
            touchTargetClasses
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 flex-1 min-w-0",
                  collapsed && "justify-center"
                )}
              >
                <item.icon
                  size={iconSize}
                  className={cn(
                    "flex-shrink-0",
                    parentIsActive || isActive(item.href) ? "text-club-gold" : "text-club-light-gray group-hover:text-club-gold"
                  )}
                />
                {!collapsed && (
                  <span className="truncate font-medium text-sm">
                    {t(item.translationKey)}
                  </span>
                )}
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
                {t(item.translationKey)}
              </TooltipContent>
            )}
          </Tooltip>
          
          {!collapsed && (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "flex-shrink-0 text-club-light-gray hover:text-club-gold hover:bg-transparent",
                  isMobile ? "h-8 w-8" : "h-6 w-6"
                )}
                onClick={() => toggleSubMenu(item.name)}
              >
                {isOpen ? (
                  <ChevronDown size={isMobile ? 20 : 16} />
                ) : (
                  <ChevronRight size={isMobile ? 20 : 16} />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
        
        {!collapsed && (
          <CollapsibleContent className="ml-6 space-y-1 mt-1">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.href}
                className={cn(
                  "group flex items-center rounded-lg transition-all duration-200 px-3",
                  isActive(subItem.href)
                    ? "bg-club-gold/20 text-club-gold font-medium"
                    : "text-club-light-gray hover:bg-club-gold/5 hover:text-club-gold",
                  touchTargetClasses
                )}
              >
                <ArrowUpRight 
                  size={isMobile ? 18 : 16}
                  className={cn(
                    "mr-3 flex-shrink-0",
                    isActive(subItem.href) ? "text-club-gold" : "text-club-light-gray/70"
                  )} 
                />
                <span className="truncate text-sm">{t(subItem.translationKey)}</span>
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
            "group flex items-center rounded-lg transition-all duration-200",
            isActive(item.href)
              ? "bg-club-gold/20 text-club-gold"
              : "text-club-light-gray hover:bg-club-gold/10 hover:text-club-gold",
            collapsed ? "justify-center px-2" : "justify-start px-3",
            touchTargetClasses
          )}
        >
          <item.icon
            size={iconSize}
            className={cn(
              "flex-shrink-0",
              isActive(item.href) ? "text-club-gold" : "text-club-light-gray group-hover:text-club-gold"
            )}
          />
          {!collapsed && (
            <span className="ml-3 truncate font-medium text-sm">
              {t(item.translationKey)}
            </span>
          )}
        </Link>
      </TooltipTrigger>
      {collapsed && (
        <TooltipContent side="right" className="bg-club-dark-gray border-club-gold/30 text-club-light-gray">
          {t(item.translationKey)}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
