
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ComplianceItem {
  id: string;
  category: string;
  item: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  completed: boolean;
  description: string;
}

export const PreventionChecklist = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const complianceItems: ComplianceItem[] = [
    {
      id: '1',
      category: 'Financial',
      item: 'Submit Q2 Financial Reports',
      priority: 'High',
      deadline: '2024-07-31',
      completed: false,
      description: 'Quarterly financial compliance documentation'
    },
    {
      id: '2',
      category: 'Squad Registration',
      item: 'Update Player Contracts Database',
      priority: 'High',
      deadline: '2024-08-15',
      completed: true,
      description: 'Ensure all player registrations are current'
    },
    {
      id: '3',
      category: 'Safety',
      item: 'Stadium Safety Certificate Renewal',
      priority: 'Medium',
      deadline: '2024-09-01',
      completed: false,
      description: 'Annual safety inspection and certification'
    },
    {
      id: '4',
      category: 'Medical',
      item: 'Player Medical Records Update',
      priority: 'Medium',
      deadline: '2024-08-30',
      completed: false,
      description: 'Complete medical assessments for all squad members'
    },
    {
      id: '5',
      category: 'Administrative',
      item: 'Insurance Policy Review',
      priority: 'Low',
      deadline: '2024-10-01',
      completed: true,
      description: 'Annual review of club insurance coverage'
    }
  ];

  const handleItemCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'High': { variant: 'outline' as const, color: 'text-red-400 border-red-400' },
      'Medium': { variant: 'outline' as const, color: 'text-yellow-400 border-yellow-400' },
      'Low': { variant: 'outline' as const, color: 'text-green-400 border-green-400' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {priority}
      </Badge>
    );
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const pendingItems = complianceItems.filter(item => !item.completed).length;
  const highPriorityItems = complianceItems.filter(item => !item.completed && item.priority === 'High').length;

  return (
    <Card className="bg-club-dark-gray border-club-gold/20">
      <CardHeader>
        <CardTitle className="text-club-gold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compliance Prevention Checklist
        </CardTitle>
        <CardDescription className="text-club-light-gray/70">
          Proactive measures to avoid future penalties
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-club-black/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{pendingItems}</div>
            <div className="text-sm text-club-light-gray/70">Pending Items</div>
          </div>
          <div className="text-center p-3 bg-club-black/30 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{highPriorityItems}</div>
            <div className="text-sm text-club-light-gray/70">High Priority</div>
          </div>
        </div>

        {/* Compliance Items */}
        <div className="space-y-3">
          {complianceItems.map((item) => {
            const daysUntilDeadline = getDaysUntilDeadline(item.deadline);
            const isOverdue = daysUntilDeadline < 0;
            const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
            
            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-all ${
                  item.completed 
                    ? 'bg-green-900/20 border-green-600/30'
                    : isOverdue
                    ? 'bg-red-900/20 border-red-600/30'
                    : isUrgent
                    ? 'bg-yellow-900/20 border-yellow-600/30'
                    : 'bg-club-black/30 border-club-gold/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      checked={item.completed || checkedItems[item.id] || false}
                      onCheckedChange={() => handleItemCheck(item.id)}
                      className="mt-1"
                      disabled={item.completed}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${item.completed ? 'text-green-400 line-through' : 'text-club-light-gray'}`}>
                          {item.item}
                        </span>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <p className="text-sm text-club-light-gray/70 mb-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-club-gold border-club-gold/30">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className={
                            isOverdue 
                              ? 'text-red-400' 
                              : isUrgent 
                              ? 'text-yellow-400' 
                              : 'text-club-light-gray/70'
                          }>
                            {isOverdue 
                              ? `${Math.abs(daysUntilDeadline)} days overdue`
                              : daysUntilDeadline === 0
                              ? 'Due today'
                              : `${daysUntilDeadline} days left`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {item.completed && (
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  )}
                  {isOverdue && !item.completed && (
                    <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-club-gold/20">
          <Button className="w-full bg-club-gold text-club-black hover:bg-club-gold/90">
            <Shield className="mr-2 h-4 w-4" />
            Generate Compliance Report
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};
