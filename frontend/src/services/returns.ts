import { apiRequest, ApiResponse } from './api';

export interface ProductReturn {
  id: number;
  return_number: string;
  user_id: number;
  product_id: number;
  order_id?: number;
  quantity: number;
  refund_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  reason: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'damaged_shipping' | 'other';
  description?: string;
  admin_notes?: string;
  return_method: 'refund' | 'exchange' | 'store_credit';
  requested_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const ReturnsService = {
  async list(params?: { status?: string; search?: string; page?: number }): Promise<ApiResponse<Paginated<ProductReturn>>> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    const qs = query.toString();
    const endpoint = qs ? `/returns?${qs}` : '/returns';
    return await apiRequest<Paginated<ProductReturn>>('GET', endpoint);
  },

  async approve(id: number): Promise<ApiResponse<ProductReturn>> {
    return await apiRequest<ProductReturn>('POST', `/returns/${id}/approve`);
  },

  async reject(id: number): Promise<ApiResponse<ProductReturn>> {
    return await apiRequest<ProductReturn>('POST', `/returns/${id}/reject`);
  },

  async complete(id: number): Promise<ApiResponse<ProductReturn>> {
    return await apiRequest<ProductReturn>('POST', `/returns/${id}/complete`);
  },
};



