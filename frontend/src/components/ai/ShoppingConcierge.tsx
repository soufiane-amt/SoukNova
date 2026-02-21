'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  primary_image?: string;
  rating?: string;
  url?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  isLoading?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  products?: Product[]; // Add products to chat history
}

interface ChatResponse {
  message: string;
  products?: Product[];
}

const suggestedPrompts = [
  "I'm looking for a gift for a developer",
  'Show me trending products under $50',
  'Best-selling items this week',
  'Help me find home decor',
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const STORAGE_KEY = 'concierge_session_id';

const getSessionId = (): string => {
  if (typeof window === 'undefined') return ''; // SSR guard
  let sessionId = sessionStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
};

export default function ShoppingConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session ID on client only
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Welcome to SoukNova! 👋 I'm your personal shopping assistant. Tell me what you're looking for and I'll help you find the perfect products.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = text || input.trim();
      if (!messageText || isTyping || !sessionId) return;

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: messageText,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      try {
        const response = await fetch(`${API_BASE_URL}/shopping-concierge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            message: messageText,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ChatResponse = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          products: data.products,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error('Chat error:', error);

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "I'm sorry, I encountered an error. Please try again in a moment.",
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping, sessionId],
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsTyping(false);

    await fetch(`${API_BASE_URL}/shopping-concierge/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
      }),
    });

    // Generate new session ID
    const newSessionId = uuidv4();
    sessionStorage.setItem(STORAGE_KEY, newSessionId);
    setSessionId(newSessionId);

    setMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          "Welcome to SoukNova! 👋 I'm your personal shopping assistant. Tell me what you're looking for and I'll help you find the perfect products.",
      },
    ]);
  }, [sessionId]);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl"
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
            {/* Pulse indicator */}
            <span className="absolute -right-1 -top-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 flex h-[550px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-black px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Shopping Assistant
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${isTyping ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`}
                    ></span>
                    <p className="text-xs text-gray-400">
                      {isTyping ? 'Thinking...' : 'Online'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  title="Clear chat"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.role === 'user' ? '' : 'space-y-3'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-start gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black">
                            <SparklesIcon className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 shadow-sm">
                            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      )}

                      {message.role === 'user' && (
                        <div className="rounded-2xl rounded-br-sm bg-black px-4 py-2.5">
                          <p className="text-sm leading-relaxed text-white">
                            {message.content}
                          </p>
                        </div>
                      )}

                      {/* Product Cards */}
                      {message.products && message.products.length > 0 && (
                        <div className="ml-9 mt-2 space-y-2">
                          {message.products.map((product, idx) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <Link
                                href={`/product/${product.id}`}
                                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-2.5 transition-all hover:border-gray-200 hover:shadow-md"
                              >
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                  {product.primary_image ? (
                                    <Image
                                      src={product.primary_image}
                                      alt={product.title}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <ShoppingBagIcon className="h-5 w-5 text-gray-300" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="truncate text-sm font-medium text-gray-900">
                                    {product.title}
                                  </h4>
                                  <div className="mt-0.5 flex items-center gap-2">
                                    <span className="text-sm font-semibold text-black">
                                      {product.price}
                                    </span>
                                    {product.discount && (
                                      <span className="text-xs font-medium text-emerald-600">
                                        -{product.discount}%
                                      </span>
                                    )}
                                  </div>
                                  {product.rating && (
                                    <div className="flex items-center gap-0.5 text-xs text-gray-500">
                                      <span className="text-yellow-500">★</span>
                                      {product.rating}
                                    </div>
                                  )}
                                </div>
                                <svg
                                  className="h-4 w-4 shrink-0 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black">
                      <SparklesIcon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="h-1.5 w-1.5 rounded-full bg-gray-400"
                        />
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.15,
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-gray-400"
                        />
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.3,
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-gray-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              {messages.length === 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4"
                >
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Quick prompts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={() => handleSend(prompt)}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-all hover:border-black hover:bg-black hover:text-white"
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isTyping}
                  className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-black focus:bg-white disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-all disabled:opacity-40"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
