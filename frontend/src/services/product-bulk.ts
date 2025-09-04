import { apiRequest, ApiResponse } from './api';

export type BulkOperation =
  | { operation: 'price_increase_percent'; percent: number }
  | { operation: 'price_decrease_percent'; percent: number }
  | { operation: 'set_category'; category_id: number }
  | { operation: 'set_status_active' }
  | { operation: 'set_status_inactive' }
  | { operation: 'set_stock_quantity'; stock_quantity: number };

export const ProductBulkService = {
  async update(productIds: number[], op: BulkOperation): Promise<ApiResponse<{ updated: number }>> {
    const payload: any = { product_ids: productIds, operation: op.operation, ...op };
    return await apiRequest<{ updated: number }>('POST', '/products/bulk-update', payload);
  },
};



