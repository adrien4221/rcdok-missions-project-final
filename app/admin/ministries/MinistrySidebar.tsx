'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';

type Ministry = { id: string; name: string; icon: string | null };

export default function MinistrySidebar({ ministries }: { ministries: Ministry[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10 shrink-0">
      
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
          <LayoutDashboard size={14} className="text-[#0060AF]" /> 
          Ministries
        </h2>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">System Management</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {ministries.map((ministry) => {
          const isActive = pathname.includes(ministry.id);

          return (
            <Link
              key={ministry.id}
              href={`/admin/ministries/${ministry.id}/analytics`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-[#0060AF] font-bold text-[13px]' 
                  : 'text-gray-500 hover:bg-gray-50 text-[13px] hover:text-gray-900'
              }`}
            >
              <span className="text-base w-5 flex justify-center shrink-0">
                {ministry.icon || '📂'}
              </span>              
              <span className="truncate tracking-tight">{ministry.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}