import { db } from '@/db';
import { services } from '@/db/schemas/services';
import { eq } from 'drizzle-orm';
import LegalAidLog from './LegalAidLog';
import BusogPusoLog from './BusogPusoLog'; 
import CommunityLog from './CommunityLog';
import DrugRehabLog from './DrugRehabLog';
import MentalHealthLog from './MentalHealthLog';
import CivilRegistryLog from './CivilRegistryLog';

export default async function MasterLogPage({ 
  params 
}: { 
  params: Promise<{ serviceId: string }> 
}) {
  const resolvedParams = await params;
  const serviceId = resolvedParams.serviceId;

  // fetch the specific ministry to know its name
  const [ministry] = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId));

  // 2. Render the correct Activity Log based on the name
  if (ministry?.name.includes("Busog Puso")) {
    return <BusogPusoLog serviceId={serviceId} />; 
  } 
  
  if (ministry?.name.includes("Legal Aid")) {
    return <LegalAidLog serviceId={serviceId} />;
  }

  if (ministry?.name.includes("Community")) {
    return <CommunityLog serviceId={serviceId} />;
  }

  if (ministry?.name.includes("Drug Rehabilitation") || ministry?.name.includes("Rehab")) {
    return <DrugRehabLog serviceId={serviceId} />;
  }

  if (ministry?.name.includes("Mental Health")) {
    return <MentalHealthLog serviceId={serviceId} />;
  }

  if (ministry?.name.includes("Civil Registry") || ministry?.name.includes("Registry")) {
    return <CivilRegistryLog serviceId={serviceId} />;
  }
  // fallback state for future ministries
  return (
    <div className="p-8 text-center text-gray-500">
      Activity Log configuration for this ministry is currently under development.
    </div>
  );
}