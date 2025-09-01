import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Heart, Bookmark, Share2, Clock, User, Eye, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BlogDetailPageProps {
  onBack: () => void;
  articleId?: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const relatedArticles: RelatedArticle[] = [
  {
    id: "3",
    title: "Essential Auto Parts Every Car Owner Should Know",
    excerpt: "A comprehensive guide to understanding the most important auto parts and their maintenance requirements.",
    category: "Automotive",
    author: "Sarah Johnson",
    date: "1/12/2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop"
  },
  {
    id: "2",
    title: "Smart Home Technology Trends in 2024",
    excerpt: "Discover the latest smart home innovations that are revolutionizing how we live and interact with our homes.",
    category: "Technology",
    author: "Mike Chen",
    date: "1/10/2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop"
  },
  {
    id: "4",
    title: "iPhone vs Samsung: A Comprehensive Comparison",
    excerpt: "Breaking down the key differences between iPhone and Samsung smartphones for 2024.",
    category: "Reviews",
    author: "Emily Rodriguez",
    date: "1/8/2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop"
  }
];

export function BlogDetailPage({ onBack, articleId }: BlogDetailPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes] = useState(247);
  const [views] = useState(1542);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from likes' : 'Added to likes');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved' : 'Added to saved articles');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard!');
  };

  const handleBackToBlog = () => {
    // Navigate back to blog instead of home
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToBlog}
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <div className="mb-8">
          <Badge className="mb-4 bg-primary text-white">Business</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            The Future of Electronics Import from Dubai to Rwanda
          </h1>
          
          {/* Author and Meta Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face" 
                alt="John Doe"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-semibold text-gray-900">John Doe</div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>January 15, 2024</span>
                <span>•</span>
                <span>15 min read</span>
              </div>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center gap-4 py-4 border-y border-gray-200">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={`flex items-center gap-2 ${isLiked ? 'text-red-600' : 'text-gray-600'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 text-gray-600"
            >
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </Button>

            <div className="flex-1" />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSave}
              className={`flex items-center gap-2 ${isSaved ? 'text-primary' : 'text-gray-600'}`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              Save
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop" 
            alt="Electronics import business" 
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            The electronics import market between Dubai and Rwanda represents one of the most promising opportunities in East Africa's 
            growing digital economy. As Rwanda continues its rapid transformation into a regional tech hub, the demand for high-quality 
            electronics has skyrocketed.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Market Overview</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Dubai's strategic location as a global trading hub makes it an ideal source for electronics destined for the East African market. 
            With its world-class infrastructure, competitive prices, and extensive supplier networks, Dubai offers numerous advantages for 
            importers looking to serve the Rwandan market.
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            Over the past five years, Rwanda has experienced a 300% increase in electronics imports, with mobile phones, laptops, and 
            home appliances leading the charge. This growth is driven by several factors:
          </p>

          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">Rapid digitalization initiatives by the Rwandan government</li>
            <li className="mb-2">Growing middle class with increased purchasing power</li>
            <li className="mb-2">Improved logistics and customs processes</li>
            <li className="mb-2">Rising demand for smart devices and IoT solutions</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Opportunities</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            The electronics import sector offers several lucrative opportunities for businesses willing to navigate the market complexities. 
            Smartphones and accessories continue to dominate, accounting for nearly 40% of all electronics imports. However, emerging 
            categories like smart home devices, electric vehicle accessories, and renewable energy solutions are showing remarkable 
            growth potential.
          </p>

          <blockquote className="border-l-4 border-blue-600 pl-6 italic text-gray-700 my-8 bg-blue-50 py-4">
            "The key to success in this market is understanding local preferences while maintaining quality standards that consumers 
            expect from Dubai-sourced products." - Industry Expert
          </blockquote>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Challenges and Solutions</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            While opportunities abound, importers must navigate several challenges including regulatory compliance, customs procedures, 
            and quality assurance. Successful businesses typically focus on:
          </p>

          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li className="mb-2">Building strong relationships with Dubai suppliers</li>
            <li className="mb-2">Understanding Rwanda's import regulations</li>
            <li className="mb-2">Establishing reliable logistics partnerships</li>
            <li className="mb-2">Providing excellent after-sales support</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Future Outlook</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            The future looks incredibly bright for electronics import from Dubai to Rwanda. With Rwanda's Vision 2050 emphasizing 
            technology adoption and Dubai's continued excellence in trade infrastructure, we can expect this market to grow 
            exponentially over the next decade.
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            Key trends to watch include the rise of e-commerce platforms, increased demand for sustainable electronics, and the growing 
            importance of warranty and after-sales service in purchasing decisions.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-gray-200">
          {['Electronics', 'Import', 'Dubai', 'Rwanda', 'Trade'].map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Author Bio */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" 
                  alt="John Doe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About John Doe</h3>
                <p className="text-gray-600 mb-3">
                  International Trade Specialist with 15+ years experience in Dubai-Africa trade corridors.
                </p>
                <Badge variant="outline" className="text-xs">
                  Fellow Author
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video relative">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
