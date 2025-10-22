import { apiRequest, ApiResponse } from './api';

export interface DashboardStatistics {
  pending_orders: number;
  total_customers: number;
  products_pending: number;
  monthly_revenue: number;
  new_orders_today: number;
  active_customers_percentage: number;
  new_products_this_week: number;
  revenue_growth_percentage: number;
}

export interface DashboardCard {
  title: string;
  value: number;
  subtitle: string;
  badge: string;
  icon: string;
}

export class DashboardService {
  /**
   * Get dashboard statistics
   */
  static async getStatistics(): Promise<ApiResponse<DashboardStatistics>> {
    return await apiRequest<DashboardStatistics>('GET', '/dashboard/statistics');
  }

  /**
   * Get dashboard cards data
   */
  static async getCards(): Promise<ApiResponse<DashboardCard[]>> {
    return await apiRequest<DashboardCard[]>('GET', '/dashboard/cards');
  }
}




























