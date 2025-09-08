import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import {
  Eye,
  Edit,
  Plus,
  ArrowLeft,
  Search,
  Upload,
  MessageCircle,
  Package,
  FileText,
  Image,
  Loader2,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { ProductService, Product as ApiProduct, CreateProductData, createProduct, Brand, Subcategory } from '../services/product'; // Updated interface
import { postService, Post as ApiPost, CreatePostData } from '../services/post';
import { mediaService, MediaFile as ApiMediaFile } from '../services/media';
import { performanceService, ProductPerformanceMetrics, ContentPerformanceMetrics } from '../services/performance';
import { categoryService, Category as ApiCategory } from '../services/category';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

// Legacy interfaces removed - using API types instead

const EditorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-products');
  const [searchQuery, setSearchQuery] = useState('');

  // Real data state
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [blogPosts, setBlogPosts] = useState<ApiPost[]>([]);
  const [mediaFiles, setMediaFiles] = useState<ApiMediaFile[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformanceMetrics | null>(null);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformanceMetrics | null>(null);

  // Loading states
  const [productsLoading, setProductsLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [performanceLoading, setPerformanceLoading] = useState(false);

  // Modal states
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showViewProductModal, setShowViewProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [showMediaUploadModal, setShowMediaUploadModal] = useState(false);

  // Form states
  const [newProductForm, setNewProductForm] = useState<Partial<CreateProductData>>({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    original_price: 0,
    cost_price: 0,
    category_id: 1, // Default to Electronics category
    subcategory_id: undefined,
    brand_id: undefined,
    sku: '',
    stock_quantity: 0,
    min_stock_level: 5,
    weight: 0,
    dimensions: '',
    meta_title: '',
    meta_description: '',
    is_active: false, // Set to false by default
    is_featured: false,
    is_digital: false
  });

  const [editProductForm, setEditProductForm] = useState<Partial<CreateProductData>>({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    original_price: 0,
    cost_price: 0,
    category_id: 1,
    subcategory_id: undefined,
    brand_id: undefined,
    sku: '',
    stock_quantity: 0,
    min_stock_level: 5,
    weight: 0,
    dimensions: '',
    meta_title: '',
    meta_description: '',
    is_active: false,
    is_featured: false,
    is_digital: false
  });

  const [newPostForm, setNewPostForm] = useState<Partial<CreatePostData>>({
    title: '',
    content: '',
    status: 'draft'
  });

  const [uploadingFile, setUploadingFile] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [selectedProductForMedia, setSelectedProductForMedia] = useState<number | null>(null);
  const [selectedUsageType, setSelectedUsageType] = useState<string>('general');

  // Data fetching functions
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await ProductService.getProducts({
        per_page: 50,
        include_inactive: true // Include inactive products for editors
      });
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    setPostsLoading(true);
    try {
      const response = await postService.getPosts({ per_page: 50 });
      setBlogPosts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchMediaFiles = async () => {
    setMediaLoading(true);
    try {
      const response = await mediaService.getMediaFiles({ per_page: 50 });
      setMediaFiles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch media files:', error);
    } finally {
      setMediaLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await ProductService.getBrands();
      setBrands(response.data || []);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  const fetchSubcategories = async (categoryId?: number) => {
    try {
      const response = await ProductService.getSubcategories(categoryId);
      setSubcategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };

  const fetchPerformanceMetrics = async () => {
    setPerformanceLoading(true);
    try {
      const [productMetrics, contentMetrics] = await Promise.all([
        performanceService.getProductPerformance(),
        performanceService.getContentPerformance()
      ]);
      setProductPerformance(productMetrics.data);
      setContentPerformance(contentMetrics.data);
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    } finally {
      setPerformanceLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProducts();
    fetchBlogPosts();
    fetchMediaFiles();
    fetchCategories();
    fetchBrands();
    fetchSubcategories();
    fetchPerformanceMetrics();
  }, []);

  // Load data when switching tabs
  useEffect(() => {
    if (activeTab === 'my-products') {
      fetchProducts();
    } else if (activeTab === 'blog-posts') {
      fetchBlogPosts();
    } else if (activeTab === 'media-library') {
      fetchMediaFiles();
    } else if (activeTab === 'performance') {
      fetchPerformanceMetrics();
    }
  }, [activeTab]);

  const handleBackClick = () => {
    window.history.back();
  };

  // Handle category change to fetch subcategories
  const handleCategoryChange = (categoryId: number) => {
    setNewProductForm({ ...newProductForm, category_id: categoryId, subcategory_id: undefined });
    fetchSubcategories(categoryId);
  };

  // Form handlers
  const handleCreateProduct = async () => {
    setCreatingProduct(true);
    try {
      await createProduct(newProductForm as CreateProductData);
      toast.success('Product created successfully!');
      setShowNewProductModal(false);
      setNewProductForm({
        name: '',
        description: '',
        short_description: '',
        price: 0,
        original_price: 0,
        cost_price: 0,
        category_id: 1,
        subcategory_id: undefined,
        brand_id: undefined,
        sku: '',
        stock_quantity: 0,
        min_stock_level: 5,
        weight: 0,
        dimensions: '',
        meta_title: '',
        meta_description: '',
        is_active: false,
        is_featured: false,
        is_digital: false
      });
      await fetchProducts(); // Wait for products to refresh
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    setCreatingProduct(true);
    try {
      await ProductService.updateProduct(selectedProduct.id, editProductForm as CreateProductData);
      toast.success('Product updated successfully!');
      setShowEditProductModal(false);
      setSelectedProduct(null);
      await fetchProducts(); // Wait for products to refresh
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleCreatePost = async () => {
    setCreatingPost(true);
    try {
      await postService.createPost(newPostForm as CreatePostData);
      toast.success('Post created successfully!');
      setShowNewPostModal(false);
      setNewPostForm({
        title: '',
        content: '',
        status: 'draft'
      });
      await fetchBlogPosts(); // Wait for posts to refresh
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setCreatingPost(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    try {
      await mediaService.uploadFile(file, {
        folder: 'editor-uploads',
        product_id: selectedProductForMedia || undefined,
        usage_type: selectedUsageType
      });
      toast.success('File uploaded successfully!');
      setShowMediaUploadModal(false);
      setSelectedProductForMedia(null);
      setSelectedUsageType('general');
      fetchMediaFiles();
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'inactive':
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // getStatusIcon function removed - not used

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMediaFiles = mediaFiles.filter(file =>
    file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.resource_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 gap-4">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="ml-2">Back</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Editor Dashboard</h1>
                <p className="text-gray-600">Content Editor</p>
              </div>
            </div>

            {/* Right side - Actions and user info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-right flex-1 sm:flex-none">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-600">{user?.email || 'user@example.com'}</p>
                </div>
                <Button variant="ghost" className="text-red-600 hover:text-red-700">
                  → Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Products</CardTitle>
              <div className="w-8 h-8 flex items-center justify-center">
                <Package className="h-4 w-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products && products.filter(p => p.is_active).length ? products.filter(p => p.is_active).length : <div className="animate-pulse h-8 w-16 rounded">0</div>}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Published</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {products.filter(p => p.is_active).length} active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Products</CardTitle>
              <div className="w-8 h-8 flex items-center justify-center">
                <Edit className="h-4 w-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products && products.filter(p => !p.is_active).length ? products.filter(p => !p.is_active).length : <div className="animate-pulse h-8 w-16 rounded">0</div>}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">In progress</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {products.filter(p => !p.is_active).length} inactive
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Media Library</CardTitle>
              <div className="w-8 h-8 flex items-center justify-center">
                <Image className="h-4 w-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaFiles && mediaFiles.length ? mediaFiles.length : <div className="animate-pulse h-8 w-16 rounded">0</div>}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Images & videos</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {mediaFiles.filter(f => f.resource_type === 'image').length} images
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <div className="w-8 h-8 flex items-center justify-center">
                <FileText className="h-4 w-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts && blogPosts.filter(p => p.status === 'published').length ? blogPosts.filter(p => p.status === 'published').length : <div className="animate-pulse h-8 w-16 rounded">0</div>}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Published</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {blogPosts.filter(p => p.status === 'draft').length} drafts
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="my-products">My Products</TabsTrigger>
            <TabsTrigger value="blog-posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="media-library">Media Library</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* My Products Tab */}
          <TabsContent value="my-products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">My Products</CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                  <Button
                    className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto"
                    onClick={() => setShowNewProductModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Product Name</TableHead>
                        <TableHead className="min-w-[100px]">Category</TableHead>
                        <TableHead className="min-w-[80px]">Price</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[80px]">Views</TableHead>
                        <TableHead className="min-w-[120px]">Last Updated</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              Loading products...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-sm text-gray-500">No products found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category?.name || 'N/A'}</TableCell>
                            <TableCell>${product.effective_price.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(product.is_active ? 'active' : 'inactive')}>
                                {product.is_active ? 'active' : 'inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>{product.total_reviews || 0}</TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(product.created_at || '').toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setShowViewProductModal(true);
                                  }}
                                  title="View Product"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setEditProductForm({
                                      name: product.name,
                                      description: product.description,
                                      short_description: product.short_description || '',
                                      price: product.effective_price,
                                      original_price: product.original_price || 0,
                                      cost_price: product.cost_price || 0,
                                      category_id: product.category?.id || 1,
                                      subcategory_id: product.subcategory?.id,
                                      brand_id: product.brand?.id,
                                      sku: product.sku,
                                      stock_quantity: product.stock_quantity,
                                      min_stock_level: product.min_stock_level || 5,
                                      weight: product.weight || 0,
                                      dimensions: product.dimensions || '',
                                      meta_title: product.meta_title || '',
                                      meta_description: product.meta_description || '',
                                      is_active: product.is_active,
                                      is_featured: product.is_featured || false,
                                      is_digital: product.is_digital || false
                                    });
                                    setShowEditProductModal(true);
                                  }}
                                  title="Edit Product"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Posts Tab */}
          <TabsContent value="blog-posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Blog Posts</CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                  <Button
                    className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto"
                    onClick={() => setShowNewPostModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Title</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[80px]">Views</TableHead>
                        <TableHead className="min-w-[100px]">Comments</TableHead>
                        <TableHead className="min-w-[120px]">Last Updated</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {postsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              Loading posts...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredBlogPosts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-sm text-gray-500">No posts found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBlogPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(post.status)}>
                                {post.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{post.views_count.toLocaleString()}</TableCell>
                            <TableCell>{post.comments_count}</TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(post.updated_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Library Tab */}
          <TabsContent value="media-library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Media Library</CardTitle>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search media..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                  <Button
                    className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto"
                    onClick={() => setShowMediaUploadModal(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">File Name</TableHead>
                        <TableHead className="min-w-[80px]">Type</TableHead>
                        <TableHead className="min-w-[80px]">Size</TableHead>
                        <TableHead className="min-w-[100px]">Format</TableHead>
                        <TableHead className="min-w-[120px]">Product</TableHead>
                        <TableHead className="min-w-[100px]">Usage Type</TableHead>
                        <TableHead className="min-w-[120px]">Uploaded</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mediaLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              Loading media files...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredMediaFiles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-sm text-gray-500">No media files found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMediaFiles.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell className="font-medium font-mono text-sm">{file.original_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{file.resource_type}</Badge>
                            </TableCell>
                            <TableCell>{mediaService.formatFileSize(file.file_size)}</TableCell>
                            <TableCell>{file.format}</TableCell>
                            <TableCell>
                              {file.product ? (
                                <span className="text-blue-600 text-sm">{file.product.name}</span>
                              ) : (
                                <span className="text-gray-400 text-sm">No product</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {file.usage_type || 'general'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(file.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this file?')) {
                                      mediaService.deleteMediaFile(file.id).then(() => {
                                        fetchMediaFiles();
                                        toast.success('File deleted successfully');
                                      }).catch((error) => {
                                        console.error('Failed to delete file:', error);
                                        toast.error('Failed to delete file. Please try again.');
                                      });
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            {performanceLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Loading performance metrics...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Product Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Products</span>
                      <span className="text-2xl font-bold">{productPerformance?.total_products || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Products</span>
                      <span className="text-lg font-semibold text-green-600">{productPerformance?.active_products || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Views</span>
                      <span className="text-lg font-semibold">{productPerformance?.total_views?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <span className="text-lg font-semibold">{productPerformance?.average_rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    {productPerformance?.top_products && productPerformance.top_products.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Top Products</h4>
                        <div className="space-y-2">
                          {productPerformance.top_products.slice(0, 3).map((product) => (
                            <div key={product.id} className="flex justify-between text-sm">
                              <span className="truncate">{product.name}</span>
                              <span className="text-gray-500">{product.total_views} views</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Content Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Posts</span>
                      <span className="text-2xl font-bold">{contentPerformance?.total_posts || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Published Posts</span>
                      <span className="text-lg font-semibold text-green-600">{contentPerformance?.published_posts || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Views</span>
                      <span className="text-lg font-semibold">{contentPerformance?.total_views?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Comments</span>
                      <span className="text-lg font-semibold">{contentPerformance?.total_comments || 0}</span>
                    </div>
                    {contentPerformance?.top_posts && contentPerformance.top_posts.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Top Posts</h4>
                        <div className="space-y-2">
                          {contentPerformance.top_posts.slice(0, 3).map((post) => (
                            <div key={post.id} className="flex justify-between text-sm">
                              <span className="truncate">{post.title}</span>
                              <span className="text-gray-500">{post.views_count} views</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>



      {/* Footer */}

      {/* Floating Action Buttons - REMOVED PURPLE SETTINGS BUTTONS */}
      {/* Only keeping the chat button */}

      <div className="fixed right-6 bottom-6 z-50">
        <Button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* New Product Modal */}
      {showNewProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Product</h2>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <Input
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <Input
                    value={newProductForm.short_description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, short_description: e.target.value })}
                    placeholder="Brief product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Description *</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    placeholder="Enter detailed product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <Input
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    placeholder="Product SKU (optional)"
                  />
                </div>
              </div>

              {/* Category and Brand */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Category & Brand</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newProductForm.category_id}
                      onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newProductForm.subcategory_id || ''}
                      onChange={(e) => setNewProductForm({ ...newProductForm, subcategory_id: e.target.value ? parseInt(e.target.value) : undefined })}
                    >
                      <option value="">Select subcategory</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newProductForm.brand_id || ''}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand_id: e.target.value ? parseInt(e.target.value) : undefined })}
                  >
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Pricing</h3>
                <div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Inventory</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                    <Input
                      type="number"
                      value={newProductForm.stock_quantity}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stock_quantity: parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Stock Level</label>
                    <Input
                      type="number"
                      value={newProductForm.min_stock_level}
                      onChange={(e) => setNewProductForm({ ...newProductForm, min_stock_level: parseInt(e.target.value) })}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProductForm.weight}
                    onChange={(e) => setNewProductForm({ ...newProductForm, weight: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dimensions</label>
                  <Input
                    value={newProductForm.dimensions}
                    onChange={(e) => setNewProductForm({ ...newProductForm, dimensions: e.target.value })}
                    placeholder="L x W x H (e.g., 10x5x2)"
                  />
                </div>
              </div>


            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowNewProductModal(false)} disabled={creatingProduct}>
                Cancel
              </Button>
              <Button onClick={handleCreateProduct} disabled={creatingProduct}>
                {creatingProduct ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Post Title</label>
                <Input
                  value={newPostForm.title}
                  onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={6}
                  value={newPostForm.content}
                  onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                  placeholder="Enter post content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newPostForm.status}
                  onChange={(e) => setNewPostForm({ ...newPostForm, status: e.target.value as any })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowNewPostModal(false)} disabled={creatingPost}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={creatingPost}>
                {creatingPost ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Upload Modal */}
      {showMediaUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Media</h2>
            <div className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Associate with Product (Optional)</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedProductForMedia || ''}
                  onChange={(e) => setSelectedProductForMedia(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">No product association</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Usage Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Usage Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedUsageType}
                  onChange={(e) => setSelectedUsageType(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="product_image">Product Image</option>
                  <option value="product_gallery">Product Gallery</option>
                  <option value="blog_cover">Blog Cover</option>
                </select>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 mb-2">Drop files here or click to upload</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      handleFileUpload(files[0]);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer inline-block">
                  <Button variant="outline" disabled={uploadingFile} asChild>
                    <span>
                      {uploadingFile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Choose Files'
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowMediaUploadModal(false)} disabled={uploadingFile}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Product Details</h2>
              <Button variant="ghost" onClick={() => setShowViewProductModal(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Product Name</label>
                    <p className="text-sm text-gray-900">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">SKU</label>
                    <p className="text-sm text-gray-900">{selectedProduct.sku || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Short Description</label>
                  <p className="text-sm text-gray-900">{selectedProduct.short_description || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Description</label>
                  <p className="text-sm text-gray-900">{selectedProduct.description || 'N/A'}</p>
                </div>
              </div>

              {/* Category & Brand */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Category & Brand</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Category</label>
                    <p className="text-sm text-gray-900">{selectedProduct.category?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Subcategory</label>
                    <p className="text-sm text-gray-900">{selectedProduct.subcategory?.name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Brand</label>
                  <p className="text-sm text-gray-900">{selectedProduct.brand?.name || 'N/A'}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Current Price</label>
                    <p className="text-sm text-gray-900">${selectedProduct.effective_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Original Price</label>
                    <p className="text-sm text-gray-900">${selectedProduct.original_price?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Inventory</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Stock Quantity</label>
                    <p className="text-sm text-gray-900">{selectedProduct.stock_quantity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Min Stock Level</label>
                    <p className="text-sm text-gray-900">{selectedProduct.min_stock_level || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Weight (kg)</label>
                    <p className="text-sm text-gray-900">{selectedProduct.weight || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Dimensions</label>
                    <p className="text-sm text-gray-900">{selectedProduct.dimensions || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Active Status</label>
                    <Badge className={getStatusColor(selectedProduct.is_active ? 'active' : 'inactive')}>
                      {selectedProduct.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Featured</label>
                    <Badge className={selectedProduct.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                      {selectedProduct.is_featured ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Digital Product</label>
                    <Badge className={selectedProduct.is_digital ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                      {selectedProduct.is_digital ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Created</label>
                    <p className="text-sm text-gray-900">{new Date(selectedProduct.created_at || '').toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-sm text-gray-900">{new Date(selectedProduct.updated_at || '').toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowViewProductModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product: {selectedProduct.name}</h2>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <Input
                    value={editProductForm.name}
                    onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <Input
                    value={editProductForm.short_description}
                    onChange={(e) => setEditProductForm({ ...editProductForm, short_description: e.target.value })}
                    placeholder="Brief product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Description *</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={editProductForm.description}
                    onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                    placeholder="Enter detailed product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <Input
                    value={editProductForm.sku}
                    onChange={(e) => setEditProductForm({ ...editProductForm, sku: e.target.value })}
                    placeholder="Product SKU (optional)"
                  />
                </div>
              </div>

              {/* Category and Brand */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Category & Brand</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={editProductForm.category_id}
                      onChange={(e) => {
                        const categoryId = parseInt(e.target.value);
                        setEditProductForm({ ...editProductForm, category_id: categoryId, subcategory_id: undefined });
                        fetchSubcategories(categoryId);
                      }}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={editProductForm.subcategory_id || ''}
                      onChange={(e) => setEditProductForm({ ...editProductForm, subcategory_id: e.target.value ? parseInt(e.target.value) : undefined })}
                    >
                      <option value="">Select subcategory</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editProductForm.brand_id || ''}
                    onChange={(e) => setEditProductForm({ ...editProductForm, brand_id: e.target.value ? parseInt(e.target.value) : undefined })}
                  >
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Pricing</h3>
                <div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editProductForm.price}
                      onChange={(e) => setEditProductForm({ ...editProductForm, price: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Inventory</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                    <Input
                      type="number"
                      value={editProductForm.stock_quantity}
                      onChange={(e) => setEditProductForm({ ...editProductForm, stock_quantity: parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Stock Level</label>
                    <Input
                      type="number"
                      value={editProductForm.min_stock_level}
                      onChange={(e) => setEditProductForm({ ...editProductForm, min_stock_level: parseInt(e.target.value) })}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editProductForm.weight}
                    onChange={(e) => setEditProductForm({ ...editProductForm, weight: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dimensions</label>
                  <Input
                    value={editProductForm.dimensions}
                    onChange={(e) => setEditProductForm({ ...editProductForm, dimensions: e.target.value })}
                    placeholder="L x W x H (e.g., 10x5x2)"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditProductModal(false)} disabled={creatingProduct}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct} disabled={creatingProduct}>
                {creatingProduct ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorDashboard;
