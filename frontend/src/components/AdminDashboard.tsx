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
  Search,
  Clock,
  Truck
} from 'lucide-react';
import { ProductBulkService } from '../services/product-bulk';
import { ReturnsList } from './ReturnsList';
import { ProductService, Product as ProductApi } from '../services/product';
import { PromotionService, Promotion as PromotionApi } from '../services/promotion';
import { OrderService, Order as OrderApi, OrderStatistics } from '../services/order';
import { UserService, User as UserApi, UserStatistics } from '../services/user';
import { DashboardService, DashboardStatistics } from '../services/dashboard';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  editor: string;
  category: string;
  price: number;
  originalPrice?: number;
  status: 'pending' | 'under review' | 'approved' | 'rejected';
  submitted: string;
  fullProduct?: ProductApi | null;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  is_paid: boolean;
  payment_method?: string;
  created_at: string;
  fullOrder?: OrderApi | null;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  total_orders: number;
  total_spent: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  roles: Array<{ id: number; name: string; slug: string }>;
  fullUser?: UserApi | null;
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('product-approval');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatistics | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
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
  
  // Product view modal state
  const [showProductViewModal, setShowProductViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductApi | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Order management state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatistics, setOrderStatistics] = useState<OrderStatistics | null>(null);
  const [showOrderViewModal, setShowOrderViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderApi | null>(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  
  // Customer management state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null);
  const [showCustomerViewModal, setShowCustomerViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<UserApi | null>(null);
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
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

  // Fetch products from backend - all products regardless of status
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await ProductService.getProducts({ 
        per_page: 100, // Get more products
        include_inactive: true, // Include inactive products
        detailed: true // Get detailed product data
      });
      
      if (response.success && response.data) {
        const mappedProducts = response.data.map((p: ProductApi) => {
          return {
          id: p.id.toString(),
          name: p.name,
          editor: 'System', // Default since we don't have editor info in API
          category: p.category?.name || 'Uncategorized',
          price: p.effective_price, // Use effective price (promotional or regular)
          originalPrice: p.has_promotional_price ? p.price : undefined, // Show original price if on promotion
          status: p.is_active ? 'approved' : 'pending' as 'pending' | 'under review' | 'approved' | 'rejected',
            submitted: new Date(p.created_at || Date.now()).toLocaleDateString(),
            // Store full product data for modal
            fullProduct: p
          };
        });
        setProducts(mappedProducts);
      } else {
        console.error('API response failed:', response);
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to mock data if API fails
      setProducts([
    { id: '1', name: 'MacBook Pro M3', editor: 'Sarah Wilson', category: 'Laptops', price: 1999, status: 'pending', submitted: '2 hours ago', fullProduct: null },
    { id: '2', name: 'Hyundai Oil Filter', editor: 'Mike Johnson', category: 'Auto Parts', price: 24.99, status: 'pending', submitted: '1 day ago', fullProduct: null },
    { id: '3', name: 'iPhone 15 Case', editor: 'Emily Brown', category: 'Accessories', price: 29.99, status: 'under review', submitted: '3 hours ago', fullProduct: null },
    { id: '4', name: 'Samsung Monitor', editor: 'Sarah Wilson', category: 'Electronics', price: 299, status: 'pending', submitted: '5 hours ago', fullProduct: null },
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

  // Toggle product status (active/inactive)
  const toggleProductStatus = async (productId: string, currentStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
      const isActive = newStatus === 'approved';
      
      const response = await ProductService.updateProductStatus(Number(productId), isActive);
      
      if (response.success) {
        // Update local state
        setProducts(prev => prev.map(p => 
          p.id === productId 
            ? { ...p, status: newStatus as 'pending' | 'under review' | 'approved' | 'rejected' }
            : p
        ));
        
        toast.success(`Product ${isActive ? 'activated' : 'deactivated'} successfully!`);
      } else {
        throw new Error(response.message || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Failed to update product status:', error);
      toast.error('Failed to update product status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Open product view modal
  const openProductViewModal = (product: Product) => {
    if (product.fullProduct) {
      setSelectedProduct(product.fullProduct);
      setShowProductViewModal(true);
    } else {
      toast.error('Product details not available');
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await OrderService.getOrders({
        per_page: 50
      });

      if (response.success && response.data) {
        const mappedOrders = response.data.map((order: OrderApi) => ({
          id: order.id.toString(),
          order_number: order.order_number,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          total_amount: Number(order.total_amount),
          status: order.status,
          is_paid: order.is_paid,
          payment_method: order.payment_method,
          created_at: new Date(order.created_at).toLocaleDateString(),
          fullOrder: order
        }));
        setOrders(mappedOrders);
      } else {
        console.error('API response failed:', response);
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Fallback to mock data if API fails
      setOrders([
        { id: '1', order_number: 'ORD-000001', customer_name: 'John Doe', customer_email: 'john@example.com', total_amount: 1299, status: 'processing', is_paid: true, payment_method: 'credit_card', created_at: '10 min ago', fullOrder: null },
        { id: '2', order_number: 'ORD-000002', customer_name: 'Jane Smith', customer_email: 'jane@example.com', total_amount: 89.99, status: 'shipped', is_paid: false, created_at: '1 hour ago', fullOrder: null },
        { id: '3', order_number: 'ORD-000003', customer_name: 'Bob Wilson', customer_email: 'bob@example.com', total_amount: 549, status: 'pending', is_paid: false, created_at: '2 hours ago', fullOrder: null },
        { id: '4', order_number: 'ORD-000004', customer_name: 'Alice Brown', customer_email: 'alice@example.com', total_amount: 299, status: 'delivered', is_paid: true, payment_method: 'paypal', created_at: '1 day ago', fullOrder: null },
      ]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch order statistics
  const fetchOrderStatistics = async () => {
    try {
      const response = await OrderService.getStatistics();
      if (response.success && response.data) {
        setOrderStatistics(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch order statistics:', error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdatingOrder(true);
      const response = await OrderService.updateOrderStatus(Number(orderId), newStatus);
      
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as any }
            : order
        ));
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status. Please try again.');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (orderId: string, isPaid: boolean) => {
    try {
      setIsUpdatingOrder(true);
      const response = await OrderService.updatePaymentStatus(Number(orderId), isPaid);
      
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, is_paid: isPaid }
            : order
        ));
        toast.success(`Order payment status updated to ${isPaid ? 'paid' : 'unpaid'}`);
      } else {
        throw new Error(response.message || 'Failed to update payment status');
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update payment status. Please try again.');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Open order view modal
  const openOrderViewModal = (order: Order) => {
    if (order.fullOrder) {
      setSelectedOrder(order.fullOrder);
      setShowOrderViewModal(true);
    } else {
      toast.error('Order details not available');
    }
  };

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);
      const response = await UserService.getUsers({
        per_page: 50
      });

      if (response.success && response.data) {
        const mappedCustomers = response.data.map((user: UserApi) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          total_orders: user.total_orders,
          total_spent: Number(user.total_spent),
          status: user.status,
          created_at: new Date(user.created_at).toLocaleDateString(),
          roles: user.roles,
          fullUser: user
        }));
        setCustomers(mappedCustomers);
      } else {
        console.error('API response failed:', response);
        throw new Error(response.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to fetch customers. Please try again.');
    } finally {
      setCustomersLoading(false);
    }
  };

  // Fetch user statistics
  const fetchUserStatistics = async () => {
    try {
      const response = await UserService.getStatistics();
      if (response.success && response.data) {
        setUserStatistics(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user statistics:', error);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStatistics = async () => {
    try {
      setDashboardLoading(true);
      const response = await DashboardService.getStatistics();
      if (response.success && response.data) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard statistics:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Update customer status
  const updateCustomerStatus = async (customerId: string, newStatus: string) => {
    try {
      setIsUpdatingCustomer(true);
      const response = await UserService.updateUserStatus(Number(customerId), newStatus);
      
      if (response.success) {
        setCustomers(prev => prev.map(customer => 
          customer.id === customerId 
            ? { ...customer, status: newStatus as any }
            : customer
        ));
        toast.success(`Customer status updated to ${newStatus}`);
      } else {
        throw new Error(response.message || 'Failed to update customer status');
      }
    } catch (error) {
      console.error('Failed to update customer status:', error);
      toast.error('Failed to update customer status. Please try again.');
    } finally {
      setIsUpdatingCustomer(false);
    }
  };

  // Open customer view modal
  const openCustomerViewModal = (customer: Customer) => {
    if (customer.fullUser) {
      setSelectedCustomer(customer.fullUser);
      setShowCustomerViewModal(true);
    } else {
      toast.error('Customer details not available');
    }
  };

  // Show delete confirmation dialog
  const showDeleteConfirmation = (customerId: string) => {
    setCustomerToDelete(customerId);
    setShowDeleteDialog(true);
  };

  // Delete customer
  const deleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      setIsUpdatingCustomer(true);
      const response = await UserService.deleteUser(Number(customerToDelete));
      
      if (response.success) {
        setCustomers(prev => prev.filter(customer => customer.id !== customerToDelete));
        toast.success('Customer deleted successfully');
        setShowDeleteDialog(false);
        setCustomerToDelete(null);
      } else {
        throw new Error(response.message || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
      toast.error('Failed to delete customer. Please try again.');
    } finally {
      setIsUpdatingCustomer(false);
    }
  };



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
    
    // Fetch products, orders, customers, and dashboard stats on mount
    fetchProducts();
    fetchAvailableProducts();
    fetchOrders();
    fetchOrderStatistics();
    fetchCustomers();
    fetchUserStatistics();
    fetchDashboardStatistics();
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
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchQuery))
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


              {/* User info - hidden on very small screens */}
              <div className="hidden sm:block text-right">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-600">{user?.email || 'user@example.com'}</p>
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
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-600">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Key Metrics - Using real data from backend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Pending Orders</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {dashboardLoading ? (
                  <div className="animate-pulse h-8 w-16 rounded">0</div>
                ) : (
                  dashboardStats?.pending_orders || 0
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Need attention</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {dashboardLoading ? '0 new' : `${dashboardStats?.new_orders_today || 0} new`}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {dashboardLoading ? (
                  <div className="animate-pulse h-8 w-20 rounded">0</div>
                ) : (
                  dashboardStats?.total_customers?.toLocaleString() || 0
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Active users</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {dashboardLoading ? '0' : `${dashboardStats?.active_customers_percentage || 0}%`}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Products Pending</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {dashboardLoading ? (
                  <div className="animate-pulse h-8 w-12 rounded">0</div>
                ) : (
                  dashboardStats?.products_pending || 0
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Awaiting approval</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {dashboardLoading ? '0 new' : `${dashboardStats?.new_products_this_week || 0} new`}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Monthly Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {dashboardLoading ? (
                  <div className="animate-pulse h-8 w-24 rounded">0</div>
                ) : (
                  `RWF ${dashboardStats?.monthly_revenue?.toLocaleString() || 0}`
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">This month</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {dashboardLoading ? '0' : `${dashboardStats?.revenue_growth_percentage || 0}%`}
                </Badge>
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
                              <span className="font-medium">RWF {product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  RWF {product.originalPrice}
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
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openProductViewModal(product)}
                                title="View Product Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-600 hover:text-green-700"
                                onClick={() => toggleProductStatus(product.id, product.status)}
                                disabled={isUpdatingStatus}
                                title={product.status === 'approved' ? 'Deactivate Product' : 'Activate Product'}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => toggleProductStatus(product.id, product.status)}
                                disabled={isUpdatingStatus}
                                title={product.status === 'approved' ? 'Deactivate Product' : 'Activate Product'}
                              >
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
                        <TableHead>Order Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordersLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              Loading orders...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.order_number}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{order.customer_name}</div>
                                <div className="text-sm text-gray-500">{order.customer_email}</div>
                              </div>
                            </TableCell>
                            <TableCell>RWF {Number(order.total_amount).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                            <TableCell>
                              <Badge className={order.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {order.is_paid ? 'Paid' : 'Unpaid'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{order.created_at}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openOrderViewModal(order)}
                                  title="View Order Details"
                                >
                                <Eye className="h-4 w-4" />
                              </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => updateOrderStatus(order.id, 'processing')}
                                  disabled={isUpdatingOrder || order.status === 'processing'}
                                  title="Mark as Processing"
                                >
                                  <Clock className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                                  disabled={isUpdatingOrder || order.status === 'shipped'}
                                  title="Mark as Shipped"
                                >
                                  <Truck className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-purple-600 hover:text-purple-700"
                                  onClick={() => updatePaymentStatus(order.id, !order.is_paid)}
                                  disabled={isUpdatingOrder}
                                  title={order.is_paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                                >
                                  {order.is_paid ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
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
                        <TableHead>Phone</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customersLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              Loading customers...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone || 'N/A'}</TableCell>
                            <TableCell>{customer.total_orders}</TableCell>
                            <TableCell>RWF {Number(customer.total_spent).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(customer.status)}>
                                {customer.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{customer.created_at}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openCustomerViewModal(customer)}
                                  title="View Customer Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => updateCustomerStatus(customer.id, 'active')}
                                  disabled={isUpdatingCustomer || customer.status === 'active'}
                                  title="Activate Customer"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-yellow-600 hover:text-yellow-700"
                                  onClick={() => updateCustomerStatus(customer.id, 'inactive')}
                                  disabled={isUpdatingCustomer || customer.status === 'inactive'}
                                  title="Deactivate Customer"
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => showDeleteConfirmation(customer.id)}
                                  disabled={isUpdatingCustomer}
                                  title="Delete Customer"
                                >
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
                              {product.name} - RWF {product.price} ({product.category?.name || 'No Category'})
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

      {/* Product View Modal */}
      {showProductViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Product Details</h2>
              <Button variant="ghost" onClick={() => setShowProductViewModal(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {selectedProduct.primary_image ? (
                    <img 
                      src={selectedProduct.primary_image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>
                
                {/* Additional Images */}
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.slice(0, 4).map((img, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={img.image_url} 
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Information */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={selectedProduct.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {selectedProduct.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {selectedProduct.category?.name || 'Uncategorized'}
                    </Badge>
                    {selectedProduct.subcategory && (
                      <Badge variant="outline">
                        {selectedProduct.subcategory.name}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl font-bold">RWF {selectedProduct.effective_price}</span>
                    {selectedProduct.has_promotional_price && (
                      <span className="text-lg text-gray-500 line-through">RWF {selectedProduct.price}</span>
                    )}
                    {selectedProduct.promotional_discount_percentage && (
                      <Badge className="bg-red-100 text-red-800">
                        -{selectedProduct.promotional_discount_percentage}%
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">
                    {selectedProduct.description || selectedProduct.short_description || 'No description available'}
                  </p>
                </div>
                
                {/* Product Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">SKU</h4>
                    <p className="text-gray-600">{selectedProduct.sku || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Brand</h4>
                    <p className="text-gray-600">{selectedProduct.brand?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Stock Status</h4>
                    <p className="text-gray-600">{selectedProduct.stock_status || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Stock Quantity</h4>
                    <p className="text-gray-600">{selectedProduct.stock_quantity || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Rating</h4>
                    <p className="text-gray-600">{selectedProduct.average_rating || 'N/A'} ({selectedProduct.total_reviews || 0} reviews)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Weight</h4>
                    <p className="text-gray-600">{selectedProduct.weight ? `${selectedProduct.weight} kg` : 'N/A'}</p>
                  </div>
                </div>
                
                {/* Specifications */}
                {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Specifications</h4>
                    <div className="space-y-1">
                      {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Features */}
                {selectedProduct.features && selectedProduct.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Features</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index} className="text-gray-600">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Tags */}
                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Timestamps */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Created:</span> {new Date(selectedProduct.created_at || '').toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span> {new Date(selectedProduct.updated_at || '').toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Order View Modal */}
      {showOrderViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order Details - {selectedOrder.order_number}</h2>
              <Button variant="ghost" onClick={() => setShowOrderViewModal(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Order Number:</span>
                      <span>{selectedOrder.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Payment Status:</span>
                      <Badge className={selectedOrder.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {selectedOrder.is_paid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Payment Method:</span>
                      <span>{selectedOrder.payment_method || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Created:</span>
                      <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{selectedOrder.customer_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phone:</span>
                      <span>{selectedOrder.customer_phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Shipping Address:</span>
                      <p className="text-sm text-gray-600 mt-1">{selectedOrder.shipping_address}</p>
                    </div>
                    {selectedOrder.billing_address && (
                      <div>
                        <span className="font-medium">Billing Address:</span>
                        <p className="text-sm text-gray-600 mt-1">{selectedOrder.billing_address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items and Totals */}
              <div className="space-y-6">
                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{item.product_name}</h4>
                            <p className="text-sm text-gray-600">SKU: {item.product_sku || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">RWF {Number(item.unit_price).toFixed(2)}</p>
                            <p className="text-sm text-gray-600">x{item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">RWF {Number(item.total_price).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Totals</h3>
                                      <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>RWF {Number(selectedOrder.subtotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>RWF {Number(selectedOrder.tax_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>RWF {Number(selectedOrder.shipping_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>-RWF {Number(selectedOrder.discount_amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>RWF {Number(selectedOrder.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Notes</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer View Modal */}
      {showCustomerViewModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Customer Details - {selectedCustomer.name}</h2>
              <Button variant="ghost" onClick={() => setShowCustomerViewModal(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedCustomer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Phone:</span>
                      <span>{selectedCustomer.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusColor(selectedCustomer.status)}>
                        {selectedCustomer.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Member Since:</span>
                      <span>{new Date(selectedCustomer.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Last Login:</span>
                      <span>{selectedCustomer.last_login_at ? new Date(selectedCustomer.last_login_at).toLocaleString() : 'Never'}</span>
                    </div>
                  </div>
                </div>

                {/* Roles */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Roles</h3>
                  <div className="space-y-2">
                    {selectedCustomer.roles.map((role) => (
                      <Badge key={role.id} variant="outline" className="mr-2">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Orders:</span>
                      <span>{selectedCustomer.total_orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Spent:</span>
                      <span>RWF {Number(selectedCustomer.total_spent).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Average Order Value:</span>
                      <span>RWF {selectedCustomer.total_orders > 0 ? (Number(selectedCustomer.total_spent) / selectedCustomer.total_orders).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                      selectedCustomer.orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{order.order_number}</h4>
                              <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${Number(order.total_amount).toFixed(2)}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-sm text-gray-600">Payment Status:</span>
                            <Badge className={order.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {order.is_paid ? 'Paid' : 'Unpaid'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No orders found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
              {customerToDelete && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Note:</strong> Customers with existing orders cannot be deleted. 
                    Please suspend them instead if you want to restrict their access.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowDeleteDialog(false)}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </AlertDialogAction>
            <AlertDialogAction
              onClick={deleteCustomer}
              className="bg-red-600 hover:bg-red-700"
              disabled={isUpdatingCustomer}
            >
              {isUpdatingCustomer ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;