import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, CheckCircle, Truck, Clock, Shield } from "lucide-react";
import { useQuery } from 'urql';
import { GET_PAGE_CONTENT } from '../graphql/storefront';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  const [pageContentResult] = useQuery({ 
    query: GET_PAGE_CONTENT, 
    variables: { pageKey: 'about' } 
  });

  const pageContent = pageContentResult.data?.adminPageContent;
  
  // Helper to get section content
  const getContent = (key: string, fallback: string) => {
    const section = pageContent?.sections?.find((s: any) => s.key === key);
    return section?.content || fallback;
  };

  // Helper to render HTML content safely
  const renderHTML = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} className="prose max-w-none" />;
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
              <h1 className="text-2xl font-bold text-gray-900">
                {getContent('hero_title', 'About Us')}
              </h1>
              <p className="text-gray-600">
                {getContent('hero_subtitle', "Your trusted partner in global e-commerce")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="p-8">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <div className="text-gray-700">
                  {renderHTML(getContent('mission', '<p>We connect global markets with Rwanda through seamless e-commerce.</p>'))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <div className="text-gray-700">
                  {renderHTML(getContent('vision', '<p>To become the leading cross-border e-commerce platform.</p>'))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-gray-600">These core values guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Quality First</h4>
                <p className="text-sm text-gray-600">
                  Every product meets our strict quality standards
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast Delivery</h4>
                <p className="text-sm text-gray-600">
                  Efficient logistics from global hubs to your door
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Always Available</h4>
                <p className="text-sm text-gray-600">
                  24/7 support when you need assistance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure Shopping</h4>
                <p className="text-sm text-gray-600">
                  Your data and payments are always protected
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our wide selection of products sourced from global markets
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/products'}>
              Browse Products
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.location.href = '/contact'}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
