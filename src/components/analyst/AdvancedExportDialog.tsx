
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Calendar,
  Database,
  ChartBar,
  Users,
  Target,
  Clock,
  Mail
} from "lucide-react";
import { useComprehensiveExport, ExportOptions } from "@/hooks/use-comprehensive-export";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";

interface AdvancedExportDialogProps {
  trigger?: React.ReactNode;
}

export const AdvancedExportDialog = ({ trigger }: AdvancedExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: 'season',
    includeCharts: true,
    includePlayerData: true,
    includeMatchData: true,
    includePerformanceMetrics: true
  });

  const { exportAnalyticsData, exporting, progress } = useComprehensiveExport();

  const handleExport = async () => {
    const result = await exportAnalyticsData(options);
    if (result.success) {
      setOpen(false);
    }
  };

  const updateOption = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'excel': return <FileSpreadsheet className="h-4 w-4" />;
      case 'csv': return <Database className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <TouchFeedbackButton 
            variant="outline"
            className="border-club-gold/30 hover:bg-club-gold/10 text-club-light-gray"
          >
            <Download className="h-4 w-4 mr-2" />
            Advanced Export
          </TouchFeedbackButton>
        )}
      </DialogTrigger>
      <DialogContent className="bg-club-dark-gray border-club-gold/20 text-club-light-gray max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-club-gold flex items-center gap-2">
            <ChartBar className="h-5 w-5" />
            Comprehensive Data Export
          </DialogTitle>
          <DialogDescription className="text-club-light-gray/70">
            Export professional analytics reports with customizable data sets and formats
          </DialogDescription>
        </DialogHeader>

        {progress && (
          <div className="space-y-3 p-4 bg-club-black/40 rounded-lg border border-club-gold/10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-club-gold capitalize">
                {progress.stage}
              </span>
              <span className="text-sm text-club-light-gray">
                {progress.progress}%
              </span>
            </div>
            <Progress value={progress.progress} className="h-2" />
            <p className="text-xs text-club-light-gray/70">{progress.message}</p>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Export Format */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-club-gold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export Format
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {(['pdf', 'excel', 'csv'] as const).map((format) => (
                <TouchFeedbackButton
                  key={format}
                  variant={options.format === format ? "default" : "outline"}
                  onClick={() => updateOption('format', format)}
                  className={`
                    flex items-center justify-center gap-2 h-12
                    ${options.format === format 
                      ? 'bg-club-gold text-club-black' 
                      : 'border-club-gold/30 text-club-light-gray hover:bg-club-gold/10'
                    }
                  `}
                >
                  {getFormatIcon(format)}
                  {format.toUpperCase()}
                </TouchFeedbackButton>
              ))}
            </div>
          </div>

          <Separator className="bg-club-gold/10" />

          {/* Date Range */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-club-gold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </h4>
            <Select
              value={options.dateRange}
              onValueChange={(value: any) => updateOption('dateRange', value)}
            >
              <SelectTrigger className="bg-club-black border-club-gold/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="season">Current Season</SelectItem>
                <SelectItem value="all">All Available Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-club-gold/10" />

          {/* Data Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-club-gold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Include Data Categories
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-club-gold/10 bg-club-black/20">
                <Checkbox
                  id="player-data"
                  checked={options.includePlayerData}
                  onCheckedChange={(checked) => updateOption('includePlayerData', !!checked)}
                />
                <div className="flex items-center gap-2 flex-1">
                  <Users className="h-4 w-4 text-club-gold" />
                  <div>
                    <label htmlFor="player-data" className="text-sm font-medium">
                      Player Statistics
                    </label>
                    <p className="text-xs text-club-light-gray/60">
                      Goals, assists, ratings, physical metrics
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-club-gold/10 bg-club-black/20">
                <Checkbox
                  id="match-data"
                  checked={options.includeMatchData}
                  onCheckedChange={(checked) => updateOption('includeMatchData', !!checked)}
                />
                <div className="flex items-center gap-2 flex-1">
                  <Target className="h-4 w-4 text-club-gold" />
                  <div>
                    <label htmlFor="match-data" className="text-sm font-medium">
                      Match Information
                    </label>
                    <p className="text-xs text-club-light-gray/60">
                      Results, opponents, competition details
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-club-gold/10 bg-club-black/20">
                <Checkbox
                  id="performance-metrics"
                  checked={options.includePerformanceMetrics}
                  onCheckedChange={(checked) => updateOption('includePerformanceMetrics', !!checked)}
                />
                <div className="flex items-center gap-2 flex-1">
                  <ChartBar className="h-4 w-4 text-club-gold" />
                  <div>
                    <label htmlFor="performance-metrics" className="text-sm font-medium">
                      Performance Analytics
                    </label>
                    <p className="text-xs text-club-light-gray/60">
                      Goals breakdown, assists, match ratings
                    </p>
                  </div>
                </div>
              </div>

              {options.format === 'pdf' && (
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-club-gold/10 bg-club-black/20">
                  <Checkbox
                    id="include-charts"
                    checked={options.includeCharts}
                    onCheckedChange={(checked) => updateOption('includeCharts', !!checked)}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <ChartBar className="h-4 w-4 text-club-gold" />
                    <div>
                      <label htmlFor="include-charts" className="text-sm font-medium">
                        Visual Charts & Graphs
                      </label>
                      <p className="text-xs text-club-light-gray/60">
                        Include charts in PDF report (PDF only)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-club-gold/10">
          <div className="flex items-center gap-2 text-xs text-club-light-gray/60">
            <Clock className="h-3 w-3" />
            <span>Export may take 30-60 seconds for large datasets</span>
          </div>
          
          <div className="flex gap-3">
            <TouchFeedbackButton
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={exporting}
              className="border-club-gold/30 text-club-light-gray"
            >
              Cancel
            </TouchFeedbackButton>
            <TouchFeedbackButton
              onClick={handleExport}
              disabled={exporting}
              className="bg-club-gold text-club-black hover:bg-club-gold/90"
            >
              {exporting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </TouchFeedbackButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
