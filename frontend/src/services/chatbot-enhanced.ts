import { Product } from "../data/products";

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
  language: string;
  recentProducts: Product[];
  cartItems: any[];
  conversationHistory: ChatMessage[];
}

class EnhancedChatbotService {
  private context: ChatContext;
  private readonly GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
  private readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

  constructor() {
    this.context = {
      language: 'en',
      recentProducts: [],
      cartItems: [],
      conversationHistory: []
    };
  }

  setContext(context: Partial<ChatContext>) {
    this.context = { ...this.context, ...context };
  }

  async generateResponse(userMessage: string, products: Product[]): Promise<ChatMessage> {
    const messageId = Date.now().toString();

    // Add user message to history
    const userMessageObj: ChatMessage = {
      id: messageId + '_user',
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    this.context.conversationHistory.push(userMessageObj);

    try {
      // Try Gemini first (more generous free tier)
      if (this.GEMINI_API_KEY) {
        return await this.generateGeminiResponse(userMessage, products, messageId);
      }
      // Fallback to OpenAI if Gemini is not available
      else if (this.OPENAI_API_KEY) {
        return await this.generateOpenAIResponse(userMessage, products, messageId);
      }
      // Fallback to rule-based responses
      else {
        return this.generateRuleBasedResponse(userMessage, products, messageId);
      }
    } catch (error) {
      console.error('AI service error:', error);
      return this.generateRuleBasedResponse(userMessage, products, messageId);
    }
  }

  private async generateGeminiResponse(userMessage: string, products: Product[], messageId: string): Promise<ChatMessage> {
    const prompt = this.buildEnhancedPrompt(userMessage, products);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
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

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return this.parseAndEnhanceResponse(aiResponse, userMessage, products, messageId);
  }

  private buildEnhancedPrompt(userMessage: string, products: Product[]): string {
    const productList = products.slice(0, 15).map(p =>
      `- ${p.name} by ${p.brand} - $${p.price} (${p.category})`
    ).join('\n');

    // Get recent conversation context
    const recentConversation = this.context.conversationHistory.slice(-6).map(msg => 
      `${msg.type === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    return `You are a friendly, helpful shopping assistant for TechBridge - an e-commerce platform connecting Dubai with Rwanda. You help customers find products, answer questions, and provide excellent customer service.

CONVERSATION CONTEXT:
${recentConversation ? recentConversation : 'This is the start of the conversation.'}

AVAILABLE PRODUCTS:
${productList}

CURRENT CUSTOMER MESSAGE: "${userMessage}"

INSTRUCTIONS:
- Be conversational, friendly, and helpful
- Remember and use customer names when they introduce themselves
- If they ask about their name or if you remember them, acknowledge appropriately
- Provide personalized product recommendations
- Answer questions about shipping (Global hubs → Rwanda: 5-7 days, free over $5000)
- Support multiple languages: English, Kinyarwanda, Kiswahili, Lingala, Luganda
- When recommending products, mention 2-3 specific items with prices
- Be natural and human-like in your responses
- If they greet you or introduce themselves, respond warmly and personally

RESPONSE FORMAT:
Provide a natural, conversational response. If recommending products, mention them by name and price in your response.`;
  }

  private buildSystemPrompt(products: Product[]): string {
    const productList = products.slice(0, 15).map(p =>
      `- ${p.name} by ${p.brand} - $${p.price} (${p.category})`
    ).join('\n');

    return `You are a friendly shopping assistant for TechBridge, connecting Dubai with Rwanda.

Available products:
${productList}

Be conversational, remember customer names, provide personalized recommendations, and answer questions about shipping (Global hubs → Rwanda: 5-7 days, free over $5000). Support multiple languages and be naturally helpful.`;
  }

  private generateRuleBasedResponse(userMessage: string, products: Product[], messageId: string): ChatMessage {
    const message = userMessage.toLowerCase();

    // Simple greeting responses
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return {
        id: messageId,
        type: 'bot',
        content: "Hello! 👋 I'm your shopping assistant. I can help you find products, answer questions about shipping, payments, and more. What are you looking for today?",
        timestamp: new Date(),
        suggestions: [
          "Show me iPhones",
          "What's on sale?",
          "I need auto parts",
          "Help me choose a laptop"
        ]
      };
    }

    // Product search responses
    if (message.includes('iphone') || message.includes('apple phone')) {
      const iphones = products.filter(p => p.name.toLowerCase().includes('iphone'));
      return {
        id: messageId,
        type: 'bot',
        content: "I found some great iPhone options for you! Here are our current models available with fast shipping from Dubai:",
        timestamp: new Date(),
        products: iphones.slice(0, 3),
        suggestions: ["Add iPhone to cart", "Compare iPhone models", "Show me iPhone accessories"],
        actions: iphones.slice(0, 3).map(product => ({
          type: 'add_to_cart' as const,
          label: `Add ${product.name}`,
          data: product
        }))
      };
    }

    // Default response
    return {
      id: messageId,
      type: 'bot',
      content: "I'd be happy to help you find what you're looking for! You can ask me about specific products, shipping, deals, or anything else. What would you like to know?",
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
}

export const enhancedChatbotService = new EnhancedChatbotService();
