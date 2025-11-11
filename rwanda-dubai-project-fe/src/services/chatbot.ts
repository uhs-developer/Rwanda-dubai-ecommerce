import { Product } from "../data/products";
import { ProductService, ProductFilters } from "./product";
import { UserService } from "./user";

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  products?: Product[];
  actions?: ChatAction[];
}

export interface ChatAction {
  type: 'add_to_cart' | 'view_product' | 'search' | 'category';
  label: string;
  data: any;
}

export interface ChatContext {
  userId?: string;
  userName?: string;
  userEmail?: string;
  isAuthenticated: boolean;
  language: string;
  recentProducts: Product[];
  cartItems: any[];
  conversationHistory: ChatMessage[];
  // Enhanced context
  categories: any[];
  brands: any[];
  currentPage?: string;
  userLocation?: string;
  orderHistory?: any[];
  wishlistItems?: any[];
  browsingHistory?: any[];
  currentGeolocation?: {
    country: string;
    city: string;
    latitude?: number;
    longitude?: number;
  };
}

class ChatbotService {
  private context: ChatContext;
  private readonly GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
  private readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

  private generateUniqueId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  constructor() {
    this.context = {
      isAuthenticated: false,
      language: 'en',
      recentProducts: [],
      cartItems: [],
      conversationHistory: [],
      categories: [],
      brands: [],
      browsingHistory: [],
      orderHistory: [],
      wishlistItems: []
    };
    
    // Initialize chatbot service silently
  }

  setContext(context: Partial<ChatContext>) {
    this.context = { ...this.context, ...context };
  }

  async generateResponse(userMessage: string, products: Product[]): Promise<ChatMessage> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate AI response with enhanced database queries

    // Add user message to history
    const userMessageObj: ChatMessage = {
      id: this.generateUniqueId(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    this.context.conversationHistory.push(userMessageObj);

    try {
      // Get intelligent product results from database
      const dbProducts = await this.intelligentProductQuery(userMessage);
      
      // Combine static products with database results
      const enhancedProducts = [...dbProducts, ...products].slice(0, 15);

      // Try Gemini first (more generous free tier)
      if (this.GEMINI_API_KEY) {
        return await this.generateGeminiResponse(userMessage, enhancedProducts, messageId);
      }
      // Fallback to OpenAI if Gemini is not available
      else if (this.OPENAI_API_KEY) {
        return await this.generateOpenAIResponse(userMessage, enhancedProducts, messageId);
      }
      // Fallback to rule-based responses
      else {
        return this.generateRuleBasedResponse(userMessage, enhancedProducts, messageId);
      }
    } catch (error) {
      // Silently fall back to rule-based response on API errors
      return this.generateRuleBasedResponse(userMessage, products, messageId);
    }
  }

  private async generateGeminiResponse(userMessage: string, products: Product[], messageId: string): Promise<ChatMessage> {
    const prompt = this.buildEnhancedPrompt(userMessage, products);

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return this.parseAndEnhanceResponse(aiResponse, userMessage, products, messageId);
  }

  private async generateOpenAIResponse(userMessage: string, products: Product[], messageId: string): Promise<ChatMessage> {
    const conversationHistory = this.context.conversationHistory.slice(-6).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const systemPrompt = this.buildSystemPrompt(products);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return this.parseAndEnhanceResponse(aiResponse, userMessage, products, messageId);
  }

  private buildEnhancedPrompt(userMessage: string, products: Product[]): string {
    const productList = products.slice(0, 15).map(p =>
      `- ${p.name} by ${typeof p.brand === 'string' ? p.brand : p.brand?.name || 'Unknown Brand'} - $${p.price} (${typeof p.category === 'string' ? p.category : p.category?.name || 'Unknown Category'})`
    ).join('\n');

    // Get recent conversation context (last 6 messages)
    const recentConversation = this.context.conversationHistory.slice(-6).map(msg => 
      `${msg.type === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    // Build user context
    const userContext = this.context.isAuthenticated 
      ? `CUSTOMER PROFILE:
- Name: ${this.context.userName || 'Not provided'}
- Email: ${this.context.userEmail || 'Not provided'}
- Account Status: Registered customer
- Cart Items: ${this.context.cartItems.length} items
- Wishlist Items: ${this.context.wishlistItems?.length || 0} items
- Previous Orders: ${this.context.orderHistory?.length || 0} orders`
      : `CUSTOMER PROFILE:
- Status: Guest visitor (not logged in)
- Cart Items: ${this.context.cartItems.length} items`;

    // Build site context from backend data only
    const categoryNames = this.context.categories && this.context.categories.length > 0 
      ? this.context.categories.map(c => typeof c === 'string' ? c : (c?.name || '')).filter(Boolean).join(', ')
      : '';
    
    const brandNames = this.context.brands && this.context.brands.length > 0
      ? this.context.brands.map(b => typeof b === 'string' ? b : (b?.name || '')).filter(Boolean).join(', ')
      : '';

    const siteContext = `SITE INFORMATION:
- Platform: TechBridge E-commerce
- Business Model: Dubai/China/Korea → Rwanda cross-border trade
- Available Categories: ${categoryNames || 'Loading categories...'}
- Available Brands: ${brandNames || 'Loading brands...'}
- Current Page: ${this.context.currentPage || 'Homepage'}
- Language: ${this.context.language}
- User Location: ${this.context.currentGeolocation?.city || this.context.userLocation || 'Rwanda'}
- Country: ${this.context.currentGeolocation?.country || 'Rwanda'}`;

    // Build browsing context
    const browsingContext = this.context.browsingHistory && this.context.browsingHistory.length > 0
      ? `RECENT BROWSING HISTORY:
${this.context.browsingHistory.slice(0, 5).map(item => 
  `- ${item.name || 'Unknown Product'} (${typeof item.category === 'string' ? item.category : item.category?.name || 'Unknown Category'}) - Viewed recently`
).join('\n')}`
      : 'RECENT BROWSING HISTORY:\n- No recent browsing history';

    // Build order context
    const orderContext = this.context.orderHistory && this.context.orderHistory.length > 0
      ? `ORDER HISTORY:
- Total Orders: ${this.context.orderHistory.length}
- Recent Orders: ${this.context.orderHistory.slice(0, 3).map(order => 
  `Order #${order.id || 'Unknown'} - $${order.total || 0} (${order.status || 'Unknown'})`
).join(', ')}`
      : 'ORDER HISTORY:\n- No previous orders';

    return `You are Manzi, a friendly and expert shopping assistant for TechBridge - an e-commerce platform connecting Dubai/China/Korea with Rwanda. You help customers find products, answer questions, and provide excellent customer service.

${userContext}

${siteContext}

${browsingContext}

${orderContext}

CONVERSATION HISTORY:
${recentConversation || 'This is the start of the conversation.'}

AVAILABLE PRODUCTS (Real-time from Database):
${productList}

CURRENT CUSTOMER MESSAGE: "${userMessage}"

INSTRUCTIONS:
- Be conversational, friendly, and naturally helpful like a real person
- Use the customer's name from their profile when appropriate
- Provide personalized recommendations based on their cart, wishlist, and order history
- Answer questions about shipping (Dubai to Rwanda: 5-7 days standard, 3-5 days express, FREE over $500)
- Support multiple languages: English, Kinyarwanda, Kiswahili, Lingala, Luganda
- When recommending products, mention 2-3 specific items with prices from the available list
- Reference their account status (guest vs registered) when relevant
- Help with account-related questions if they're logged in
- Suggest creating an account if they're a guest and it would be beneficial
- Be natural and human-like - no robotic responses
- Remember context from the conversation history above
- Use site context (current page, categories, brands) to provide relevant help

RESPONSE STYLE:
- Conversational and friendly
- Use emojis sparingly but appropriately 😊
- Mention specific products by name when relevant
- Keep responses concise but informative
- Be helpful and solution-oriented
- Address customers by name when you know it
- Reference their shopping context (cart items, wishlist) when helpful

Respond naturally as if you're a real person helping a customer in a store. Be warm, personal, and contextually aware.`;
  }

  private buildSystemPrompt(products: Product[]): string {
    const productList = products.slice(0, 15).map(p =>
      `- ${p.name} by ${typeof p.brand === 'string' ? p.brand : p.brand?.name || 'Unknown Brand'} - $${p.price} (${typeof p.category === 'string' ? p.category : p.category?.name || 'Unknown Category'})`
    ).join('\n');

    return `You are Manzi, a friendly shopping assistant for TechBridge, connecting Dubai with Rwanda.

Available products:
${productList}

Be conversational, remember customer names from conversation history, provide personalized recommendations with specific product names and prices, and answer questions about shipping (Dubai to Rwanda: 5-7 days, free over $500). Support multiple languages and be naturally helpful like a real person named Manzi.`;
  }

  private generateRuleBasedResponse(userMessage: string, products: Product[], messageId: string): ChatMessage {
    const message = userMessage.toLowerCase();

    // Handle personal introductions and greetings
    if (message.includes('who are you') || message.includes('what is your name')) {
      return {
        id: this.generateUniqueId(),
        type: 'bot',
        content: "Hi! I'm Manzi, your personal shopping assistant here at TechBridge! 😊 I help customers find amazing products from Dubai and get them delivered to Rwanda. I can help you with product recommendations, shipping questions, and anything else you need. What's your name?",
        timestamp: new Date(),
        suggestions: [
          "My name is...",
          "Show me products",
          "What can you help with?",
          "Tell me about shipping"
        ]
      };
    }

    // Handle greetings and introductions
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return {
        id: this.generateUniqueId(),
        type: 'bot',
        content: "Hello! 👋 I'm Manzi, your shopping assistant. I can help you find products, answer questions about shipping, payments, and more. What are you looking for today?",
        timestamp: new Date(),
        suggestions: [
          "Show me iPhones",
          "What's on sale?",
          "I need auto parts",
          "Help me choose a laptop"
        ]
      };
    }

    // Handle name introductions
    if ((message.includes('i am') || message.includes('my name is') || message.includes('call me')) && 
        (message.includes('sebastien') || message.includes('ndagijimana'))) {
      return {
        id: this.generateUniqueId(),
        type: 'bot',
        content: "Nice to meet you, Sebastien! 😊 Welcome to TechBridge! I'm Manzi, and I'm here to help you find exactly what you need. We have amazing products from Dubai with fast delivery to Rwanda. What can I help you find today?",
        timestamp: new Date(),
        suggestions: [
          "Show me electronics",
          "What's popular?",
          "I need auto parts",
          "Tell me about deals"
        ]
      };
    }

    // Dynamic product search responses - let backend data determine results
    if (message.includes('iphone') || message.includes('apple phone')) {
      const iphones = products.filter(p => p.name.toLowerCase().includes('iphone'));
      return {
        id: this.generateUniqueId(),
        type: 'bot',
        content: `I found ${iphones.length} iPhone options for you! Here are our current models available with fast shipping from Dubai:`,
        timestamp: new Date(),
        products: iphones.slice(0, 3),
        suggestions: ["Add to cart", "Compare models", "View all iPhones"],
        actions: iphones.slice(0, 3).map(product => ({
          type: 'add_to_cart' as const,
          label: `Add ${product.name}`,
          data: product
        }))
      };
    }

    if (message.includes('hyundai') || message.includes('auto parts') || message.includes('car parts')) {
      const autoParts = products.filter(p => p.category?.toLowerCase().includes('auto') || p.subcategory?.toLowerCase().includes('hyundai'));
      return {
        id: this.generateUniqueId(),
        type: 'bot',
        content: `Perfect! I found ${autoParts.length} auto parts available. All genuine OEM parts with warranty:`,
        timestamp: new Date(),
        products: autoParts.slice(0, 3),
        suggestions: ["Show all parts", "Check compatibility", "Add to cart"],
        actions: autoParts.slice(0, 3).map(product => ({
          type: 'add_to_cart' as const,
          label: `Add ${product.name}`,
          data: product
        }))
      };
    }

    if (message.includes('laptop') || message.includes('computer')) {
      const laptops = products.filter(p => p.category?.toLowerCase().includes('laptop') || p.name.toLowerCase().includes('macbook'));
      return {
        id: this.generateUniqueId(),
        type: 'bot',
        content: `Excellent choice! I found ${laptops.length} laptop options, including premium models:`,
        timestamp: new Date(),
        products: laptops.slice(0, 3),
        suggestions: ["Compare specs", "Check availability", "Add to cart"],
        actions: laptops.slice(0, 3).map(product => ({
          type: 'add_to_cart' as const,
          label: `Add ${product.name}`,
          data: product
        }))
      };
    }

    if (message.includes('sale') || message.includes('discount') || message.includes('deal')) {
      const saleItems = products.filter(p => p.originalPrice && p.originalPrice > p.price);
      return {
        id: this.generateUniqueId(),
        type: 'bot',
        content: "Amazing! Here are our current deals with fantastic discounts:",
        timestamp: new Date(),
        products: saleItems.slice(0, 3),
        suggestions: ["Show all deals", "Filter by category", "Set price alert"],
        actions: saleItems.slice(0, 3).map(product => ({
          type: 'add_to_cart' as const,
          label: `Add ${product.name}`,
          data: product
        }))
      };
    }

    // General help responses
    if (message.includes('shipping') || message.includes('delivery')) {
      return {
        id: this.generateUniqueId(),
        type: 'bot',
        content: "Great question! We offer fast shipping from Dubai to Rwanda:\n\n• FREE shipping on orders over $500\n• Standard delivery: 7-14 business days\n• Express delivery: 3-7 business days\n• All items are authentic and come with warranty\n\nWould you like to see products that qualify for free shipping?",
        timestamp: new Date(),
        suggestions: ["Show free shipping items", "Calculate shipping cost", "Track my order"]
      };
    }

    // Default response
    return {
      id: this.generateUniqueId(),
      type: 'bot',
      content: "I'm here to help you find exactly what you need! You can ask me about:\n\n• Specific products (iPhone, MacBook, auto parts)\n• Shipping and delivery\n• Current deals and pricing\n• Product comparisons\n• Order assistance\n\nWhat would you like to explore?",
      timestamp: new Date(),
      suggestions: [
        "Show me popular products",
        "What's new?",
        "Help me find something specific",
        "I need technical support"
      ]
    };
  }

  private parseAndEnhanceResponse(aiResponse: string, userMessage: string, products: Product[], messageId: string): ChatMessage {
    // Try to extract product recommendations from AI response
    const recommendedProducts: Product[] = [];
    const productNames = products.map(p => p.name.toLowerCase());

    // Simple product extraction - look for product names in response
    productNames.forEach((name, index) => {
      if (aiResponse.toLowerCase().includes(name)) {
        recommendedProducts.push(products[index]);
      }
    });

    // If no products found in response, suggest based on query
    if (recommendedProducts.length === 0) {
      const query = userMessage.toLowerCase();
      if (query.includes('phone') || query.includes('iphone')) {
        recommendedProducts.push(...products.filter(p => p.name.toLowerCase().includes('iphone')).slice(0, 3));
      } else if (query.includes('laptop') || query.includes('computer')) {
        recommendedProducts.push(...products.filter(p => p.subcategory === 'Laptops').slice(0, 3));
      } else if (query.includes('auto') || query.includes('car')) {
        recommendedProducts.push(...products.filter(p => p.category === 'auto-parts').slice(0, 3));
      }
    }

    return {
      id: messageId,
      type: 'bot',
      content: aiResponse,
      timestamp: new Date(),
      products: recommendedProducts.slice(0, 3),
      suggestions: this.generateSuggestions(userMessage, recommendedProducts),
      actions: recommendedProducts.slice(0, 3).map(product => ({
        type: 'add_to_cart' as const,
        label: `Add ${product.name}`,
        data: product
      }))
    };
  }

  private generateSuggestions(userMessage: string, products: Product[]): string[] {
    const suggestions: string[] = [];
    const message = userMessage.toLowerCase();

    if (products.length > 0) {
      suggestions.push("Add to cart", "View details", "Compare products");
    }

    if (message.includes('shipping')) {
      suggestions.push("Calculate shipping", "Track order");
    }

    if (message.includes('payment')) {
      suggestions.push("Payment methods", "Security info");
    }

    if (message.includes('warranty')) {
      suggestions.push("Return policy", "Contact support");
    }

    // Default helpful suggestions
    if (suggestions.length === 0) {
      suggestions.push("Browse categories", "View deals", "Contact support");
    }

    return suggestions.slice(0, 3);
  }

  searchProducts(query: string, products: Product[]): Product[] {
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.subcategory.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm)
    );
  }

  getProductsByCategory(category: string, products: Product[]): Product[] {
    return products.filter(product =>
      product.category.toLowerCase() === category.toLowerCase() ||
      product.subcategory.toLowerCase() === category.toLowerCase()
    );
  }

  getProductsByPriceRange(minPrice: number, maxPrice: number, products: Product[]): Product[] {
    return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
  }

  getOnSaleProducts(products: Product[]): Product[] {
    return products.filter(product => product.originalPrice && product.originalPrice > product.price);
  }

  // Enhanced Database Query Methods
  async queryProductsFromDB(query: string, filters: ProductFilters = {}): Promise<any[]> {
    try {
      const response = await ProductService.searchProducts(query, filters);
      return response.data || [];
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  }

  async getFeaturedProductsFromDB(): Promise<any[]> {
    try {
      const response = await ProductService.getFeaturedProducts();
      return response.data || [];
    } catch (error) {
      console.error('Featured products query error:', error);
      return [];
    }
  }

  async queryProductsByCategory(categorySlug: string): Promise<any[]> {
    try {
      // Use search to find products by category
      const response = await ProductService.searchProducts(categorySlug);
      return response.data || [];
    } catch (error) {
      console.error('Category products query error:', error);
      return [];
    }
  }

  async queryProductsByBrand(brandSlug: string): Promise<any[]> {
    try {
      // Use search to find products by brand
      const response = await ProductService.searchProducts(brandSlug);
      return response.data || [];
    } catch (error) {
      console.error('Brand products query error:', error);
      return [];
    }
  }

  async queryProductsByPriceRange(minPrice: number, maxPrice: number): Promise<any[]> {
    try {
      const response = await ProductService.getProducts({ 
        min_price: minPrice, 
        max_price: maxPrice 
      });
      return response.data || [];
    } catch (error) {
      console.error('Price range query error:', error);
      return [];
    }
  }

  async querySaleProductsFromDB(): Promise<any[]> {
    try {
      // Use search to find sale products
      const response = await ProductService.searchProducts('sale discount');
      return response.data || [];
    } catch (error) {
      console.error('Sale products query error:', error);
      return [];
    }
  }

  async getUserOrderHistory(): Promise<any[]> {
    try {
      if (!this.context.isAuthenticated) return [];
      const response = await UserService.getUserOrders();
      return response.data || [];
    } catch (error) {
      console.error('Order history query error:', error);
      return [];
    }
  }

  // AI-Powered Product Query Method
  async intelligentProductQuery(userMessage: string): Promise<any[]> {
    const message = userMessage.toLowerCase();
    
    // Extract query intent and parameters
    let queryResults: any[] = [];

    try {
      // Dynamic category-based queries - let backend determine categories
      if (message.includes('phone') || message.includes('iphone') || message.includes('mobile')) {
        queryResults = await this.queryProductsFromDB(message.includes('iphone') ? 'iphone' : 'phone');
      }
      else if (message.includes('laptop') || message.includes('computer') || message.includes('macbook')) {
        queryResults = await this.queryProductsFromDB(message.includes('macbook') ? 'macbook' : 'laptop');
      }
      else if (message.includes('auto') || message.includes('car') || message.includes('parts')) {
        queryResults = await this.queryProductsFromDB('auto parts');
      }
      else if (message.includes('electronics')) {
        queryResults = await this.queryProductsFromDB('electronics');
      }
      
      // Dynamic brand-based queries - let backend determine brands
      else if (message.includes('apple')) {
        queryResults = await this.queryProductsFromDB('apple');
      }
      else if (message.includes('samsung')) {
        queryResults = await this.queryProductsFromDB('samsung');
      }
      else if (message.includes('hyundai')) {
        queryResults = await this.queryProductsFromDB('hyundai');
      }
      
      // Price-based queries
      else if (message.includes('cheap') || message.includes('budget') || message.includes('under')) {
        const priceMatch = message.match(/under\s*\$?(\d+)/);
        const maxPrice = priceMatch ? parseInt(priceMatch[1]) : 500;
        queryResults = await this.queryProductsByPriceRange(0, maxPrice);
      }
      else if (message.includes('expensive') || message.includes('premium') || message.includes('over')) {
        const priceMatch = message.match(/over\s*\$?(\d+)/);
        const minPrice = priceMatch ? parseInt(priceMatch[1]) : 1000;
        queryResults = await this.queryProductsByPriceRange(minPrice, 10000);
      }
      
      // Special queries
      else if (message.includes('sale') || message.includes('discount') || message.includes('deal')) {
        queryResults = await this.querySaleProductsFromDB();
      }
      else if (message.includes('featured') || message.includes('popular') || message.includes('best')) {
        queryResults = await this.getFeaturedProductsFromDB();
      }
      
      // General search
      else {
        queryResults = await this.queryProductsFromDB(userMessage);
      }

      return queryResults.slice(0, 10); // Limit to 10 results
    } catch (error) {
      console.error('Intelligent query error:', error);
      return [];
    }
  }

  // Geolocation Detection
  async detectUserLocation(): Promise<void> {
    try {
      // Try to get user's geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Try to get location details from coordinates
            try {
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
              const locationData = await response.json();
              
              this.context.currentGeolocation = {
                country: locationData.countryName || 'Rwanda',
                city: locationData.city || 'Kigali',
                latitude,
                longitude
              };
            } catch (error) {
              // Fallback to default location
              this.context.currentGeolocation = {
                country: 'Rwanda',
                city: 'Kigali',
                latitude,
                longitude
              };
            }
          },
          (error) => {
            // Geolocation denied or failed, use default
            this.context.currentGeolocation = {
              country: 'Rwanda',
              city: 'Kigali'
            };
          }
        );
      }
    } catch (error) {
      console.error('Geolocation detection error:', error);
    }
  }

  // Browsing History Management
  addToBrowsingHistory(product: any): void {
    if (!this.context.browsingHistory) {
      this.context.browsingHistory = [];
    }

    // Remove if already exists to avoid duplicates
    this.context.browsingHistory = this.context.browsingHistory.filter(
      item => item.id !== product.id
    );

    // Add to beginning of array
    this.context.browsingHistory.unshift({
      ...product,
      viewedAt: new Date()
    });

    // Keep only last 20 items
    this.context.browsingHistory = this.context.browsingHistory.slice(0, 20);

    // Save to localStorage
    try {
      localStorage.setItem('techbridge-browsing-history', JSON.stringify(this.context.browsingHistory));
    } catch (error) {
      console.error('Failed to save browsing history:', error);
    }
  }

  loadBrowsingHistory(): void {
    try {
      const saved = localStorage.getItem('techbridge-browsing-history');
      if (saved) {
        this.context.browsingHistory = JSON.parse(saved).map((item: any) => ({
          ...item,
          viewedAt: new Date(item.viewedAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load browsing history:', error);
      this.context.browsingHistory = [];
    }
  }

  // Enhanced Order History with API Integration
  async loadUserOrderHistory(): Promise<void> {
    try {
      if (this.context.isAuthenticated) {
        const orderHistory = await this.getUserOrderHistory();
        this.context.orderHistory = orderHistory;
      }
    } catch (error) {
      console.error('Failed to load order history:', error);
    }
  }

  // Price Alert System (Future Enhancement)
  async checkPriceAlerts(products: any[]): Promise<any[]> {
    // TODO: Implement price alert checking
    // This would check if any products in user's price alerts have dropped in price
    return [];
  }

  // Smart Recommendations Based on Full Context
  getSmartRecommendations(): any[] {
    const recommendations: any[] = [];
    
    // Based on cart items
    if (this.context.cartItems.length > 0) {
      // Recommend complementary products
      this.context.cartItems.forEach(cartItem => {
        // Add logic to recommend accessories or related products
      });
    }

    // Based on browsing history
    if (this.context.browsingHistory && this.context.browsingHistory.length > 0) {
      // Recommend similar products to recently viewed
      const recentCategories = [...new Set(
        this.context.browsingHistory.slice(0, 5).map(item => item.category)
      )];
      // Add logic to recommend products from these categories
    }

    // Based on order history
    if (this.context.orderHistory && this.context.orderHistory.length > 0) {
      // Recommend products based on purchase patterns
      // Add logic for repeat purchases or upgrades
    }

    return recommendations;
  }
}

export const chatbotService = new ChatbotService();