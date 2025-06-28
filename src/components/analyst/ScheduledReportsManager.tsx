import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Mail, 
  Calendar, 
  Settings, 
  Plus,
  Trash2,
  Edit,
  PlayCircle,
  PauseCircle
} from "lucide-react";
import { TouchFeedbackButton } from "@/components/TouchFeedbackButton";
import { toast } from "sonner";

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  isActive: boolean;
  lastRun: Date | null;
  nextRun: Date;
  dataCategories: string[];
}

export const ScheduledReportsManager = () => {
  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Weekly Performance Summary',
      frequency: 'weekly',
      format: 'pdf',
      recipients: ['coach@example.com', 'manager@example.com'],
      isActive: true,
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      dataCategories: ['player-stats', 'match-results']
    },
    {
      id: '2', 
      name: 'Monthly Analytics Report',
      frequency: 'monthly',
      format: 'excel',
      recipients: ['director@example.com'],
      isActive: false,
      lastRun: null,
      nextRun: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      dataCategories: ['comprehensive-analytics']
    }
  ]);

  const [newReport, setNewReport] = useState({
    name: '',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    format: 'pdf' as 'pdf' | 'excel' | 'csv',
    recipients: '',
    dataCategories: [] as string[]
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const toggleReportStatus = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, isActive: !report.isActive }
        : report
    ));
    toast.success('Report status updated');
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
    toast.success('Scheduled report deleted');
  };

  const runReportNow = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      toast.success(`Running ${report.name}...`);
      // Simulate running report
      setTimeout(() => {
        setReports(prev => prev.map(r => 
          r.id === reportId 
            ? { ...r, lastRun: new Date() }
            : r
        ));
        toast.success('Report generated and sent successfully');
      }, 2000);
    }
  };

  const addNewReport = () => {
    if (!newReport.name.trim()) {
      toast.error('Please enter a report name');
      return;
    }

    const nextRun = new Date();
    const frequency = newReport.frequency;
    
    if (frequency === 'daily') {
      nextRun.setDate(nextRun.getDate() + 1);
    } else if (frequency === 'weekly') {
      nextRun.setDate(nextRun.getDate() + 7);
    } else if (frequency === 'monthly') {
      nextRun.setMonth(nextRun.getMonth() + 1);
    }

    const report: ScheduledReport = {
      id: Date.now().toString(),
      name: newReport.name,
      frequency: newReport.frequency,
      format: newReport.format,
      recipients: newReport.recipients.split(',').map(email => email.trim()).filter(Boolean),
      isActive: true,
      lastRun: null,
      nextRun,
      dataCategories: newReport.dataCategories
    };

    setReports(prev => [...prev, report]);
    setNewReport({
      name: '',
      frequency: 'weekly',
      format: 'pdf',
      recipients: '',
      dataCategories: []
    });
    setShowAddForm(false);
    toast.success('Scheduled report created');
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-club-gold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scheduled Reports
            </CardTitle>
            <CardDescription className="text-club-light-gray/70">
              Automate analytics report generation and distribution
            </CardDescription>
          </div>
          <TouchFeedbackButton
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-club-gold text-club-black hover:bg-club-gold/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </TouchFeedbackButton>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showAddForm && (
          <div className="p-4 bg-club-black/40 rounded-lg border border-club-gold/10 space-y-4">
            <h4 className="text-sm font-medium text-club-gold">Create New Scheduled Report</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-name" className="text-club-light-gray">Report Name</Label>
                <Input
                  id="report-name"
                  value={newReport.name}
                  onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Weekly Team Performance"
                  className="bg-club-black border-club-gold/30"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-club-light-gray">Frequency</Label>
                <Select
                  value={newReport.frequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setNewReport(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger className="bg-club-black border-club-gold/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-club-light-gray">Format</Label>
                <Select
                  value={newReport.format}
                  onValueChange={(value: 'pdf' | 'excel' | 'csv') => setNewReport(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger className="bg-club-black border-club-gold/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients" className="text-club-light-gray">Recipients (comma-separated)</Label>
                <Input
                  id="recipients"
                  value={newReport.recipients}
                  onChange={(e) => setNewReport(prev => ({ ...prev, recipients: e.target.value }))}
                  placeholder="coach@example.com, manager@example.com"
                  className="bg-club-black border-club-gold/30"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <TouchFeedbackButton
                onClick={addNewReport}
                className="bg-club-gold text-club-black hover:bg-club-gold/90"
              >
                Create Report
              </TouchFeedbackButton>
              <TouchFeedbackButton
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-club-gold/30 text-club-light-gray"
              >
                Cancel
              </TouchFeedbackButton>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-4 bg-club-black/20 rounded-lg border border-club-gold/10 hover:bg-club-gold/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="font-medium text-club-light-gray">{report.name}</h5>
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${report.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                      }
                    `}>
                      {report.isActive ? 'Active' : 'Paused'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-club-light-gray/70">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.frequency}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                    </span>
                    <span>{report.format.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TouchFeedbackButton
                    size="sm"
                    variant="outline"
                    onClick={() => runReportNow(report.id)}
                    className="border-club-gold/30 text-club-light-gray hover:bg-club-gold/10"
                  >
                    <PlayCircle className="h-3 w-3" />
                  </TouchFeedbackButton>
                  <TouchFeedbackButton
                    size="sm"
                    variant="outline"
                    onClick={() => toggleReportStatus(report.id)}
                    className="border-club-gold/30 text-club-light-gray hover:bg-club-gold/10"
                  >
                    {report.isActive ? <PauseCircle className="h-3 w-3" /> : <PlayCircle className="h-3 w-3" />}
                  </TouchFeedbackButton>
                  <TouchFeedbackButton
                    size="sm"
                    variant="outline"
                    onClick={() => deleteReport(report.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </TouchFeedbackButton>
                </div>
              </div>

              <Separator className="bg-club-gold/10 mb-3" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-club-light-gray/60">Last Run:</span>
                  <p className="text-club-light-gray">{formatDate(report.lastRun)}</p>
                </div>
                <div>
                  <span className="text-club-light-gray/60">Next Run:</span>
                  <p className="text-club-light-gray">{formatDate(report.nextRun)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-club-gold/30 mx-auto mb-4" />
            <p className="text-club-light-gray/60">No scheduled reports configured</p>
            <p className="text-sm text-club-light-gray/40">Create your first automated report to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
