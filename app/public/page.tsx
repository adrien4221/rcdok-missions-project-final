import Link from 'next/link';
import { Search, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      
      {/* header */}
      <header className="flex items-center justify-between px-6 py-5 bg-white">
        {/* logo */}
        <div className="flex items-center gap-4">
          {/* logo container */}
          <div className="w-10 h-10 bg-gradient-to-b from-sky-400 to-red-700 rounded-b-xl rounded-t-sm flex items-center justify-center text-white text-[9px] font-bold shadow-sm border border-gray-100">
            LOGO {/* Ilagay nalang yung logo dito */}
          </div>
          <span className="text-xl font-medium text-gray-900 tracking-tight">
            Diocesan Mission Portal
          </span>
        </div>

        {/* admin login button */}
        <Link 
          href="/login" 
          className="bg-cyan-400 hover:bg-cyan-500 text-gray-900 text-xs font-bold px-6 py-2.5 rounded-full transition-colors shadow-sm"
        >
          Admin Login
        </Link>
      </header>

      {/* hero section */}
      <main className="flex-1 bg-[#DDF6FF] m-4 mt-0 rounded-2xl flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-700">
        
        <div className="max-w-3xl space-y-12 w-full">
           
           {/* header text and subheading */}
           <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                Diocesan Mission Support Portal
              </h1>
              <p className="text-gray-500 text-lg font-medium">
                Connecting communities to the help they need.
              </p>
           </div>

           {/* find help and request assistance button */}
           <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
              
              {/* find help */}
              <button className="w-full flex items-center justify-center gap-3 bg-[#0060AF] hover:bg-blue-800 text-white px-6 py-4 rounded-lg text-lg font-semibold shadow-md transition-transform active:scale-95 group">
                 <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                 Find Help Near Me
              </button>

              {/* request assistance */}
              <Link 
                href="/public/request" 
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#0060AF] border-2 border-[#0060AF] px-6 py-4 rounded-lg text-lg font-semibold shadow-md transition-transform active:scale-95 group"
              >
                 <HelpCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                 Request Assistance
              </Link>

           </div>

        </div>
      </main>
    </div>
  )
}