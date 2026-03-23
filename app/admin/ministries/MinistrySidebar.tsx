'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';

type Ministry = { id: string; name: string; icon: string | null };

export default function MinistrySidebar({ ministries }: { ministries: Ministry[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutDashboard className="text-[#0060AF]" /> 
          Ministries
        </h2>
        <p className="text-sm text-gray-500 mt-1">Select a service to manage</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {ministries.map((ministry) => {
          // Check if the current URL contains this ministry's ID
          const isActive = pathname.includes(ministry.id);

          return (
            <Link
              key={ministry.id}
              href={`/admin/ministries/${ministry.id}/analytics`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 border border-blue-100 text-[#0060AF] font-semibold shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
              }`}
            >
              <span className="text-2xl">{ministry.icon || '📂'}</span>
              <span>{ministry.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}