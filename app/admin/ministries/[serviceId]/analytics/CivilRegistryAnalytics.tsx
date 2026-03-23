import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { eq } from 'drizzle-orm';
import { FileText, Clock, FileCheck2, ScrollText } from 'lucide-react';
import { DocumentVolumeDonutChart, ProcessingTimeBarChart } from './CivilRegistryCharts';

export default async function CivilRegistryAnalytics({ serviceId }: { serviceId: string }) {
  // get all Civil Registry documents
  const rawActivities = await db
    .select({ 
      releaseDate: ministryActivities.activityDate,
      details: ministryActivities.details 
    })
    .from(ministryActivities)
    .where(eq(ministryActivities.serviceId, serviceId));

  // aggregation variables
  let totalDocuments = rawActivities.length;
  let totalProcessingDays = 0;
  let validTimeRecords = 0;
  
  const volumeMap: Record<string, number> = {};
  const processingTimeMap: Record<string, { totalDays: number; count: number }> = {};

  // crunch through the activities to populate aggregation variables
  rawActivities.forEach((activity) => {
    const details = activity.details as any;
    const docType = details?.sacrament_type || 'Unspecified';

    // calculate volume
    volumeMap[docType] = (volumeMap[docType] || 0) + 1;

    // calculate processing time
    const received = details?.date_received ? new Date(details.date_received) : null;
    const released = activity.releaseDate ? new Date(activity.releaseDate) : null;

    if (received && released) {
      // (Release Date - Receive Date) / Milliseconds in a Day
      const diffTime = Math.abs(released.getTime() - received.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      totalProcessingDays += diffDays;
      validTimeRecords++;

      if (!processingTimeMap[docType]) {
        processingTimeMap[docType] = { totalDays: 0, count: 0 };
      }
      processingTimeMap[docType].totalDays += diffDays;
      processingTimeMap[docType].count += 1;
    }
  });

  // Calculate the overall average across all documents
  const overallAvgTime = validTimeRecords > 0 ? (totalProcessingDays / validTimeRecords).toFixed(1) : 0;

  // Find the most requested document type
  let topDocument = 'None';
  let maxCount = 0;
  Object.entries(volumeMap).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topDocument = name;
    }
  });

  // format into arrays for the charts
  const volumeChartData = Object.entries(volumeMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const timeChartData = Object.entries(processingTimeMap)
    .map(([name, stats]) => ({
      name,
      // Calculate the average days for this specific document type
      days: Number((stats.totalDays / stats.count).toFixed(1)) 
    }))
    .sort((a, b) => b.days - a.days); // Longest processing times first!

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-[#0060AF] rounded-xl"><FileText size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Docs Released</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalDocuments}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-xl"><Clock size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Overall Avg. Processing</p>
            <h3 className="text-3xl font-bold text-gray-900">{overallAvgTime} <span className="text-lg text-gray-500 font-medium">days</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><ScrollText size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Most Requested</p>
            <h3 className="text-xl font-bold text-gray-900 truncate max-w-[150px]" title={topDocument}>{topDocument}</h3>
          </div>
        </div>
      </div>

      {/* The Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Volumes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Document Volume</h2>
            <p className="text-xs text-gray-500">Distribution of requests by sacrament type.</p>
          </div>
          <DocumentVolumeDonutChart data={volumeChartData} />
        </div>

        {/* Chart 2: Processing Times */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Operational Efficiency</h2>
            <p className="text-xs text-gray-500">Average processing turnaround time (in days).</p>
          </div>
          <ProcessingTimeBarChart data={timeChartData} />
        </div>

      </div>
    </div>
  );
}