
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
import { Download, FileText, Database, Calendar } from "lucide-react";
import { Player } from "@/types";
import { usePlayerExport, PlayerExportOptions } from "@/hooks/use-player-export";
import { toast } from "sonner";

interface PlayerExportDialogProps {
  player: Player;
}

export const PlayerExportDialog = ({ player }: PlayerExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<PlayerExportOptions>({
    includeAttributes: true,
    includePerformance: true,
    includeGoalsAssists: true,
    includeBenchmarks: true,
    timeRange: 'season',
    format: 'pdf'
  });

  const { exportPlayerReport, exporting } = usePlayerExport();

  const handleExport = async () => {
    const result = await exportPlayerReport(player, options);
    if (result.success) {
      setOpen(false);
      toast.success(`Report exported successfully: ${result.filename}`);
    }
  };

  const updateOption = (key: keyof PlayerExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-club-gold/30 hover:bg-club-gold/10 text-club-light-gray"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-club-dark-gray border-club-gold/20 text-club-light-gray max-w-md">
        <DialogHeader>
          <DialogTitle className="text-club-gold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Player Report
          </DialogTitle>
          <DialogDescription className="text-club-light-gray/70">
            Customize your analytical report for {player.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Data Sections */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-club-gold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Include Data
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="attributes"
                  checked={options.includeAttributes}
                  onCheckedChange={(checked) => updateOption('includeAttributes', checked)}
                />
                <label htmlFor="attributes" className="text-sm">
                  Player Attributes & Skills
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="performance"
                  checked={options.includePerformance}
                  onCheckedChange={(checked) => updateOption('includePerformance', checked)}
                />
                <label htmlFor="performance" className="text-sm">
                  Match Performance Data
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="goals-assists"
                  checked={options.includeGoalsAssists}
                  onCheckedChange={(checked) => updateOption('includeGoalsAssists', checked)}
                />
                <label htmlFor="goals-assists" className="text-sm">
                  Goals & Assists Analysis
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="benchmarks"
                  checked={options.includeBenchmarks}
                  onCheckedChange={(checked) => updateOption('includeBenchmarks', checked)}
                />
                <label htmlFor="benchmarks" className="text-sm">
                  League Benchmarks
                </label>
              </div>
            </div>
          </div>

          {/* Time Range */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-club-gold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Time Range
            </h4>
            <Select
              value={options.timeRange}
              onValueChange={(value: any) => updateOption('timeRange', value)}
            >
              <SelectTrigger className="bg-club-black border-club-gold/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="season">Current Season</SelectItem>
                <SelectItem value="last10">Last 10 Matches</SelectItem>
                <SelectItem value="all">All Available Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-club-gold">Export Format</h4>
            <Select
              value={options.format}
              onValueChange={(value: any) => updateOption('format', value)}
            >
              <SelectTrigger className="bg-club-black border-club-gold/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-club-gold/10">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-club-gold/30 text-club-light-gray"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-club-gold text-club-black hover:bg-club-gold/90"
          >
            {exporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
