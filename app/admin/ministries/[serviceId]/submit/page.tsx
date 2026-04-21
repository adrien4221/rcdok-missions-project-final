import { db } from '@/db';
import { services } from '@/db/schemas/services';
import { eq } from 'drizzle-orm';
import { fetchActiveStationsByServiceName } from '@/app/actions/actions';
import ActivityForm from './ActivityForm';

export default async function SubmitActivityPage({ 
  params 
}: { 
  params: Promise<{ serviceId: string }> 
}) {
  const { serviceId } = await params;

  // ministry details
  const [ministry] = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId));

  if (!ministry) return <div>Ministry not found</div>;

  // load only enabled stations in services
  const activeStationsResult = await fetchActiveStationsByServiceName(ministry.name);
  const parishes = activeStationsResult.success ? activeStationsResult.data : [];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Submit {ministry.name} Report
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Fill out the details below to log the latest feeding activity.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 md:p-12">
        <ActivityForm 
          serviceId={serviceId} 
          parishes={parishes} // pass fetched parishes/stations/chapels 
        />
      </div>
    </div>
  );
}