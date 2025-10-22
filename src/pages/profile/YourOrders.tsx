import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const YourOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['user-orders', user?.id, filter],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        let query = supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                name,
                price,
                image_url
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (filter !== 'all') {
          query = query.eq('status', filter);
        }

        const { data, error } = await query;
        if (error) {
          console.error('Database error:', error);
          return [];
        }
        return data || [];
      } catch (err) {
        console.error('Query error:', err);
        return [];
      }
    },
    enabled: !!user,
  });

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <Clock className="h-4 w-4" />;
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <RefreshCw className="h-4 w-4" />;
      case 'out_for_delivery': return <Package className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
              <p className="text-gray-600 mt-2">Track and manage your order history</p>
            </div>
            <Card>
              <CardContent className="text-center py-12">
                <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
                <p className="text-gray-600 mb-6">
                  There was an error loading your orders. Please try again.
                </p>
                <Button onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your order history</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'preparing', label: 'Preparing' },
                { key: 'out_for_delivery', label: 'Out for Delivery' },
                { key: 'delivered', label: 'Delivered' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={filter === tab.key ? 'default' : 'outline'}
                  onClick={() => setFilter(tab.key)}
                  className="text-sm"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                          <p className="text-sm text-gray-600">
                            Placed on {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {order.status ? order.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Amount</span>
                        <span className="text-lg font-bold">₹{order.total_amount || 0}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Items</span>
                        <span className="text-sm text-gray-600">
                          {order.order_items?.length || 0} item(s)
                        </span>
                      </div>

                      {order.order_items && order.order_items.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2">Order Items:</p>
                          <div className="space-y-2">
                            {order.order_items.slice(0, 3).map((item: any, index: number) => (
                              <div key={index} className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                  {item.products?.image_url ? (
                                    <img 
                                      src={item.products.image_url} 
                                      alt={item.products.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  ) : (
                                    <Package className="h-4 w-4 text-gray-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.products?.name || 'Unknown Product'}</p>
                                  <p className="text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                                </div>
                              </div>
                            ))}
                            {order.order_items.length > 3 && (
                              <p className="text-sm text-gray-600">
                                +{order.order_items.length - 3} more items
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all' 
                    ? "You haven't placed any orders yet." 
                    : `No orders with status "${filter}" found.`
                  }
                </p>
                <Button onClick={() => navigate('/products')}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourOrders;
