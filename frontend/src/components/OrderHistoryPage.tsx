import { useState, useEffect } from "react";
import { CustomerDashboardService, RecentOrder } from "../services/customerDashboard";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  ArrowLeft,
  Package,
  Eye,
  Download,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface OrderHistoryPageProps {
  onBack: () => void;
}

export function OrderHistoryPage({ onBack }: OrderHistoryPageProps) {
  const [selectedTab, setSelectedTab] = useState("all");
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string>("");

  // Load orders data
  const loadOrders = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError("");

      const response = await CustomerDashboardService.getUserOrders({
        per_page: 50, // Load more orders for better filtering
        page: 1
      });

      if (response.success && response.data) {
        // Handle both direct array response and paginated response
        const ordersData = Array.isArray(response.data) ? response.data : response.data.data;
        console.log('Orders API Response:', response);
        console.log('Orders Data:', ordersData);
        setOrders(ordersData || []);
      } else {
        throw new Error(response.message || 'Failed to load orders');
      }
    } catch (error: any) {
      console.error('Error loading orders:', error);
      setError(error.message || 'Failed to load orders');
      setOrders([]); // Ensure orders is always an array
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Set up real-time updates (polling every 60 seconds for orders)
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    loadOrders(true);
  };

  const getStatusIcon = (status: RecentOrder['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'refunded':
        return <XCircle className="h-4 w-4 text-purple-600" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: RecentOrder['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOrders = (status: string) => {
    if (!orders || !Array.isArray(orders)) return [];
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: RecentOrder }) => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">
              RWF {order.total_amount.toFixed(2)}
            </div>
            <Badge className={getStatusColor(order.status)}>
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Order Summary */}
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium">Order Summary</div>
          <div className="text-sm text-muted-foreground">
            {order.items_count} item{order.items_count !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Tracking Number */}
        {order.tracking_number && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium">Tracking Number</div>
            <div className="text-sm text-muted-foreground font-mono">
              {order.tracking_number}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Order History</h1>
              {isRefreshing && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {isLoading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                    <h3 className="text-lg font-medium mb-2">Loading orders...</h3>
                    <p className="text-muted-foreground">
                      Please wait while we fetch your order history.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {filterOrders('all')?.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  )) || []}
                  {(!filterOrders('all') || filterOrders('all').length === 0) && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders found</h3>
                        <p className="text-muted-foreground">
                          You haven't placed any orders yet. Start shopping to see your orders here.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-6">
              {isLoading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                    <h3 className="text-lg font-medium mb-2">Loading orders...</h3>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {filterOrders('pending')?.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  )) || []}
                  {(!filterOrders('pending') || filterOrders('pending').length === 0) && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No pending orders</h3>
                        <p className="text-muted-foreground">
                          You don't have any orders currently pending.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="processing">
            <div className="space-y-6">
              {filterOrders('processing')?.map((order) => (
                <OrderCard key={order.id} order={order} />
              )) || []}
              {(!filterOrders('processing') || filterOrders('processing').length === 0) && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No processing orders</h3>
                    <p className="text-muted-foreground">
                      You don't have any orders currently being processed.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shipped">
            <div className="space-y-6">
              {filterOrders('shipped')?.map((order) => (
                <OrderCard key={order.id} order={order} />
              )) || []}
              {(!filterOrders('shipped') || filterOrders('shipped').length === 0) && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No shipped orders</h3>
                    <p className="text-muted-foreground">
                      You don't have any orders currently shipped.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="delivered">
            <div className="space-y-6">
              {filterOrders('delivered')?.map((order) => (
                <OrderCard key={order.id} order={order} />
              )) || []}
              {(!filterOrders('delivered') || filterOrders('delivered').length === 0) && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No delivered orders</h3>
                    <p className="text-muted-foreground">
                      You don't have any delivered orders yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cancelled">
            <div className="space-y-6">
              {filterOrders('cancelled')?.map((order) => (
                <OrderCard key={order.id} order={order} />
              )) || []}
              {(!filterOrders('cancelled') || filterOrders('cancelled').length === 0) && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No cancelled orders</h3>
                    <p className="text-muted-foreground">
                      You don't have any cancelled orders.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}