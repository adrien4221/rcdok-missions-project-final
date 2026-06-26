import { db } from '@/db';
import { services } from '@/db/schemas/services';
import { ministryActivities } from '@/db/schemas/activities';
import { organizations } from '@/db/schemas/organizations';
import { eq, desc } from 'drizzle-orm';
import { fetchActiveStationsByServiceName } from '@/app/actions/actions';

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
  const { serviceId } = await params;

  // get specific ministry
  const [ministry] = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId));

  if (!ministry) {
    return <div className="p-8 text-center text-gray-500">Ministry not found.</div>;
  }

  // get only enalbed stations in services
  const activeStationsResult = await fetchActiveStationsByServiceName(ministry.name);
  const parishes = activeStationsResult.success ? activeStationsResult.data : [];

  // get log data
  const activityData = await db
    .select({
      id: ministryActivities.id,
      date: ministryActivities.activityDate,
      details: ministryActivities.details,
      parishName: organizations.name,
      organizationId: organizations.id, 
    })
    .from(ministryActivities)
    .innerJoin(organizations, eq(ministryActivities.organizationId, organizations.id))
    .where(eq(ministryActivities.serviceId, serviceId))
    .orderBy(desc(ministryActivities.activityDate));

  if (ministry.name.includes("Busog Puso")) {
    return (
      <BusogPusoLog 
        initialActivities={activityData} 
        serviceId={serviceId} 
        parishes={parishes} 
      />
    ); 
  } 

  if (ministry.name.includes("Legal Aid")) {
    return <LegalAidLog
      initialActivities={activityData}
      serviceId={serviceId}
      parishes={parishes}
    />;
      }

  if (ministry.name.includes("Community")) {
    return <CommunityLog 
    initialActivities={activityData} 
    serviceId={serviceId} 
    parishes={parishes} 
    />;
  }

  if (ministry.name.includes("Drug Rehabilitation") || ministry.name.includes("Rehab")) {
    return <DrugRehabLog 
      initialActivities={activityData} 
      serviceId={serviceId} 
      parishes={parishes} 
    />;
  }

  if (ministry.name.includes("Mental Health")) {
    return (<MentalHealthLog initialActivities={activityData} serviceId={serviceId} parishes={parishes}/>);
  }

  if (ministry.name.includes("Civil Registry") || ministry.name.includes("Registry")) {
    return (<CivilRegistryLog initialActivities={activityData}serviceId={serviceId}
      parishes={parishes}
    />
  );
}

  return (
    <div className="p-8 text-center text-gray-500 italic">
      Activity Log configuration for "{ministry.name}" is currently under development.
    </div>
  );
}