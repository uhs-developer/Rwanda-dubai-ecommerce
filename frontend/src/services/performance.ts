import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface ProductPerformanceMetrics {
  total_products: number;
  active_products: number;
  draft_products: number;
  total_views: number;
  total_sales: number;
  average_rating: number;
  top_products: Array<{
    id: number;
    name: string;
    total_views: number;
    average_rating: number;
    category: {
      id: number;
      name: string;
    };
  }>;
  recent_products: Array<{
    id: number;
    name: string;
    status: string;
    created_at: string;
    category: {
      id: number;
      name: string;
    };
  }>;
}

export interface ContentPerformanceMetrics {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_comments: number;
  total_media_files: number;
  media_by_type: Record<string, number>;
  top_posts: Array<{
    id: number;
    title: string;
    views_count: number;
    comments_count: number;
    author: {
      id: number;
      name: string;
    };
  }>;
  recent_posts: Array<{
    id: number;
    title: string;
    status: string;
    created_at: string;
    author: {
      id: number;
      name: string;
    };
  }>;
}

export interface DashboardMetrics {
  products: {
    total: number;
    active: number;
    draft: number;
  };
  posts: {
    total: number;
    published: number;
    draft: number;
  };
  media: {
    total: number;
    images: number;
    videos: number;
  };
  recent_activity: {
    recent_products: Array<{
      id: number;
      name: string;
      created_at: string;
    }>;
    recent_posts: Array<{
      id: number;
      title: string;
      created_at: string;
    }>;
    recent_media: Array<{
      id: number;
      original_name: string;
      created_at: string;
    }>;
  };
}

class PerformanceService {
  private getAuthHeaders() {
    const token = localStorage.getItem('rwanda-dubai-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getProductPerformance(): Promise<{ success: boolean; message: string; data: ProductPerformanceMetrics }> {
    const response = await axios.get(`${API_BASE_URL}/performance/products`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getContentPerformance(): Promise<{ success: boolean; message: string; data: ContentPerformanceMetrics }> {
    const response = await axios.get(`${API_BASE_URL}/performance/content`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getDashboardMetrics(): Promise<{ success: boolean; message: string; data: DashboardMetrics }> {
    const response = await axios.get(`${API_BASE_URL}/performance/dashboard`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const performanceService = new PerformanceService();

