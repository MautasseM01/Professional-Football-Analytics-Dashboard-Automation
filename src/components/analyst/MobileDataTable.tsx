
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TouchFeedbackButton } from '../TouchFeedbackButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeGestures } from '@/hooks/use-swipe-gestures';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Eye,
  MoreHorizontal
} from 'lucide-react';

interface DataColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'badge' | 'action';
  sortable?: boolean;
  width?: string;
}

interface MobileDataTableProps {
  title: string;
  data: any[];
  columns: DataColumn[];
  onRowSelect?: (row: any) => void;
  onExport?: () => void;
  searchable?: boolean;
  filterable?: boolean;
  pageSize?: number;
  className?: string;
}

export const MobileDataTable = ({
  title,
  data,
  columns,
  onRowSelect,
  onExport,
  searchable = true,
  filterable = false,
  pageSize = 10,
  className = ""
}: MobileDataTableProps) => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and sort data
  const processedData = React.useMemo(() => {
    let filtered = data;

    // Search functionality
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * modifier;
        }
        return String(aVal).localeCompare(String(bVal)) * modifier;
      });
    }

    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Swipe gestures for pagination
  const { swipeProps } = useSwipeGestures({
    onSwipeLeft: () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    },
    onSwipeRight: () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    },
    threshold: 100
  });

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const renderCellContent = (row: any, column: DataColumn) => {
    const value = row[column.key];
    
    switch (column.type) {
      case 'number':
        return <span className="font-mono text-sm">{value}</span>;
      case 'badge':
        return (
          <Badge variant="outline" className="text-xs border-club-gold/30 text-club-light-gray">
            {value}
          </Badge>
        );
      case 'action':
        return (
          <div className="flex gap-1">
            <TouchFeedbackButton
              variant="ghost"
              size="sm"
              onClick={() => onRowSelect?.(row)}
              className="h-8 w-8 p-0 text-club-light-gray hover:text-club-gold"
            >
              <Eye className="h-3 w-3" />
            </TouchFeedbackButton>
            <TouchFeedbackButton
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-club-light-gray hover:text-club-gold"
            >
              <MoreHorizontal className="h-3 w-3" />
            </TouchFeedbackButton>
          </div>
        );
      default:
        return <span className="text-sm">{value}</span>;
    }
  };

  return (
    <Card className={`bg-club-dark-gray border-club-gold/20 ${className}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-club-gold text-sm sm:text-base">
            {title}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {onExport && (
              <TouchFeedbackButton
                variant="ghost"
                size="sm"
                onClick={onExport}
                className="h-8 px-2 text-club-light-gray hover:text-club-gold"
              >
                <Download className="h-3 w-3 mr-1" />
                {!isMobile && <span className="text-xs">Export</span>}
              </TouchFeedbackButton>
            )}
          </div>
        </div>

        {searchable && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-club-light-gray/50" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-club-black border-club-gold/30 text-club-light-gray placeholder:text-club-light-gray/50"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div {...swipeProps}>
          {isMobile ? (
            // Mobile card layout
            <div className="space-y-2 p-4">
              {paginatedData.map((row, index) => (
                <Card
                  key={index}
                  className="bg-club-black border-club-gold/10 p-3 touch-manipulation"
                  onClick={() => onRowSelect?.(row)}
                >
                  <div className="space-y-2">
                    {columns.slice(0, 3).map((column) => (
                      <div key={column.key} className="flex justify-between items-center">
                        <span className="text-xs text-club-light-gray/70">
                          {column.label}
                        </span>
                        <div className="text-club-light-gray">
                          {renderCellContent(row, column)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            // Desktop table layout
            <ScrollArea className="w-full">
              <div className="min-w-full">
                <div className="grid gap-0 border-b border-club-gold/10" style={{
                  gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ')
                }}>
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className="p-3 text-xs font-medium text-club-gold cursor-pointer hover:bg-club-gold/5"
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      {column.label}
                      {sortColumn === column.key && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {paginatedData.map((row, index) => (
                  <div
                    key={index}
                    className="grid gap-0 border-b border-club-gold/5 hover:bg-club-gold/5 cursor-pointer touch-manipulation"
                    style={{
                      gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ')
                    }}
                    onClick={() => onRowSelect?.(row)}
                  >
                    {columns.map((column) => (
                      <div key={column.key} className="p-3 text-club-light-gray">
                        {renderCellContent(row, column)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-club-gold/10">
            <div className="text-xs text-club-light-gray/70">
              {processedData.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <TouchFeedbackButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="h-8 w-8 p-0 text-club-light-gray hover:text-club-gold disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </TouchFeedbackButton>
              
              <span className="text-xs text-club-light-gray px-2">
                {currentPage + 1} / {totalPages}
              </span>
              
              <TouchFeedbackButton
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="h-8 w-8 p-0 text-club-light-gray hover:text-club-gold disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </TouchFeedbackButton>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
