import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { eq } from 'drizzle-orm';
import { Users, HeartHandshake, MapPin } from 'lucide-react';
import { CommunityProgramPieChart, TurnoutBarChart } from './CommunityCharts';

export default async function CommunityAnalytics({ serviceId }: { serviceId: string }) {
  // fetch all Community activities
  const rawActivities = await db
    .select({ details: ministryActivities.details })
    .from(ministryActivities)
    .where(eq(ministryActivities.serviceId, serviceId));

  // setup Aggregation Variables
  let totalActivities = rawActivities.length;
  let totalBeneficiaries = 0;
  let totalVolunteers = 0;
  
  // dictionaries for charts
  const programCountMap: Record<string, number> = {};
  const turnoutMap: Record<string, { beneficiaries: number; volunteers: number }> = {};

  // crunch the JSON data
  rawActivities.forEach((activity) => {
    const details = activity.details as any;
    
    const programType = details?.program_type || 'Unspecified';
    const benes = Number(details?.beneficiaries) || 0;
    const volun = Number(details?.volunteers) || 0;

    totalBeneficiaries += benes;
    totalVolunteers += volun;

    // aggregate for Pie Chart (Count of events per program type)
    programCountMap[programType] = (programCountMap[programType] || 0) + 1;

    // aggregate for Bar Chart (Sum of people per program type)
    if (!turnoutMap[programType]) {
      turnoutMap[programType] = { beneficiaries: 0, volunteers: 0 };
    }
    turnoutMap[programType].beneficiaries += benes;
    turnoutMap[programType].volunteers += volun;
  });

  // format the dictionaries into Arrays for Recharts
  const pieChartData = Object.entries(programCountMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const barChartData = Object.entries(turnoutMap)
    .map(([name, counts]) => ({ 
      name, 
      beneficiaries: counts.beneficiaries, 
      volunteers: counts.volunteers 
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-[#0060AF] rounded-xl"><Users size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Beneficiaries</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalBeneficiaries.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-xl"><HeartHandshake size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Volunteers Mobilized</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalVolunteers.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><MapPin size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Activities</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalActivities}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Activity Breakdown</h2>
            <p className="text-xs text-gray-500">Types of community programs conducted.</p>
          </div>
          <CommunityProgramPieChart data={pieChartData} />
        </div>

        {/* Chart 2: Double Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Impact vs. Effort</h2>
            <p className="text-xs text-gray-500">Comparing beneficiaries reached vs. volunteers mobilized.</p>
          </div>
          <TurnoutBarChart data={barChartData} />
        </div>

      </div>
    </div>
  );
}