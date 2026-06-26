import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { eq } from 'drizzle-orm';
import { BrainCircuit, Users, AlertTriangle, LifeBuoy } from 'lucide-react';
import { PrimaryReasonBarChart, RiskLevelDonutChart } from './MentalHealthCharts';

// helper to clean up free-text inputs for the chart
const normalizeString = (str: string) => {
  if (!str) return 'Unspecified';
  const cleaned = str.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

export default async function MentalHealthAnalytics({ serviceId }: { serviceId: string }) {
  // fetch all mental health consultations for this service
  const rawActivities = await db
    .select({ details: ministryActivities.details })
    .from(ministryActivities)
    .where(eq(ministryActivities.serviceId, serviceId));

  // aggregation variables
  let totalSessions = rawActivities.length;
  let crisisInterventions = 0;
  
  const uniqueClients = new Set<string>();
  
  const reasonAggregation: Record<string, number> = {};
  const riskAggregation: Record<string, number> = { High: 0, Moderate: 0, Low: 0 };

  // crunch through the activities to populate aggregation variables
  rawActivities.forEach((activity) => {
    const details = activity.details as any;
    
    // Unique Clients (using a combination of name + dob as a simple unique key))
    const clientKey = `${details?.client_name}-${details?.dob}`;
    if (details?.client_name) uniqueClients.add(clientKey);

    // crisis Count
    if (details?.session_type === 'Crisis Intervention') crisisInterventions++;

    // aggregate Risk Levels
    const risk = details?.risk_level || 'Low';
    riskAggregation[risk] = (riskAggregation[risk] || 0) + 1;

    // aggregate Reasons for Consultation (normalize free text to reduce duplicates in the chart)
    const reason = normalizeString(details?.primary_reason);
    reasonAggregation[reason] = (reasonAggregation[reason] || 0) + 1;
  });

  // format into Arrays for Recharts
  
  // sort by highest count and only take the TOP 5 to keep the chart clean
  const topReasonsData = Object.entries(reasonAggregation)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); 

  const riskChartData = [
    { name: 'High', value: riskAggregation['High'] },
    { name: 'Moderate', value: riskAggregation['Moderate'] },
    { name: 'Low', value: riskAggregation['Low'] },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BrainCircuit size={24} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Sessions</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalSessions}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Unique Clients</p>
            <h3 className="text-2xl font-bold text-gray-900">{uniqueClients.size}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">High Risk Cases</p>
            <h3 className="text-2xl font-bold text-gray-900">{riskAggregation['High']}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><LifeBuoy size={24} /></div>
          <div>
            <p className="text-xs font-medium text-gray-500">Crisis Interventions</p>
            <h3 className="text-2xl font-bold text-gray-900">{crisisInterventions}</h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Primary Reasons */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top Consultation Reasons</h2>
            <p className="text-xs text-gray-500">The most frequent presenting issues (Top 5).</p>
          </div>
          <PrimaryReasonBarChart data={topReasonsData} />
        </div>

        {/* Risk Levels */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Clinical Acuity (Risk)</h2>
            <p className="text-xs text-gray-500">Distribution of cases by severity and risk level.</p>
          </div>
          <RiskLevelDonutChart data={riskChartData} />
        </div>

      </div>
    </div>
  );
}