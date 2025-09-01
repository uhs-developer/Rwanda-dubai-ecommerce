import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft,
  Package,
  Eye,
  Download,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

interface OrderHistoryPageProps {
  onBack: () => void;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  trackingNumber?: string;
  items: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

export function OrderHistoryPage({ onBack }: OrderHistoryPageProps) {
  const [selectedTab, setSelectedTab] = useState("all");

  // Mock data - replace with real data from your backend
  const orders: Order[] = [
    {
      id: "ORD-001",
      date: "1/15/2024",
      total: 899.99,
      status: "delivered",
      trackingNumber: "TRK123456789",
      items: [
        {
          name: "MacBook Air M2",
          image: "/api/placeholder/60/60",
          quantity: 1,
          price: 899.99
        }
      ]
    },
    {
      id: "ORD-002", 
      date: "1/10/2024",
      total: 1299.99,
      status: "shipped",
      trackingNumber: "TRK987654321",
      items: [
        {
          name: "iPhone 15 Pro",
          image: "/api/placeholder/60/60",
          quantity: 1,
          price: 1299.99
        }
      ]
    },
    {
      id: "ORD-003",
      date: "1/5/2024", 
      total: 299.99,
      status: "processing",
      items: [
        {
          name: "Hyundai Brake Pads",
          image: "/api/placeholder/60/60",
          quantity: 2,
          price: 149.99
        }
      ]
    }
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOrders = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">${order.total}</div>
            <Badge className={getStatusColor(order.status)}>
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Order Items */}
        <div className="space-y-4 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-15 h-15 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} • ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tracking Number */}
        {order.trackingNumber && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium">Tracking Number</div>
            <div className="text-sm text-muted-foreground font-mono">
              {order.trackingNumber}
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Order History</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {filterOrders('all').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {filterOrders('all').length === 0 && (
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
            </div>
          </TabsContent>

          <TabsContent value="processing">
            <div className="space-y-6">
              {filterOrders('processing').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {filterOrders('processing').length === 0 && (
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
              {filterOrders('shipped').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {filterOrders('shipped').length === 0 && (
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
              {filterOrders('delivered').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {filterOrders('delivered').length === 0 && (
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
              {filterOrders('cancelled').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {filterOrders('cancelled').length === 0 && (
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
