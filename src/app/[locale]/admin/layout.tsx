'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Box
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { locale } = useParams<{ locale: string }>();

  const navItems = [
    { name: 'Dashboard', href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: 'Produkty', href: `/${locale}/admin/products`, icon: Package },
    { name: 'Zamówienia', href: `/${locale}/admin/orders`, icon: ShoppingCart },
    { name: 'Klienci', href: `/${locale}/admin/customers`, icon: Users },
    { name: 'Ustawienia', href: `/${locale}/admin/settings`, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#0F172A]">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#E2E8F0] shadow-sm flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Box className="text-indigo-600" size={24} />
            <span className="text-lg font-bold tracking-tight">GMS Admin</span>
          </div>
          <button className="lg:hidden text-[#64748B]" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">Zarządzanie</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-[#64748B]'} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#E2E8F0]">
          <Link href={`/${locale}/adminlogin`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] hover:text-red-600 transition-colors">
            <LogOut size={18} />
            Wyloguj się
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] shadow-sm flex items-center px-4 sm:px-6 z-30 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-[#64748B] hover:text-[#0F172A]">
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
