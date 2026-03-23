import { db } from '@/db';
import { organizations } from '@/db/schemas/organizations';
import { eq } from 'drizzle-orm';
import ActivityForm from './ActivityForm';
import LegalAidForm from './LegalAidForm';
import CommunityForm from './CommunityForm';
import DrugRehabForm from './DrugRehabForm';
import MentalHealthForm from './MentalHealthForm';
import CivilRegistryForm from './CivilRegistryForm';
import { services } from '@/db/schemas/services';
import { Suspense } from 'react';

export default async function SubmitActivityPage({ 
  params 
}: { 
  params: Promise<{ serviceId: string }> 
}) {
  const resolvedParams = await params;

  const [ministry] = await db.select().from(services).where(eq(services.id, resolvedParams.serviceId));
  
  // Fetch all parishes in the server component so we can pass it down to the form as a prop for the "Assigned Station" dropdown. This way, we avoid fetching parishes separately in each form component, and we ensure consistency across all forms.
  const parishes = await db
    .select({ id: organizations.id, name: organizations.name })
    .from(organizations)
    .where(eq(organizations.type, 'parish')) 
    .orderBy(organizations.name);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Log New Activity</h2>
      <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading form...</div>}>
        {ministry?.name.includes("Busog Puso") ? (
          <ActivityForm serviceId={resolvedParams.serviceId} parishes={parishes} />
        ) : ministry?.name.includes("Legal Aid") ? (
          <LegalAidForm serviceId={resolvedParams.serviceId} parishes={parishes} />
        ) : ministry?.name.includes("Community") ? ( 
          <CommunityForm serviceId={resolvedParams.serviceId} parishes={parishes} />
        ) : ministry?.name.includes("Rehab") ? (
          <DrugRehabForm serviceId={resolvedParams.serviceId} parishes={parishes} />
        ) : ministry?.name.includes("Mental Health") ? (
          <MentalHealthForm serviceId={resolvedParams.serviceId} parishes={parishes} />
        ) : ministry?.name.includes("Civil Registry") ? (
          <CivilRegistryForm serviceId={resolvedParams.serviceId} parishes={parishes} />
        ) : (
          <p className="text-gray-500">Form configuration for this ministry is currently under development.</p>
        )}
      </Suspense>
    </div>
  );
}