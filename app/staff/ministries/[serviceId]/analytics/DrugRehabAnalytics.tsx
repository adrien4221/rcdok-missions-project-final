import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { eq } from 'drizzle-orm';
import { Activity, Users, AlertTriangle, GraduationCap } from 'lucide-react';
import { SessionTypeBarChart, ReferralPieChart } from './DrugRehabCharts';

export default async function DrugRehabAnalytics({ serviceId }: { serviceId: string }) {
  // fetch all Rehab encounters
  const rawActivities = await db
    .select({ details: ministryActivities.details })
    .from(ministryActivities)
    .where(eq(ministryActivities.serviceId, serviceId));

  // setup Aggregation Variables
  let totalEncounters = rawActivities.length;
  let highPriorityCount = 0;
  let graduations = 0;
  
  const uniqueClients = new Set<string>(); // use set to ignore duplicates
  
  const sessionAggregation: Record<string, number> = {};
  const referralAggregation: Record<string, number> = {};

  // crunch the JSON data in a single efficient loop
  rawActivities.forEach((activity) => {
    const details = activity.details as any;
    
    // track Unique Clients (Using Name + DOB to distinguish people with the same name)
    const clientKey = `${details?.client_name}-${details?.dob}`;
    if (details?.client_name) uniqueClients.add(clientKey);

    // track Priorities & Graduations
    if (details?.priority_level === 'High') highPriorityCount++;
    if (details?.session_type === 'Program Completion') graduations++;

    // aggregate for Bar Chart (Session Types)
    const sessionType = details?.session_type || 'Unspecified';
    sessionAggregation[sessionType] = (sessionAggregation[sessionType] || 0) + 1;

    // aggregate for Pie Chart (Referral Sources)
    const referral = details?.referral_source || 'Unknown';
    referralAggregation[referral] = (referralAggregation[referral] || 0) + 1;
  });

  // format into arrays for charts
  const sessionChartData = Object.entries(sessionAggregation)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // Highest volume first

  const referralChartData = Object.entries(referralAggregation)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#0060AF] rounded-xl"><Activity size={24} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Sessions</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalEncounters}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Unique Clients</p>
            <h3 className="text-2xl font-bold text-gray-900">{uniqueClients.size}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">High Risk Intakes</p>
            <h3 className="text-2xl font-bold text-gray-900">{highPriorityCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><GraduationCap size={24} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Graduations</p>
            <h3 className="text-2xl font-bold text-gray-900">{graduations}</h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Operational Load */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Operational Load</h2>
            <p className="text-xs text-gray-500">Distribution of session types conducted.</p>
          </div>
          <SessionTypeBarChart data={sessionChartData} />
        </div>

        {/* Referral Sources */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Entry Vectors</h2>
            <p className="text-xs text-gray-500">How clients are finding the rehabilitation program.</p>
          </div>
          <ReferralPieChart data={referralChartData} />
        </div>

      </div>
    </div>
  );
}