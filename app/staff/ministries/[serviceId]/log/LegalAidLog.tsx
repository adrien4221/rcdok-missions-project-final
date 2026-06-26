'use client';

import { useState } from 'react';
import { deleteActivity } from '@/app/actions/actions';
import LegalAidForm from '../submit/LegalAidForm'; // Ensure this matches your actual form path

import {
  Calendar,
  User,
  AlertCircle,
  Briefcase,
  ClipboardList,
  Search,
  Download,
  Edit2,
  Trash2,
  X,
  Phone,
  Scale
} from 'lucide-react';

export default function LegalAidLog({
  initialActivities,
  serviceId,
  parishes,
}: {
  initialActivities: any[];
  serviceId: string;
  parishes: any[];
}) {
  const [activities, setActivities] = useState(initialActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingActivity, setEditingActivity] = useState<any>(null);

  const itemsPerPage = 7;

  // Filter logic based on the specific Legal Aid schema fields
  const filteredActivities = activities.filter((activity) => {
    const details = activity.details as any;

    return (
      activity.parishName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      details?.client_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      details?.problem_type
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      details?.assigned_lawyer
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case intake?')) {
      const result = await deleteActivity(id);

      if (result.success) {
        setActivities(activities.filter((activity) => activity.id !== id));
      }
    }
  };

  const exportCSV = () => {
    if (filteredActivities.length === 0) return;

    const rows = filteredActivities.map((activity) => {
      const details = activity.details as any;

      return {
        Date: activity.date ? new Date(activity.date).toLocaleDateString() : '',
        Client: details?.client_name || '',
        ContactNumber: details?.contact_number || '',
        ProblemType: details?.problem_type || '',
        PriorityLevel: details?.priority_level || '',
        ProblemDescription: details?.problem_description || '',
        AssignedLawyer: details?.assigned_lawyer || '',
        Parish: activity.parishName || '',
      };
    });

    const csv = [
      Object.keys(rows[0] || {}).join(','),
      ...rows.map((row) =>
        Object.values(row)
          .map((value) => `"${value.toString().replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legal-aid-log.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Case Intake Log</h2>
          <p className="text-sm text-gray-500">
            A historical record of all legal aid consultations and intakes.
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
              placeholder="Search cases..."
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
        Showing {filteredActivities.length} case(s)
      </div>

      {/* Main Table Structure */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <ClipboardList className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">No cases logged yet.</p>
            <p className="text-sm mt-1">
              Log a new legal intake case from the Submit Activity tab.
            </p>
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
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedActivities.map((activity) => {
                  const details = activity.details as any;

                  const formattedDate = new Date(activity.date).toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric' }
                  );

                  const priority = details?.priority_level || 'Low';
                  const priorityColor =
                    priority === 'High'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : priority === 'Medium'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200';

                  return (
                    <tr
                      key={activity.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Date / Type Column */}
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div className="font-medium text-gray-900 flex items-center gap-2 mb-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {formattedDate}
                        </div>
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          <Scale size={10} />
                          Legal Aid
                        </span>
                      </td>

                      {/* Client info Column */}
                      <td className="px-6 py-4 align-top">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                          <User size={14} className="text-gray-400" />
                          {details?.client_name || 'Unknown Client'}
                        </div>
                        <div className="text-gray-500 text-xs flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400" />
                          {details?.contact_number || 'No contact'}
                        </div>
                      </td>

                      {/* Problem/Case Column */}
                      <td className="px-6 py-4 align-top max-w-xs">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-gray-900">
                            {details?.problem_type || 'Unspecified'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${priorityColor}`}>
                            {priority === 'High' && <AlertCircle size={10} />}
                            {priority} Priority
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2" title={details?.problem_description}>
                          {details?.problem_description || 'No description provided.'}
                        </p>
                      </td>

                      {/* Assignment/Parish Column */}
                      <td className="px-6 py-4 align-top max-w-xs">
                        <div className="flex flex-col gap-1 mb-1">
                          <span className="font-medium text-[#0060AF] text-xs">
                            {activity.parishName}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                            <Briefcase size={12} className="text-gray-400" />
                            {details?.assigned_lawyer || 'Unassigned'}
                          </span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setEditingActivity(activity)}
                            className="p-2 text-gray-400 hover:text-[#0060AF] hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(activity.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm rounded-lg border bg-white disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm rounded-lg border bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Drawer / Modal Overlay */}
      {editingActivity && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setEditingActivity(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <LegalAidForm
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