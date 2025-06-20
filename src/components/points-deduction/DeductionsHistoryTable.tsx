
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface DeductionRecord {
  id: number;
  date: string;
  reason: string;
  pointsLost: number;
  appealStatus: 'Pending' | 'Rejected' | 'Successful' | 'Under Review' | 'Not Appealed';
  resolution: string;
  season: string;
}

interface DeductionsHistoryTableProps {
  searchTerm: string;
}

export const DeductionsHistoryTable = ({ searchTerm }: DeductionsHistoryTableProps) => {
  const [sortField, setSortField] = useState<keyof DeductionRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Mock data - this would come from team_admin_status table
  const deductions: DeductionRecord[] = [
    {
      id: 1,
      date: '2024-03-15',
      reason: 'Financial Fair Play Violation',
      pointsLost: 6,
      appealStatus: 'Under Review',
      resolution: 'Appeal submitted 2024-03-20',
      season: '2024-25'
    },
    {
      id: 2,
      date: '2023-11-08',
      reason: 'Squad Registration Breach',
      pointsLost: 3,
      appealStatus: 'Rejected',
      resolution: 'Final decision - penalty upheld',
      season: '2023-24'
    },
    {
      id: 3,
      date: '2023-02-14',
      reason: 'Administrative Non-Compliance',
      pointsLost: 2,
      appealStatus: 'Not Appealed',
      resolution: 'Penalty accepted',
      season: '2022-23'
    }
  ];

  const handleSort = (field: keyof DeductionRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = deductions
    .filter(record => 
      record.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.resolution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.appealStatus.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const getAppealStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { variant: 'outline' as const, color: 'text-yellow-400 border-yellow-400' },
      'Under Review': { variant: 'outline' as const, color: 'text-blue-400 border-blue-400' },
      'Rejected': { variant: 'outline' as const, color: 'text-red-400 border-red-400' },
      'Successful': { variant: 'outline' as const, color: 'text-green-400 border-green-400' },
      'Not Appealed': { variant: 'outline' as const, color: 'text-gray-400 border-gray-400' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Not Appealed'];
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const SortButton = ({ field, children }: { field: keyof DeductionRecord; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium text-club-light-gray hover:text-club-gold"
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3" />
      )}
    </Button>
  );

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <CardTitle className="text-club-gold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Deductions History
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Complete record of administrative penalties and appeals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-club-gold/20">
                <TableHead>
                  <SortButton field="date">Date</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="reason">Reason</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="pointsLost">Points Lost</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="appealStatus">Appeal Status</SortButton>
                </TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>
                  <SortButton field="season">Season</SortButton>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((record) => (
                <TableRow key={record.id} className="border-club-gold/10 hover:bg-club-gold/5">
                  <TableCell className="text-club-light-gray">
                    {new Date(record.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-club-light-gray font-medium">
                    {record.reason}
                  </TableCell>
                  <TableCell>
                    <span className="text-red-400 font-bold">-{record.pointsLost}</span>
                  </TableCell>
                  <TableCell>
                    {getAppealStatusBadge(record.appealStatus)}
                  </TableCell>
                  <TableCell className="text-club-light-gray/70 text-sm max-w-xs">
                    {record.resolution}
                  </TableCell>
                  <TableCell className="text-club-light-gray">
                    {record.season}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-8 text-club-light-gray/70">
            No deduction records found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
