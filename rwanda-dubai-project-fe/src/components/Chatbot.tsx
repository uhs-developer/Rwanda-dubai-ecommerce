import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  ShoppingCart, 
  Search,
  Minimize2,
  Maximize2
} from "lucide-react";
import { Product, products } from "../data/products";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  products?: Product[];
}

interface ChatbotProps {
  onAddToCart?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export function Chatbot({ onAddToCart, onProductClick }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your shopping assistant. I can help you find products, answer questions, and complete your purchase. What are you looking for today?",
      timestamp: new Date(),
      suggestions: [
        "Show me iPhones",
        "I need auto parts for Hyundai",
        "What's on sale?",
        "Help me choose a laptop"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateBotResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    
    // Product search responses
    if (message.includes('iphone') || message.includes('apple phone')) {
      const iphones = products.filter(p => p.name.toLowerCase().includes('iphone'));
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I found some great iPhone options for you! Here are our current models available with fast shipping from Dubai:",
        timestamp: new Date(),
        products: iphones,
        suggestions: ["Add iPhone to cart", "Compare iPhone models", "Show me iPhone accessories"]
      };
    }
    
    if (message.includes('hyundai') || message.includes('auto parts')) {
      const hyundaiParts = products.filter(p => p.subcategory === 'Hyundai');
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Here are the Hyundai auto parts we have in stock. All genuine OEM parts with warranty:",
        timestamp: new Date(),
        products: hyundaiParts,
        suggestions: ["Show brake pads", "Find air filters", "Check compatibility"]
      };
    }
    
    if (message.includes('laptop') || message.includes('macbook')) {
      const laptops = products.filter(p => p.subcategory === 'Laptops' || p.name.toLowerCase().includes('macbook'));
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Perfect timing! Here are our premium laptops, including the latest MacBook models:",
        timestamp: new Date(),
        products: laptops,
        suggestions: ["Compare specs", "Check availability", "Add to cart"]
      };
    }
    
    if (message.includes('sale') || message.includes('discount') || message.includes('deal')) {
      const saleItems = products.filter(p => p.originalPrice && p.originalPrice > p.price);
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Great news! Here are our current deals with amazing discounts:",
        timestamp: new Date(),
        products: saleItems,
        suggestions: ["Show all deals", "Filter by category", "Set price alert"]
      };
    }
    
    if (message.includes('samsung') || message.includes('galaxy')) {
      const samsungProducts = products.filter(p => p.brand === 'Samsung');
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Here are the Samsung products we have available:",
        timestamp: new Date(),
        products: samsungProducts,
        suggestions: ["Compare with iPhone", "Check Samsung deals", "Add to cart"]
      };
    }
    
    // General help responses
    if (message.includes('shipping') || message.includes('delivery')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "We offer fast shipping from Dubai to Rwanda:\n\n• FREE shipping on orders over $500\n• Standard delivery: 7-14 business days\n• Express delivery: 3-7 business days\n• All items are authentic and come with warranty\n\nWould you like to see products that qualify for free shipping?",
        timestamp: new Date(),
        suggestions: ["Show free shipping items", "Calculate shipping cost", "Track my order"]
      };
    }
    
    if (message.includes('payment') || message.includes('pay')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "We accept multiple secure payment methods:\n\n• Credit/Debit Cards (Visa, Mastercard)\n• Mobile Money (MTN, Airtel)\n• Bank Transfer\n• PayPal\n\nAll payments are secured with 256-bit SSL encryption. Need help with checkout?",
        timestamp: new Date(),
        suggestions: ["Start checkout", "Payment help", "Contact support"]
      };
    }
    
    if (message.includes('warranty') || message.includes('return')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "All our products come with great protection:\n\n• 2-year manufacturer warranty\n• 30-day free returns\n• 100% authentic products\n• Customer support in English & Kinyarwanda\n\nWhat product are you interested in?",
        timestamp: new Date(),
        suggestions: ["Browse electronics", "View auto parts", "Contact support"]
      };
    }
    
    // Default response with product suggestions
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "I'd be happy to help you find what you're looking for! You can ask me about:\n\n• Specific products (iPhone, MacBook, auto parts)\n• Shipping and delivery\n• Pricing and deals\n• Product comparisons\n• Order assistance\n\nWhat would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Show me popular products",
        "What's new?",
        "Help me find something specific",
        "I need technical support"
      ]
    };
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 shadow-xl z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[32rem]'
    }`}>
      <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Shopping Assistant</CardTitle>
              <p className="text-xs opacity-90">Online • Ready to help</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(32rem-4rem)]">
          {/* Messages with proper scrolling */}
          <ScrollArea 
            className="flex-1 p-4" 
            ref={scrollAreaRef}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  {message.type === 'bot' && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${
                    message.type === 'user' ? 'order-1' : 'order-2'
                  }`}>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                    
                    {/* Product Cards */}
                    {message.products && (
                      <div className="space-y-2 mt-2">
                        {message.products.slice(0, 3).map((product) => (
                          <div key={product.id} className="bg-white border rounded-lg p-3">
                            <div className="flex gap-3">
                              <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-sm font-semibold">${product.price}</span>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 text-xs px-2"
                                      onClick={() => onProductClick?.(product)}
                                    >
                                      View
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-6 text-xs px-2"
                                      onClick={() => onAddToCart?.(product)}
                                    >
                                      <ShoppingCart className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80 text-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 order-2">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}