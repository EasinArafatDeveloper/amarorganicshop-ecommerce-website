"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Menu, X, Bell, Clock, Users, Tag, Mail, UserCircle, ShieldAlert } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Helper for relative time
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch pending orders for notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const navigation = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/dashboard/products', icon: Package },
    { name: 'Discounts', href: '/admin/dashboard/discounts', icon: Tag },
    { name: 'Orders', href: '/admin/dashboard/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/dashboard/customers', icon: Users },
    { name: 'Messages', href: '/admin/dashboard/messages', icon: Mail },
    { name: 'UI Settings', href: '/admin/dashboard/ui-settings', icon: Settings },
    { name: 'Profile', href: '/admin/dashboard/profile', icon: UserCircle },
    { name: 'IP Blocklist', href: '/admin/dashboard/ip-blocklist', icon: ShieldAlert },
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
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-green-500/20">
             <span className="text-white text-lg font-black leading-none mt-[-2px]">A</span>
          </div>
          <span className="text-xl md:text-2xl text-white ml-1 tracking-tight">Admin<span className="text-green-500 font-black">.</span></span>
        </div>
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
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 w-72 bg-[#0F172A] flex flex-col z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:relative md:translate-x-0 border-r border-gray-800 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} print:hidden`}>
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:h-auto print:overflow-visible relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 h-20 flex items-center justify-between px-4 sm:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-30 shrink-0 sticky top-0 print:hidden relative">
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
          <div className="flex items-center gap-3 sm:gap-6">
             
             {/* Notification Bell Dropdown */}
             <div className="relative" ref={dropdownRef}>
               <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2.5 text-gray-500 hover:text-primary transition-all bg-gray-50 rounded-full hover:bg-primary/10 shadow-sm border border-gray-200 hover:border-primary/30"
               >
                 <Bell className="w-5 h-5" />
                 {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                 )}
               </button>

               {/* Dropdown Menu */}
               {isNotificationOpen && (
                 <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-4">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        Pending Orders
                      </h3>
                      {notifications.length > 0 && (
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                          {notifications.length} New
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                          <p className="text-sm font-medium">No pending orders</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {notifications.map((order) => (
                            <Link 
                              key={order._id}
                              href="/admin/dashboard/orders"
                              onClick={() => setIsNotificationOpen(false)}
                              className="p-4 hover:bg-primary/10/50 transition-colors flex flex-col gap-1 group block"
                            >
                               <div className="flex justify-between items-start">
                                 <span className="font-bold text-sm text-gray-800 group-hover:text-primary scale-[0.98] transition-colors">#{order.orderId}</span>
                                 <span className="text-xs font-semibold text-gray-400 bg-white border border-gray-100 shadow-sm px-2 py-0.5 rounded-full">{timeAgo(order.createdAt)}</span>
                               </div>
                               <div className="flex justify-between items-center mt-1">
                                 <span className="text-sm text-gray-600 truncate mr-2">{order.customerName}</span>
                                 <span className="font-black text-primary text-sm">৳{order.finalTotal}</span>
                               </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      href="/admin/dashboard/orders"
                      onClick={() => setIsNotificationOpen(false)}
                      className="block w-full p-3 text-center text-xs font-bold text-primary bg-gray-50 hover:bg-primary/10 hover:text-primary scale-[0.98] transition-colors border-t border-gray-100"
                    >
                      View All Orders →
                    </Link>
                 </div>
               )}
             </div>

             <Link href="/admin/dashboard/profile" className="flex items-center gap-3 py-1.5 pl-1.5 pr-5 bg-white border border-gray-200 shadow-sm rounded-full cursor-pointer hover:border-green-300 hover:bg-primary/10 transition-all group">
               <div className="w-9 h-9 bg-gradient-to-tr from-green-500 to-green-400 rounded-full flex items-center justify-center text-white font-bold shadow-inner group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all">
                 A
               </div>
               <span className="text-sm font-bold text-gray-700 group-hover:text-primary scale-[0.98] hidden sm:block tracking-wide">Easin Arafat</span>
             </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto w-full animation-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
