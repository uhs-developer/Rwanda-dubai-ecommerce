import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

class CategoryService {
  private getAuthHeaders() {
    const token = localStorage.getItem('rwanda-dubai-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getCategories(): Promise<CategoriesResponse> {
    const response = await axios.get(`${API_BASE_URL}/categories`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getCategory(slug: string): Promise<{ success: boolean; message: string; data: Category }> {
    const response = await axios.get(`${API_BASE_URL}/categories/${slug}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const categoryService = new CategoryService();

