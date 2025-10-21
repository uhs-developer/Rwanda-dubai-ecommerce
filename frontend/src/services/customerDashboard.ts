import { apiRequest, ApiResponse } from './api';

// Customer Dashboard Types
export interface CustomerStats {
  total_orders: number;
  total_spent: number;
  pending_orders: number;
  delivered_orders: number;
  wishlist_items: number;
  account_status: 'active' | 'inactive' | 'suspended';
  last_order_date?: string;
  member_since: string;
}

export interface RecentOrder {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  currency: string;
  created_at: string;
  items_count: number;
  tracking_number?: string;
}

export interface DashboardNotification {
  id: number;
  type: 'order_update' | 'promotion' | 'security' | 'general';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

export interface CustomerDashboardData {
  stats: CustomerStats;
  recent_orders: RecentOrder[];
  notifications: DashboardNotification[];
  quick_actions: QuickAction[];
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  color: string;
}

export interface Address {
  id: number;
  type: 'home' | 'work' | 'other';
  is_default: boolean;
  name: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  district: string;
  country: string;
  phone: string;
  postal_code?: string;
  created_at: string;
  updated_at: string;
}

export interface AddressListResponse {
  success: boolean;
  message: string;
  data: Address[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface CreateAddressData {
  type: 'home' | 'work' | 'other';
  is_default?: boolean;
  name: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  district: string;
  country: string;
  phone: string;
  postal_code?: string;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: number;
}

// Customer Dashboard Service
export class CustomerDashboardService {
  // Get dashboard data with real-time stats
  static async getDashboardData(): Promise<ApiResponse<CustomerDashboardData>> {
    return await apiRequest<CustomerDashboardData>('GET', '/customer/dashboard');
  }

  // Get customer statistics
  static async getCustomerStats(): Promise<ApiResponse<CustomerStats>> {
    return await apiRequest<CustomerStats>('GET', '/customer/stats');
  }

  // Get recent orders
  static async getRecentOrders(limit: number = 5): Promise<ApiResponse<RecentOrder[]>> {
    return await apiRequest<RecentOrder[]>('GET', `/customer/orders/recent?limit=${limit}`);
  }

  // Get notifications
  static async getNotifications(): Promise<ApiResponse<DashboardNotification[]>> {
    return await apiRequest<DashboardNotification[]>('GET', '/customer/notifications');
  }

  // Mark notification as read
  static async markNotificationAsRead(notificationId: number): Promise<ApiResponse> {
    return await apiRequest('PATCH', `/customer/notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  static async markAllNotificationsAsRead(): Promise<ApiResponse> {
    return await apiRequest('PATCH', '/customer/notifications/read-all');
  }

  // Get addresses
  static async getAddresses(): Promise<AddressListResponse> {
    const response = await apiRequest<AddressListResponse>('GET', '/customer/addresses');
    return response.data || { success: false, message: 'No data', data: [], meta: { total: 0, per_page: 0, current_page: 0, last_page: 0 } };
  }

  // Create new address
  static async createAddress(addressData: CreateAddressData): Promise<ApiResponse<Address>> {
    return await apiRequest<Address>('POST', '/customer/addresses', addressData);
  }

  // Update address
  static async updateAddress(addressData: UpdateAddressData): Promise<ApiResponse<Address>> {
    const { id, ...data } = addressData;
    return await apiRequest<Address>('PUT', `/customer/addresses/${id}`, data);
  }

  // Delete address
  static async deleteAddress(addressId: number): Promise<ApiResponse> {
    return await apiRequest('DELETE', `/customer/addresses/${addressId}`);
  }

  // Set default address
  static async setDefaultAddress(addressId: number): Promise<ApiResponse<Address>> {
    return await apiRequest<Address>('PATCH', `/customer/addresses/${addressId}/default`);
  }

  // Get user orders with filtering
  static async getUserOrders(filters: {
    status?: string;
    search?: string;
    per_page?: number;
    page?: number;
  } = {}): Promise<ApiResponse<{
    data: RecentOrder[];
    meta: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  }>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/customer/orders?${queryString}` : '/customer/orders';
    
    return await apiRequest('GET', endpoint);
  }

  // Get single order details
  static async getOrderDetails(orderId: number): Promise<ApiResponse<{
    order: RecentOrder;
    items: Array<{
      id: number;
      product_name: string;
      product_image?: string;
      quantity: number;
      unit_price: number;
      total_price: number;
      brand_name?: string;
    }>;
    shipping_address: Address;
    billing_address?: Address;
    payment_info: {
      method: string;
      reference?: string;
      paid_at?: string;
    };
  }>> {
    return await apiRequest('GET', `/customer/orders/${orderId}`);
  }

  // Update user profile
  static async updateProfile(profileData: {
    name?: string;
    phone?: string;
    avatar?: string;
  }): Promise<ApiResponse<{
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    status: string;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
  }>> {
    return await apiRequest('PUT', '/customer/profile', profileData);
  }

  // Change password
  static async changePassword(passwordData: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<ApiResponse> {
    return await apiRequest('POST', '/customer/change-password', passwordData);
  }

  // Get real-time updates (for WebSocket or polling)
  static async getRealTimeUpdates(): Promise<ApiResponse<{
    stats: CustomerStats;
    new_notifications: DashboardNotification[];
    order_updates: Array<{
      order_id: number;
      status: string;
      updated_at: string;
    }>;
  }>> {
    return await apiRequest('GET', '/customer/real-time-updates');
  }
}

export default CustomerDashboardService;

