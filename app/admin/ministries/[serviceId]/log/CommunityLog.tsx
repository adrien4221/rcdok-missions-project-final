import { db } from '@/db';
import { ministryActivities } from '@/db/schemas/activities';
import { organizations } from '@/db/schemas/organizations';
import { eq, desc } from 'drizzle-orm';
import { Calendar, MapPin, Users, HeartHandshake, Globe } from 'lucide-react';

export default async function CommunityLog({ serviceId }: { serviceId: string }) {
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
          <h2 className="text-xl font-bold text-gray-900">Community Activity Log</h2>
          <p className="text-sm text-gray-500">A historical record of all outreach and community engagement events.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Globe className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">No community events logged yet.</p>
            <p className="text-sm mt-1">Submit a new event from the 'Submit Activity' tab to see it appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Location & Coordination</th>
                  <th className="px-6 py-4 text-center">Impact & Turnout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((activity) => {
                  // 2. Unwrap the JSON!
                  const details = activity.details as any;
                  
                  const formattedDate = new Date(activity.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  });

                  return (
                    <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Date & Time */}
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div className="font-medium text-gray-900 flex items-center gap-2 mb-1">
                          <Calendar size={14} className="text-gray-400" />
                          {formattedDate}
                        </div>
                        <div className="text-gray-500 text-xs ml-5">
                          {details?.time || 'Time not specified'}
                        </div>
                      </td>
                      
                      {/* Event Details */}
                      <td className="px-6 py-4 align-top max-w-[250px]">
                        <div className="font-bold text-[#0060AF] mb-1 truncate" title={details?.activity_title}>
                          {details?.activity_title || 'Untitled Event'}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 font-medium">
                            {details?.program_type || 'General'}
                          </span>
                          <span className="text-gray-500">For: {details?.target_group || 'All'}</span>
                        </div>
                      </td>
                      
                      {/* Location & Coordination */}
                      <td className="px-6 py-4 align-top">
                        <div className="font-medium text-gray-900 flex items-center gap-1.5 mb-1">
                          <MapPin size={14} className="text-gray-400"/>
                          <span className="truncate max-w-[200px]" title={details?.location_barangay}>
                            {details?.location_barangay || 'Location not specified'}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs ml-5">
                          Host: {activity.parishName} <br/>
                          Lead: {details?.coordinator || 'Unspecified'}
                        </div>
                      </td>

                      {/* Impact & Turnout */}
                      <td className="px-6 py-4 align-top text-center">
                        <div className="flex justify-center gap-4">
                          <div className="flex flex-col items-center" title="Beneficiaries Reached">
                            <Users size={16} className="text-blue-500 mb-1" />
                            <span className="font-bold text-gray-900">{details?.beneficiaries || 0}</span>
                          </div>
                          <div className="w-px bg-gray-200 h-8"></div>
                          <div className="flex flex-col items-center" title="Volunteers Mobilized">
                            <HeartHandshake size={16} className="text-teal-500 mb-1" />
                            <span className="font-bold text-gray-900">{details?.volunteers || 0}</span>
                          </div>
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