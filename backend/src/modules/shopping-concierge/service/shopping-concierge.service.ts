import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import { ChatResponse, Product } from '../dto/chat-response.dto';
import { Prisma } from '@prisma/client';

// chat-session.interface.ts
export interface ChatSession {
  activeProducts: Product[];
  latestKeywords?: string[];
  filters: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'rating';
  };
  offset: number;
  contextSummary: string;
}

const IntentSchema = z.object({
  intent: z.enum([
    'product_search',
    'product_reference',
    'product_comparison',
    'pagination',
    'general',
  ]),
  searchKeywords: z.array(z.string()).optional(),
  filters: z
    .object({
      category: z.string().nullable().optional(),
      priceMin: z.number().nullable().optional(),
      priceMax: z.number().nullable().optional(),
      sortBy: z
        .enum(['price_asc', 'price_desc', 'rating'])
        .nullable()
        .optional(),
    })
    .optional(),

  referenceIndices: z.array(z.number()).nullable().optional(),
  comparisonQuery: z.string().nullable().optional(),
  confidence: z.number().optional(),
  contextSummary: z.string().optional(),
});
@Injectable()
export class ConciergeService {
  private groq: ReturnType<typeof createGroq>;

  // In production, use Redis or similar for session state
  private sessions: Map<string, ChatSession> = new Map();

  constructor(private prisma: PrismaService) {
    this.groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async handleChat(sessionId: string, userMessage: string) {
    const session = this.getSession(sessionId);

    const intentData = await this.extractIntent(userMessage);

    // Store the updated context summary
    if (intentData.contextSummary) {
      session.contextSummary = intentData.contextSummary;
    }

    if (intentData?.confidence && intentData?.confidence < 0.6)
      return this.handleGeneral(session, userMessage);

    switch (intentData.intent) {
      case 'product_search':
        return this.handleSearch(session, intentData, userMessage);
      case 'product_reference':
        return this.handleReference(session, intentData);
      case 'product_comparison':
        return this.handleComparison(session, intentData, userMessage);
      case 'pagination':
        return this.handlePagination(session, intentData);
      default:
        return this.handleGeneral(session, userMessage);
    }
  }

  private async generateProductResponse(products: any[], userMessage: string) {
    const productContext = products
      .map(
        (p, i) => `
[${i}]
Title: ${p.title}
Price: $${p.price}
Rating: ${p.rating ?? 'N/A'}
Discount: ${p.discount ?? 'None'}
About: ${p.about_item?.substring(0, 100) ?? 'No description available.'}
`,
      )
      .join('\n');

    const result = await generateText({
      model: this.groq('llama-3.3-70b-versatile'),
      temperature: 0.3,
      prompt: `
You are a professional shopping assistant.

You must answer the user's question using ONLY the product data provided below.
Do NOT invent information.
Do NOT say that information is missing.
Speak naturally and directly to the user.

Available Products:
${productContext}

User message:
"${userMessage}"

Respond helpfully:
`,
    });

    return result.text;
  }

  private async handleSearch(
    session: ChatSession,
    intentData,
    userMessage: string,
  ) {
    session.filters = intentData.filters;
    session.offset = 0;

    const rawKeywords = intentData.searchKeywords ?? [];
    const expandedKeywords = await this.expandKeywords(rawKeywords);
    session.latestKeywords = expandedKeywords;

    const products = await this.queryProducts(
      session,
      expandedKeywords,
      intentData.filters,
    );

    if (!products.length) {
      return {
        message:
          "I couldn't find matching products. Would you like to try something else?",
      };
    }

    const relevantProducts = await this.filterRelevantProducts(
      products,
      expandedKeywords,
      userMessage,
    );

    if (!relevantProducts.length) {
      return {
        message:
          "I found some related items but not exactly what you're looking for. Could you try describing it differently?",
      };
    }

    session.activeProducts = relevantProducts.map((p) => ({
      id: p.id,
      title: p.title,
      price: (
        p.price - (p.discount ? p.price * (parseFloat(p.discount) / 100) : 0)
      ).toFixed(2),
      discount: p.discount ?? undefined,
      primary_image: p.primary_image ?? undefined,
      rating: p.rate ?? undefined,
      url: undefined,
    }));

    console.log('relevantProducts:', relevantProducts);
    const response = await this.generateProductResponse(
      relevantProducts,
      'talk to me briefly about these products',
    );

    return {
      message: response,
      products: session.activeProducts,
    };
  }

  private async handleReference(session: ChatSession, intentData) {
    const indices = intentData.referenceIndices || [];

    const referenced = indices
      .map((i) => session.activeProducts[i])
      .filter(Boolean);

    if (referenced.length === 0) {
      return { message: "I couldn't identify which product you mean." };
    }
    const referencedProductsInfo = await this.prisma.product.findMany({
      where: {
        id: {
          in: referenced.map((p) => p.id),
        },
      },
      select: {
        title: true,
        price: true,
        discount: true,
        rate: true,
        about_item: true,
      },
    });

    const response = await this.generateProductResponse(
      referencedProductsInfo,
      'tell me more about these products',
    );

    return {
      message: response,
      products: referenced,
    };
  }

  // Add this inside the ConciergeService class, after handleReference

  private async handleComparison(
    session: ChatSession,
    intentData: z.infer<typeof IntentSchema>,
    userMessage: string,
  ): Promise<ChatResponse> {
    const products = session.activeProducts;

    if (!products.length) {
      return {
        message:
          "I don't have any products to compare right now. What would you like to search for?",
      };
    }

    // If user referenced specific products, only compare those
    const indices = intentData.referenceIndices ?? [];
    const toCompare =
      indices.length > 0
        ? indices.map((i) => products[i]).filter(Boolean)
        : products;

    if (toCompare.length === 0) {
      return {
        message: "I couldn't identify which products you want to compare.",
      };
    }

    // Fetch full product details for comparison
    const fullProducts = await this.prisma.product.findMany({
      where: { id: { in: toCompare.map((p) => p.id) } },
      select: {
        id: true,
        title: true,
        price: true,
        discount: true,
        rate: true,
        about_item: true,
        categories: true,
      },
    });

    const productContext = fullProducts
      .map(
        (p, i) => `
[Product ${i + 1}]
Title: ${p.title}
Price: $${p.price}
Rating: ${p.rate ?? 'N/A'}/5
Discount: ${p.discount ?? 'None'}
Categories: ${p.categories?.join(', ') ?? 'N/A'}
About: ${p.about_item?.substring(0, 200) ?? 'No description available.'}
`,
      )
      .join('\n');

    const result = await generateText({
      model: this.groq('llama-3.3-70b-versatile'),
      temperature: 0.3,
      prompt: `
You are a professional home decor shopping assistant for SoukNova.

The user is asking a question about these previously shown products.

PRODUCTS:
${productContext}

USER QUESTION:
"${userMessage}"

RULES:
1. Answer ONLY using the product data above. NEVER invent features, materials, or specs not listed.
2. If the user asks "which is cheapest/most expensive" → compare prices directly.
3. If the user asks "which do you recommend" → recommend based on rating, price, and description.
4. If the user asks to compare → provide a clear, concise comparison.
5. If asked about a detail not available (e.g., dimensions, material), say: "That detail isn't listed, but you can check the product page for more info."
6. Reference products by their names, not just numbers.
7. Keep it concise (3-5 sentences max).
8. End with a helpful next step (e.g., "Would you like more details on any of these?").
`,
    });

    return {
      message:
        result.text || "Here's what I can tell you about these products.",
      products: toCompare, // Re-show the compared products
    };
  }

  async queryProducts(
    session: ChatSession,
    searchKeywords: string[],
    filters?: {
      category?: string | null;
      priceMin?: number | null;
      priceMax?: number | null;
      sortBy?: 'price_asc' | 'price_desc' | 'rating' | null;
    },
  ): Promise<any> {
    console.log('Querying products with keywords:', searchKeywords);
    console.log('Applied filters:', filters);
    const queryString = searchKeywords?.join(' ') ?? '';
    if (!queryString.trim()) return [];

    const rawQuery = queryString
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(' | '); // ← CHANGED from ' & ' to ' | ' (OR instead of AND)

    if (!rawQuery || rawQuery === ':*') return [];

    // 🔹 Build dynamic WHERE filters
    const filterConditions: Prisma.Sql[] = [];

    if (filters?.category) {
      const normalizedCategory = filters.category.toLowerCase();

      console.log('Filtering by category:', normalizedCategory);
      // Match the keyword inside categoriesText (case-insensitive)
      filterConditions.push(
        Prisma.sql`LOWER("Product"."categoriesText") LIKE '%' || ${normalizedCategory} || '%'`,
      );
    }

    if (filters?.priceMin != null) {
      filterConditions.push(Prisma.sql`price >= ${filters.priceMin}`);
    }

    if (filters?.priceMax != null) {
      filterConditions.push(Prisma.sql`price <= ${filters.priceMax}`);
    }

    const filtersSql =
      filterConditions.length > 0
        ? Prisma.sql`AND ${Prisma.join(filterConditions, ' AND ')}`
        : Prisma.empty;

    // 🔹 Dynamic ORDER BY
    let orderBySql: Prisma.Sql;

    switch (filters?.sortBy) {
      case 'price_asc':
        orderBySql = Prisma.sql`price ASC`;
        break;
      case 'price_desc':
        orderBySql = Prisma.sql`price DESC`;
        break;
      case 'rating':
        orderBySql = Prisma.sql`rate DESC NULLS LAST`;
        break;
      default:
        orderBySql = Prisma.sql`rank DESC`;
    }

    const results = await this.prisma.$queryRaw`
    SELECT id, title, primary_image, price, discount, rate, categories,
      ts_rank(
        setweight(to_tsvector('english', title), 'A'),
        to_tsquery('english', ${rawQuery})
      ) +
      ts_rank(
        setweight(to_tsvector('english', about_item), 'B'),
        plainto_tsquery('english', ${queryString})
      ) AS rank
    FROM "Product"
    WHERE (
      setweight(to_tsvector('english', title), 'A') @@ to_tsquery('english', ${rawQuery})
    )
    ${filtersSql}
    ORDER BY ${orderBySql}
    LIMIT 15
    OFFSET ${session.offset};
  `;

    return results;
  }

  private getSession(sessionId: string): ChatSession {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        activeProducts: [],
        latestKeywords: [],
        filters: {},
        offset: 0,
        contextSummary: '',
      });
    }

    return this.sessions.get(sessionId)!;
  }

  private async handlePagination(session: ChatSession, intentData: any) {
    if (!session.latestKeywords?.length) {
      return { message: 'What would you like to search for?' };
    }

    session.offset += 15;
    console.log('Handling pagination with filters:', session.latestKeywords);
    console.log('session.filters', session.filters);
    const products = await this.queryProducts(
      session,
      session.latestKeywords ?? [],
      session.filters,
    );

    if (!products.length) {
      return {
        message:
          "I couldn't find matching products. Would you like to try something else?",
      };
    }

    session.activeProducts = [
      ...session.activeProducts,
      ...products.map((p) => ({
        id: p.id,
        title: p.title,
        price: (
          p.price - (p.discount ? p.price * (parseFloat(p.discount) / 100) : 0)
        ).toFixed(2),
        discount: p.discount ?? undefined,
        primary_image: p.primary_image ?? undefined,
        rating: p.rate ?? undefined,
        url: undefined,
      })),
    ];

    return {
      message: 'Here are more options:',
      products: products,
    };
  }

  private async extractIntent(userMessage: string) {
    const activeProducts = this.getSession("1").activeProducts ?? [];
    const lastIndex = activeProducts.length - 1;

    const prompt = `
You are an intent extraction engine for a HOME DECOR e-commerce store.

CONVERSATION CONTEXT:
${this.getSession("1").contextSummary || '(new conversation, no prior context)'}

${(() => {
  const session = this.getSession("1");
  return session && session.latestKeywords?.length
    ? `Previous search keywords: [${session.latestKeywords.join(', ')}]`
    : '';
})()}

CURRENT MESSAGE: "${userMessage}"

Previously shown products:
${activeProducts.length > 0 ? activeProducts.map((p, i) => `[${i}] ${p.title} - $${p.price}`).join('\n') : '(none)'}

Respond ONLY with valid JSON:

{
  "intent": "product_search" | "product_reference" | "product_comparison" | "pagination" | "general",
  "filters": {
    "category": string | null,
    "priceMin": number | null,
    "priceMax": number | null,
    "sortBy": "price_asc" | "price_desc" | "rating" | null
  },
  "searchKeywords": string[] | null,
  "referenceIndices": number[] | null,
  "comparisonQuery": string | null,
  "confidence": number,
  "contextSummary": string
}

CONTEXT SUMMARY RULES:
- "contextSummary" must be a SHORT (1-2 sentence) summary of the ENTIRE conversation so far, INCLUDING the current message.
- Capture: what the user is looking for, any preferences, what was shown, and what they just asked.
- Examples:
  - First message "I need chairs" → "User is looking for chairs."
  - Follow-up "something cheaper" → "User searched for chairs, was shown results. Now wants cheaper options."
  - Follow-up "tell me about the first one" → "User searched for chairs, was shown results. Asking about the first chair."
  - Follow-up "hello" → "User previously searched for chairs. Now greeting."

CONTEXT-AWARE RULES:
- If the user says something vague like "something better", "anything else", "what about cheaper ones" AND there are previously shown products → this is a REFINED SEARCH.
- For a refined search: use intent "product_search" but carry over the SAME keywords from "Previous search keywords" and apply new filters.
- "something better" → keep same keywords, sortBy: "rating"
- "something cheaper" / "anything more affordable" → keep same keywords, sortBy: "price_asc"
- "something more expensive" / "more premium" → keep same keywords, sortBy: "price_desc"
- "do you have more" / "show me more" → intent: "pagination"
- "what about in blue/leather/wood" → keep same keywords, add modifier to searchKeywords

SORTING RULES:
- "cheapest", "lowest price", "most affordable" → "price_asc"
- "most expensive", "highest price", "luxury", "premium" → "price_desc"
- "highest rated", "best rated", "top rated", "best reviews" → "rating"

When a sorting preference is detected:
- DO NOT include those words in "searchKeywords".
- Instead, set the appropriate "sortBy" value.

Intent definitions:

1. product_search
User wants to find, buy, browse, see, explore, or get recommendations for products.

In addition to filters, extract the main search keywords from the message (e.g., nouns, product names, adjectives describing the product) and put them in the array "searchKeywords". If you cannot extract any, return an empty array.
If intent is NOT "product_search", return an empty array [] for "searchKeywords".

Examples:
- "I need chairs" => { "searchKeywords": ["chairs"] }
- "Looking for cheap beds" => { "searchKeywords": ["beds"] } don't include "cheap" because it's a price filter, not a keyword.
- "Do you have office desks?" => { "searchKeywords": ["office", "desks"] }
- "Recommend me a mirror" => { "searchKeywords": ["mirror"] }

2. product_reference
Choose "product_reference" ONLY if:
- The user refers to products using positional words like:
  "first", "second", "third", "last", "that one", "this one"
- OR refers to one of the indexed products shown above.
- AND the message is clearly about one of those previously shown products.
Examples:
- Tell me more about the first one
- Is the second cheaper?
- What about that one?

put in mind that these following products were previously shown to the user:

${this.sessions
  .get('1')
  ?.activeProducts.map((p, i) => `[${i}] ${p.title}`)
  .join('\n')}

IMPORTANT RULES:
- Indices are ZERO-BASED (0 to ${lastIndex}).
- "first" = 0, "second" = 1, "last" = ${lastIndex}.
- NEVER return an index outside 0-${lastIndex}.

3. product_comparison
User asks a question that requires ANALYZING or COMPARING previously shown products.
Examples: "Which is cheapest?", "Which do you recommend?", "Compare them"
Set "comparisonQuery" to the user's question.

4. pagination
User wants MORE results from the same search.
Examples: "Show me more", "Next", "More options"

5. general
Greetings, small talk, or questions unrelated to products.

- If products are shown AND user asks about those products → "product_comparison", NOT "product_search".
- If NO context and vague message → "general".

Message: "${userMessage}"
`;
    const result = await generateText({
      model: this.groq('llama-3.1-8b-instant'),
      temperature: 0,
      prompt: prompt,
    });
    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch {
      throw new Error('Intent parsing failed');
    }
    console.log('Extracted intent data:', parsed);
    return IntentSchema.parse(parsed);
  }

  private async handleGeneral(
    session: ChatSession,
    userMessage: string,
  ): Promise<ChatResponse> {
    try {
      session.latestKeywords = [];
      const result = await generateText({
        model: this.groq('llama-3.3-70b-versatile'),
        system: `
You are a friendly shopping assistant for SoukNova, your name is Nexo, a home decor and furniture store.

Your role:
- Be warm and conversational.
- Answer greetings and small talk naturally.
- If asked about shipping, returns, or policies, give general helpful guidance.
- Always gently guide the conversation back toward shopping.

CRITICAL RULES:
1. Keep responses short (1–3 sentences).
2. NEVER mention specific product types (e.g., "curtains", "sofas", "lamps", "rugs").
3. NEVER say "we have...", "we carry...", "we offer...", "you might like our..." followed by any product.
4. NEVER claim you can show or suggest a specific category of product.
5. Instead, ask the user what they're looking for or what problem they're trying to solve.
6. If the user describes a problem or need, respond with empathy and ask them to describe what they need so you can search for it.

GOOD EXAMPLES:
- User: "my neighbors can see through my windows" → "That sounds frustrating! Tell me what you're looking for and I'll search our catalog to see if we have something that can help."
- User: "my room is too dark" → "I'd love to help with that! What kind of solution are you imagining? I can search and see what we have available."
- User: "hello" → "Hi there! Welcome to SoukNova 👋 I'm Nexo, your shopping assistant. What can I help you find today?"

BAD EXAMPLES (never do this):
- "We have lovely curtains that can help!" ❌
- "Check out our lamps and lighting options!" ❌
- "You might like our rugs!" ❌
        `,
        prompt: userMessage,
      });

      return {
        message:
          result.text ||
          "Hi! I'm here to help you find beautiful home decor. What are you looking for today?",
      };
    } catch (error) {
      console.error('General handler error:', error);

      return {
        message:
          "Hi! I'm here to help you find home decor and furniture. What would you like to explore?",
      };
    }
  }

  private async expandKeywords(searchKeywords: string[]): Promise<string[]> {
    const query = searchKeywords.join(' ');

    const result = await generateText({
      model: this.groq('llama-3.1-8b-instant'),
      temperature: 0,
      prompt: `
You are a keyword expansion engine for a HOME DECOR & FURNITURE store.

The user described what they want using natural language.
Your job: translate their description into concrete product names/types that would appear in a store catalog.

STORE INVENTORY INCLUDES:
chairs, sofas, couches, armchairs, recliners, tables, desks, beds, nightstands,
lamps, chandeliers, pendant lights, rugs, carpets, mirrors, shelves, bookcases,
vases, planters, candles, curtains, pillows, cushions, throws, blankets,
wall art, paintings, frames, clocks, sculptures, baskets, storage boxes,
plates, bowls, mugs, kitchen accessories

RULES:
1. Return ONLY a JSON array of product keywords. Nothing else.
2. Maximum 4 keywords.
3. Map abstract needs to concrete products:
   - "something to relax on" → ["sofa", "armchair", "recliner"]
   - "something to eat on" → ["dining table", "tableware"]
   - "make my room brighter" → ["lamp", "chandelier", "mirror"]
   - "organize my stuff" → ["shelf", "storage", "basket"]
   - "something cozy" → ["blanket", "throw", "cushion"]
   - "wall decoration" → ["wall art", "painting", "mirror"]
4. If the input is already a concrete product name (e.g., "chair", "lamp"), return it as-is.
5. Only suggest products that exist in a home decor store.

User query: "${query}"

JSON array:`,
    });

    try {
      const expanded = JSON.parse(result.text);
      if (Array.isArray(expanded) && expanded.length > 0) {
        console.log(`Keywords expanded: [${searchKeywords}] → [${expanded}]`);
        return expanded.map((k: string) => k.toLowerCase()).slice(0, 4);
      }
    } catch {
      console.error('Keyword expansion parsing failed, using originals');
    }

    return searchKeywords;
  }

  // Add this method to the ConciergeService class
  private async filterRelevantProducts(
    products: any[],
    searchKeywords: string[],
    userMessage: string,
  ): Promise<any[]> {
    if (products.length <= 1) return products;

    const productList = products
      .map(
        (p, i) =>
          `[${i}] ${p.title}, Categories : ${p.categories.join(', ') ?? 'N/A'}`,
      )
      .join('\n');

    console.log('productList:', productList);
    const result = await generateText({
      model: this.groq('llama-3.3-70b-versatile'),
      temperature: 0,
      prompt: `
You are a product relevance filter.


Products found:
${productList}

Return ONLY the indices of products that ARE ACTUALLY the type of product the user wants and order them based on the relevance.
the user sent to you this message: ${userMessage}
ask yourself "Would THIS product satisfy that need?"
- If YES → include it
- If NO → exclude it
- If it's a PART OF or ACCESSORY FOR the product → exclude it

CATEGORY-BASED RULES (most important):
- EXCLUDE if categories contain: "Replacement Parts", "Parts & Accessories", "Hardware", "Sofa Parts", "Chair Parts", "Furniture Parts", "Springs", "Connectors", "Brackets", "Straps", "Webbing", "Power Supplies", "Adapters", "Covers", "Slipcovers", "Protectors", "Tools" or anything that ends up with Parts
- EXCLUDE if categories indicate a DIFFERENT product type than what the user wants (e.g., user wants "chair" but categories say "Tables", "End Tables", "Side Tables")
- INCLUDE only if categories indicate the product IS the actual item the user wants

TITLE-BASED RULES (secondary check):
- EXCLUDE if title contains: "replacement", "repair", "connector", "handle", "cable", "lever", "spring", "bracket", "pack", "pcs", "kit"

FOR EACH PRODUCT:
1. Check categories first → do they match what the user wants?
2. Check title second → is it the actual product or a part/accessory?
3. Only include if BOTH checks pass

Respond with ONLY a JSON array of indices, e.g.: [0, 4]
and please order them by relevance (most relevant first).
Do NOT include any explanation.
`,
    });

    try {
      console.log('LLM filter raw response:', result.text);

      const indices = JSON.parse(result.text);
      if (Array.isArray(indices) && indices.length > 0) {
        const filtered = indices
          .filter((i: number) => i >= 0 && i < products.length)
          .map((i: number) => products[i]);
        return filtered;
      }
    } catch {
      console.error('Relevance filter parsing failed, returning all products');
    }

    return products;
  }
}
