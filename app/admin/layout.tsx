'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, HeartHandshake, Gift, Settings2, LogOut, UserCircle } from 'lucide-react';
import { logoutAdmin } from '@/app/actions/auth';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // which tab is currently active
  const pathname = usePathname();

  const navItems = [
    { name: 'Ministries Overview', href: '/admin/ministries', icon: LayoutDashboard },
    { name: 'Requests', href: '/admin/request-management', icon: HeartHandshake },
    { name: 'Services', href: '/admin/services', icon: Settings2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* --- GLOBAL TOP NAVBAR --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 h-16 flex items-center justify-between">
          
          {/* LEFT: Consistent Logo & Title */}
          <div className="flex items-center gap-4 shrink-0">
              <Image 
                src="/Diocese-of-Kalookan-Logo.png"     
                alt="Diocese Logo" 
                width={32}          
                height={32} 
                className="rounded-md" 
              />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-tight tracking-tight">
                Diocesan Mission Portal
              </span>
              <span className="text-[10px] font-bold text-[#0060AF] uppercase tracking-widest leading-tight">
                Admin Console
              </span>
            </div>
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center h-full ml-12">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/admin' 
                ? pathname === '/admin' 
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    h-full flex items-center gap-2 px-5 text-sm font-bold border-b-2 transition-all
                    ${isActive 
                      ? 'border-[#0060AF] text-[#0060AF] bg-blue-50/30' 
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: User Profile & Logout */}
          <div className="flex items-center gap-4 pl-4 ml-auto md:ml-0 border-l border-gray-100 h-8">
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-gray-700">Admin User</span>
                <span className="text-[10px] text-gray-400 font-medium">Diocese Level</span>
              </div>
              <UserCircle size={28} className="text-gray-300" />
            </div>
            
            <form action={logoutAdmin}>
              <button 
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group" 
                type="submit"
                title="Log Out"
              >
                <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>

        </div>
        
        {/* MOBILE NAVIGATION: Scrollable row for small screens */}
        <nav className="md:hidden flex overflow-x-auto border-t border-gray-100 bg-gray-50/80 px-2 hide-scrollbar">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
             
             return (
               <Link
                 key={item.name}
                 href={item.href}
                 className={`
                   flex-shrink-0 flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors
                   ${isActive ? 'text-[#0060AF]' : 'text-gray-500'}
                 `}
               >
                 <Icon size={16} />
                 {item.name}
               </Link>
             )
          })}
        </nav>
      </header>

      {/* --- DYNAMIC MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </main>

    </div>
  );
}