import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { organizations } from '@/db/schemas/organizations';
import { eq, desc } from 'drizzle-orm';
import { FileText, Calendar, User, Phone, Briefcase, AlertCircle } from 'lucide-react';

export default async function LegalAidLog({ serviceId }: { serviceId: string }) {
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
          <h2 className="text-xl font-bold text-gray-900">Case Intake Log</h2>
          <p className="text-sm text-gray-500">A historical record of all legal aid consultations and intakes.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Briefcase className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">No cases logged yet.</p>
            <p className="text-sm mt-1">Submit a new legal intake to see it appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Intake Date</th>
                  <th className="px-6 py-4">Client Info</th>
                  <th className="px-6 py-4">Case Details</th>
                  <th className="px-6 py-4">Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((activity) => {
                  // 2. Unwrap the Legal Aid JSON payload
                  const details = activity.details as any;
                  
                  const formattedDate = new Date(activity.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  });

                  // Dynamic color for Priority Badge
                  const priority = details?.priority_level || 'Low';
                  const priorityColor = 
                    priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                    priority === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                    'bg-blue-50 text-blue-700 border-blue-200';

                  return (
                    <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Intake Date */}
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 align-top">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {formattedDate}
                        </div>
                      </td>
                      
                      {/* Client Info */}
                      <td className="px-6 py-4 align-top">
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
                          <User size={14} className="text-gray-400"/>
                          {details?.client_name || 'Unknown Client'}
                        </div>
                        <div className="text-gray-500 text-xs flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400"/>
                          {details?.contact_number || 'No contact'}
                        </div>
                      </td>
                      
                      {/* Case Details */}
                      <td className="px-6 py-4 max-w-xs align-top">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900">{details?.problem_type || 'Unspecified'}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${priorityColor}`}>
                            {priority === 'High' && <AlertCircle size={10} />}
                            {priority} Priority
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2" title={details?.problem_description}>
                          {details?.problem_description || 'No description provided.'}
                        </p>
                      </td>

                      {/* Assignment */}
                      <td className="px-6 py-4 align-top">
                        <div className="font-medium text-[#0060AF] mb-1">
                          {activity.parishName}
                        </div>
                        <div className="text-gray-500 text-xs flex items-center gap-1.5">
                          <Briefcase size={12} className="text-gray-400"/>
                          {details?.assigned_lawyer || 'Unassigned'}
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