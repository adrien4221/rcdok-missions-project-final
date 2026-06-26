'use client';

import { useState } from 'react';
import { deleteActivity } from '@/app/actions/actions';
import MentalHealthForm from '../submit/MentalHealthForm';

import {
Calendar,
User,
AlertTriangle,
Brain,
Stethoscope,
ClipboardList,
Search,
Download,
Edit2,
Trash2,
X
} from 'lucide-react';

export default function MentalHealthLog({
initialActivities,
serviceId,
parishes,
}: {
initialActivities: any[];
serviceId: string;
parishes: any[];
}) {

const [activities, setActivities] =
useState(initialActivities);

const [searchTerm, setSearchTerm] =
useState('');

const [currentPage, setCurrentPage] =
useState(1);

const [editingActivity, setEditingActivity] =
useState<any>(null);

const itemsPerPage = 7;

const filteredActivities =
activities.filter((activity) => {

  const details =
    activity.details as any;

  return (
    activity.parishName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    details?.client_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    details?.primary_reason
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    details?.assigned_counselor
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
});

const totalPages =
Math.ceil(
filteredActivities.length /
itemsPerPage
);

const startIndex =
(currentPage - 1) *
itemsPerPage;

const paginatedActivities =
filteredActivities.slice(
startIndex,
startIndex + itemsPerPage
);

const handleDelete =
async (id: string) => {

  if (
    confirm(
      'Are you sure you want to delete this session?'
    )
  ) {

    const result =
      await deleteActivity(id);

    if (result.success) {

      setActivities(
        activities.filter(
          (activity) =>
            activity.id !== id
        )
      );
    }
  }
};

const exportCSV = () => {


    const rows = filteredActivities.map(
      (activity) => {

        const details =
          activity.details as any;

        return {
          Date:
            activity.date
              ? new Date(activity.date)
                  .toLocaleDateString()
              : '',

          Client:
            details?.client_name || '',

          DateOfBirth:
            details?.dob
              ? new Date(details.dob)
                  .toLocaleDateString()
              : '',

          ContactNumber:
            details?.contact_number || '',

          SessionType:
            details?.session_type || '',

          PrimaryReason:
            details?.primary_reason || '',

          ReferralSource:
            details?.referral_source || '',

          SymptomsObserved:
            details?.symptoms_observed || '',

          RiskLevel:
            details?.risk_level || '',

          AssignedCounselor:
            details?.assigned_counselor || '',

          SessionNotes:
            details?.session_notes || '',

          Parish:
            activity.parishName || '',
        };
      }
    );

    const csv =
      [
        Object.keys(rows[0] || {}).join(','),

        ...rows.map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(',')
        )
      ].join('\n');

    const blob =
      new Blob([csv], {
        type: 'text/csv'
      });

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;
    a.download =
      'mental-health-log.csv';

    a.click();
};

return (<div className="space-y-6 animate-in fade-in duration-500">

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    <div>
      <h2 className="text-xl font-bold text-gray-900">
        Psychiatric & Counseling Log
      </h2>

      <p className="text-sm text-gray-500">
        A clinical record of all mental health assessments and therapy sessions.
      </p>
    </div>

    <div className="flex items-center gap-3 w-full md:w-auto">

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all text-sm font-bold shadow-sm"
        >
          <Download size={18} />
          Export CSV
        </button>

        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0060AF] transition-all text-sm"
          />
        </div>

      </div>
  </div>

  <div className="text-sm text-gray-500">
    Showing
    {' '}
    {filteredActivities.length}
    {' '}
    session(s)
  </div>

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

    {activities.length === 0 ? (

      <div className="p-12 text-center text-gray-500 flex flex-col items-center">

        <ClipboardList className="h-12 w-12 text-gray-300 mb-3" />

        <p className="text-lg font-medium text-gray-900">
          No sessions logged yet.
        </p>

        <p className="text-sm mt-1">
          Log a new counseling session from the Submit Activity tab.
        </p>

      </div>

    ) : (

      <div className="overflow-x-auto">

        <table className="w-full text-sm text-left">

          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">

            <tr>
              <th className="px-6 py-4">
                Session Date
              </th>

              <th className="px-6 py-4">
                Client Profile
              </th>

              <th className="px-6 py-4">
                Clinical Assessment
              </th>

              <th className="px-6 py-4">
                Assignment & Notes
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100">

            {paginatedActivities.map(
              (activity) => {

                const details =
                  activity.details as any;

                const formattedDate =
                  new Date(
                    activity.date
                  ).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }
                  );

                const risk =
                  details?.risk_level ||
                  'Low';

                const riskColor =
                  risk === 'High'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : risk === 'Moderate'
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : 'bg-green-50 text-green-700 border-green-200';

                return (

                  <tr
                    key={activity.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >

                    <td className="px-6 py-4 whitespace-nowrap align-top">

                      <div className="font-medium text-gray-900 flex items-center gap-2 mb-1.5">
                        <Calendar
                          size={14}
                          className="text-gray-400"
                        />
                        {formattedDate}
                      </div>

                      <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">

                        <Brain size={10} />

                        {details?.session_type ||
                          'Session'}

                      </span>

                    </td>

                    <td className="px-6 py-4 align-top">

                      <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">

                        <User
                          size={14}
                          className="text-gray-400"
                        />

                        {details?.client_name ||
                          'Unknown Client'}

                      </div>

                      <div className="text-gray-500 text-xs mb-1">

                        DOB:
                        {' '}
                        {details?.dob
                          ? new Date(
                              details.dob
                            ).toLocaleDateString()
                          : 'N/A'}

                        {' | '}

                        {details?.contact_number ||
                          'No Contact'}

                      </div>

                      <div className="text-xs font-medium text-gray-500">

                        Ref:
                        {' '}
                        {details?.referral_source ||
                          'Walk-in'}

                      </div>

                    </td>

                    <td className="px-6 py-4 align-top max-w-xs">

                      <div className="flex flex-wrap items-center gap-2 mb-2">

                        <span className="font-bold text-gray-900">

                          {details?.primary_reason ||
                            'Unspecified Reason'}

                        </span>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${riskColor}`}>

                          {risk === 'High' &&
                            <AlertTriangle size={10} />}

                          {risk} Risk

                        </span>

                      </div>

                      <p className="text-gray-600 text-xs line-clamp-2">

                        <span className="font-semibold text-gray-700">
                          Symptoms:
                        </span>

                        {' '}

                        {details?.symptoms_observed ||
                          'None logged'}

                      </p>

                    </td>

                    <td className="px-6 py-4 align-top max-w-xs">

                      <div className="flex flex-col gap-1 mb-2">

                        <span className="font-medium text-[#0060AF] text-xs">

                          {activity.parishName}

                        </span>

                        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">

                          <Stethoscope
                            size={12}
                          />

                          {details?.assigned_counselor ||
                            'Unassigned'}

                        </span>

                      </div>

                      <p className="text-gray-500 text-xs italic line-clamp-2">

                        "{details?.session_notes ||
                          'No session notes provided'}"

                      </p>

                    </td>

                    <td className="px-6 py-4 text-right">

                      <div className="flex justify-end gap-1">

                        <button
                          onClick={() =>
                            setEditingActivity(
                              activity
                            )
                          }
                          className="p-2 text-gray-400 hover:text-[#0060AF] hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              activity.id
                            )
                          }
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>
    )}
  </div>

  {totalPages > 1 && (
      <div className="flex items-center justify-center gap-2 pt-2">

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.max(prev - 1, 1)
            )
          }
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm rounded-lg border bg-white disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from(
          { length: totalPages },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() =>
              setCurrentPage(page)
            }
            className={`px-3 py-2 text-sm rounded-lg border transition ${
              currentPage === page
                ? 'bg-[#0060AF] text-white border-[#0060AF]'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, totalPages)
            )
          }
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm rounded-lg border bg-white disabled:opacity-50"
        >
          Next
        </button>

      </div>
    )}



  {editingActivity && (

    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">

      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">

        <button
          onClick={() =>
            setEditingActivity(null)
          }
          className="absolute right-6 top-6"
        >
          <X />
        </button>

        <MentalHealthForm
          serviceId={serviceId}
          parishes={parishes}
          initialData={editingActivity}
          onSuccess={() => {
            setEditingActivity(null);
            window.location.reload();
          }}
        />

      </div>

    </div>

  )}

</div>

);
}
