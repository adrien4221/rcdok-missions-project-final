import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { organizations } from '@/db/schemas/organizations';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { Users, CalendarCheck, TrendingUp } from 'lucide-react';
import BeneficiariesChart from './BeneficiariesChart';
import TargetMonitor from './BPTargetMonitor';

export default async function BusogPusoAnalytics({ 
  serviceId 
}: { 
  serviceId: string 
}) {
  const vicariates = alias(organizations, 'vicariates');

  const rawActivities = await db
    .select({
      date: ministryActivities.activityDate,
      details: ministryActivities.details,
      parishName: organizations.name,
      vicariateName: vicariates.name, 
    })
    .from(ministryActivities)
    .innerJoin(organizations, eq(ministryActivities.organizationId, organizations.id))
    .leftJoin(vicariates, eq(organizations.parentId, vicariates.id))
    .where(eq(ministryActivities.serviceId, serviceId));

  let totalKidsFed = 0;
  const parishAggregation: Record<string, number> = {};
  const vicariateAggregation: Record<string, number> = {};
  
  const frequencyByVicariate: Record<string, Record<string, number>> = {};

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  rawActivities.forEach((activity) => {
    const details = activity.details as any; 
    const kids = Number(details?.beneficiaries) || 0;
    const actDate = new Date(activity.date);
    const vName = activity.vicariateName || 'Independent/Other';
    
    totalKidsFed += kids;

    parishAggregation[activity.parishName] = (parishAggregation[activity.parishName] || 0) + kids;
    vicariateAggregation[vName] = (vicariateAggregation[vName] || 0) + kids;

    if (actDate.getMonth() === currentMonth && actDate.getFullYear() === currentYear) {
      if (!frequencyByVicariate[vName]) {
        frequencyByVicariate[vName] = {};
      }
      frequencyByVicariate[vName][activity.parishName] = (frequencyByVicariate[vName][activity.parishName] || 0) + 1;
    }
  });

  const parishChartData = Object.entries(parishAggregation)
    .map(([name, kidsFed]) => ({ name, kidsFed }))
    .sort((a, b) => b.kidsFed - a.kidsFed);

  const vicariateChartData = Object.entries(vicariateAggregation)
    .map(([name, kidsFed]) => ({ name, kidsFed }))
    .sort((a, b) => b.kidsFed - a.kidsFed);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Kids Fed</p>
              <h3 className="text-2xl font-bold">{totalKidsFed.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CalendarCheck size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Monthly Total Sessions</p>
              <h3 className="text-2xl font-bold">
                {Object.values(frequencyByVicariate).reduce((acc, stations) => 
                  acc + Object.values(stations).reduce((a, b) => a + b, 0), 0
                )}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Stations</p>
              <h3 className="text-2xl font-bold">{Object.keys(parishAggregation).length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Beneficiaries Overview</h2>
              <p className="text-sm text-gray-500">Comparing children fed across stations and vicariates.</p>
            </div>
            <BeneficiariesChart 
              parishData={parishChartData} 
              vicariateData={vicariateChartData} 
            />
          </div>
        </div>

        <TargetMonitor data={frequencyByVicariate} />
      </div>
    </div>
  );
}