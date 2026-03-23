import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { organizations } from '@/db/schemas/organizations';
import { eq, desc } from 'drizzle-orm';
import { Calendar, User, AlertTriangle, Activity, Stethoscope, ClipboardList } from 'lucide-react';

export default async function DrugRehabLog({ serviceId }: { serviceId: string }) {
  // fetch data and join with the Parish table
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
    .orderBy(desc(ministryActivities.activityDate));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Encounter History Log</h2>
          <p className="text-sm text-gray-500">A clinical record of all rehabilitation sessions, intakes, and graduations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <ClipboardList className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">No encounters logged yet.</p>
            <p className="text-sm mt-1">Log a new session from the 'Submit Activity' tab to build the history.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Session Date</th>
                  <th className="px-6 py-4">Client Profile</th>
                  <th className="px-6 py-4">Encounter Details</th>
                  <th className="px-6 py-4">Treatment Pathway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((activity) => {
                  // 2. Unwrap the Clinical JSON payload
                  const details = activity.details as any;
                  
                  const formattedDate = new Date(activity.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  });

                  // Dynamic color for Priority Badge
                  const priority = details?.priority_level || 'Low';
                  const priorityColor = 
                    priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                    priority === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                    'bg-green-50 text-green-700 border-green-200';

                  return (
                    <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Session Date & Type */}
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div className="font-medium text-gray-900 flex items-center gap-2 mb-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {formattedDate}
                        </div>
                        <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          <Activity size={10} />
                          {details?.session_type || 'Unspecified Session'}
                        </span>
                      </td>
                      
                      {/* Client Profile */}
                      <td className="px-6 py-4 align-top">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                          <User size={14} className="text-gray-400"/>
                          {details?.client_name || 'Unknown Client'}
                        </div>
                        <div className="text-gray-500 text-xs mb-1">
                          DOB: {details?.dob ? new Date(details.dob).toLocaleDateString() : 'N/A'} | {details?.contact_number || 'No contact'}
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          Substance: <span className="text-red-600 font-semibold">{details?.primary_substance || 'Unknown'}</span>
                        </div>
                      </td>
                      
                      {/* Encounter Details */}
                      <td className="px-6 py-4 max-w-xs align-top">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500 font-medium">Ref: {details?.referral_source || 'Walk-in'}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${priorityColor}`}>
                            {priority === 'High' && <AlertTriangle size={10} />}
                            {priority} Risk
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2 italic" title={details?.session_notes}>
                          "{details?.session_notes || 'No session notes provided.'}"
                        </p>
                      </td>

                      {/* Treatment Pathway */}
                      <td className="px-6 py-4 align-top">
                        <div className="font-medium text-[#0060AF] mb-1">
                          {activity.parishName}
                        </div>
                        <div className="text-gray-500 text-xs flex flex-col gap-1">
                          <span className="flex items-center gap-1.5">
                            <Stethoscope size={12} className="text-gray-400"/>
                            {details?.assigned_counselor || 'Unassigned'}
                          </span>
                          <span className="font-semibold text-gray-700">
                            Pathway: {details?.assigned_program || 'Pending'}
                          </span>
                        </div>
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