'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';

const mockPosts = [
  {
    id: 1,
    title: 'Jak odpowiednio przygotować podłoże pod garaż blaszany?',
    excerpt: 'Prawidłowe przygotowanie wylewki to klucz do długowieczności garażu. Zobacz nasz poradnik.',
    date: '10 Wrz 2026',
    author: 'Zespół GMS',
    category: 'Poradnik',
    link: '/blog/jak-przygotowac-podloze'
  },
  {
    id: 2,
    title: 'Nowoczesne wiaty śmietnikowe na osiedlach – trendy 2026',
    excerpt: 'Estetyka i funkcjonalność idą w parze. Przedstawiamy najnowsze realizacje.',
    date: '28 Sie 2026',
    author: 'Zespół GMS',
    category: 'Realizacje',
    link: '/blog/nowoczesne-wiaty-smietnikowe'
  },
  {
    id: 3,
    title: 'Wybór napędu do bramy uchylnej. Na co zwrócić uwagę?',
    excerpt: 'Automatyka bramowa ułatwia życie. Jak dobrać odpowiedni silnik do ciężaru bramy.',
    date: '15 Sie 2026',
    author: 'Zespół GMS',
    category: 'Wiedza',
    link: '/blog/wybor-napedu-do-bramy'
  }
];

export default function HomeBlogPreview() {
  return (
    <section className="relative w-full py-32 bg-[#050505] overflow-hidden flex flex-col items-center border-t border-white/5">
      
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-[#ff6b00] uppercase mb-8"
        >
          Baza wiedzy
        </motion.div>

        <div className="w-full flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-left"
          >
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6">
              Ostatnie wpisy. <span className="text-gray-500">Inspiracje i wiedza.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors group"
            >
              Wszystkie artykuły
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {mockPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
            >
              <article className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-colors duration-300 h-full flex flex-col group">
                
                <Link href={post.link} className="block h-56 bg-black relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b00]/20 to-transparent group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute top-4 left-4 z-20">
                     <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-widest rounded-full">
                       {post.category}
                     </span>
                   </div>
                </Link>

                <div className="p-8 flex flex-col flex-grow text-left">
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                  </div>

                  <Link href={post.link} className="group-hover:text-[#ff6b00] transition-colors">
                    <h3 className="text-2xl font-semibold text-white mb-4 line-clamp-2 tracking-tight">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-gray-400 font-light mb-8 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link 
                    href={post.link} 
                    className="inline-flex items-center text-sm font-semibold text-[#ff6b00] uppercase tracking-wider group-hover:text-[#ff8533]"
                  >
                    Czytaj artykuł
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
