import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, MessageCircle, RotateCcw, Package, CheckCircle, XCircle, Shield, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

interface ReturnsWarrantyPageProps {
  onBack: () => void;
}

export function ReturnsWarrantyPage({ onBack }: ReturnsWarrantyPageProps) {
  const handleContactReturns = () => {
    toast.info('Redirecting to returns department...');
  };

  const handleWarrantyClaim = () => {
    toast.info('Warranty claim form coming soon!');
  };

  const handleTrackRequest = () => {
    toast.info('Return tracking feature coming soon!');
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
              <h1 className="text-2xl font-bold text-gray-900">Returns & Warranty</h1>
              <p className="text-gray-600">Our comprehensive return policy and warranty coverage</p>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Return Policy */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">30-Day Return Policy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We stand behind the quality of our products. If you're not completely satisfied with your 
              purchase, you can return it within 30 days for a full refund or exchange.
            </p>
          </div>

          {/* Return Process Steps */}
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">01</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 1</h3>
              <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
              <p className="text-sm text-gray-600">
                Contact our customer service team within 30 days of purchase.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 2</h3>
              <h4 className="font-medium text-gray-900 mb-2">Return Authorization</h4>
              <p className="text-sm text-gray-600">
                Get your Return Merchandise Authorization (RMA) number.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 3</h3>
              <h4 className="font-medium text-gray-900 mb-2">Package & Ship</h4>
              <p className="text-sm text-gray-600">
                Pack your item securely and ship using provided return label.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Step 4</h3>
              <h4 className="font-medium text-gray-900 mb-2">Processing</h4>
              <p className="text-sm text-gray-600">
                We'll process your return within 5-7 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Return Conditions */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Return Conditions</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Eligible for Return */}
            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-700">Eligible for Return</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Items in original condition with all accessories</li>
                  <li>• Original packaging and documentation included</li>
                  <li>• Returned within 30 days of delivery</li>
                  <li>• Proof of purchase provided</li>
                  <li>• No signs of wear or damage</li>
                </ul>
              </CardContent>
            </Card>

            {/* Not Eligible for Return */}
            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <h3 className="font-semibold text-red-700">Not Eligible for Return</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Items damaged by misuse or normal wear</li>
                  <li>• Software or digital products after activation</li>
                  <li>• Custom or personalized items</li>
                  <li>• Items returned after 30-day period</li>
                  <li>• Items without original packaging</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Warranty Coverage */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-gray-900">Warranty Coverage</h2>
            </div>
            <p className="text-gray-600">Comprehensive warranty protection for all our products</p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Electronics Warranty */}
            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Electronics</h3>
                  <Badge variant="secondary" className="text-primary bg-primary/10">
                    12-24 months
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Coverage Includes:</h4>
                    <p className="text-sm text-gray-600">
                      Manufacturing defects, component failures
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Conditions:</h4>
                    <p className="text-sm text-gray-600">
                      Original packaging, proof of purchase required
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto Parts Warranty */}
            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Auto Parts</h3>
                  <Badge variant="secondary" className="text-primary bg-primary/10">
                    6-12 months
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Coverage Includes:</h4>
                    <p className="text-sm text-gray-600">
                      Defective parts, installation issues
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Conditions:</h4>
                    <p className="text-sm text-gray-600">
                      Professional installation recommended
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appliances Warranty */}
            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Appliances</h3>
                  <Badge variant="secondary" className="text-primary bg-primary/10">
                    12-36 months
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Coverage Includes:</h4>
                    <p className="text-sm text-gray-600">
                      Electrical faults, mechanical failures
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Conditions:</h4>
                    <p className="text-sm text-gray-600">
                      User manual compliance required
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Need Help?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Returns Department */}
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Returns Department</h3>
                <p className="text-sm text-gray-600 mb-4">
                  For return requests and RMA numbers
                </p>
                <Button variant="outline" onClick={handleContactReturns}>
                  Contact Returns
                </Button>
              </CardContent>
            </Card>

            {/* Warranty Claims */}
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Warranty Claims</h3>
                <p className="text-sm text-gray-600 mb-4">
                  For warranty service and repairs
                </p>
                <Button variant="outline" onClick={handleWarrantyClaim}>
                  File Warranty Claim
                </Button>
              </CardContent>
            </Card>

            {/* Track Status */}
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Track Status</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Check your return or warranty status
                </p>
                <Button variant="outline" onClick={handleTrackRequest}>
                  Track Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-orange-50 border-l-4 border-orange-400 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-orange-600 text-sm font-bold">!</span>
            </div>
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Important Notice</h3>
              <p className="text-orange-700 text-sm">
                Items shipped internationally may be subject to customs fees or duties upon arrival. We recommend using tracking 
                shipping methods and purchasing insurance for valuable items. Processing times may vary during peak seasons and holidays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
