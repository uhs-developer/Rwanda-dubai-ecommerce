import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  ArrowLeft,
  Menu,
  X,
  Search,
  Upload,
  Heart,
  ShoppingCart,
  User,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Settings,
  MessageCircle,
  Package,
  FileText,
  Image,
  BarChart3
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'approved' | 'pending' | 'draft';
  views: number;
  lastUpdated: string;
}

interface BlogPost {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'review';
  views: number;
  comments: number;
  lastUpdated: string;
}

interface MediaFile {
  id: string;
  fileName: string;
  type: 'image' | 'video';
  size: string;
  usage: string;
  uploaded: string;
}

const EditorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('my-products');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data matching the images exactly
  const products: Product[] = [
    { id: '1', name: 'MacBook Pro M3', category: 'Laptops', price: 1999, status: 'approved', views: 1234, lastUpdated: '2 hours ago' },
    { id: '2', name: 'iPhone 15 Pro', category: 'Smartphones', price: 1199, status: 'pending', views: 892, lastUpdated: '1 day ago' },
    { id: '3', name: 'Samsung Monitor', category: 'Electronics', price: 299, status: 'draft', views: 0, lastUpdated: '3 hours ago' },
    { id: '4', name: 'Wireless Headphones', category: 'Audio', price: 149, status: 'approved', views: 567, lastUpdated: '1 week ago' },
  ];

  const blogPosts: BlogPost[] = [
    { id: '1', title: 'Top 10 Tech Trends 2024', status: 'published', views: 2145, comments: 23, lastUpdated: '3 days ago' },
    { id: '2', title: 'MacBook vs PC: Ultimate Guide', status: 'draft', views: 0, comments: 0, lastUpdated: '1 day ago' },
    { id: '3', title: 'Best Smartphone Accessories', status: 'published', views: 1876, comments: 15, lastUpdated: '1 week ago' },
    { id: '4', title: 'Auto Parts Buying Guide', status: 'review', views: 0, comments: 0, lastUpdated: '2 days ago' },
  ];

  const mediaFiles: MediaFile[] = [
    { id: '1', fileName: 'macbook-hero.jpg', type: 'image', size: '2.4 MB', usage: '3 products', uploaded: '2 hours ago' },
    { id: '2', fileName: 'iphone-gallery.mp4', type: 'video', size: '12.1 MB', usage: '1 products', uploaded: '1 day ago' },
    { id: '3', fileName: 'product-banner.png', type: 'image', size: '890 KB', usage: '5 products', uploaded: '3 days ago' },
    { id: '4', fileName: 'tech-review.jpg', type: 'image', size: '1.2 MB', usage: '2 products', uploaded: '1 week ago' },
  ];

  const handleBackClick = () => {
    window.history.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'pending':
        return '⏰';
      case 'draft':
        return '!';
      case 'review':
        return '!';
      default:
        return '';
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMediaFiles = mediaFiles.filter(file =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase())
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
              <div className="text-2xl font-bold">47</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Published</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  5 new
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
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">In progress</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  3 new
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
              <div className="text-2xl font-bold">234</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Images & videos</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  12 new
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
              <div className="text-2xl font-bold">8</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Published</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  2 new
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
                  <Button className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
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
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(product.status)}>
                              {getStatusIcon(product.status)} {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.views.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-gray-600">{product.lastUpdated}</TableCell>
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
                      ))}
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
                  <Button className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
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
                      {filteredBlogPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{post.views.toLocaleString()}</TableCell>
                          <TableCell>{post.comments}</TableCell>
                          <TableCell className="text-sm text-gray-600">{post.lastUpdated}</TableCell>
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
                      ))}
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
                  <Button className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
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
                        <TableHead className="min-w-[100px]">Usage</TableHead>
                        <TableHead className="min-w-[120px]">Uploaded</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMediaFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium font-mono text-sm">{file.fileName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{file.type}</Badge>
                          </TableCell>
                          <TableCell>{file.size}</TableCell>
                          <TableCell>{file.usage}</TableCell>
                          <TableCell className="text-sm text-gray-600">{file.uploaded}</TableCell>
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Product Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Product Views</span>
                    <span className="text-2xl font-bold">12,543</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Views per Product</span>
                    <span className="text-lg font-semibold">267</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-lg font-semibold text-green-600">4.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Top Performing Category</span>
                    <span className="text-lg font-semibold">Electronics</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Content Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Blog Post Views</span>
                    <span className="text-2xl font-bold">8,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Read Time</span>
                    <span className="text-lg font-semibold">3m 45s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Engagement Rate</span>
                    <span className="text-lg font-semibold text-green-600">6.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Most Popular Post</span>
                    <span className="text-lg font-semibold">Tech Trends 2024</span>
                  </div>
                </CardContent>
              </Card>
            </div>
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
    </div>
  );
};

export default EditorDashboard;
