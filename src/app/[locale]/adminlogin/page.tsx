'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login delay
    setTimeout(() => {
      // Use standard en locale for routing in this mock
      router.push('/pl/admin/products/new');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050506] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-light tracking-tight text-white flex items-center justify-center gap-2 mb-2">
              GMS <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Admin</span>
            </h1>
            <p className="text-[#8A8F98] text-sm">Zaloguj się, aby zarządzać konfiguratorami</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#8A8F98] uppercase tracking-wider pl-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#8A8F98]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-[#8A8F98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="admin@gms-system.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#8A8F98] uppercase tracking-wider pl-1">Hasło</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#8A8F98]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-[#8A8F98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Zaloguj się</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
        </div>
      </motion.div>
    </div>
  );
}
