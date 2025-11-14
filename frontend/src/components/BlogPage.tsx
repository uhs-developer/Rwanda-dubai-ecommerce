import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Search, Clock, User, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BlogPageProps {
  onBack: () => void;
}

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  tags: string[];
}

const blogArticles: BlogArticle[] = [
  {
    id: "1",
    title: "The Future of Electronics Import to Rwanda",
    excerpt: "Exploring the growing opportunities and market trends in electronics import business between Dubai and Rwanda.",
    category: "business",
    categoryLabel: "Business",
    author: "John Doe",
    date: "1/15/2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop",
    featured: true,
    tags: ["Electronics", "Import", "Dubai"]
  },
  {
    id: "2",
    title: "Smart Home Technology Trends in 2024",
    excerpt: "Discover the latest smart home innovations that are revolutionizing how we live and interact with our homes.",
    category: "technology",
    categoryLabel: "Technology",
    author: "Mike Chen",
    date: "1/10/2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=300&fit=crop",
    featured: true,
    tags: ["Smart Home", "IoT", "Technology"]
  },
  {
    id: "3",
    title: "Essential Auto Parts Every Car Owner Should Know",
    excerpt: "A comprehensive guide to understanding the most important auto parts and their maintenance requirements.",
    category: "automotive",
    categoryLabel: "Automotive",
    author: "Sarah Johnson",
    date: "1/12/2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop",
    tags: ["Auto Parts", "Maintenance"]
  },
  {
    id: "4",
    title: "iPhone vs Samsung: A Comprehensive Comparison",
    excerpt: "Breaking down the key differences between iPhone and Samsung smartphones for 2024.",
    category: "reviews",
    categoryLabel: "Reviews",
    author: "Emily Rodriguez",
    date: "1/8/2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    tags: ["iPhone", "Samsung"]
  },
  {
    id: "5",
    title: "Hyundai Parts: Quality and Reliability Guide",
    excerpt: "Understanding the importance of genuine Hyundai parts and how to identify authentic components.",
    category: "automotive",
    categoryLabel: "Automotive",
    author: "David Park",
    date: "1/5/2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=250&fit=crop",
    tags: ["Hyundai", "Auto Parts"]
  },
  {
    id: "6",
    title: "Best Practices for International Shipping",
    excerpt: "Tips and guidelines for safely shipping electronics and auto parts across international borders.",
    category: "logistics",
    categoryLabel: "Logistics",
    author: "Lisa Ahmed",
    date: "1/1/2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=250&fit=crop",
    tags: ["Shipping", "International"]
  },
  {
    id: "7",
    title: "Top 10 Gaming Laptops Under $1000",
    excerpt: "Our curated list of the best gaming laptops that offer excellent performance without breaking the bank.",
    category: "technology",
    categoryLabel: "Technology",
    author: "Alex Chen",
    date: "12/28/2023",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=250&fit=crop",
    tags: ["Gaming", "Laptops", "Reviews"]
  },
  {
    id: "8",
    title: "Electric Vehicle Charging Solutions for Rwanda",
    excerpt: "Exploring the infrastructure and technology needed to support electric vehicles in Rwanda's growing market.",
    category: "automotive",
    categoryLabel: "Automotive",
    author: "Peter Uwimana",
    date: "12/25/2023",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=250&fit=crop",
    tags: ["Electric Vehicles", "Rwanda", "Infrastructure"]
  }
];

const categories = [
  { id: "all", label: "All" },
  { id: "business", label: "Business" },
  { id: "technology", label: "Technology" },
  { id: "automotive", label: "Automotive" },
  { id: "reviews", label: "Reviews" },
  { id: "logistics", label: "Logistics" }
];

export function BlogPage({ onBack }: BlogPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const latestArticles = filteredArticles.filter(article => !article.featured);

  const handleArticleClick = (articleId: string) => {
    navigate(`/blog/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kora Blog</h1>
              <p className="text-gray-600">Insights, tips, and updates from the world of electronics and automotive</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm">★</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <div className="aspect-video relative">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white">
                        {article.categoryLabel}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <span>{article.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Latest Articles */}
        {latestArticles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <div className="aspect-video relative">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-white text-xs">
                        {article.categoryLabel}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <span>{article.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse a different category.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
