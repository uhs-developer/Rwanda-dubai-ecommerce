import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  author_id: number;
  meta_data?: any;
  views_count: number;
  comments_count: number;
  reading_time?: number;
  author?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  status?: 'draft' | 'published' | 'archived';
  meta_data?: any;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: number;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: Post[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface PostResponse {
  success: boolean;
  message: string;
  data: Post;
}

class PostService {
  private getAuthHeaders() {
    const token = localStorage.getItem('rwanda-dubai-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getPosts(params?: {
    status?: string;
    author_id?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
    page?: number;
  }): Promise<PostsResponse> {
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      headers: this.getAuthHeaders(),
      params,
    });
    return response.data;
  }

  async getPost(slug: string): Promise<PostResponse> {
    const response = await axios.get(`${API_BASE_URL}/posts/${slug}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async createPost(data: CreatePostData): Promise<PostResponse> {
    const response = await axios.post(`${API_BASE_URL}/posts`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async updatePost(id: number, data: Partial<CreatePostData>): Promise<PostResponse> {
    const response = await axios.put(`${API_BASE_URL}/posts/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async deletePost(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/posts/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }
}

export const postService = new PostService();

