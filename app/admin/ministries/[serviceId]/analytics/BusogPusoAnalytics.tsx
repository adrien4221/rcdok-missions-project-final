import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { organizations } from '@/db/schemas/organizations';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { Users, Utensils, CalendarCheck } from 'lucide-react';
import BeneficiariesChart from './BeneficiariesChart'; // Adjust path if you put it in /components

export default async function BusogPusoAnalytics({ 
  serviceId 
}: { 
  serviceId: string 
}) {
  //const resolvedParams = await params;
  //const serviceId = resolvedParams.serviceId;

  const vicariates = alias(organizations, 'vicariates');

  const rawActivities = await db
    .select({
      details: ministryActivities.details,
      parishName: organizations.name,
      // Grab the vicariate name, fallback to "Unassigned" if it has no parent
      vicariateName: vicariates.name, 
    })
    .from(ministryActivities)
    .innerJoin(organizations, eq(ministryActivities.organizationId, organizations.id))
    .leftJoin(vicariates, eq(organizations.parentId, vicariates.id))
    .where(eq(ministryActivities.serviceId, serviceId));

  let totalKidsFed = 0;
  
  const parishAggregation: Record<string, number> = {};
  const vicariateAggregation: Record<string, number> = {};

  rawActivities.forEach((activity) => {
    const details = activity.details as any; 
    const kids = Number(details?.beneficiaries) || 0;
    
    totalKidsFed += kids;

    // Aggregate by Parish
    parishAggregation[activity.parishName] = (parishAggregation[activity.parishName] || 0) + kids;
    
    // Aggregate by Vicariate
    const vicName = activity.vicariateName || 'Unassigned Vicariate';
    vicariateAggregation[vicName] = (vicariateAggregation[vicName] || 0) + kids;
  });

  const parishChartData = Object.entries(parishAggregation)
    .map(([name, kidsFed]) => ({ name, kidsFed }))
    .sort((a, b) => b.kidsFed - a.kidsFed);

  const vicariateChartData = Object.entries(vicariateAggregation)
    .map(([name, kidsFed]) => ({ name, kidsFed }))
    .sort((a, b) => b.kidsFed - a.kidsFed);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Beneficiaries Overview</h2>
          <p className="text-sm text-gray-500">Total kids fed distributed across the diocese.</p>
        </div>
        
        <BeneficiariesChart 
          parishData={parishChartData} 
          vicariateData={vicariateChartData} 
        />
      </div>

    </div>
  );
}