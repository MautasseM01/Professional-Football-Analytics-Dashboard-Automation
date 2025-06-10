
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
    default: "bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-900/70",
    featured: "bg-gradient-to-br from-blue-50/90 to-indigo-100/70 dark:from-blue-900/40 dark:to-indigo-900/40",
    minimal: "bg-white/50 dark:bg-slate-800/50"
  };

  return (
    <Card 
      className={cn(
        "relative rounded-2xl border-0 shadow-lg backdrop-blur-xl transition-all duration-300 ease-out",
        "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
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
      
      {/* iOS-style shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-60 pointer-events-none" />
    </Card>
  );
};
