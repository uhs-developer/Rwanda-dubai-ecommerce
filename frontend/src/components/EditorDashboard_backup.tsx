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
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Package,
  FileText,
  Image,
  Loader2,
  Trash2,
} from 'lucide-react';
import { ProductService, Product as ApiProduct, CreateProductData, createProduct, Brand, Subcategory } from '../services/product';
import { postService, Post as ApiPost, CreatePostData } from '../services/post';
import { mediaService, MediaFile as ApiMediaFile } from '../services/media';
import { performanceService, ProductPerformanceMetrics, ContentPerformanceMetrics } from '../services/performance';
import { categoryService, Category as ApiCategory } from '../services/category';

// Legacy interfaces removed - using API types instead

const EditorDashboard: React.FC = () => {
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
    setNewProductForm({...newProductForm, category_id: categoryId, subcategory_id: undefined});
    fetchSubcategories(categoryId);
  };

  // Form handlers
  const handleCreateProduct = async () => {
    setCreatingProduct(true);
    try {
      await createProduct(newProductForm as CreateProductData);
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
      alert('Failed to create product. Please try again.');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleCreatePost = async () => {
    setCreatingPost(true);
    try {
      await postService.createPost(newPostForm as CreatePostData);
      setShowNewPostModal(false);
      setNewPostForm({
        title: '',
        content: '',
        status: 'draft'
      });
      await fetchBlogPosts(); // Wait for posts to refresh
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
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
      setShowMediaUploadModal(false);
      setSelectedProductForMedia(null);
      setSelectedUsageType('general');
      fetchMediaFiles();
    } catch (error) {
      console.error('Failed to upload file:', error);
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
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                  M
                </div>
                <div className="text-right flex-1 sm:flex-none">
                  <p className="text-sm font-medium text-gray-900">Mike Admin</p>
                  <p className="text-xs text-gray-600">admin@techbridge.com</p>
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
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.filter(p => p.is_active).length}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Published</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  {products.filter(p => p.is_active).length} active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Products</CardTitle>
              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                <Edit className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.filter(p => !p.is_active).length}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">In progress</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  {products.filter(p => !p.is_active).length} inactive
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Media Library</CardTitle>
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                <Image className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaFiles.length}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Images & videos</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  {mediaFiles.filter(f => f.resource_type === 'image').length} images
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts.filter(p => p.status === 'published').length}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Published</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
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
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2 text-sm text-gray-500">Loading products...</p>
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
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2 text-sm text-gray-500">Loading posts...</p>
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
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="mt-2 text-sm text-gray-500">Loading media files...</p>
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
                                    if (confirm('Are you sure you want to delete this file?')) {
                                      mediaService.deleteMediaFile(file.id).then(() => {
                                        fetchMediaFiles();
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
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-2 text-gray-500">Loading performance metrics...</p>
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
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* TechBridge Info */}
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold mb-4">TechBridge</h3>
              <p className="text-gray-400 mb-6">
                Connecting Dubai's premium electronics and auto parts market with Rwanda through reliable shipping and authentic products.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Returns & Warranty</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Electronics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Auto Parts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Home Appliances</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">New Arrivals</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Best Sellers</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Dubai, UAE → Kigali, Rwanda</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">+971 4 XXX XXXX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">support@techbridge.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 TechBridge. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

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
                    onChange={(e) => setNewProductForm({...newProductForm, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <Input
                    value={newProductForm.short_description}
                    onChange={(e) => setNewProductForm({...newProductForm, short_description: e.target.value})}
                    placeholder="Brief product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Description *</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({...newProductForm, description: e.target.value})}
                    placeholder="Enter detailed product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <Input
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({...newProductForm, sku: e.target.value})}
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
                      onChange={(e) => setNewProductForm({...newProductForm, subcategory_id: e.target.value ? parseInt(e.target.value) : undefined})}
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
                    onChange={(e) => setNewProductForm({...newProductForm, brand_id: e.target.value ? parseInt(e.target.value) : undefined})}
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({...newProductForm, price: parseFloat(e.target.value)})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Original Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProductForm.original_price}
                      onChange={(e) => setNewProductForm({...newProductForm, original_price: parseFloat(e.target.value)})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cost Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProductForm.cost_price}
                      onChange={(e) => setNewProductForm({...newProductForm, cost_price: parseFloat(e.target.value)})}
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
                      onChange={(e) => setNewProductForm({...newProductForm, stock_quantity: parseInt(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Stock Level</label>
                    <Input
                      type="number"
                      value={newProductForm.min_stock_level}
                      onChange={(e) => setNewProductForm({...newProductForm, min_stock_level: parseInt(e.target.value)})}
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
                    onChange={(e) => setNewProductForm({...newProductForm, weight: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dimensions</label>
                  <Input
                    value={newProductForm.dimensions}
                    onChange={(e) => setNewProductForm({...newProductForm, dimensions: e.target.value})}
                    placeholder="L x W x H (e.g., 10x5x2)"
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">SEO & Meta</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Title</label>
                  <Input
                    value={newProductForm.meta_title}
                    onChange={(e) => setNewProductForm({...newProductForm, meta_title: e.target.value})}
                    placeholder="SEO title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    value={newProductForm.meta_description}
                    onChange={(e) => setNewProductForm({...newProductForm, meta_description: e.target.value})}
                    placeholder="SEO description"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Status & Visibility</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={newProductForm.is_active}
                      onChange={(e) => setNewProductForm({...newProductForm, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">Active</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={newProductForm.is_featured}
                      onChange={(e) => setNewProductForm({...newProductForm, is_featured: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium">Featured</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_digital"
                      checked={newProductForm.is_digital}
                      onChange={(e) => setNewProductForm({...newProductForm, is_digital: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="is_digital" className="text-sm font-medium">Digital Product</label>
                  </div>
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
                  onChange={(e) => setNewPostForm({...newPostForm, title: e.target.value})}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={6}
                  value={newPostForm.content}
                  onChange={(e) => setNewPostForm({...newPostForm, content: e.target.value})}
                  placeholder="Enter post content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newPostForm.status}
                  onChange={(e) => setNewPostForm({...newPostForm, status: e.target.value as any})}
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
    </div>
  );
};

export default EditorDashboard;
