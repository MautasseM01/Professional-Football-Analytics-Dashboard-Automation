import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  cardLayout?: boolean; // Force card layout even on desktop
}

const ResponsiveTable = React.forwardRef<
  HTMLDivElement,
  ResponsiveTableProps
>(({ className, children, cardLayout = false, ...props }, ref) => {
  const isMobile = useIsMobile();
  const showCardLayout = isMobile || cardLayout;

  if (showCardLayout) {
    return (
      <div
        ref={ref}
        className={cn("space-y-3", className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="relative">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div
          ref={ref}
          className={cn("w-full", className)}
          {...props}
        >
          <table className="w-full caption-bottom text-sm">
            {children}
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {/* Visual scroll indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none opacity-50" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-50" />
    </div>
  );
});
ResponsiveTable.displayName = "ResponsiveTable";

interface ResponsiveTableRowProps {
  children?: React.ReactNode; // Made optional for card layout
  className?: string;
  data?: Record<string, React.ReactNode>; // For card layout
  title?: React.ReactNode; // Changed from string to ReactNode
}

const ResponsiveTableRow = React.forwardRef<
  HTMLTableRowElement,
  ResponsiveTableRowProps
>(({ className, children, data, title, ...props }, ref) => {
  const isMobile = useIsMobile();

  if (isMobile && data) {
    return (
      <div className={cn(
        "bg-card border rounded-lg p-4 space-y-2 min-h-[44px] touch-manipulation",
        className
      )}>
        {title && (
          <h3 className="font-medium text-base text-card-foreground mb-3">
            {title}
          </h3>
        )}
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-1">
              <span className="text-sm text-muted-foreground font-medium">
                {key}
              </span>
              <span className="text-sm font-medium text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
});
ResponsiveTableRow.displayName = "ResponsiveTableRow";

const ResponsiveTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle min-h-[44px] touch-manipulation [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  >
    {children}
  </td>
));
ResponsiveTableCell.displayName = "ResponsiveTableCell";

const ResponsiveTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground min-h-[44px] touch-manipulation [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  >
    {children}
  </th>
));
ResponsiveTableHead.displayName = "ResponsiveTableHead";

export {
  ResponsiveTable,
  ResponsiveTableRow,
  ResponsiveTableCell,
  ResponsiveTableHead,
};
