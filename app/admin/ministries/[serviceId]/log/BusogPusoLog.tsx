import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { organizations } from '@/db/schemas/organizations';
import { eq, desc } from 'drizzle-orm';
import { FileText, Package, Calendar } from 'lucide-react';

export default async function ActivityLogPage( 
{ serviceId }: { serviceId: string }
) {
  //const resolvedParams = await params;
  //const serviceId = resolvedParams.serviceId;

  // fetch the data and join with the Parish table
  const activities = await db
    .select({
      id: ministryActivities.id,
      date: ministryActivities.activityDate,
      details: ministryActivities.details,
      parishName: organizations.name,
    })
    .from(ministryActivities)
    .innerJoin(organizations, eq(ministryActivities.organizationId, organizations.id))
    .where(eq(ministryActivities.serviceId, serviceId))
    .orderBy(desc(ministryActivities.activityDate)); // Newest activities at the top!

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Activity Log</h2>
          <p className="text-sm text-gray-500">A complete historical record of all submitted ministry events.</p>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">No activities logged yet.</p>
            <p className="text-sm mt-1">Submit an activity from the 'Submit Activity' tab to see it here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Station Location</th>
                  <th className="px-6 py-4">Program & Food</th>
                  <th className="px-6 py-4 text-center">Kids Fed</th>
                  <th className="px-6 py-4">Resources Utilized</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((activity) => {
                  // Unwrap JSONB column!
                  const details = activity.details as any;
                  const resources = details?.resources_utilized || [];

                  // format the date (e.g. "Sep 15, 2024")
                  const formattedDate = new Date(activity.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  });

                  return (
                    <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {formattedDate}
                      </td>
                      
                      {/* Parish */}
                      <td className="px-6 py-4 font-medium text-[#0060AF]">
                        {activity.parishName}
                      </td>
                      
                      {/* Program Details */}
                      <td className="px-6 py-4">
                        <span className="block font-semibold text-gray-900">{details?.program_type || 'N/A'}</span>
                        <span className="block text-gray-500 text-xs mt-0.5">{details?.food_served || 'No details provided'}</span>
                      </td>
                      
                      {/* Beneficiaries (Kids Fed) */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full">
                          {details?.beneficiaries || 0}
                        </span>
                      </td>

                      {/* Resources Array*/}
                      <td className="px-6 py-4">
                        {resources.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {resources.map((res: any, idx: number) => (
                              <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2 py-1 rounded-md">
                                <Package size={12} className="text-gray-500" />
                                {res.quantity} {res.unit} {res.item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">No resources logged</span>
                        )}
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}