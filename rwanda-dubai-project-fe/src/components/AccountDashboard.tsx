import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft,
  Package,
  Heart,
  Settings,
  User,
  ShoppingBag,
  LogOut
} from "lucide-react";

interface AccountDashboardProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onBack: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function AccountDashboard({ user, onBack, onNavigate, onLogout }: AccountDashboardProps) {
  // Mock data - replace with real data from your backend
  const stats = {
    totalOrders: 2,
    wishlistItems: 0,
    accountStatus: "Active"
  };

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
              <h1 className="text-2xl font-bold">My Account</h1>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Welcome Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Welcome back, {user.name}!</h2>
                  <p className="text-muted-foreground">
                    Manage your account settings and view your order history
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    <div className="text-muted-foreground text-sm">Total Orders</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.wishlistItems}</div>
                    <div className="text-muted-foreground text-sm">Wishlist Items</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {stats.accountStatus}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground text-sm">Account Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('profile-settings')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Update your personal information
                </p>
                <Button variant="outline" size="sm">
                  Manage Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('order-history')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                  </div>
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {stats.totalOrders} orders
                </p>
                <Button variant="outline" size="sm">
                  View Orders
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('address-book')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  Address Book
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage shipping and billing addresses
                </p>
                <Button variant="outline" size="sm">
                  Manage Addresses
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('account-security')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Password and security settings
                </p>
                <Button variant="outline" size="sm">
                  Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('wishlist')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </div>
                  My Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {stats.wishlistItems} items saved
                </p>
                <Button variant="outline" size="sm">
                  View Wishlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
