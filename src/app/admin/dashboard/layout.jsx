"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Menu, X, Bell } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/dashboard/products', icon: Package },
    { name: 'Orders', href: '/admin/dashboard/orders', icon: ShoppingBag },
    { name: 'UI Settings', href: '/admin/dashboard/ui-settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  };

  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center justify-between px-6 font-bold tracking-tight border-b border-gray-800 bg-[#0F172A]">
        <div className="flex items-center gap-2 relative z-20">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
             <span className="text-white text-lg font-black leading-none mt-[-2px]">A</span>
          </div>
          <span className="text-xl md:text-2xl text-white ml-1 tracking-tight">Admin<span className="text-green-500 font-black">.</span></span>
        </div>
        {/* Close Button for Mobile */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="md:hidden p-2 text-gray-400 hover:text-white bg-gray-800/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1.5 px-4">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Main Menu</p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-green-500/10 to-transparent text-green-400 font-semibold border-l-4 border-green-500' 
                    : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200 border-l-4 border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-green-500/5 opacity-100 transition-opacity"></div>
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-green-400' : 'text-gray-500 group-hover:text-green-400'}`} />
                <span className={`relative z-10 text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800 bg-[#0F172A]">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full px-4 py-3.5 text-gray-400 border border-gray-700/50 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl transition-all duration-300 group shadow-sm"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-gray-900 font-sans print:h-auto print:overflow-visible">
      <Toaster position="top-right" className="print:hidden" />
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-[#0F172A] flex flex-col z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:relative md:translate-x-0 border-r border-gray-800 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} print:hidden`}>
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:h-auto print:overflow-visible relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 h-20 flex items-center justify-between px-4 sm:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-30 shrink-0 sticky top-0 print:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2.5 -ml-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 md:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
             <button className="relative p-2 text-gray-400 hover:text-green-600 transition-colors hidden sm:block bg-gray-50 rounded-full hover:bg-green-50">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="flex items-center gap-3 py-1.5 pl-1.5 pr-5 bg-white border border-gray-200 shadow-sm rounded-full cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all group">
               <div className="w-9 h-9 bg-gradient-to-tr from-green-500 to-green-400 rounded-full flex items-center justify-center text-white font-bold shadow-inner group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all">
                 A
               </div>
               <span className="text-sm font-bold text-gray-700 group-hover:text-green-700 hidden sm:block tracking-wide">Easin Arafat</span>
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto w-full animation-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
