
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
  
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isParentActive = (item: NavigationItem) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => isActive(subItem.href));
  };

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
            "group flex items-center px-2 py-3 rounded-md transition-all",
            parentIsActive || isActive(item.href)
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
                    parentIsActive || isActive(item.href) ? "text-club-gold" : "text-club-light-gray group-hover:text-club-gold"
                  )}
                />
                {!collapsed && <span>{t(item.translationKey)}</span>}
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
                className="h-6 w-6 p-0 text-club-light-gray hover:text-club-gold hover:bg-transparent"
                onClick={() => toggleSubMenu(item.name)}
              >
                {isOpen ? (
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
                    ? "bg-club-gold/20 text-club-gold font-medium"
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
                <span>{t(subItem.translationKey)}</span>
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
          {!collapsed && <span className="ml-3">{t(item.translationKey)}</span>}
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
