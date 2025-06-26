
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface DevelopmentReportGeneratorProps {
  onGenerateReport: (reportType: string, teamLevel: string) => void;
}

export const DevelopmentReportGenerator = ({ onGenerateReport }: DevelopmentReportGeneratorProps) => {
  const [selectedReportType, setSelectedReportType] = useState<string>('monthly');
  const [selectedTeamLevel, setSelectedTeamLevel] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'monthly', label: 'Monthly Development Report', icon: Calendar },
    { value: 'individual', label: 'Individual Player Summary', icon: Users },
    { value: 'board', label: 'Board Performance Summary', icon: TrendingUp },
    { value: 'parent', label: 'Parent Academy Report', icon: FileText }
  ];

  const teamLevels = [
    { value: 'all', label: 'All Teams' },
    { value: 'first_team', label: 'First Team' },
    { value: 'u23s', label: 'U23s' },
    { value: 'u18s', label: 'Academy U18s' },
    { value: 'u15s', label: 'Academy U15s' },
    { value: 'u12s', label: 'Academy U12s' }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate generation
      onGenerateReport(selectedReportType, selectedTeamLevel);
      toast.success(`${reportTypes.find(r => r.value === selectedReportType)?.label} generated successfully`);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const recentReports = [
    { name: 'Academy Monthly Report - November', date: '2024-11-30', status: 'completed' },
    { name: 'First Team Performance Summary', date: '2024-11-28', status: 'completed' },
    { name: 'Parent Communication Report', date: '2024-11-25', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <FileText className="mr-2 h-5 w-5" />
            Development Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-club-light-gray mb-2 block">
                Report Type
              </label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger className="bg-club-black/40 border-club-gold/30">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <type.icon className="mr-2 h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-club-light-gray mb-2 block">
                Team Level
              </label>
              <Select value={selectedTeamLevel} onValueChange={setSelectedTeamLevel}>
                <SelectTrigger className="bg-club-black/40 border-club-gold/30">
                  <SelectValue placeholder="Select team level" />
                </SelectTrigger>
                <SelectContent>
                  {teamLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full bg-club-gold text-club-black hover:bg-club-gold/90"
          >
            {isGenerating ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="text-club-gold">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-club-black/40 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-club-light-gray">{report.name}</h4>
                  <p className="text-sm text-club-light-gray/70">{report.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={report.status === 'completed' ? 
                      'bg-green-500/20 text-green-400' : 
                      'bg-amber-500/20 text-amber-400'
                    }
                  >
                    {report.status === 'completed' ? (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    ) : (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    {report.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="border-club-gold/30">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
