'use client';

import { useState } from 'react';
import { 
  Calendar, MapPin, Utensils, Search, Trash2, Edit2, 
  FileText, X, Download, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { deleteActivity } from '@/app/actions/actions';
import ActivityForm from '@/app/admin/ministries/[serviceId]/submit/ActivityForm';

export default function BusogPusoLog({ 
  initialActivities = [],
  serviceId,
  parishes = [] 
}: { 
  initialActivities: any[];
  serviceId: string;
  parishes: any[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState(initialActivities);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  
  //pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredActivities = (activities || []).filter((activity) =>
    activity.parishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (activity.details as any)?.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (activity.details as any)?.food_served?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  // export csv logic
  const exportToCSV = () => {
    const headers = ["Activity_ID", "Date", "Station_Name", "Area", "Meal_Served", "Beneficiaries", "Total_Market_Cost"];

    const rows = filteredActivities.map(activity => {
      const details = activity.details as any;
      const totalCost = (details?.market_expenses || []).reduce(
        (acc: number, curr: any) => acc + (Number(curr.cost) || 0), 0
      );

      return [
        activity.id,
        new Date(activity.date).toLocaleDateString(),
        `"${activity.parishName}"`,
        `"${details?.area || 'N/A'}"`,
        `"${details?.food_served || 'N/A'}"`,
        details?.beneficiaries || 0,
        totalCost
      ];
    });

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `busog_puso_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this log? This cannot be undone.")) {
      const result = await deleteActivity(id);
      if (result.success) {
        setActivities(activities.filter(a => a.id !== id));
      } else {
        alert("Failed to delete entry.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Feeding Activity Log</h2>
          <p className="text-sm text-gray-500">Search and manage mission station reports.</p>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search..."
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center">
            <FileText className="h-12 w-12 text-gray-200 mb-3" />
            <p className="text-lg font-medium text-gray-900">No logs found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Date & Station</th>
                    <th className="px-6 py-4">Area</th>
                    <th className="px-6 py-4">Meal Served</th>
                    <th className="px-6 py-4 text-center">Beneficiaries</th>
                    <th className="px-6 py-4">Market Expenses</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedActivities.map((activity) => {
                    const details = activity.details as any;
                    const expenses = details?.market_expenses || [];
                    const totalCost = expenses.reduce((acc: number, curr: any) => acc + (Number(curr.cost) || 0), 0);
                    
                    return (
                      <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(activity.date).toLocaleDateString()}
                          </div>
                          <div className="text-[#0060AF] text-[11px] font-bold mt-1 uppercase">{activity.parishName}</div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-rose-400" />
                            <span>{details?.area || '—'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">{details?.food_served}</td>

                        <td className="px-6 py-4 text-center">
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs border border-emerald-100">
                            {details?.beneficiaries || 0}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="min-w-[180px] bg-gray-50 p-2 rounded-lg space-y-1 border border-gray-100">
                            {expenses.map((ex: any, idx: number) => (
                              <div key={idx} className="text-[10px] flex justify-between text-gray-500">
                                <span>{ex.item}</span>
                                <span className="font-mono">₱{Number(ex.cost).toLocaleString()}</span>
                              </div>
                            ))}
                            <div className="pt-1 border-t flex justify-between font-bold text-[11px] text-gray-900">
                              <span>Total</span>
                              <span className="text-[#0060AF]">₱{totalCost.toLocaleString()}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setEditingActivity(activity)} className="p-2 text-gray-400 hover:text-[#0060AF] hover:bg-blue-50 rounded-lg transition-all">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(activity.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 font-medium">
                Showing <span className="text-gray-900 font-bold">{startIndex + 1}</span> to{' '}
                <span className="text-gray-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredActivities.length)}</span> of{' '}
                <span className="text-gray-900 font-bold">{filteredActivities.length}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > 0 && val <= totalPages) {
                        setCurrentPage(val);
                      }
                    }}
                    className="w-12 h-9 text-center text-xs font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0060AF] outline-none transition-all shadow-sm"
                  />
                  <span className="text-xs text-gray-400 font-medium">of {totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {editingActivity && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 md:p-12 relative shadow-2xl">
            <button onClick={() => setEditingActivity(null)} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
              <X size={24} />
            </button>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><Edit2 className="text-[#0060AF]" /> Edit Activity Log</h2>
              <p className="text-gray-500 mt-1">Updating entry for <span className="font-bold text-[#0060AF]">{editingActivity.parishName}</span></p>
            </div>
            <ActivityForm 
              serviceId={serviceId}
              parishes={parishes}
              initialData={editingActivity}
              onSuccess={() => { setEditingActivity(null); window.location.reload(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}