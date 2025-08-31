import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Settings, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Activity,
  ArrowUp,
  ArrowDown,
  Search,
  Database,
  Zap,
  CreditCard,
  Mail,
  Shield,
  Key,
  Globe,
  DollarSign,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import CreateAdminModal from './CreateAdminModal';
import CreateUserModal from './CreateUserModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor';
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface SystemStatus {
  database: 'Healthy' | 'Warning' | 'Error';
  apiServices: 'Running' | 'Stopped' | 'Warning';
  paymentGateway: 'Connected' | 'Disconnected' | 'Warning';
  emailService: 'Running' | 'Stopped' | 'Warning';
}

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  status: 'success' | 'error' | 'warning';
  timestamp: string;
}

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('user-management');
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data
  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@techbridge.com', role: 'Admin', status: 'active', lastLogin: '2 hours ago' },
    { id: '2', name: 'Sarah Wilson', email: 'sarah@techbridge.com', role: 'Editor', status: 'active', lastLogin: '1 day ago' },
    { id: '3', name: 'Mike Johnson', email: 'mike@techbridge.com', role: 'Admin', status: 'inactive', lastLogin: '1 week ago' },
    { id: '4', name: 'Emily Brown', email: 'emily@techbridge.com', role: 'Editor', status: 'active', lastLogin: '3 hours ago' },
  ];

  const systemStatus: SystemStatus = {
    database: 'Healthy',
    apiServices: 'Running',
    paymentGateway: 'Connected',
    emailService: 'Warning'
  };

  const recentActivity: ActivityLog[] = [
    { id: '1', action: 'User Login', user: 'john@techbridge.com', status: 'success', timestamp: '10:30:00 AM' },
    { id: '2', action: 'Product Updated', user: 'sarah@techbridge.com', status: 'success', timestamp: '10:25:00 AM' },
    { id: '3', action: 'Failed Login Attempt', user: 'unknown@email.com', status: 'error', timestamp: '10:20:00 AM' },
    { id: '4', action: 'Order Processed', user: 'system', status: 'success', timestamp: '10:15:00 AM' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
      case 'Running':
      case 'Connected':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Error':
      case 'Stopped':
      case 'Disconnected':
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackClick = () => {
    // Navigate back to previous page or home
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={handleBackClick}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">Back</span>
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Super Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">System Administrator</p>
              </div>
            </div>

            {/* Right side - Actions and user info */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Desktop actions */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button onClick={() => setShowCreateAdmin(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Create Admin</span>
                  <span className="lg:hidden">Admin</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Settings</span>
                  <span className="lg:hidden">Settings</span>
                </Button>
              </div>

              {/* User info - hidden on very small screens */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">Alex SuperAdmin</p>
                <p className="text-xs text-gray-600">superadmin@techbridge.com</p>
              </div>

              <Button variant="ghost" className="text-red-600 hover:text-red-700" size="sm">
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t pt-4 pb-2">
              <div className="flex flex-col space-y-2">
                <Button onClick={() => setShowCreateAdmin(true)} className="justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Admin
                </Button>
                <Button variant="outline" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-gray-900">Alex SuperAdmin</p>
                  <p className="text-xs text-gray-600">superadmin@techbridge.com</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">$124,573</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">12.5%</span>
                <span className="ml-1 hidden sm:inline">All time</span>
                <span className="ml-1 sm:hidden">vs last</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">12,543</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">8.2%</span>
                <span className="ml-1 hidden sm:inline">Active accounts</span>
                <span className="ml-1 sm:hidden">active</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">8,129</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">15.8%</span>
                <span className="ml-1 hidden sm:inline">All stores</span>
                <span className="ml-1 sm:hidden">stores</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">99.9%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="hidden sm:inline">Uptime</span>
                <span className="sm:hidden">Up</span>
                <ArrowDown className="h-3 w-3 text-red-600 ml-1" />
                <span className="text-red-600 ml-1">0.1%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="user-management" className="text-xs sm:text-sm">User Management</TabsTrigger>
            <TabsTrigger value="system-monitor" className="text-xs sm:text-sm">System Monitor</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="global-settings" className="text-xs sm:text-sm">Global Settings</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="user-management" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Admin & Editor Management</CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                  <Button onClick={() => setShowCreateUser(true)} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mobile view - Cards instead of table */}
                <div className="sm:hidden space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'} className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 'destructive'}
                          className={`text-xs ${getStatusColor(user.status)}`}
                        >
                          {user.status}
                        </Badge>
                        <p className="text-xs text-gray-600">{user.lastLogin}</p>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop view - Table */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.status === 'active' ? 'default' : 'destructive'}
                              className={getStatusColor(user.status)}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{user.lastLogin}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Monitor Tab */}
          <TabsContent value="system-monitor" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <span className="text-sm sm:text-base">Database</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.database)}>
                      {systemStatus.database}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-green-600" />
                      <span className="text-sm sm:text-base">API Services</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.apiServices)}>
                      {systemStatus.apiServices}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      <span className="text-sm sm:text-base">Payment Gateway</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.paymentGateway)}>
                      {systemStatus.paymentGateway}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-orange-600" />
                      <span className="text-sm sm:text-base">Email Service</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.emailService)}>
                      {systemStatus.emailService}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          activity.status === 'success' ? 'bg-green-500' : 
                          activity.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{activity.action}</p>
                          <p className="text-xs text-gray-600 truncate">{activity.user}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="text-xl sm:text-2xl font-bold">$24,573</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Month</span>
                    <span className="text-lg sm:text-xl">$21,890</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Growth Rate</span>
                    <span className="text-base sm:text-lg font-semibold text-green-600">+12.3%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">User Growth</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Users (30d)</span>
                    <span className="text-xl sm:text-2xl font-bold">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-lg sm:text-xl">8,942</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Retention Rate</span>
                    <span className="text-base sm:text-lg font-semibold text-green-600">87.5%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Global Settings Tab */}
          <TabsContent value="global-settings" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <CreditCard className="h-4 w-4 mr-3" />
                    Configure Payment Gateways
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <DollarSign className="h-4 w-4 mr-3" />
                    Tax Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Globe className="h-4 w-4 mr-3" />
                    Currency Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Shield className="h-4 w-4 mr-3" />
                    Security Policies
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Key className="h-4 w-4 mr-3" />
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Zap className="h-4 w-4 mr-3" />
                    API Access Control
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateAdminModal 
        isOpen={showCreateAdmin} 
        onClose={() => setShowCreateAdmin(false)} 
      />
      <CreateUserModal 
        isOpen={showCreateUser} 
        onClose={() => setShowCreateUser(false)} 
      />
    </div>
  );
};

export default SuperAdminDashboard;
