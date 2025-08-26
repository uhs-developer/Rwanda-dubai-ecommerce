import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ArrowLeft, Search, Plus, Minus, Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FAQPageProps {
  onBack: () => void;
}

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  categoryLabel: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "shipping",
    categoryLabel: "Shipping",
    question: "How long does shipping from Dubai to Rwanda take?",
    answer: "Standard shipping from Dubai to Rwanda typically takes 5-7 business days. Express shipping options are available for 2-3 business days delivery. All shipments include tracking information so you can monitor your order's progress."
  },
  {
    id: "2",
    category: "shipping",
    categoryLabel: "Shipping",
    question: "Do I need to pay customs duties on my order?",
    answer: "Customs duties may apply depending on the value and type of products ordered. Orders under $100 are typically exempt from duties. For orders above this amount, you may be required to pay customs fees upon delivery. We provide all necessary documentation to facilitate customs clearance."
  },
  {
    id: "3",
    category: "orders",
    categoryLabel: "Orders",
    question: "Can I modify or cancel my order after placing it?",
    answer: "Orders can be modified or cancelled within 2 hours of placement. After this time, orders enter our fulfillment process and cannot be changed. Please contact our customer service team immediately if you need to make changes to your order."
  },
  {
    id: "4",
    category: "payment",
    categoryLabel: "Payment",
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and mobile money payments. All transactions are secured with SSL encryption to protect your payment information."
  },
  {
    id: "5",
    category: "products",
    categoryLabel: "Products",
    question: "Are all products genuine and authentic?",
    answer: "Yes, we guarantee that all our products are 100% genuine and authentic. We work directly with authorized distributors and manufacturers in Dubai to ensure product authenticity. All items come with original packaging and documentation."
  },
  {
    id: "6",
    category: "shipping",
    categoryLabel: "Shipping",
    question: "Can I track my shipment?",
    answer: "Yes, all orders include tracking information. Once your order ships, you'll receive a tracking number via email and SMS. You can track your shipment on our website or directly with the shipping carrier."
  },
  {
    id: "7",
    category: "orders",
    categoryLabel: "Orders",
    question: "Do you offer bulk or wholesale pricing?",
    answer: "Yes, we offer competitive bulk and wholesale pricing for orders of 10 or more units. Please contact our sales team with your requirements for a custom quote. Volume discounts are available for businesses and resellers."
  },
  {
    id: "8",
    category: "payment",
    categoryLabel: "Payment",
    question: "Is it safe to enter my payment information?",
    answer: "Absolutely. We use industry-standard SSL encryption and PCI DSS compliant payment processing to protect your information. Your payment details are never stored on our servers and are processed securely by trusted payment providers."
  },
  {
    id: "9",
    category: "products",
    categoryLabel: "Products",
    question: "Can you help me find a specific product not listed on your website?",
    answer: "Yes! Our team can help source specific products from Dubai's markets. Contact us with the product details, and we'll check availability and provide you with pricing and delivery information within 24 hours."
  },
  {
    id: "10",
    category: "account",
    categoryLabel: "Account",
    question: "Do I need to create an account to place an order?",
    answer: "While you can place orders as a guest, creating an account offers benefits like order history, faster checkout, wishlist functionality, and exclusive member discounts. Account creation is free and takes less than a minute."
  },
  {
    id: "11",
    category: "returns",
    categoryLabel: "Returns",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories. Return shipping costs are covered by us for defective items, while customer-initiated returns may incur return shipping fees."
  },
  {
    id: "12",
    category: "warranty",
    categoryLabel: "Warranty",
    question: "What warranty coverage do you provide?",
    answer: "Warranty coverage varies by product category: Electronics (12-24 months), Auto Parts (6-12 months), and Appliances (12-36 months). All warranties cover manufacturing defects and component failures under normal use conditions."
  },
  {
    id: "13",
    category: "products",
    categoryLabel: "Products",
    question: "Do you sell refurbished or used items?",
    answer: "No, we only sell brand new, unused products. All items are sourced directly from manufacturers or authorized distributors and come with full warranty coverage. We clearly label any open-box or display items if available."
  },
  {
    id: "14",
    category: "support",
    categoryLabel: "Support",
    question: "How can I contact customer support?",
    answer: "Our customer support team is available via email (support@techbridge.com), phone (+971 4 XXX XXXX), live chat on our website, and WhatsApp. Email support is available 24/7, while phone and chat support operate during business hours."
  },
  {
    id: "15",
    category: "installation",
    categoryLabel: "Installation",
    question: "Do you provide installation services for auto parts?",
    answer: "While we don't provide direct installation services, we can recommend certified mechanics and auto service centers in Rwanda. We also provide detailed installation guides and technical support for compatible products."
  }
];

const categories = [
  { id: "all", label: "All" },
  { id: "shipping", label: "Shipping" },
  { id: "orders", label: "Orders" },
  { id: "payment", label: "Payment" },
  { id: "products", label: "Products" },
  { id: "returns", label: "Returns" },
  { id: "warranty", label: "Warranty" },
  { id: "account", label: "Account" },
  { id: "support", label: "Support" },
  { id: "installation", label: "Installation" }
];

export function FAQPage({ onBack }: FAQPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@techbridge.com";
  };

  const handleCallUs = () => {
    toast.info("Calling +971 4 XXX XXXX...");
  };

  const handleLiveChat = () => {
    toast.info("Live chat feature coming soon!");
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
              <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
              <p className="text-gray-600">Find answers to common questions about our products and services</p>
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
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
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

        {/* Popular Questions Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Popular Questions</h2>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="overflow-hidden">
                <Collapsible 
                  open={openItems.includes(faq.id)} 
                  onOpenChange={() => toggleItem(faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {faq.categoryLabel}
                          </Badge>
                          <h3 className="font-medium text-gray-900 text-left">
                            {faq.question}
                          </h3>
                        </div>
                        {openItems.includes(faq.id) ? (
                          <Minus className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        ) : (
                          <Plus className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="px-6 pb-6 pt-0">
                      <div className="pl-20">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse a different category.
              </p>
            </div>
          )}
        </div>

        {/* Still Need Help Section */}
        <Card className="bg-gray-900 text-white">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-white" />
              <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-gray-300 mb-8">
                Can't find the answer you're looking for? Our customer support team is here to help with any 
                questions about products, orders, or technical issues.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  onClick={handleEmailSupport}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Support
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCallUs}
                  className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-gray-900"
                >
                  <Phone className="h-4 w-4" />
                  Call Us
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLiveChat}
                  className="flex items-center gap-2 border-white text-white hover:bg-white hover:text-gray-900"
                >
                  <MessageCircle className="h-4 w-4" />
                  Live Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Support Hours */}
        <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Customer Support Hours</h3>
            <p className="text-gray-600 text-sm mb-4">
              Our team is available to assist you during these hours:
            </p>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-900">Email Support</span>
                <p className="text-gray-600">Available 24/7</p>
                <p className="text-gray-600">Response within 24 hours</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Phone & Chat</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Monday - Friday:</span> 9:00 AM - 6:00 PM
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Saturday:</span> 10:00 AM - 4:00 PM
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Sunday:</span> Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
