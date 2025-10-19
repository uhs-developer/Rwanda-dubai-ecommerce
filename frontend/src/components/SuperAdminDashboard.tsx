import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Activity,
  ArrowUp,
  Search,
  Database,
  Zap,
  CreditCard,
  Mail,
  ArrowLeft,
  Menu,
  X,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  Filter,
  Download,
} from 'lucide-react';
import CreateAdminModal from './CreateAdminModal';
import CreateUserModal from './CreateUserModal';
import { 
  superAdminService, 
  DashboardOverview, 
  AdminUser, 
  SystemStatus, 
  ActivityLog, 
  AnalyticsData 
} from '../services/superAdminService';

// Types are now imported from the service

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('user-management');
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // API Data States
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: null,
    to: null
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'user-management':
        loadAdminUsers();
        break;
      case 'system-monitor':
        loadSystemData();
        break;
      case 'analytics':
        loadAnalyticsData();
        break;
    }
  }, [activeTab]);

  // Load admin users when search query changes
  useEffect(() => {
    if (activeTab === 'user-management') {
      const timeoutId = setTimeout(() => {
        loadAdminUsers();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  // Data loading functions
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await superAdminService.getDashboardOverview();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const response = await superAdminService.getAdminUsers({
        search: searchQuery || undefined,
        per_page: 15,
        page: pagination.current_page
      });
      setAdminUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load admin users:', error);
    }
  };

  const loadSystemData = async () => {
    try {
      const [statusData, activitiesData] = await Promise.all([
        superAdminService.getSystemStatus(),
        superAdminService.getRecentActivities({ limit: 20 })
      ]);
      setSystemStatus(statusData);
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Failed to load system data:', error);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      const data = await superAdminService.getAnalytics({ period: 30 });
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadDashboardData();
      switch (activeTab) {
        case 'user-management':
          await loadAdminUsers();
          break;
        case 'system-monitor':
          await loadSystemData();
          break;
        case 'analytics':
          await loadAnalyticsData();
          break;
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  // Helper functions using the service
  const getStatusColor = (status: string) => superAdminService.getStatusColor(status);
  const getStatusIcon = (status: string) => {
    const iconName = superAdminService.getStatusIcon(status);
    switch (iconName) {
      case 'check-circle':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'alert-triangle':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'x-circle':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };
  const formatCurrency = (amount: number) => superAdminService.formatCurrency(amount);
  const formatNumber = (num: number) => superAdminService.formatNumber(num);
  const formatLastLogin = (lastLogin: string) => superAdminService.formatLastLogin(lastLogin);

  // Safely format permission values that may be strings or objects from the API
  const formatPermission = (permission: any): string => {
    if (typeof permission === 'string') {
      return permission.replace(/_/g, ' ');
    }
    if (permission && typeof permission === 'object') {
      const label = (permission as any).name || (permission as any).slug || (permission as any).label || (permission as any).permission;
      return label ? String(label).replace(/_/g, ' ') : JSON.stringify(permission);
    }
    return String(permission);
  };

  // Filter users based on search query
  const filteredUsers = adminUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {/* Refresh button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>

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
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Export</span>
                  <span className="lg:hidden">Export</span>
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
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
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
              <div className="text-xl sm:text-2xl font-bold">
                {loading ? '...' : formatCurrency(dashboardData?.revenue.current || 0)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+{dashboardData?.revenue.growth || 0}%</span>
                <span className="ml-1 hidden sm:inline">vs last month</span>
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
              <div className="text-xl sm:text-2xl font-bold">
                {loading ? '...' : formatNumber(dashboardData?.users.total || 0)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+{dashboardData?.users.growth || 0}%</span>
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
              <div className="text-xl sm:text-2xl font-bold">
                {loading ? '...' : formatNumber(dashboardData?.orders.total || 0)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">+15.8%</span>
                <span className="ml-1 hidden sm:inline">All stores</span>
                <span className="ml-1 sm:hidden">stores</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">System Uptime</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {loading ? '...' : `${dashboardData?.performance.uptime || 0}%`}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="hidden sm:inline">Response time: {dashboardData?.performance.response_time || 0}ms</span>
                <span className="sm:hidden">RT: {dashboardData?.performance.response_time || 0}ms</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user-management" className="text-xs sm:text-sm">User Management</TabsTrigger>
            <TabsTrigger value="system-monitor" className="text-xs sm:text-sm">System Monitor</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
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
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button onClick={() => setShowCreateUser(true)} className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mobile view - Cards instead of table */}
                <div className="sm:hidden space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                            ) : (
                              <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
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
                          {user.status === 'active' ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                          {user.status}
                        </Badge>
                        <p className="text-xs text-gray-600">{formatLastLogin(user.lastLogin)}</p>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>Permissions: {user.permissions.join(', ')}</p>
                        <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
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
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                ) : (
                                  <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
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
                              {user.status === 'active' ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.permissions.slice(0, 2).map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {formatPermission(permission)}
                                </Badge>
                              ))}
                              {user.permissions.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.permissions.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{formatLastLogin(user.lastLogin)}</TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
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
                  <CardTitle className="text-lg sm:text-xl flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemStatus ? Object.entries(systemStatus).map(([key, status]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        {key === 'database' && <Database className="h-5 w-5 text-blue-600" />}
                        {key === 'apiServices' && <Zap className="h-5 w-5 text-green-600" />}
                        {key === 'paymentGateway' && <CreditCard className="h-5 w-5 text-purple-600" />}
                        {key === 'emailService' && <Mail className="h-5 w-5 text-orange-600" />}
                        {key === 'cache' && <Activity className="h-5 w-5 text-indigo-600" />}
                        {key === 'storage' && <Database className="h-5 w-5 text-teal-600" />}
                        <span className="text-sm sm:text-base font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <Badge className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">Loading system status...</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {recentActivities.length > 0 ? recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{activity.action}</p>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{activity.user}</p>
                        {activity.details && (
                          <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                          {activity.ipAddress && (
                            <p className="text-xs text-gray-500">IP: {activity.ipAddress}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">Loading recent activities...</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span className="font-medium">{dashboardData?.performance.uptime || 0}%</span>
                    </div>
                    <Progress value={dashboardData?.performance.uptime || 0} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span className="font-medium">{dashboardData?.performance.response_time || 0}ms</span>
                    </div>
                    <Progress value={100 - ((dashboardData?.performance.response_time || 0) / 10)} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Error Rate</span>
                      <span className="font-medium">{dashboardData?.performance.error_rate || 0}%</span>
                    </div>
                    <Progress value={100 - (dashboardData?.performance.error_rate || 0)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Month</span>
                      <span className="text-xl sm:text-2xl font-bold">
                        {loading ? '...' : formatCurrency(analyticsData?.revenue.current || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Previous Month</span>
                      <span className="text-lg sm:text-xl">
                        {loading ? '...' : formatCurrency(analyticsData?.revenue.previous || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Growth Rate</span>
                      <span className="text-base sm:text-lg font-semibold text-green-600 flex items-center">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        +{analyticsData?.revenue.growth || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Monthly Growth</span>
                      <span className="text-sm text-gray-600">+{analyticsData?.revenue.growth || 0}%</span>
                    </div>
                    <Progress value={analyticsData?.revenue.growth || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Users</span>
                      <span className="text-xl sm:text-2xl font-bold">
                        {loading ? '...' : formatNumber(analyticsData?.users.total || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Users</span>
                      <span className="text-lg sm:text-xl">
                        {loading ? '...' : formatNumber(analyticsData?.users.active || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New Users (30d)</span>
                      <span className="text-lg sm:text-xl">
                        {loading ? '...' : formatNumber(analyticsData?.users.new || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Growth Rate</span>
                      <span className="text-base sm:text-lg font-semibold text-green-600 flex items-center">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        +{analyticsData?.users.growth || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">User Growth</span>
                      <span className="text-sm text-gray-600">+{analyticsData?.users.growth || 0}%</span>
                    </div>
                    <Progress value={analyticsData?.users.growth || 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Order Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {loading ? '...' : formatNumber(analyticsData?.orders.total || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {loading ? '...' : formatNumber(analyticsData?.orders.pending || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {loading ? '...' : formatNumber(analyticsData?.orders.completed || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {loading ? '...' : formatNumber(analyticsData?.orders.cancelled || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Cancelled</div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
