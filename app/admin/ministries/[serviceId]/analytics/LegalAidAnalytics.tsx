import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { eq } from 'drizzle-orm';
import { Scale, AlertTriangle, Briefcase } from 'lucide-react';
import { ProblemTypePieChart, PriorityBarChart } from './LegalCharts';

export default async function LegalAidAnalytics({ serviceId }: { serviceId: string }) {
  // fetch all Legal Aid cases
  const rawActivities = await db
    .select({ details: ministryActivities.details })
    .from(ministryActivities)
    .where(eq(ministryActivities.serviceId, serviceId));

  // aggregation dictionaries
  let totalCases = rawActivities.length;
  let highPriorityCount = 0;
  
  const problemAggregation: Record<string, number> = {};
  const priorityAggregation: Record<string, number> = { High: 0, Medium: 0, Low: 0 };
  const uniqueLawyers = new Set<string>();

  // crunch JSON data
  rawActivities.forEach((activity) => {
    const details = activity.details as any;
    
    // aggregate Problems
    const problem = details?.problem_type || 'Unspecified';
    problemAggregation[problem] = (problemAggregation[problem] || 0) + 1;

    // aggregate Priorities
    const priority = details?.priority_level || 'Low';
    priorityAggregation[priority] = (priorityAggregation[priority] || 0) + 1;
    if (priority === 'High') highPriorityCount++;

    // track active lawyers
    if (details?.assigned_lawyer) {
      uniqueLawyers.add(details.assigned_lawyer);
    }
  });

  // format for Recharts
  const problemChartData = Object.entries(problemAggregation)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // sort for the biggest slice first

  const priorityChartData = [
    { name: 'High', count: priorityAggregation['High'] },
    { name: 'Medium', count: priorityAggregation['Medium'] },
    { name: 'Low', count: priorityAggregation['Low'] },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-[#0060AF] rounded-xl"><Scale size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Active Cases</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalCases}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">High Priority Cases</p>
            <h3 className="text-3xl font-bold text-gray-900">{highPriorityCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Briefcase size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Lawyers</p>
            <h3 className="text-3xl font-bold text-gray-900">{uniqueLawyers.size}</h3>
          </div>
        </div>
      </div>

      {/* Two Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Problem Types */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Cases by Problem Type</h2>
            <p className="text-xs text-gray-500">Distribution of legal issues handled.</p>
          </div>
          <ProblemTypePieChart data={problemChartData} />
        </div>

        {/* Priority Levels */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Triage: Priority Levels</h2>
            <p className="text-xs text-gray-500">Volume of cases based on urgency.</p>
          </div>
          <PriorityBarChart data={priorityChartData} />
        </div>

      </div>
    </div>
  );
}