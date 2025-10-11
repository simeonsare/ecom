import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  MessageCircle, 
  Search, 
  TrendingUp, 
  Users,
  Filter,
  Download
} from 'lucide-react';
import { mockUserActivities } from '@/data/mockData';
import { UserActivity } from '@/types/product';

export const UserActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>(mockUserActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activity.productName && activity.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = selectedAction === '' || activity.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const actionTypes = Array.from(new Set(activities.map(a => a.action)));

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'Product Viewed':
        return Eye;
      case 'WhatsApp Order':
        return MessageCircle;
      case 'Search Performed':
      case 'Category Browsed':
        return TrendingUp;
      default:
        return Users;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'WhatsApp Order':
        return 'bg-success/10 text-success';
      case 'Product Viewed':
        return 'bg-primary/10 text-primary';
      case 'Search Performed':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const activityStats = {
    totalActivities: activities.length,
    uniqueUsers: new Set(activities.map(a => a.userId)).size,
    orders: activities.filter(a => a.action === 'WhatsApp Order').length,
    views: activities.filter(a => a.action === 'Product Viewed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Activity</h1>
          <p className="text-muted-foreground">Monitor user interactions and behavior</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{activityStats.totalActivities}</div>
            <p className="text-sm text-muted-foreground">Total Activities</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{activityStats.uniqueUsers}</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{activityStats.orders}</div>
            <p className="text-sm text-muted-foreground">WhatsApp Orders</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{activityStats.views}</div>
            <p className="text-sm text-muted-foreground">Product Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-foreground"
            >
              <option value="">All Actions</option>
              {actionTypes.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const Icon = getActivityIcon(activity.action);
              
              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-fast">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.action)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{activity.userName}</h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{activity.action}</Badge>
                      {activity.productName && (
                        <span className="text-sm text-muted-foreground">
                          → {activity.productName}
                        </span>
                      )}
                    </div>
                    
                    {activity.details && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {activity.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline - Mock Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Activity chart would be displayed here</p>
              <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};