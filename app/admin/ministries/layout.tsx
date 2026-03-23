import { db } from '@/db';
import { services } from '@/db/schemas/services';
import MinistrySidebar from './MinistrySidebar';

export default async function MinistriesMasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the master list of ministries for the sidebar
  const allMinistries = await db.select().from(services).orderBy(services.name);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR: Passes the fetched data to the interactive client component */}
      <MinistrySidebar ministries={allMinistries} />

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}