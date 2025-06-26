
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Calendar, 
  Mail, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  Activity,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

export const WorkflowAutomation = () => {
  const [automationSettings, setAutomationSettings] = useState({
    milestoneAlerts: true,
    coachingReminders: true,
    parentCommunication: true,
    injuryPrevention: true,
    performanceReviews: true
  });

  const activeWorkflows = [
    {
      id: 1,
      name: 'Monthly Development Review',
      type: 'performance',
      status: 'active',
      nextRun: '2024-12-01',
      frequency: 'Monthly',
      description: 'Automated generation of player development reports for coaching staff'
    },
    {
      id: 2,
      name: 'Parent Communication - Academy U15s',
      type: 'communication',
      status: 'active',
      nextRun: '2024-11-30',
      frequency: 'Weekly',
      description: 'Weekly progress updates sent to parents of academy players'
    },
    {
      id: 3,
      name: 'Injury Prevention Alerts',
      type: 'health',
      status: 'active',
      nextRun: '2024-11-27',
      frequency: 'Daily',
      description: 'Monitor training load and alert when players approach risk thresholds'
    },
    {
      id: 4,
      name: 'Milestone Achievement Notifications',
      type: 'development',
      status: 'active',
      nextRun: 'Continuous',
      frequency: 'Real-time',
      description: 'Instant notifications when players achieve development milestones'
    }
  ];

  const pendingActions = [
    {
      id: 1,
      type: 'milestone',
      player: 'James Mitchell',
      action: 'Technical Skills Assessment Due',
      priority: 'high',
      dueDate: '2024-11-28',
      assignedTo: 'Coach Smith'
    },
    {
      id: 2,
      type: 'communication',
      player: 'Marcus Thompson',
      action: 'Parent Meeting Scheduled',
      priority: 'medium',
      dueDate: '2024-11-30',
      assignedTo: 'Academy Manager'
    },
    {
      id: 3,
      type: 'health',
      player: 'Oliver Davis',
      action: 'Workload Review Required',
      priority: 'high',
      dueDate: '2024-11-27',
      assignedTo: 'Fitness Coach'
    },
    {
      id: 4,
      type: 'review',
      player: 'Alex Johnson',
      action: 'Quarterly Performance Review',
      priority: 'medium',
      dueDate: '2024-12-01',
      assignedTo: 'Performance Director'
    }
  ];

  const workflowStats = {
    totalWorkflows: 12,
    activeWorkflows: 8,
    completedToday: 15,
    pendingActions: 23,
    automationSavings: 18.5 // hours per week
  };

  const handleToggleAutomation = (setting: string) => {
    setAutomationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
    toast.success(`${setting} automation ${automationSettings[setting as keyof typeof automationSettings] ? 'disabled' : 'enabled'}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-amber-500/20 text-amber-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <CheckCircle className="h-4 w-4" />;
      case 'communication': return <Mail className="h-4 w-4" />;
      case 'health': return <Shield className="h-4 w-4" />;
      case 'review': return <Activity className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-club-gold">{workflowStats.totalWorkflows}</div>
            <div className="text-sm text-club-light-gray/70">Total Workflows</div>
          </CardContent>
        </Card>
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{workflowStats.activeWorkflows}</div>
            <div className="text-sm text-club-light-gray/70">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{workflowStats.completedToday}</div>
            <div className="text-sm text-club-light-gray/70">Completed Today</div>
          </CardContent>
        </Card>
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{workflowStats.pendingActions}</div>
            <div className="text-sm text-club-light-gray/70">Pending Actions</div>
          </CardContent>
        </Card>
        <Card className="bg-club-dark-gray border-club-gold/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-club-gold">{workflowStats.automationSavings}h</div>
            <div className="text-sm text-club-light-gray/70">Weekly Savings</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Workflow Dashboard */}
      <Card className="bg-club-dark-gray border-club-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center text-club-gold">
            <Settings className="mr-2 h-5 w-5" />
            Workflow Automation Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-3 bg-club-black/40">
              <TabsTrigger value="active">Active Workflows</TabsTrigger>
              <TabsTrigger value="pending">Pending Actions</TabsTrigger>
              <TabsTrigger value="settings">Automation Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="space-y-3">
                {activeWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="bg-club-black/40 border-club-gold/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-club-light-gray">{workflow.name}</h4>
                            <Badge className={getStatusColor(workflow.status)}>
                              {workflow.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-club-light-gray/80 mb-3">{workflow.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-club-light-gray/70">Frequency: </span>
                              <span className="text-club-light-gray">{workflow.frequency}</span>
                            </div>
                            <div>
                              <span className="text-club-light-gray/70">Next Run: </span>
                              <span className="text-club-light-gray">{workflow.nextRun}</span>
                            </div>
                            <div>
                              <span className="text-club-light-gray/70">Type: </span>
                              <span className="text-club-light-gray capitalize">{workflow.type}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm" variant="outline" className="border-club-gold/30">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="border-club-gold/30">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="space-y-3">
                {pendingActions.map((action) => (
                  <Card key={action.id} className="bg-club-black/40 border-club-gold/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getTypeIcon(action.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-club-light-gray">{action.action}</h4>
                              <Badge className={getPriorityColor(action.priority)}>
                                {action.priority}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-club-light-gray/70">Player: </span>
                                <span className="text-club-light-gray">{action.player}</span>
                              </div>
                              <div>
                                <span className="text-club-light-gray/70">Due: </span>
                                <span className="text-club-light-gray">{action.dueDate}</span>
                              </div>
                              <div>
                                <span className="text-club-light-gray/70">Assigned: </span>
                                <span className="text-club-light-gray">{action.assignedTo}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" className="bg-club-gold text-club-black hover:bg-club-gold/90">
                            Complete
                          </Button>
                          <Button size="sm" variant="outline" className="border-club-gold/30">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                {Object.entries(automationSettings).map(([key, value]) => (
                  <Card key={key} className="bg-club-black/40 border-club-gold/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-club-light-gray capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-club-light-gray/70">
                            {key === 'milestoneAlerts' && 'Automatic notifications when development milestones are reached'}
                            {key === 'coachingReminders' && 'Reminders for coaching assessments and reviews'}
                            {key === 'parentCommunication' && 'Automated progress updates for academy parents'}
                            {key === 'injuryPrevention' && 'Workload monitoring and injury risk alerts'}
                            {key === 'performanceReviews' && 'Scheduled performance review reminders'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={() => handleToggleAutomation(key)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
