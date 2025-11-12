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
  Minimize2,
  Maximize2,
  Eye
} from "lucide-react";
import { Product, products } from "../data/products";
import { chatbotService, ChatMessage, ChatAction } from "../services/chatbot";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContext";
import { useLocation } from "react-router-dom";

interface ChatbotProps {
  onAddToCart?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  cartItems?: any[];
  wishlistItems?: any[];
}

export function Chatbot({ onAddToCart, onProductClick, cartItems = [], wishlistItems = [] }: ChatbotProps) {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { categories, brands } = useProducts();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: t("chatbot.welcome", "Hello! I'm your shopping assistant. I can help you find products, answer questions, and complete your purchase. What are you looking for today?"),
      timestamp: new Date(),
      suggestions: [
        t("chatbot.suggestion1", "Show me iPhones"),
        t("chatbot.suggestion2", "I need auto parts for Hyundai"),
        t("chatbot.suggestion3", "What's on sale?"),
        t("chatbot.suggestion4", "Help me choose a laptop")
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

  // Initialize enhanced chatbot features
  useEffect(() => {
    // Load browsing history
    chatbotService.loadBrowsingHistory();
    
    // Detect user location
    chatbotService.detectUserLocation();
    
    // Load order history if authenticated
    if (isAuthenticated) {
      chatbotService.loadUserOrderHistory();
    }
  }, [isAuthenticated]);

  // Generate bot response using AI service
  const generateBotResponse = async (userMessage: string): Promise<ChatMessage> => {
    try {
      // Set comprehensive context for the chatbot service
      chatbotService.setContext({
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
        isAuthenticated,
        language: i18n.language,
        recentProducts: products.slice(0, 10),
        cartItems: cartItems,
        conversationHistory: messages.slice(-10),
        categories: categories || [],
        brands: brands || [],
        currentPage: location.pathname,
        userLocation: user?.location || 'Rwanda',
        orderHistory: [], // Will be loaded by loadUserOrderHistory
        wishlistItems: wishlistItems,
        browsingHistory: chatbotService.context.browsingHistory || [],
        currentGeolocation: chatbotService.context.currentGeolocation
      });

      const response = await chatbotService.generateResponse(userMessage, products);
      return response;
    } catch (error) {
      // Log errors for debugging in production
      console.error('Chatbot service error:', error);
      // Fallback response
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'm having trouble connecting right now. Please try again or contact our support team for assistance.",
        timestamp: new Date(),
        suggestions: ["Contact support", "Browse products", "View FAQ"]
      };
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get AI-powered bot response
      const botResponse = await generateBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      // Fallback to legacy response
      const fallbackResponse: ChatMessage = {
        id: Date.now().toString() + '_fallback',
        type: 'bot',
        content: "I'm experiencing some technical difficulties. Let me help you in a different way - you can browse our products or contact our support team.",
        timestamp: new Date(),
        suggestions: ["Browse products", "Contact support", "View FAQ"]
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Enhanced product search with NLP
  const handleProductSearch = (query: string) => {
    const results = chatbotService.searchProducts(query, products);
    return results;
  };

  // Handle chat actions
  const handleChatAction = (action: ChatAction) => {
    switch (action.type) {
      case 'add_to_cart':
        if (onAddToCart && action.data) {
          onAddToCart(action.data);
          // Add confirmation message
          const confirmMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'bot',
            content: `✅ ${action.data.name} has been added to your cart! Would you like to continue shopping or proceed to checkout?`,
            timestamp: new Date(),
            suggestions: [t("chatbot.continueShopping", "Continue shopping"), t("chatbot.viewCart", "View cart"), t("chatbot.checkout", "Checkout")]
          };
          setMessages(prev => [...prev, confirmMessage]);
        }
        break;
      case 'view_product':
        if (onProductClick && action.data) {
          onProductClick(action.data);
        }
        break;
      case 'search':
        if (action.data) {
          handleProductSearch(action.data);
        }
        break;
    }
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
      isMinimized ? 'h-16' : 'h-[600px]'
    } flex flex-col`}>
      <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">{t("chatbot.shoppingAssistant", "Shopping Assistant")}</CardTitle>
              <p className="text-xs opacity-90">{t("chatbot.online", "Online")} • {t("chatbot.readyToHelp", "Ready to help")}</p>
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
        <>
          {/* Messages Area - Takes remaining space */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4 pb-4">
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
                        <p className="text-sm whitespace-pre-line">
                          {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                        </p>
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
                                        {t("chatbot.view", "View")}
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="h-6 text-xs px-2"
                                        onClick={() => onAddToCart?.(product)}
                                      >
                                        <ShoppingCart className="h-3 w-3 mr-1" />
                                        {t("chatbot.addToCart", "Add")}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Actions */}
                      {message.actions && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant={action.type === 'add_to_cart' ? 'default' : 'outline'}
                              className="text-xs h-7"
                              onClick={() => handleChatAction(action)}
                            >
                              {action.type === 'add_to_cart' && <ShoppingCart className="h-3 w-3 mr-1" />}
                              {action.type === 'view_product' && <Eye className="h-3 w-3 mr-1" />}
                              {action.label}
                            </Button>
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
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                placeholder={t("chatbot.askAnything", "Ask me anything...")}
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
        </>
      )}
    </Card>
  );
}