import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface MediaFile {
  id: number;
  public_id: string;
  file_name: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  url: string;
  secure_url: string;
  format: string;
  width?: number;
  height?: number;
  resource_type: 'image' | 'video' | 'raw';
  metadata?: any;
  uploaded_by: number;
  product_id?: number;
  usage_type?: string;
  formatted_size?: string;
  is_image?: boolean;
  is_video?: boolean;
  thumbnail_url?: string;
  uploader?: {
    id: number;
    name: string;
    email: string;
  };
  product?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface MediaResponse {
  success: boolean;
  message: string;
  data: MediaFile[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface MediaStats {
  total_files: number;
  total_size: number;
  by_type: Record<string, number>;
  by_format: Record<string, number>;
  recent_uploads: MediaFile[];
}

export interface MediaStatsResponse {
  success: boolean;
  message: string;
  data: MediaStats;
}

class MediaService {
  private getAuthHeaders() {
    const token = localStorage.getItem('rwanda-dubai-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private getUploadHeaders() {
    const token = localStorage.getItem('rwanda-dubai-token');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  async getMediaFiles(params?: {
    resource_type?: string;
    format?: string;
    uploaded_by?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
    page?: number;
  }): Promise<MediaResponse> {
    const response = await axios.get(`${API_BASE_URL}/media`, {
      headers: this.getAuthHeaders(),
      params,
    });
    return response.data;
  }

  async getMediaFile(id: number): Promise<{ success: boolean; message: string; data: MediaFile }> {
    const response = await axios.get(`${API_BASE_URL}/media/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async uploadFile(file: File, options?: {
    folder?: string;
    public_id?: string;
    product_id?: number;
    usage_type?: string;
  }): Promise<{ success: boolean; message: string; data: MediaFile }> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    
    if (options?.public_id) {
      formData.append('public_id', options.public_id);
    }
    
    if (options?.product_id) {
      formData.append('product_id', options.product_id.toString());
    }
    
    if (options?.usage_type) {
      formData.append('usage_type', options.usage_type);
    }

    const response = await axios.post(`${API_BASE_URL}/media/upload`, formData, {
      headers: this.getUploadHeaders(),
    });
    return response.data;
  }

  async deleteMediaFile(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/media/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getMediaStats(): Promise<MediaStatsResponse> {
    const response = await axios.get(`${API_BASE_URL}/media/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Helper method to format file size
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  // Helper method to get file type icon
  getFileTypeIcon(resourceType: string, format: string): string {
    if (resourceType === 'image') {
      return '🖼️';
    } else if (resourceType === 'video') {
      return '🎥';
    } else {
      return '📄';
    }
  }
}

export const mediaService = new MediaService();
