import apiClient from './api';

export interface DashboardOverview {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  performance: {
    uptime: number;
    response_time: number;
    error_rate: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  permissions: string[];
  createdAt: string;
  avatar?: string;
}

export interface SystemStatus {
  database: 'Healthy' | 'Warning' | 'Error';
  apiServices: 'Running' | 'Stopped' | 'Warning';
  paymentGateway: 'Connected' | 'Disconnected' | 'Warning';
  emailService: 'Running' | 'Stopped' | 'Warning';
  cache: 'Healthy' | 'Warning' | 'Error';
  storage: 'Healthy' | 'Warning' | 'Error';
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  status: 'success' | 'error' | 'warning';
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

export interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
}

export interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
  permissions?: string[];
}

export interface UpdateAdminUserRequest {
  name?: string;
  email?: string;
  status?: 'active' | 'inactive';
  role?: 'admin' | 'editor';
  permissions?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

class SuperAdminService {
  private baseUrl = '/super-admin';

  // Dashboard Overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    const response = await apiClient.get(`${this.baseUrl}/dashboard/overview`);
    return response.data.data;
  }

  // Admin Users Management
  async getAdminUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<AdminUser>> {
    const response = await apiClient.get(`${this.baseUrl}/users`, { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  }

  async createAdminUser(userData: CreateAdminUserRequest): Promise<AdminUser> {
    const response = await apiClient.post(`${this.baseUrl}/users`, userData);
    return response.data.data;
  }

  async updateAdminUser(id: string, userData: UpdateAdminUserRequest): Promise<AdminUser> {
    const response = await apiClient.put(`${this.baseUrl}/users/${id}`, userData);
    return response.data.data;
  }

  async deleteAdminUser(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/users/${id}`);
  }

  // System Monitoring
  async getSystemStatus(): Promise<SystemStatus> {
    const response = await apiClient.get(`${this.baseUrl}/system/status`);
    return response.data.data;
  }

  async getRecentActivities(params?: {
    limit?: number;
  }): Promise<ActivityLog[]> {
    const response = await apiClient.get(`${this.baseUrl}/system/activities`, { params });
    return response.data.data;
  }

  // Analytics
  async getAnalytics(params?: {
    period?: number;
  }): Promise<AnalyticsData> {
    const response = await apiClient.get(`${this.baseUrl}/analytics`, { params });
    return response.data.data;
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  formatLastLogin(lastLogin: string): string {
    if (!lastLogin || lastLogin === 'Never') {
      return 'Never';
    }
    return lastLogin;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Healthy':
      case 'Running':
      case 'Connected':
      case 'success':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Error':
      case 'Stopped':
      case 'Disconnected':
      case 'error':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Healthy':
      case 'Running':
      case 'Connected':
      case 'success':
      case 'active':
        return 'check-circle';
      case 'Warning':
        return 'alert-triangle';
      case 'Error':
      case 'Stopped':
      case 'Disconnected':
      case 'error':
      case 'inactive':
        return 'x-circle';
      default:
        return 'clock';
    }
  }
}

export const superAdminService = new SuperAdminService();
