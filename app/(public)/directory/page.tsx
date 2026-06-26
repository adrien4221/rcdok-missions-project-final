import { db } from '@/db'; 
import { organizations } from '@/db/schemas/organizations'; 
import { services, organizationServices } from '@/db/schemas/services'; 
import { inArray, eq } from 'drizzle-orm';
import DirectoryClient from './DirectoryClient';

// Helper to keep the main component clean
function normalizeCategory(name: string, dbCat: string | null) {
  const n = name.toLowerCase();
  if (n.includes('busog puso') || n.includes('nutrition') || dbCat === 'Nutrition') return 'Nutrition';
  if (n.includes('legal') || dbCat === 'Legal Aid') return 'Legal Aid';
  if (n.includes('mental') || dbCat === 'Mental Health') return 'Mental Health';
  if (n.includes('rehab') || dbCat === 'Drug Rehab') return 'Drug Rehab';
  if (n.includes('community') || dbCat === 'Community') return 'Community';
  if (n.includes('registry') || dbCat === 'Civil Registry') return 'Civil Registry';
  return 'Other';
}

export default async function ResourceDirectoryPage() {
  const dbOrgs = await db.select().from(organizations).where(
    inArray(organizations.type, ['parish', 'quasi-parish'])
  );

  const linkedServices = await db.select({
    orgId: organizationServices.organizationId,
    serviceId: services.id,
    serviceName: services.name,
    dbCategory: services.category,
  })
  .from(organizationServices)
  .innerJoin(services, eq(organizationServices.serviceId, services.id));

  const formattedOrgs = dbOrgs.map(org => {
    const parishServices = linkedServices
      .filter(ls => ls.orgId === org.id)
      .map(s => ({
        id: s.serviceId,
        name: s.serviceName,
        category: normalizeCategory(s.serviceName, s.dbCategory)
      }));

    const uniqueServices = Array.from(
      new Map(parishServices.map(item => [item.category, item])).values()
    );

    return {
      id: org.id,
      name: org.name,
      address: org.address || '',
      mapQuery: encodeURIComponent(`${org.name} ${org.address || ''}`),
      services: uniqueServices
    };
  });

  return <DirectoryClient initialOrganizations={formattedOrgs} />;
}