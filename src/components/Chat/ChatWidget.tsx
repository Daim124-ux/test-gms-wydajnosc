'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useChat } from 'ai/react';
import { Minus, X, Send, Sparkles, User, Loader2, Info, Terminal, ChevronRight, ExternalLink, Trash2, Globe, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Message } from 'ai';
import { getCurrentPageContext, type PageContext } from '@/lib/page-context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QUICK_CHIPS = [
  { id: 'summary', label: 'Podsumuj stronę', prompt: 'Przygotuj krótkie podsumowanie (3-5 punktów) tego, co znajduje się na tej podstronie' },
  { id: 'specs', label: 'Specyfikacja techniczna', prompt: 'Wyciągnij specyfikację techniczną z treści tej strony lub opowiedz o najważniejszych szczegółach technicznych' },
];

const STORAGE_KEY = 'gms_chat_history';

const AIIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
  </svg>
);

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const contextBody = useMemo(() => ({
    currentPageContent: pageContext ? JSON.stringify(pageContext) : ''
  }), [pageContext]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
    api: '/api/chat',
    body: contextBody,
  });

  // 1. PERSISTENCE: Save to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // 2. PERSISTENCE: Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, [setMessages]);

  // 3. PAGE CONTEXT & 3D UPDATES
  useEffect(() => {
    if (isOpen) {
      setPageContext(getCurrentPageContext());
    }

    const handle3DUpdate = () => {
      if (isOpen) setPageContext(getCurrentPageContext());
    };

    window.addEventListener('gms:3d-update', handle3DUpdate);
    return () => window.removeEventListener('gms:3d-update', handle3DUpdate);
  }, [isOpen]);

  const handleChipClick = (prompt: string) => {
    append({
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
    });
  };

  const clearChat = useCallback(() => {
    if (window.confirm('Czy na pewno chcesz wyczyścić historię rozmowy?')) {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([]);
    }
  }, [setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, filter: 'blur(20px)' }}
            animate={{
              opacity: 1,
              scale: isMinimized ? 0 : 1,
              y: isMinimized ? 500 : 0,
              filter: isMinimized ? 'blur(20px)' : 'blur(0px)',
              pointerEvents: isMinimized ? 'none' : 'auto'
            }}
            exit={{ opacity: 0, scale: 0.8, y: 100, filter: 'blur(20px)' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="w-[380px] md:w-[600px] h-[750px] bg-[#333333] rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col pointer-events-auto origin-bottom-right google-ai-border"
          >
            {/* Header (Liquid Glass) */}
            <div className="p-8 pb-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-zinc-100">
                  <AIIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl leading-none mb-1.5 text-zinc-100 tracking-tight">GMS Corporation</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-zinc-400">Asystent AI</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                  className="hover:bg-red-500/20 hover:text-red-500 p-2.5 rounded-full transition-all active:scale-90"
                  title="Zamknij"
                >
                  <X size={22} className="text-zinc-600 dark:text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-8 space-y-8 custom-scrollbar flex flex-col"
            >
              {messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center py-20">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-white font-bold text-3xl tracking-tighter text-center px-12 leading-tight"
                  >
                    Jak mogę Ci dzisiaj pomóc?
                  </motion.p>
                </div>
              )}

              {messages.map((m: Message) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-4 max-w-[95%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {m.role !== 'user' && (
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 text-zinc-100">
                        <AIIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className={`p-5 rounded-[24px] text-sm leading-relaxed shadow-sm ${m.role === 'user'
                        ? 'bg-zinc-100 text-zinc-900 rounded-tr-none'
                        : 'bg-white/5 text-zinc-100 border border-white/10 rounded-tl-none prose prose-zinc dark:prose-invert prose-sm max-w-none'
                      }`}>
                      {m.role === 'user' ? (
                        m.content
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-6 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md custom-scrollbar">
                                <table className="min-w-full divide-y divide-white/10" {...props} />
                              </div>
                            ),
                            th: ({ node, ...props }) => <th className="px-5 py-3 bg-white/10 font-bold text-left text-[11px] uppercase tracking-wider" {...props} />,
                            td: ({ node, ...props }) => <td className="px-5 py-3 border-t border-white/5 text-[12px]" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-blue-500" {...props} />,
                            a: ({ node, href, children, ...props }) => {
                              const text = String(children).toLowerCase();
                              const isProduct = href?.includes('/system-dom') && text.includes('strona produktu');
                              const isConfigurator = href?.includes('/konfigurator') && text.includes('skonfiguruj');
                              const isPersonalization = href?.includes('/personalizacja') && text.includes('kolorystyka');
                              const isLinkButton = isProduct || isConfigurator || isPersonalization;

                              if (isLinkButton) {
                                const displayedText = isConfigurator ? 'Skonfiguruj' : children;

                                return (
                                  <motion.a
                                    href={href}
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 border border-white/20 rounded-full mt-4 mb-2 no-underline text-zinc-900 dark:text-white font-bold transition-all hover:border-blue-500/50 group w-auto mr-2 last:mr-0 shrink-0"
                                  >
                                    <span className="text-[10px] uppercase tracking-wide whitespace-nowrap">{displayedText}</span>
                                    {isConfigurator ? (
                                      <Settings size={12} className="text-zinc-400 group-hover:text-blue-500 transition-colors shrink-0" />
                                    ) : isProduct ? (
                                      <Globe size={12} className="text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                                    ) : (
                                      <ChevronRight size={12} className="text-zinc-400 group-hover:text-blue-500 translate-x-0 group-hover:translate-x-1 transition-all shrink-0" />
                                    )}
                                  </motion.a>
                                );
                              }
                              return <a href={href} className="text-blue-400 font-bold underline decoration-blue-500/30 hover:decoration-blue-500 transition-all mx-1" {...props}>{children}</a>;
                            }
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-white/10 dark:bg-white/5 p-5 rounded-[24px] rounded-tl-none border border-white/20 flex items-center gap-3">
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Przetwarzanie danych...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions (Conditional) */}
            <div className="px-8 py-4 flex items-center border-t border-white/10 bg-black/5 shrink-0">
              <div className="flex-1 flex gap-3 overflow-x-auto custom-scrollbar py-2">
                {QUICK_CHIPS.filter(chip => {
                  if (chip.id === 'summary') return true;
                  const isProductDepth = pageContext?.url &&
                    (pageContext.url.includes('/system-dom/') || pageContext.url.includes('/osiedle-system/')) &&
                    pageContext.url.split('/').filter(Boolean).length >= 2;
                  return isProductDepth;
                }).map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleChipClick(chip.prompt)}
                    className="px-5 py-2.5 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-full text-[12px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white/20 transition-all whitespace-nowrap"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <div className="pl-4 border-l border-white/10 ml-2">
                <button
                  onClick={clearChat}
                  className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                  title="Wyczyść historię rozmowy"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-8 pt-4 pb-8 shrink-0">
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <div className="w-full google-ai-border rounded-3xl overflow-hidden">
                  <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Zapytaj GMS Corporation..."
                    className="w-full bg-black/40 border-none py-5 pl-7 pr-16 text-sm outline-none text-white placeholder-zinc-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-6 text-zinc-400 hover:text-white transition-all disabled:opacity-20 active:scale-90"
                >
                  <Send size={22} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button (Liquid Glass Round Ball) */}
      <div className="absolute bottom-0 right-0 pointer-events-auto">
        <AnimatePresence>
          {(!isOpen || isMinimized) && (
            <motion.button
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (isMinimized) {
                  setIsMinimized(false);
                } else {
                  setIsOpen(true);
                }
              }}
              className="w-14 h-14 bg-[#333333] backdrop-blur-[35px] saturate-[200%] rounded-full flex items-center justify-center text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 cursor-pointer google-ai-border"
            >
              <AIIcon className="w-8 h-8" />
              {pageContext?.configuratorState && (
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#121212]"
                />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
