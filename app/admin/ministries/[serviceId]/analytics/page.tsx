import { db } from '@/db';
import { services } from '@/db/schemas/services';
import { eq } from 'drizzle-orm';
import LegalAidAnalytics from './LegalAidAnalytics';
import BusogPusoAnalytics from './BusogPusoAnalytics';
import CommunityAnalytics from './CommunityAnalytics';
import DrugRehabAnalytics from './DrugRehabAnalytics';
import MentalHealthAnalytics from './MentalHealthAnalytics';
import CivilRegistryAnalytics from './CivilRegistryAnalytics';

export default async function MasterAnalyticsPage({ 
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

  // render the correct Analytics Dashboard based on the name
  if (ministry?.name.includes("Busog Puso")) {
    return <BusogPusoAnalytics serviceId={serviceId} />;
  } 
  
  if (ministry?.name.includes("Legal Aid")) {
    return <LegalAidAnalytics serviceId={serviceId} />;
  }

  if (ministry?.name.includes("Community")) {
    return <CommunityAnalytics serviceId={serviceId} />;
  }

  if (ministry?.name.includes("Drug Rehabilitation") || ministry?.name.includes("Rehab")) {
    return <DrugRehabAnalytics serviceId={serviceId} />;
  }

  if (ministry?.name.includes("Mental Health")) {
    return <MentalHealthAnalytics serviceId={serviceId} />;
  }

  if (ministry?.name.includes("Civil Registry") || ministry?.name.includes("Registry")) {
    return <CivilRegistryAnalytics serviceId={serviceId} />;
  }

  // Fallback state
  return (
    <div className="p-8 text-center text-gray-500">
      Analytics configuration for this ministry is currently under development.
    </div>
  );
}