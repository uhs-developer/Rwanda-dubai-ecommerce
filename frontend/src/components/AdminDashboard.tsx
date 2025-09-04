import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  ArrowLeft,
  Menu,
  X,
  FolderOpen,
  Users,
  Package,
  BarChart3,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';
import { ProductBulkService } from '../services/product-bulk';
import { ReturnsList } from './ReturnsList';
import { ProductService, Product as ProductApi } from '../services/product';

import { PromotionService, Promotion as PromotionApi } from '../services/promotion';

interface Product {
  id: string;
  name: string;
  editor: string;
  category: string;
  price: number;
  originalPrice?: number;
  status: 'pending' | 'under review' | 'approved' | 'rejected';
  submitted: string;
}

interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'processing' | 'shipped' | 'pending' | 'delivered';
  date: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  joined: string;
}

interface Promotion {
  id: number;
  name: string;
  discount: string;
  status: 'active' | 'scheduled' | 'expired' | 'draft';
  startDate: string;
  endDate: string;
  description: string;
  category: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('product-approval');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showCreatePromotion, setShowCreatePromotion] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isActivatingPromotion, setIsActivatingPromotion] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedPromotionProducts, setSelectedPromotionProducts] = useState<number[]>([]);
  const [productsLoadingForPromotion, setProductsLoadingForPromotion] = useState(false);
  const [bulkOp, setBulkOp] = useState<'price_increase_percent' | 'price_decrease_percent' | 'set_category' | 'set_status_active' | 'set_status_inactive' | 'set_stock_quantity'>('price_increase_percent');
  const [bulkPercent, setBulkPercent] = useState<string>('');
  const [bulkStock, setBulkStock] = useState<string>('');
  const [bulkCategoryId, setBulkCategoryId] = useState<string>('');
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    discount: '',
    description: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await ProductService.getProducts({ per_page: 50 });
      if (response.success && response.data) {
        const mappedProducts = response.data.map((p: ProductApi) => ({
          id: p.id.toString(),
          name: p.name,
          editor: 'System', // Default since we don't have editor info in API
          category: p.category?.name || 'Uncategorized',
          price: p.effective_price, // Use effective price (promotional or regular)
          originalPrice: p.has_promotional_price ? p.price : undefined, // Show original price if on promotion
          status: p.is_active ? 'approved' : 'pending' as 'pending' | 'under review' | 'approved' | 'rejected',
          submitted: new Date(p.created_at || Date.now()).toLocaleDateString()
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to mock data if API fails
      setProducts([
    { id: '1', name: 'MacBook Pro M3', editor: 'Sarah Wilson', category: 'Laptops', price: 1999, status: 'pending', submitted: '2 hours ago' },
    { id: '2', name: 'Hyundai Oil Filter', editor: 'Mike Johnson', category: 'Auto Parts', price: 24.99, status: 'pending', submitted: '1 day ago' },
    { id: '3', name: 'iPhone 15 Case', editor: 'Emily Brown', category: 'Accessories', price: 29.99, status: 'under review', submitted: '3 hours ago' },
    { id: '4', name: 'Samsung Monitor', editor: 'Sarah Wilson', category: 'Electronics', price: 299, status: 'pending', submitted: '5 hours ago' },
      ]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch available products for promotion form
  const fetchAvailableProducts = async () => {
    try {
      setProductsLoadingForPromotion(true);
      const response = await PromotionService.getAvailableProducts();
      if (response.success && response.data) {
        setAvailableProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch available products:', error);
      setAvailableProducts([]);
    } finally {
      setProductsLoadingForPromotion(false);
    }
  };

  const orders: Order[] = [
    { id: 'ORD-001', customer: 'John Doe', total: 1299, status: 'processing', date: '10 min ago' },
    { id: 'ORD-002', customer: 'Jane Smith', total: 89.99, status: 'shipped', date: '1 hour ago' },
    { id: 'ORD-003', customer: 'Bob Wilson', total: 549, status: 'pending', date: '2 hours ago' },
    { id: 'ORD-004', customer: 'Alice Johnson', total: 199, status: 'delivered', date: '3 hours ago' },
  ];

  const customers: Customer[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', orders: 12, totalSpent: 2340, status: 'active', joined: '6 months ago' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', orders: 8, totalSpent: 1280, status: 'active', joined: '3 months ago' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', orders: 3, totalSpent: 450, status: 'inactive', joined: '1 month ago' },
    { id: '4', name: 'Alice Johnson', email: 'alice@example.com', orders: 15, totalSpent: 3200, status: 'active', joined: '1 year ago' },
  ];

  // Load promotions and products from API on component mount
  useEffect(() => {
    (async () => {
      try {
        const res = await PromotionService.list();
        const apiList = res.data?.data || [];
        const list = apiList.map((p: PromotionApi) => ({
          id: p.id,
          name: p.name,
          discount: p.discount_type === 'percentage' ? `${Number(p.discount_value)}% off` : `$${Number(p.discount_value)} off`,
          status: p.status as Promotion['status'],
          startDate: p.starts_at ? p.starts_at.substring(0, 10) : '',
          endDate: p.ends_at ? p.ends_at.substring(0, 10) : '',
          description: p.description || '',
          category: 'All Categories',
        }));
        setPromotions(list);
      } catch (e) {
        console.error('Failed to load promotions', e);
      }
    })();
    
    // Fetch products on mount
    fetchProducts();
    fetchAvailableProducts();
  }, []);

  const handleBackClick = () => {
    window.history.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'under review':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreatePromotion = async () => {
    if (!newPromotion.name || !newPromotion.discount) return;
    try {
      const numericDiscount = parseFloat(newPromotion.discount.replace(/[^0-9.]/g, '')) || 0;
      const created = await PromotionService.create({
        name: newPromotion.name,
        description: newPromotion.description,
        discount_type: 'percentage',
        discount_value: numericDiscount,
        status: 'scheduled',
        starts_at: newPromotion.startDate ? `${newPromotion.startDate}T00:00:00` : undefined,
        ends_at: newPromotion.endDate ? `${newPromotion.endDate}T23:59:59` : undefined,
        applicable_products: selectedPromotionProducts.length > 0 ? selectedPromotionProducts : undefined,
        stackable: false,
        is_public: true,
      });
      const p = created.data!;
      const view: Promotion = {
        id: p.id,
        name: p.name,
        discount: p.discount_type === 'percentage' ? `${Number(p.discount_value)}% off` : `$${Number(p.discount_value)} off`,
        status: p.status as Promotion['status'],
        startDate: p.starts_at ? p.starts_at.substring(0, 10) : '',
        endDate: p.ends_at ? p.ends_at.substring(0, 10) : '',
        description: p.description || '',
        category: 'All Categories',
      };
      setPromotions([...promotions, view]);
      setNewPromotion({ name: '', discount: '', description: '', category: '', startDate: '', endDate: '' });
      setSelectedPromotionProducts([]);
      setShowCreatePromotion(false);
    } catch (e) {
      console.error('Failed to create promotion', e);
    }
  };

  const handlePromotionStatusChange = async (id: number, newStatus: 'active' | 'scheduled' | 'expired') => {
    try {
      setIsActivatingPromotion(true);
      
      let response;
      if (newStatus === 'active') {
        response = await PromotionService.activate(id);
      } else if (newStatus === 'expired') {
        response = await PromotionService.expire(id);
      }
      
      // Update promotions list
      const updated = promotions.map(promo => 
        promo.id === id ? { ...promo, status: newStatus } : promo
      );
      setPromotions(updated);
      
      // Refresh products to show updated prices
      await fetchProducts();
      
      // Show success message
      if (response?.data && 'message' in response.data) {
        setDialogMessage((response.data as any).message);
        setShowSuccessDialog(true);
      } else {
        setDialogMessage(`Promotion ${newStatus} successfully!`);
        setShowSuccessDialog(true);
      }
      
    } catch (e) {
      console.error('Failed to update promotion status', e);
      setDialogMessage('Failed to update promotion status. Please try again.');
      setShowErrorDialog(true);
    } finally {
      setIsActivatingPromotion(false);
    }
  };

  const handleDeletePromotion = async (id: number) => {
    try {
      const response = await PromotionService.remove(id);
      setPromotions(promotions.filter(promo => promo.id !== id));
      
      // Refresh products to show restored prices
      await fetchProducts();
      
      // Show success message
      if (response?.data && 'message' in response.data) {
        setDialogMessage((response.data as any).message);
      } else {
        setDialogMessage('Promotion deleted successfully!');
      }
      setShowSuccessDialog(true);
    } catch (e) {
      console.error('Failed to delete promotion', e);
      setDialogMessage('Failed to delete promotion. Please try again.');
      setShowErrorDialog(true);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.editor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
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
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Administrator</p>
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
                <Button onClick={() => setShowCreatePromotion(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Create Promotion</span>
                  <span className="lg:hidden">Promotion</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Filters</span>
                  <span className="lg:hidden">Filter</span>
                </Button>
              </div>

              {/* User info - hidden on very small screens */}
              <div className="hidden sm:block text-right">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    M
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mike Admin</p>
                    <p className="text-xs text-gray-600">admin@techbridge.com</p>
                  </div>
                </div>
              </div>

              <Button variant="ghost" className="text-red-600 hover:text-red-700" size="sm">
                <span className="hidden sm:inline">→ Logout</span>
                <span className="sm:hidden">→</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t pt-4 pb-2">
              <div className="flex flex-col space-y-2">
                <Button onClick={() => setShowCreatePromotion(true)} className="justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Promotion
                </Button>
                <Button variant="outline" className="justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      M
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mike Admin</p>
                      <p className="text-xs text-gray-600">admin@techbridge.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Key Metrics - Matching the images exactly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Pending Orders</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">23</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Need attention</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">5 new</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">1,547</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Active users</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">12.5%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Products Pending</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">8</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Awaiting approval</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">3 new</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Monthly Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">$28,450</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">This month</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">8.2%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="product-approval" className="text-xs sm:text-sm">Product Approval</TabsTrigger>
            <TabsTrigger value="order-management" className="text-xs sm:text-sm">Order Management</TabsTrigger>
            <TabsTrigger value="customer-management" className="text-xs sm:text-sm">Customer Management</TabsTrigger>
            <TabsTrigger value="promotions" className="text-xs sm:text-sm">Promotions</TabsTrigger>
          </TabsList>

          {/* Product Approval Tab - Matching the image exactly */}
          <TabsContent value="product-approval" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Products Awaiting Approval</CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <input 
                            type="checkbox" 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds(filteredProducts.map(p => Number(p.id)));
                              } else {
                                setSelectedProductIds([]);
                              }
                            }}
                            checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                          />
                        </TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Editor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              Loading products...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <input 
                              type="checkbox" 
                              checked={selectedProductIds.includes(Number(product.id))}
                              onChange={(e) => {
                                const pid = Number(product.id);
                                setSelectedProductIds(prev => e.target.checked ? Array.from(new Set([...prev, pid])) : prev.filter(id => id !== pid));
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.editor}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">${product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{product.submitted}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Management Tab - Matching the image exactly */}
          <TabsContent value="order-management" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>${order.total}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{order.date}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
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

          {/* Customer Management Tab - Matching the image exactly */}
          <TabsContent value="customer-management" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Customer Management</CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.orders}</TableCell>
                          <TableCell>${customer.totalSpent}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(customer.status)}>
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{customer.joined}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
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

          {/* Promotions Tab - Working with localStorage */}
          <TabsContent value="promotions" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Active Promotions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Active Promotions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {promotions.filter(p => p.status === 'active' || p.status === 'scheduled').map((promotion) => (
                    <div key={promotion.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{promotion.name}</h4>
                          <p className="text-xs text-gray-600">{promotion.description}</p>
                        </div>
                        <Badge className={getStatusColor(promotion.status)}>
                          {promotion.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{promotion.discount}</span>
                        <span>{promotion.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Start: {promotion.startDate}</span>
                        <span>End: {promotion.endDate}</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1"
                          disabled={isActivatingPromotion}
                          onClick={() => handlePromotionStatusChange(promotion.id, 'active')}
                        >
                          {isActivatingPromotion ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          {isActivatingPromotion ? 'Activating...' : 'Activate'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => handleDeletePromotion(promotion.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setShowCreatePromotion(true)} 
                    className="w-full justify-start h-12"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Create New Promotion
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12" 
                    onClick={async () => {
                      try {
                        // Refresh products to get latest data before bulk update
                        await fetchProducts();
                        const ids = filteredProducts.map(p => Number(p.id)).filter(n => !Number.isNaN(n));
                        setSelectedProductIds(ids);
                      } catch {}
                      setShowBulkUpdate(true);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-3" />
                    Bulk Product Update
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12" 
                    disabled={isActivatingPromotion}
                    onClick={async () => {
                      try {
                        setIsActivatingPromotion(true);
                        const response = await PromotionService.applyToProducts();
                        await fetchProducts(); // Refresh products to show updated prices
                        
                        if (response?.data && 'message' in response.data) {
                          setDialogMessage((response.data as any).message);
                        } else {
                          setDialogMessage('Promotions applied to products successfully!');
                        }
                        setShowSuccessDialog(true);
                      } catch (error) {
                        console.error('Failed to apply promotions:', error);
                        setDialogMessage('Failed to apply promotions. Please try again.');
                        setShowErrorDialog(true);
                      } finally {
                        setIsActivatingPromotion(false);
                      }
                    }}
                  >
                    {isActivatingPromotion ? (
                      <RefreshCw className="h-4 w-4 mr-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-3" />
                    )}
                    {isActivatingPromotion ? 'Applying...' : 'Apply Promotions to Products'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12" onClick={() => setShowReturns(true)}>
                    <AlertTriangle className="h-4 w-4 mr-3" />
                    Review Returns
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Promotion Modal */}
      {showCreatePromotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Create New Promotion</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name</label>
                  <Input
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                    placeholder="e.g., Flash Sale - Electronics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                  <Input
                    value={newPromotion.discount}
                    onChange={(e) => setNewPromotion({...newPromotion, discount: e.target.value})}
                    placeholder="e.g., 20% off"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Input
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                    placeholder="Promotion description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Input
                    value={newPromotion.category}
                    onChange={(e) => setNewPromotion({...newPromotion, category: e.target.value})}
                    placeholder="e.g., Electronics, Auto Parts"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Select Products</label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPromotionProducts(availableProducts.map(p => p.id))}
                        className="text-xs"
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPromotionProducts([])}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                    {productsLoadingForPromotion ? (
                      <div className="text-center py-4">
                        <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                        Loading products...
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {availableProducts.map((product) => (
                          <div key={product.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`product-${product.id}`}
                              checked={selectedPromotionProducts.includes(product.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPromotionProducts([...selectedPromotionProducts, product.id]);
                                } else {
                                  setSelectedPromotionProducts(selectedPromotionProducts.filter(id => id !== product.id));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <label htmlFor={`product-${product.id}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                              {product.name} - ${product.price} ({product.category?.name || 'No Category'})
                            </label>
                          </div>
                        ))}
                        {availableProducts.length === 0 && (
                          <p className="text-sm text-gray-500">No products available</p>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedPromotionProducts.length} product(s) selected
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={newPromotion.startDate}
                      onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <Input
                      type="date"
                      value={newPromotion.endDate}
                      onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={handleCreatePromotion}
                  className="flex-1"
                  disabled={!newPromotion.name || !newPromotion.discount}
                >
                  Create Promotion
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreatePromotion(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Bulk Product Update</h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">Selected products: {selectedProductIds.length}</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                <select className="w-full border rounded px-3 py-2 text-sm" value={bulkOp} onChange={(e) => setBulkOp(e.target.value as any)}>
                  <option value="price_increase_percent">Increase price by %</option>
                  <option value="price_decrease_percent">Decrease price by %</option>
                  <option value="set_status_active">Set status Active</option>
                  <option value="set_status_inactive">Set status Inactive</option>
                  <option value="set_stock_quantity">Set stock quantity</option>
                  <option value="set_category">Set category</option>
                </select>
              </div>

              {(bulkOp === 'price_increase_percent' || bulkOp === 'price_decrease_percent') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percent</label>
                  <Input value={bulkPercent} onChange={(e) => setBulkPercent(e.target.value)} placeholder="e.g., 10" />
                </div>
              )}

              {bulkOp === 'set_stock_quantity' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock quantity</label>
                  <Input value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} placeholder="e.g., 100" />
                </div>
              )}

              {bulkOp === 'set_category' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
                  <Input value={bulkCategoryId} onChange={(e) => setBulkCategoryId(e.target.value)} placeholder="e.g., 3" />
                </div>
              )}
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                className="flex-1"
                disabled={
                  selectedProductIds.length === 0 ||
                  ((bulkOp === 'price_increase_percent' || bulkOp === 'price_decrease_percent') && (!bulkPercent || isNaN(parseFloat(bulkPercent)))) ||
                  (bulkOp === 'set_stock_quantity' && (!bulkStock || isNaN(parseInt(bulkStock, 10)))) ||
                  (bulkOp === 'set_category' && (!bulkCategoryId || isNaN(parseInt(bulkCategoryId, 10))))
                }
                onClick={async () => {
                  try {
                    const op: any = { operation: bulkOp };
                    if (bulkOp.includes('percent')) op.percent = parseFloat(bulkPercent || '0');
                    if (bulkOp === 'set_stock_quantity') op.stock_quantity = parseInt(bulkStock || '0', 10);
                    if (bulkOp === 'set_category') op.category_id = parseInt(bulkCategoryId || '0', 10);
                    await ProductBulkService.update(selectedProductIds, op);
                    
                    // Refresh products to show updated prices
                    await fetchProducts();
                    
                    setShowBulkUpdate(false);
                    setSelectedProductIds([]);
                    setBulkPercent('');
                    setBulkStock('');
                    setBulkCategoryId('');
                  } catch (e) {
                    console.error('Bulk update failed', e);
                  }
                }}
              >
                Apply
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowBulkUpdate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Returns Modal */}
      {showReturns && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Review Returns</h3>
            <ReturnsList onClose={() => setShowReturns(false)} />
          </div>
        </div>
      )}

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Success
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Error
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;