import { db } from '@/db';
import { organizations } from '@/db/schemas/organizations';
import { services, organizationServices } from '@/db/schemas/services'; 
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import RequestFormClient from './RequestFormClient';

export default async function RequestHelpPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Unwrap the Promise
  const resolvedParams = await params;
  const parishId = resolvedParams.id;

  // 2. Fetch the specific Parish
  const [parish] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, parishId));

  if (!parish) {
    notFound();
  }

  // 3. Fetch only the ministries available at the selected parish parish
  const ministries = await db
    .select({
      id: services.id, 
      name: services.name,
      icon: services.icon,
    })
    .from(organizationServices)
    .innerJoin(services, eq(organizationServices.serviceId, services.id))
    .where(eq(organizationServices.organizationId, parishId));

  // 4. Pass the data to the interactive Client Component
  return <RequestFormClient parish={parish} ministries={ministries} />;
}