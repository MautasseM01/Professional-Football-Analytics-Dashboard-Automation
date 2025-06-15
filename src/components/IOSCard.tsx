
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IOSCardProps {
  children: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "default" | "featured" | "minimal";
  onClick?: () => void;
  isInteractive?: boolean;
}

export const IOSCard = ({ 
  children, 
  className = "", 
  size = "medium",
  variant = "default",
  onClick,
  isInteractive = false
}: IOSCardProps) => {
  const sizeClasses = {
    small: "min-h-[120px] p-4",
    medium: "min-h-[200px] p-5 sm:p-6",
    large: "min-h-[300px] p-6 sm:p-8"
  };

  const variantClasses = {
    default: "bg-gradient-to-br from-club-black/90 to-club-dark-gray/70 dark:from-club-black/90 dark:to-club-dark-gray/70",
    featured: "bg-gradient-to-br from-club-gold/20 to-club-gold/10 dark:from-club-gold/20 dark:to-club-gold/10",
    minimal: "bg-club-black/50 dark:bg-club-black/50"
  };

  return (
    <Card 
      className={cn(
        "relative rounded-2xl border border-club-gold/20 shadow-lg backdrop-blur-xl transition-all duration-300 ease-out",
        "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] hover:border-club-gold/30",
        // Light mode specific styling
        "light:bg-white light:border-gray-200 light:shadow-lg",
        "light:hover:border-yellow-600/40 light:hover:shadow-xl",
        isInteractive && "cursor-pointer touch-manipulation",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* iOS-style shine effect - adjusted for light mode */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-club-gold/5 via-transparent to-transparent opacity-60 pointer-events-none light:from-yellow-600/10" />
    </Card>
  );
};
