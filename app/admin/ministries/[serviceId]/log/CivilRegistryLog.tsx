import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { organizations } from '@/db/schemas/organizations';
import { eq, desc } from 'drizzle-orm';
import { Calendar, User, FileText, Clock, FileCheck2, ScrollText } from 'lucide-react';

export default async function CivilRegistryLog({ serviceId }: { serviceId: string }) {
  // 1. Fetch data and join with the Parish table
  const activities = await db
    .select({
      id: ministryActivities.id,
      releaseDate: ministryActivities.activityDate,
      details: ministryActivities.details,
      parishName: organizations.name,
    })
    .from(ministryActivities)
    .innerJoin(organizations, eq(ministryActivities.organizationId, organizations.id))
    .where(eq(ministryActivities.serviceId, serviceId))
    .orderBy(desc(ministryActivities.activityDate));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Document Processing Log</h2>
          <p className="text-sm text-gray-500">A historical record of all completed civil registry requests and released documents.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <ScrollText className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">No documents processed yet.</p>
            <p className="text-sm mt-1">Log a completed document from the 'Submit Activity' tab.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Release Details</th>
                  <th className="px-6 py-4">Record Type</th>
                  <th className="px-6 py-4">Applicant Profile</th>
                  <th className="px-6 py-4">Processing Cycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((activity) => {
                  // 2. Unwrap the Registry JSON payload
                  const details = activity.details as any;
                  
                  const formattedReleaseDate = new Date(activity.releaseDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  });
                  const formattedReceiveDate = details?.date_received 
                    ? new Date(details.date_received).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Unknown';

                  // Calculate Turnaround Time for the badge
                  let turnaroundText = "Unknown";
                  let turnaroundColor = "bg-gray-100 text-gray-700 border-gray-200";
                  
                  if (details?.date_received && activity.releaseDate) {
                    const received = new Date(details.date_received);
                    const released = new Date(activity.releaseDate);
                    const diffTime = Math.abs(released.getTime() - received.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    
                    if (diffDays === 0) {
                       turnaroundText = "Same Day";
                       turnaroundColor = "bg-green-50 text-green-700 border-green-200";
                    } else if (diffDays <= 3) {
                       turnaroundText = `${diffDays} Days`;
                       turnaroundColor = "bg-blue-50 text-blue-700 border-blue-200";
                    } else {
                       turnaroundText = `${diffDays} Days`;
                       turnaroundColor = "bg-orange-50 text-orange-700 border-orange-200";
                    }
                  }

                  return (
                    <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Release Details */}
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div className="font-bold text-[#0060AF] flex items-center gap-2 mb-1.5">
                          <FileCheck2 size={16} />
                          {formattedReleaseDate}
                        </div>
                        <div className="text-gray-500 text-xs flex flex-col gap-0.5">
                          <span className="font-medium text-gray-700">{activity.parishName}</span>
                          <span>Staff: {details?.processing_staff || 'Unspecified'}</span>
                        </div>
                      </td>
                      
                      {/* Record Type */}
                      <td className="px-6 py-4 align-top">
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold px-2.5 py-1 rounded-md text-xs">
                          <FileText size={12} />
                          {details?.sacrament_type || 'Unspecified Record'}
                        </span>
                      </td>
                      
                      {/* Applicant Profile */}
                      <td className="px-6 py-4 align-top">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                          <User size={14} className="text-gray-400"/>
                          {details?.applicant_name || 'Unknown Applicant'}
                        </div>
                        <div className="text-gray-500 text-xs mb-1">
                          DOB: {details?.dob ? new Date(details.dob).toLocaleDateString() : 'N/A'} | {details?.gender || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]" title={details?.place_of_birth}>
                          POB: {details?.place_of_birth || 'N/A'}
                        </div>
                      </td>
                      
                      {/* Processing Cycle & Remarks */}
                      <td className="px-6 py-4 align-top max-w-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12}/> Rcvd: {formattedReceiveDate}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${turnaroundColor}`}>
                            <Clock size={10} />
                            {turnaroundText}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2 italic border-l-2 border-gray-200 pl-2" title={details?.remarks}>
                          "{details?.remarks || 'No additional remarks.'}"
                        </p>
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