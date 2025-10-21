import { ApiResponse, apiRequest } from './api';

export interface Promotion {
  id: number;
  name: string;
  slug: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  status: 'draft' | 'active' | 'scheduled' | 'expired';
  starts_at?: string;
  ends_at?: string;
  applicable_categories?: number[];
  applicable_products?: number[];
  stackable: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromotionList extends Array<Promotion> {}

export interface PromotionListResponse {
  data: Promotion[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreatePromotionRequest {
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  status: 'draft' | 'active' | 'scheduled';
  starts_at?: string;
  ends_at?: string;
  applicable_categories?: number[];
  applicable_products?: number[];
  stackable?: boolean;
  is_public?: boolean;
}

export interface UpdatePromotionRequest extends Partial<CreatePromotionRequest> {}

export const PromotionService = {
  async list(params?: { status?: string; search?: string; page?: number }): Promise<ApiResponse<PromotionListResponse>> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    const qs = query.toString();
    const endpoint = qs ? `/promotions?${qs}` : '/promotions';
    return await apiRequest<PromotionListResponse>('GET', endpoint);
  },

  async create(data: CreatePromotionRequest): Promise<ApiResponse<Promotion>> {
    return await apiRequest<Promotion>('POST', '/promotions', data);
  },

  async get(id: number): Promise<ApiResponse<Promotion>> {
    return await apiRequest<Promotion>('GET', `/promotions/${id}`);
  },

  async update(id: number, data: UpdatePromotionRequest): Promise<ApiResponse<Promotion>> {
    return await apiRequest<Promotion>('PUT', `/promotions/${id}`, data);
  },

  async remove(id: number): Promise<ApiResponse<{ message: string }>> {
    return await apiRequest<{ message: string }>('DELETE', `/promotions/${id}`);
  },

  async activate(id: number): Promise<ApiResponse<Promotion>> {
    return await apiRequest<Promotion>('POST', `/promotions/${id}/activate`);
  },

  async expire(id: number): Promise<ApiResponse<Promotion>> {
    return await apiRequest<Promotion>('POST', `/promotions/${id}/expire`);
  },

  async applyToProducts(): Promise<ApiResponse<{ message: string }>> {
    return await apiRequest<{ message: string }>('POST', '/promotions/apply-to-products');
  },

  async removeExpiredPromotions(): Promise<ApiResponse<{ message: string }>> {
    return await apiRequest<{ message: string }>('POST', '/promotions/remove-expired');
  },

  async getAvailableProducts(): Promise<ApiResponse<any[]>> {
    return await apiRequest<any[]>('GET', '/promotions/products/available');
  },
};




