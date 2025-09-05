import { apiRequest, ApiResponse } from './api';

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
  total_orders: number;
  total_spent: number;
  orders?: Order[];
}

export interface Role {
  id: number;
  name: string;
  slug: string;
}

export interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  is_paid: boolean;
  created_at: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  new_users_this_month: number;
  users_with_orders: number;
  total_revenue: number;
  recent_users: User[];
}

export interface UserFilters {
  status?: string;
  search?: string;
  per_page?: number;
  page?: number;
}

export class UserService {
  // Get users with filtering and pagination
  static async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    
    return await apiRequest<UserListResponse>('GET', endpoint);
  }

  // Get single user by ID
  static async getUser(id: number): Promise<ApiResponse<User>> {
    return await apiRequest<User>('GET', `/users/${id}`);
  }

  // Update user
  static async updateUser(id: number, data: Partial<User>): Promise<ApiResponse<User>> {
    return await apiRequest<User>('PUT', `/users/${id}`, data);
  }

  // Update user status
  static async updateUserStatus(id: number, status: string): Promise<ApiResponse<User>> {
    return await apiRequest<User>('PATCH', `/users/${id}/status`, { status });
  }

  // Delete user
  static async deleteUser(id: number): Promise<ApiResponse<any>> {
    return await apiRequest<any>('DELETE', `/users/${id}`);
  }

  // Get user statistics
  static async getStatistics(): Promise<ApiResponse<UserStatistics>> {
    return await apiRequest<UserStatistics>('GET', '/users/statistics');
  }
}