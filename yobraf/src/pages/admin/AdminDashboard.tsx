import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart,
  DollarSign,
  Eye,
  MessageCircle,
  BarChart3,
  Calendar,
  ArrowUpIcon,
  ArrowDownIcon,
  Plus,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, UserActivity } from '@/types/product';

export const AdminDashboard: React.FC = () => {
  const [products, setproducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch("/api/getProducts/")
      .then(res => res.json())
      .then(data => setproducts(data))
      .catch(() => setproducts([]));
  }, []);
  const [mockUserActivities, setMockUserActivities] = useState<UserActivity[]>([]);
  useEffect(() => {
    fetch("/api/getUserActivities/")
      .then(res => res.json())
      .then(data => setMockUserActivities(data))
      .catch(() => setMockUserActivities([]));
  }, []);

    
  const navigate = useNavigate();
  
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * 10), 0);
  const recentActivities = mockUserActivities.slice(0, 5);
  const totalOrders = 156; // Mock data
  const pendingOrders = 23; // Mock data

  const stats = [
    {
      title: 'Total Revenue',
      value: `ksh ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+23%',
      changeType: 'positive' as const,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      change: '+12%',
      changeType: 'positive' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      change: '+8%',
      changeType: 'positive' as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    },
    {
      title: 'Active Users',
      value: '1,247',
      icon: Users,
      change: '+15%',
      changeType: 'positive' as const,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/admin/category/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
          <Button 
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
          
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.changeType === 'positive';
          const ChangeIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
          
          return (
            <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg">
              <div className={`absolute inset-0 ksh {stat.bgColor} opacity-50`} />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
                <div className={`p-3 rounded-full ksh {stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ksh {stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative pt-0">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ksh {
                    isPositive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    <ChangeIcon className="h-3 w-3" />
                    {stat.change}
                  </div>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">In Stock</span>
              <span className="font-semibold text-emerald-600">{inStockProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Out of Stock</span>
              <span className="font-semibold text-red-600">{outOfStockProducts}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `ksh {(inStockProducts / totalProducts) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Completed</span>
              <span className="font-semibold text-emerald-600">{totalOrders - pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending</span>
              <span className="font-semibold text-orange-600">{pendingOrders}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `ksh {((totalOrders - pendingOrders) / totalOrders) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin/products/new')}
                className="h-16 flex-col gap-1"
              >
                <Package className="h-4 w-4" />
                <span className="text-xs">Add Product</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin/orders')}
                className="h-16 flex-col gap-1"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs">View Orders</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">ksh {product.price}</p>
                    <Badge variant={product.inStock ? 'default' : 'destructive'} className="text-xs">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>User Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const getIcon = (action: string) => {
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
                
                const Icon = getIcon(activity.action);
                
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}
                        {activity.productName && ` - ksh {activity.productName}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sales Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Sales chart will be displayed here</p>
              <p className="text-sm text-muted-foreground/75">Connect your analytics to view detailed insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};