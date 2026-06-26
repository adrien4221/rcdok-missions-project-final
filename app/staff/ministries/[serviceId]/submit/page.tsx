import { db } from '@/db';
import { services } from '@/db/schemas/services';
import { eq } from 'drizzle-orm';
import { fetchActiveStationsByServiceName } from '@/app/actions/actions';

// Import all your specialized form components
import ActivityForm from './ActivityForm'; // Busog Puso
import CivilRegistryForm from './CivilRegistryForm';
import CommunityForm from './CommunityForm';
import DrugRehabForm from './DrugRehabForm';
import LegalAidForm from './LegalAidForm';
import MentalHealthForm from './MentalHealthForm';

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

  // Normalize the entry name to guarantee accurate checks
  const normalizedName = ministry.name.toLowerCase().trim();

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Submit {ministry.name} Report
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          {normalizedName.includes("busog puso") 
            ? "Fill out the details below to log the latest feeding activity."
            : `Fill out the details below to log the latest operational metrics.`
          }
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 md:p-12">
        {/* DYNAMIC FORM SWITCHER */}
        {normalizedName.includes("busog puso") && (
          <ActivityForm serviceId={serviceId} parishes={parishes} />
        )}

        {(normalizedName.includes("civil registry") || normalizedName.includes("registry")) && (
          <CivilRegistryForm serviceId={serviceId} parishes={parishes} />
        )}

        {normalizedName.includes("community") && (
          <CommunityForm serviceId={serviceId} parishes={parishes} />
        )}

        {(normalizedName.includes("drug rehabilitation") || normalizedName.includes("rehab")) && (
          <DrugRehabForm serviceId={serviceId} parishes={parishes} />
        )}

        {normalizedName.includes("legal aid") && (
          <LegalAidForm serviceId={serviceId} parishes={parishes} />
        )}

        {normalizedName.includes("mental health") && (
          <MentalHealthForm serviceId={serviceId} parishes={parishes} />
        )}

        {/* Fallback layout for missing string patterns */}
        {!["busog puso", "registry", "community", "rehab", "legal aid", "mental health"].some(keyword => normalizedName.includes(keyword)) && (
          <div className="p-12 text-center text-gray-400 italic bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            Submission layout configuration for "{ministry.name}" is currently under development.
          </div>
        )}
      </div>
    </div>
  );
}