import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Users, TrendingUp, Award, CheckCircle, Truck, Clock, Shield } from "lucide-react";

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
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
              <h1 className="text-2xl font-bold text-gray-900">About TechBridge</h1>
              <p className="text-gray-600">Connecting Dubai's premium market with Rwanda's growing economy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Bridging Markets, Building Dreams
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            TechBridge was founded with a simple mission: to make premium electronics and auto parts 
            from Dubai accessible to customers in Rwanda. We've grown from a small startup to a trusted 
            bridge between two dynamic markets.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-gray-600">Products Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2</div>
              <div className="text-gray-600">Countries Connected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.5%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2019 by Ahmed Al-Rashid, TechBridge began as a 
                  solution to a simple problem: accessing high-quality electronics 
                  and auto parts from Dubai's world-class markets. What started as 
                  Ahmed recognized the opportunity to connect these two markets.
                </p>
                <p>
                  What started as a small operation has grown into a comprehensive 
                  platform serving thousands of customers across Rwanda. We've 
                  built strong partnerships with Dubai's leading suppliers while 
                  establishing a reliable logistics network that ensures fast, 
                  secure delivery.
                </p>
                <p>
                  Today, TechBridge is more than just an import business - we're a 
                  trusted partner helping individuals and businesses across the 
                  technology they need to grow and thrive.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop" 
                alt="Dubai skyline" 
                className="rounded-lg object-cover h-48"
              />
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop" 
                alt="Electronics warehouse" 
                className="rounded-lg object-cover h-48"
              />
              <img 
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop" 
                alt="Team working" 
                className="rounded-lg object-cover h-48 col-span-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-gray-600">These core values guide everything we do, from selecting products to serving customers.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Quality Assurance</h4>
                <p className="text-sm text-gray-600">
                  Every product is carefully tested to ensure it meets our high standards before reaching you.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Reliable Shipping</h4>
                <p className="text-sm text-gray-600">
                  Fast, secure shipping from our global hubs to Rwanda with full insurance coverage.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer First</h4>
                <p className="text-sm text-gray-600">
                  We prioritize our customers and provide exceptional support throughout your journey with us.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Authentic Products</h4>
                <p className="text-sm text-gray-600">
                  We partner directly with authorized dealers to guarantee 100% authentic products.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-600">
                  To democratize access to premium electronics and auto parts by creating a seamless bridge between Dubai's world-class markets and Rwanda, while maintaining the highest standards of quality and service.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-600">
                  To become East Africa's most trusted platform for premium electronics and auto parts, fostering technological advancement and economic growth through innovative cross-border commerce solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h3>
            <p className="text-gray-600">
              Our diverse team spans across Dubai and Rwanda, bringing together local expertise and 
              international experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                    alt="Ahmed Al-Rashid" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-gray-900">Ahmed Al-Rashid</h4>
                <p className="text-sm text-blue-600 mb-2">Founder & CEO</p>
                <p className="text-xs text-gray-500 mb-3">Dubai, UAE</p>
                <p className="text-sm text-gray-600">
                  15+ years in international trade and technology markets.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900">Sarah Mukamana</h4>
                <p className="text-sm text-blue-600 mb-2">Operations Director</p>
                <p className="text-xs text-gray-500 mb-3">Kigali, Rwanda</p>
                <p className="text-sm text-gray-600">
                  Expert in logistics and customer relations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
                    alt="Hassan Mohammed" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-gray-900">Hassan Mohammed</h4>
                <p className="text-sm text-blue-600 mb-2">Technical Lead</p>
                <p className="text-xs text-gray-500 mb-3">Dubai, UAE</p>
                <p className="text-sm text-gray-600">
                  Specialist in electronics and auto parts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Join Our Community Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Join Our Community</h3>
            <p className="text-gray-300 mb-8">
              Become part of the TechBridge family and experience the future of cross-border commerce. 
              Quality products, reliable service, and exceptional support – that's our promise to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Shopping
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
