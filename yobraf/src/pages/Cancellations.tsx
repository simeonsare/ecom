import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar,
  Package,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface CancelledOrder {
  id: string;
  orderNumber: string;
  date: string;
  cancelDate: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  refundAmount: number;
  status: 'cancelled' | 'refund-pending' | 'refunded';
  reason: string;
  refundMethod: string;
}

const mockCancelledOrders: CancelledOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    cancelDate: '2024-01-16',
    items: [
      {
        name: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: 79.99,
        image: '/placeholder.svg'
      }
    ],
    total: 79.99,
    refundAmount: 79.99,
    status: 'refunded',
    reason: 'Changed mind',
    refundMethod: 'Original payment method'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-20',
    cancelDate: '2024-01-21',
    items: [
      {
        name: 'Smart Watch Series 5',
        quantity: 1,
        price: 299.99,
        image: '/placeholder.svg'
      },
      {
        name: 'Watch Band - Leather',
        quantity: 1,
        price: 49.99,
        image: '/placeholder.svg'
      }
    ],
    total: 349.98,
    refundAmount: 349.98,
    status: 'refund-pending',
    reason: 'Product defect',
    refundMethod: 'Original payment method'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-02-01',
    cancelDate: '2024-02-02',
    items: [
      {
        name: 'Gaming Mechanical Keyboard',
        quantity: 1,
        price: 129.99,
        image: '/placeholder.svg'
      }
    ],
    total: 129.99,
    refundAmount: 129.99,
    status: 'cancelled',
    reason: 'Ordered by mistake',
    refundMethod: 'Store credit'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'refunded':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'refund-pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'refunded':
      return <CheckCircle className="h-4 w-4" />;
    case 'refund-pending':
      return <Clock className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <RefreshCw className="h-4 w-4" />;
  }
};

export const Cancellations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = mockCancelledOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRefunds = mockCancelledOrders
    .filter(order => order.status === 'refunded')
    .reduce((sum, order) => sum + order.refundAmount, 0);

  const pendingRefunds = mockCancelledOrders
    .filter(order => order.status === 'refund-pending')
    .reduce((sum, order) => sum + order.refundAmount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/account">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">My Cancellations</h1>
            <p className="text-muted-foreground">View and track your cancelled orders and refunds</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockCancelledOrders.length}</div>
              <p className="text-xs text-muted-foreground">Orders cancelled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refunds Processed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRefunds.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Successfully refunded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingRefunds.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Being processed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refund-pending">Refund Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert className="mb-6">
          <RefreshCw className="h-4 w-4" />
          <AlertDescription>
            Refunds typically take 3-5 business days to appear in your account. Store credit refunds are available immediately.
          </AlertDescription>
        </Alert>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No cancelled orders found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search criteria' 
                    : "You haven't cancelled any orders yet"}
                </p>
                <Button variant="outline" asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order {order.orderNumber}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Ordered: {new Date(order.date).toLocaleDateString()}</span>
                        <span>Cancelled: {new Date(order.cancelDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium mb-2">Cancellation Details</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-medium">Reason:</span> {order.reason}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Refund Method:</span> {order.refundMethod}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Refund Information</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-medium">Original Total:</span> ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Refund Amount:</span> ${order.refundAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status === 'refunded' && (
                      <Button variant="outline" size="sm">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Reorder Items
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};