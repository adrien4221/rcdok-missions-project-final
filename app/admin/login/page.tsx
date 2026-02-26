'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Lock, Mail, ArrowLeft, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      alert("Login logic would go here");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      
      {/* --- HEADER --- */}
      {/* Kept identical to Landing Page for consistency */}
      <header className="flex items-center justify-between px-6 py-5 bg-white">
        <div className="flex items-center gap-4">
          {/* Logo Container */}
          <div className="w-10 h-10 bg-gradient-to-b from-sky-400 to-red-700 rounded-b-xl rounded-t-sm flex items-center justify-center text-white text-[9px] font-bold shadow-sm border border-gray-100">
            LOGO
          </div>
          <span className="text-xl font-medium text-gray-900 tracking-tight hidden sm:inline">
            Diocesan Mission Portal
          </span>
        </div>

        {/* Back Button instead of Login Button */}
        <Link 
          href="/public" 
          className="text-gray-500 hover:text-[#0060AF] text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </header>

      {/* --- MAIN HERO SECTION --- */}
      {/* Reusing the rounded blue container style */}
      <main className="flex-1 bg-[#DDF6FF] m-4 mt-0 rounded-2xl flex flex-col items-center justify-center px-4 animate-in fade-in duration-700">
        
        <div className="w-full max-w-md">
           
           {/* Page Title */}
           <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black tracking-tight mb-2">
                Admin Portal
              </h1>
              <p className="text-gray-500 font-medium">
                Secure access for diocese staff only.
              </p>
           </div>

           {/* --- LOGIN CARD --- */}
           <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-50">
             <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Email Input */}
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email Address</label>
                   <div className="relative group">
                     <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#0060AF] transition-colors" size={18} />
                     <input 
                       type="email" 
                       placeholder="admin@diocese.org"
                       className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#0060AF] focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                       required
                     />
                   </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                   <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                      <a href="#" className="text-xs font-semibold text-[#0060AF] hover:underline">Forgot?</a>
                   </div>
                   <div className="relative group">
                     <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#0060AF] transition-colors" size={18} />
                     <input 
                       type="password" 
                       placeholder="••••••••"
                       className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#0060AF] focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                       required
                     />
                   </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0060AF] hover:bg-blue-800 disabled:bg-blue-300 text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 active:scale-95 transition-all mt-4"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'} 
                  {!isLoading && <LogIn size={20} />}
                </button>

             </form>
           </div>

           {/* Footer Note */}
           <p className="text-center text-xs text-blue-900/40 mt-8 font-medium">
             Unauthorized access is prohibited and monitored.
           </p>

        </div>
      </main>
    </div>
  );
}