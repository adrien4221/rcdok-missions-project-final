import { db } from '@/db';
import { organizations } from '@/db/schemas/organizations';
import { services, organizationServices } from '@/db/schemas/services'; 
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react'; // <-- 1. ADD THIS IMPORT

export default async function ParishDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  const resolvedParams = await params;
  const parishId = resolvedParams.id;

  const [parish] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, parishId));

  if (!parish) {
    notFound();
  }

  const ministries = await db
    .select({
      name: services.name,
      description: organizationServices.description,
      schedule: organizationServices.schedule,
    })
    .from(organizationServices)
    .innerJoin(services, eq(organizationServices.serviceId, services.id))
    .where(eq(organizationServices.organizationId, parishId));

  return (
    <div className="min-h-screen bg-[#def3fd] font-sans pb-16">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-4">
            <Image 
              src="/Diocese-of-Kalookan-Logo.png"     
              alt="Diocese Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
          <span className="text-xl font-medium text-gray-900 tracking-tight">
            Parish Information
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        
        {/* 2. ADD THE BACK BUTTON HERE */}
        <Link 
          href="/directory" 
          className="inline-flex items-center gap-2 text-[#0060AF] hover:text-blue-800 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Resource Directory
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight mb-2">
            {parish.name}
          </h1>
          <p className="text-xl text-black font-medium">
            {parish.address || 'Address not available'}
          </p>
          {parish.contactNumber && (
            <p className="text-xl text-black font-medium mt-1">
              Contact ({parish.contactNumber})
            </p>
          )}
        </div>

        {/* Available Ministries Section */}
        <h2 className="text-3xl font-bold text-black mb-8">Available Ministries</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {ministries.length === 0 ? (
            <p className="text-gray-600 italic">No ministries have been added to this parish yet.</p>
          ) : (
            ministries.map((ministry, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{ministry.name}</h3>
                <p className="text-sm text-gray-600 mb-6 min-h-[60px]">
                  {ministry.description || 'Contact the parish for more details regarding this ministry.'}
                </p>
                
                <div>
                  <span className="text-xs font-bold text-gray-900 block mb-1">Schedule:</span>
                  <p className="text-xs text-gray-600">
                    {ministry.schedule || 'Schedule not provided'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Request Help Button */}
        <div className="flex justify-center mt-12">
          {/* Note: I moved the Link outside the button to make the whole button clickable safely in Next.js */}
          <Link 
            href={`/directory/parish/${parish.id}/request`}
            className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-black text-xl font-bold px-10 py-4 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            Request Help in this Parish
          </Link>
        </div>

      </main>
    </div>
  );
}