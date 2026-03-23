import { db } from '@/db'; 
import { organizations } from '@/db/schemas/organizations'; 
import { services, organizationServices } from '@/db/schemas/services'; 
import { inArray, eq } from 'drizzle-orm';
import DirectoryClient from './DirectoryClient';

export default async function ResourceDirectoryPage() {
  // 1. Fetch parishes
  const dbOrgs = await db.select().from(organizations).where(
    inArray(organizations.type, ['parish', 'quasi-parish'])
  );

  // 2. Bridge Query: Get all services linked to the fetched parishes in one query using a JOIN
  const linkedServices = await db.select({
    orgId: organizationServices.organizationId,
    serviceId: services.id,
    serviceName: services.name,
    dbCategory: services.category, // Category defined in the schema
  })
  .from(organizationServices)
  .innerJoin(services, eq(organizationServices.serviceId, services.id));

  // 3. Format and attach the linked services to their specific parish
  const formattedOrgs = dbOrgs.map(org => {
    
    // Find all services linked to the specific parish via bridge query
    const parishServices = linkedServices.filter(ls => ls.orgId === org.id);

    // Map the database data to the UI Categories
    const mappedServices = parishServices.map(s => {
      let category = s.dbCategory || 'Other'; 

      // Fallback normalizer to ensure it strictly matches the exact UI buttons
      if (s.serviceName.includes('Busog Puso') || s.serviceName.includes('Nutrition') || category === 'Nutrition') category = 'Nutrition';
      else if (s.serviceName.includes('Legal Aid') || category === 'Legal Aid') category = 'Legal Aid';
      else if (s.serviceName.includes('Mental Health') || category === 'Mental Health') category = 'Mental Health';
      else if (s.serviceName.includes('Drug Rehab') || s.serviceName.includes('Rehab') || category === 'Drug Rehab') category = 'Drug Rehab';
      else if (s.serviceName.includes('Community') || category === 'Community') category = 'Community';
      else if (s.serviceName.includes('Registry') || category === 'Civil Registry') category = 'Civil Registry';

      return { id: s.serviceId, name: s.serviceName, category };
    });

    // Deduplicate categories 
    const uniqueServices = Array.from(new Map(mappedServices.map(item => [item.category, item])).values());

    return {
      id: org.id,
      name: org.name,
      address: org.address || '',
      mapQuery: `${org.name} ${org.address || ''}`.trim().replace(/\s+/g, '+'),
      services: uniqueServices // Pass the mapped array!
    };
  });

  return <DirectoryClient initialOrganizations={formattedOrgs} />;
}