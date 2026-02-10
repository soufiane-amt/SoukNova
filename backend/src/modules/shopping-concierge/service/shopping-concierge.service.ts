// @ts-nocheck

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Groq from 'groq-sdk';
import { ChatResponse, ProductRecommendation } from '../dto/chat-response.dto';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SearchIntent {
  keywords: string[];
  productType: string;
  queryType: 'specific' | 'browse';  // NEW: distinguish query type
  productName?: string;              // NEW: specific product name if mentioned
}

@Injectable()
export class ConciergeService {
  private groq: Groq;

  constructor(private prismaService: PrismaService) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async handleChat(messages: ChatMessage[]): Promise<ChatResponse> {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    const intent = await this.classifyIntent(lastUserMessage);
    console.log('Classified intent:', intent);

    if (intent === 'product_inquiry') {
      return this.handleProductQuestion(messages);
    }

    return this.handleGeneralConversation(messages);
  }

  private async classifyIntent(userMessage: string): Promise<'product_inquiry' | 'general'> {
    const response = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are an intent classifier for an e-commerce assistant.
Classify the user message into one of these categories:
- "product_inquiry": Questions about products, prices, availability, features, recommendations
- "general": Greetings, off-topic questions, personal questions, chitchat

Respond with ONLY the category name, nothing else.`,
        },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 20,
      temperature: 0,
    });

    const result = response.choices[0]?.message?.content?.toLowerCase().trim() || '';
    return result.includes('product') ? 'product_inquiry' : 'general';
  }

  private async handleGeneralConversation(messages: ChatMessage[]): Promise<ChatResponse> {
    const recentHistory = messages.slice(-10);

    const response = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a friendly e-commerce shopping assistant named "SoukNova Assistant".
You help customers find products in our store.

For greetings: Respond warmly and offer to help find products.
For off-topic questions: Politely redirect to shopping assistance.
For personal questions: Briefly answer and guide back to shopping.

Keep responses short and friendly. Remember the conversation context.`,
        },
        ...recentHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 150,
    });

    return {
      message: response.choices[0]?.message?.content || "Hi! I'm here to help you find products. What are you looking for today?",
    };
  }

  private async handleProductQuestion(messages: ChatMessage[]): Promise<ChatResponse> {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    // Step 1: Extract search intent with query type
    const searchIntent = await this.extractSearchIntent(lastUserMessage);
    console.log('Search intent:', searchIntent);

    // Step 2: Search for candidate products
    const candidateProducts = await this.searchProducts(searchIntent.keywords);
    console.log('Candidate products:', candidateProducts.length);

    if (candidateProducts.length === 0) {
      return {
        message: "I couldn't find any products matching your query. Could you try describing what you're looking for differently?",
      };
    }

    // Step 3: Handle based on query type
    if (searchIntent.queryType === 'specific') {
      return this.handleSpecificProductQuery(
        candidateProducts,
        searchIntent,
        lastUserMessage,
        messages
      );
    }

    // Browse query: filter and return multiple products
    return this.handleBrowseQuery(
      candidateProducts,
      searchIntent,
      lastUserMessage,
      messages
    );
  }

  private async handleSpecificProductQuery(
    candidateProducts: any[],
    searchIntent: SearchIntent,
    userQuery: string,
    messages: ChatMessage[]
  ): Promise<ChatResponse> {
    // Find the best matching product
    const bestMatch = await this.findBestMatchingProduct(
      candidateProducts,
      searchIntent.productName || userQuery,
      userQuery
    );

    if (!bestMatch) {
      return {
        message: `I couldn't find a product matching "${searchIntent.productName || searchIntent.keywords.join(' ')}". Would you like me to show you similar products?`,
      };
    }

    // Generate detailed response for this specific product
    const recentHistory = messages.slice(-4);

    const response = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a helpful e-commerce shopping assistant.

The customer is asking about this specific product:
- Name: ${bestMatch.title}
- Description: ${bestMatch.description}
- Price: $${bestMatch.price}
- Categories: ${bestMatch.categories?.join(', ') || 'N/A'}
- Rating: ${bestMatch.rate || 'N/A'}/5

Answer the customer's question about this product. Be detailed, helpful, and informative.
If they ask about price, availability, features, etc., provide that information.
The product will be displayed as a card below your response.`,
        },
        ...recentHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 400,
    });

    const formattedProduct: ProductRecommendation = {
      id: bestMatch.id,
      name: bestMatch.title,
      price: `$${bestMatch.price.toFixed(2)}`,
      discount: bestMatch.discount,
      image: bestMatch.images?.[0] || undefined,
      rating: bestMatch.rate ? `${bestMatch.rate.toFixed(1)}` : '4.5',
      url: `/products/${bestMatch.id}`,
    };

    return {
      message: response.choices[0]?.message?.content || `Here's the ${bestMatch.title} you asked about:`,
      products: [formattedProduct],
    };
  }

  private async handleBrowseQuery(
    candidateProducts: any[],
    searchIntent: SearchIntent,
    userQuery: string,
    messages: ChatMessage[]
  ): Promise<ChatResponse> {
    // Filter products using AI to match user intent
    const relevantProducts = await this.filterRelevantProducts(
      candidateProducts,
      searchIntent.productType,
      userQuery
    );
    console.log('Relevant products after filtering:', relevantProducts.length);

    if (relevantProducts.length === 0) {
      return {
        message: `I found some products related to "${searchIntent.keywords.join(', ')}" but none that exactly match what you're looking for. Could you provide more details?`,
      };
    }

    const productContext = relevantProducts
      .map((p) => `- ${p.title}: ${p.description?.slice(0, 100)}... (Price: $${p.price})`)
      .join('\n');

    const recentHistory = messages.slice(-6);

    const response = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a helpful e-commerce shopping assistant.
Here are the relevant products:

${productContext}

Answer the customer's question based on these products and the conversation history. 
Be helpful, concise, and friendly. Remember what was discussed earlier.
Do NOT list the products in your response - they will be displayed separately as cards.
Instead, provide a brief helpful message about the products found.`,
        },
        ...recentHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 300,
    });

    const formattedProducts: ProductRecommendation[] = relevantProducts.map(p => ({
      id: p.id,
      name: p.title,
      price: `$${p.price.toFixed(2)}`,
      discount: p.discount,
      image: p.images?.[0] || undefined,
      rating: p.rate ? `${p.rate.toFixed(1)}` : '4.5',
      url: `/products/${p.id}`,
    }));

    return {
      message: response.choices[0]?.message?.content || 'Here are some products you might like:',
      products: formattedProducts,
    };
  }

  private async findBestMatchingProduct(
    products: any[],
    productName: string,
    userQuery: string
  ): Promise<any | null> {
    if (products.length === 0) return null;
    if (products.length === 1) return products[0];

    const productSummaries = products.map((p, index) => ({
      index,
      title: p.title,
      description: p.description?.slice(0, 100) || '',
    }));

    const response = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a product matcher for an e-commerce store.

The user is asking about a specific product: "${productName}"
User query: "${userQuery}"

Find the SINGLE product that best matches what the user is asking about.

Products:
${JSON.stringify(productSummaries, null, 2)}

Return ONLY the index number of the best matching product.
If no product matches well, return -1.
Return ONLY a number, nothing else.`,
        },
      ],
      max_tokens: 10,
      temperature: 0,
    });

    try {
      const content = response.choices[0]?.message?.content?.trim() || '-1';
      const index = parseInt(content, 10);
      if (index >= 0 && index < products.length) {
        return products[index];
      }
    } catch (e) {
      console.error('Failed to parse best match response:', e);
    }

    // Fallback: return first product whose title is most similar
    const lowerName = productName.toLowerCase();
    return products.find(p => 
      p.title.toLowerCase().includes(lowerName)
    ) || products[0];
  }

  private async extractSearchIntent(userMessage: string): Promise<SearchIntent> {
    const response = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a search intent extractor for an e-commerce store.
Given a user message, extract:
1. "keywords": Array of search keywords to find products
2. "productType": The main type of product the user wants
3. "queryType": Either "specific" (asking about ONE particular product by name/model) or "browse" (looking for product recommendations/options)
4. "productName": If queryType is "specific", the exact product name mentioned (otherwise null)

Examples:
- "I need a chair" → {"keywords": ["chair"], "productType": "chair", "queryType": "browse", "productName": null}
- "Tell me about the MacBook Pro" → {"keywords": ["macbook", "pro", "apple", "laptop"], "productType": "laptop", "queryType": "specific", "productName": "MacBook Pro"}
- "What's the price of Nike Air Max?" → {"keywords": ["nike", "air", "max", "shoes"], "productType": "shoes", "queryType": "specific", "productName": "Nike Air Max"}
- "Show me gaming laptops" → {"keywords": ["gaming", "laptop"], "productType": "laptop", "queryType": "browse", "productName": null}
- "Do you have the iPhone 15?" → {"keywords": ["iphone", "15", "apple", "phone"], "productType": "phone", "queryType": "specific", "productName": "iPhone 15"}

Return ONLY valid JSON, nothing else.`,
        },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0,
    });

    try {
      const content = response.choices[0]?.message?.content || '{}';
      const match = content.match(/\{.*\}/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          keywords: parsed.keywords || [],
          productType: parsed.productType || '',
          queryType: parsed.queryType === 'specific' ? 'specific' : 'browse',
          productName: parsed.productName || undefined,
        };
      }
    } catch (e) {
      console.error('Failed to parse search intent:', e);
    }

    return {
      keywords: userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 2),
      productType: userMessage,
      queryType: 'browse',
    };
  }

  private async filterRelevantProducts(
    products: any[],
    productType: string,
    userQuery: string
  ): Promise<any[]> {
    if (products.length === 0) return [];

    const productSummaries = products.map((p, index) => ({
      index,
      title: p.title,
      description: p.description?.slice(0, 150) || '',
    }));

    const response = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a product relevance filter for an e-commerce store.

The user is looking for: "${productType}"
User query: "${userQuery}"

Given a list of products, return ONLY the indices of products that are ACTUALLY what the user wants to buy.

Rules:
- If user wants "chair", include actual chairs, NOT chair accessories, chair covers, or chair parts
- If user wants "laptop", include actual laptops, NOT laptop bags or laptop stands
- Only include products that the user would directly use as the main product

Products:
${JSON.stringify(productSummaries, null, 2)}

Return a JSON array of indices of relevant products. Example: [0, 2, 4]
If no products match, return an empty array: []
Return ONLY the JSON array, nothing else.`,
        },
      ],
      max_tokens: 50,
      temperature: 0,
    });

    try {
      const content = response.choices[0]?.message?.content || '[]';
      const match = content.match(/\[.*\]/s);
      if (match) {
        const indices: number[] = JSON.parse(match[0]);
        return indices
          .filter(i => i >= 0 && i < products.length)
          .map(i => products[i]);
      }
    } catch (e) {
      console.error('Failed to parse product filter response:', e);
    }

    return products.filter(p => 
      p.title.toLowerCase().includes(productType.toLowerCase())
    );
  }

  private async searchProducts(keywords: string[]) {
    if (keywords.length === 0) return [];

    const searchConditions = keywords.map(keyword => ({
      OR: [
        { title: { contains: keyword, mode: 'insensitive' as const } },
        { description: { contains: keyword, mode: 'insensitive' as const } },
        { categories: { has: keyword } },
      ],
    }));

    return this.prismaService.product.findMany({
      where: { OR: searchConditions },
      take: 15,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        categories: true,
        images: true,
        rate: true,
        discount: true,
      },
    });
  }
}