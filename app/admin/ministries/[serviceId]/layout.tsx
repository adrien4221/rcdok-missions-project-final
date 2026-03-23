import Link from 'next/link';
import { db } from '@/db';
import { services } from '@/db/schemas/services';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { BarChart3, ClipboardEdit, ListOrdered } from 'lucide-react';
import MinistrySidebar from './MinistrySidebar';

export default async function MinistryDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serviceId: string }>;
}) {
  const resolvedParams = await params;
  const serviceId = resolvedParams.serviceId;

  // 1. Fetch the name of the ministry for the header and to validate that the serviceId is valid. If the serviceId doesn't match any ministry, we can show a 404 page.
  const [ministry] = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId));

  if (!ministry) notFound();

  // 2. The Navigation Tabs
  const tabs = [
    { name: 'Analytics', href: `/admin/ministries/${serviceId}/analytics`, icon: <BarChart3 size={18} /> },
    { name: 'Submit Activity', href: `/admin/ministries/${serviceId}/submit`, icon: <ClipboardEdit size={18} /> },
    { name: 'Activity Log', href: `/admin/ministries/${serviceId}/log`, icon: <ListOrdered size={18} /> },
  ];

  return (
    <div className="bg-gray-50 flex flex-col font-sans">
      
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{ministry.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ministry.name}</h1>
            <p className="text-sm text-gray-500">Ministry Management Dashboard</p>
          </div>
        </div>

        {/* The Tabs */}
        <nav className="flex space-x-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex items-center gap-2 px-6 py-3 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {tab.icon}
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* The Page Content (Analytics, Submit, or Log) injects here */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

