'use client';

import { useState } from 'react';
import {
  Calendar,
  User,
  FileText,
  Clock,
  FileCheck2,
  ScrollText,
  Edit2,
  Trash2,
  X,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { deleteActivity } from '@/app/actions/actions';
import CivilRegistryForm from '../submit/CivilRegistryForm';

export default function CivilRegistryLog({
  initialActivities = [],
  serviceId,
  parishes = [],
}: {
  initialActivities: any[];
  serviceId: string;
  parishes: any[];
}) {
  const [activities, setActivities] = useState(initialActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingActivity, setEditingActivity] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredActivities = activities.filter((activity) => {
    const details = activity.details as any;

    return (
      activity.parishName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      details?.applicant_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      details?.sacrament_type
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedActivities = filteredActivities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const exportToCSV = () => {
    const headers = [
      'Release Date',
      'Parish',
      'Record Type',
      'Applicant',
      'DOB',
      'Gender',
      'Processing Staff',
      'Received Date',
      'Remarks',
    ];

    const rows = filteredActivities.map((activity) => {
      const details = activity.details as any;

      return [
        activity.date,
        activity.parishName,
        details?.sacrament_type || '',
        details?.applicant_name || '',
        details?.dob || '',
        details?.gender || '',
        details?.processing_staff || '',
        details?.date_received || '',
        details?.remarks || '',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((c) => `"${c}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `civil_registry_log_${
      new Date().toISOString().split('T')[0]
    }.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this record? This action cannot be undone.'
      )
    ) {
      const result = await deleteActivity(id);

      if (result.success) {
        setActivities((prev) =>
          prev.filter((activity) => activity.id !== id)
        );
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Document Processing Log
          </h2>
          <p className="text-sm text-gray-500">
            A historical record of all completed civil registry requests and released documents.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all text-sm font-bold shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </button>

          <div className="relative w-full md:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0060AF]"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center">
            <ScrollText className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">
              No documents processed yet.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Release Details</th>
                    <th className="px-6 py-4">Record Type</th>
                    <th className="px-6 py-4">Applicant Profile</th>
                    <th className="px-6 py-4">Processing Cycle</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedActivities.map((activity) => {
                    const details = activity.details as any;

                    const formattedReleaseDate = activity.date
                      ? new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Unknown';

                    const formattedReceiveDate = details?.date_received
                      ? new Date(details.date_received).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                          }
                        )
                      : 'Unknown';

                    let turnaroundText = 'Unknown';
                    let turnaroundColor =
                      'bg-gray-100 text-gray-700 border-gray-200';

                    if (details?.date_received && activity.date) {
                      const received = new Date(details.date_received);
                      const released = new Date(activity.date);

                      const diffDays = Math.ceil(
                        Math.abs(
                          released.getTime() - received.getTime()
                        ) /
                          (1000 * 60 * 60 * 24)
                      );

                      turnaroundText =
                        diffDays === 0
                          ? 'Same Day'
                          : `${diffDays} Days`;

                      turnaroundColor =
                        diffDays <= 3
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200';
                    }

                    return (
                      <tr
                        key={activity.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 align-top">
                          <div className="font-bold text-[#0060AF] flex items-center gap-2 mb-1">
                            <FileCheck2 size={16} />
                            {formattedReleaseDate}
                          </div>

                          <div className="text-xs text-gray-500">
                            <div className="font-medium text-gray-700">
                              {activity.parishName}
                            </div>
                            <div>
                              Staff:{' '}
                              {details?.processing_staff || 'Unspecified'}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold px-2.5 py-1 rounded-md text-xs">
                            <FileText size={12} />
                            {details?.sacrament_type ||
                              'Unspecified Record'}
                          </span>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                            <User size={14} />
                            {details?.applicant_name}
                          </div>

                          <div className="text-xs text-gray-500">
                            DOB:{' '}
                            {details?.dob
                              ? new Date(
                                  details.dob
                                ).toLocaleDateString()
                              : 'N/A'}{' '}
                            | {details?.gender}
                          </div>

                          <div className="text-xs text-gray-500">
                            POB: {details?.place_of_birth}
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar size={12} />
                              Rcvd: {formattedReceiveDate}
                            </span>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${turnaroundColor}`}
                            >
                              <Clock size={10} />
                              {turnaroundText}
                            </span>
                          </div>

                          <p className="text-xs italic text-gray-600 border-l-2 border-gray-200 pl-2">
                            "{details?.remarks || 'No additional remarks.'}"
                          </p>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() =>
                                setEditingActivity(activity)
                              }
                              className="p-2 text-gray-400 hover:text-[#0060AF] hover:bg-blue-50 rounded-lg"
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(activity.id)
                              }
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

            {/* PAGINATION */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 font-medium">
                Showing {startIndex + 1} to{' '}
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredActivities.length
                )}{' '}
                of {filteredActivities.length}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border rounded-lg bg-white disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="text-sm">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded-lg bg-white disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {editingActivity && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setEditingActivity(null)}
              className="absolute top-6 right-6"
            >
              <X />
            </button>

            <CivilRegistryForm
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