import { apiRequest, ApiResponse } from './api';

// Order Types
export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  billing_address?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  is_paid: boolean;
  payment_method?: string;
  payment_reference?: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_sku?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  product_metadata?: {
    name: string;
    slug: string;
    image?: string;
  };
  product?: {
    id: number;
    name: string;
    slug: string;
    primary_image?: string;
  };
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  data: Order[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface OrderStatistics {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  paid_orders: number;
  unpaid_orders: number;
  total_revenue: number;
  recent_orders: Order[];
}

export interface OrderFilters {
  status?: string;
  is_paid?: boolean;
  search?: string;
  per_page?: number;
  page?: number;
}

export class OrderService {
  // Get orders with filtering and pagination
  static async getOrders(filters: OrderFilters = {}): Promise<OrderListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    return await apiRequest<OrderListResponse>('GET', endpoint);
  }

  // Get single order by ID
  static async getOrder(id: number): Promise<ApiResponse<Order>> {
    return await apiRequest<Order>('GET', `/orders/${id}`);
  }

  // Update order
  static async updateOrder(id: number, data: Partial<Order>): Promise<ApiResponse<Order>> {
    return await apiRequest<Order>('PUT', `/orders/${id}`, data);
  }

  // Update order status
  static async updateOrderStatus(id: number, status: string): Promise<ApiResponse<Order>> {
    return await apiRequest<Order>('PATCH', `/orders/${id}/status`, { status });
  }

  // Update payment status
  static async updatePaymentStatus(
    id: number, 
    isPaid: boolean, 
    paymentMethod?: string, 
    paymentReference?: string
  ): Promise<ApiResponse<Order>> {
    return await apiRequest<Order>('PATCH', `/orders/${id}/payment`, {
      is_paid: isPaid,
      payment_method: paymentMethod,
      payment_reference: paymentReference,
    });
  }

  // Get order statistics
  static async getStatistics(): Promise<ApiResponse<OrderStatistics>> {
    return await apiRequest<OrderStatistics>('GET', '/orders/statistics');
  }
}

