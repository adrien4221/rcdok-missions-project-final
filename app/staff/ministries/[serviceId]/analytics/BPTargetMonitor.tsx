'use client';

import { useState } from 'react';
import { Target, ChevronRight } from 'lucide-react';

export default function TargetMonitor({ 
  data 
}: { 
  data: Record<string, Record<string, number>> 
}) {
  const vicariates = Object.keys(data);
  const [selectedVicariate, setSelectedVicariate] = useState(vicariates[0] || '');

  const activeStations = data[selectedVicariate] || {};

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="text-[#0060AF]" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Monthly Target</h2>
        </div>
        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold uppercase">
          Goal: 8
        </span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {vicariates.map((vic) => (
          <button
            key={vic}
            onClick={() => setSelectedVicariate(vic)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedVicariate === vic 
              ? 'bg-[#0060AF] text-white shadow-md' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {vic}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto max-h-[400px] pr-2">
        {Object.entries(activeStations).length > 0 ? (
          Object.entries(activeStations).map(([name, count]) => {
            const percentage = Math.min((count / 8) * 100, 100);
            return (
              <div key={name} className="group">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-gray-700 group-hover:text-[#0060AF] transition-colors">
                    {name}
                  </span>
                  <span className="font-mono font-bold text-gray-900">{count}/8</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${count >= 8 ? 'bg-emerald-500' : 'bg-[#0060AF]'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400 italic">No activity logged for this vicariate this month.</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-[10px] text-gray-400">
        Showing stations in <span className="font-bold text-gray-600">{selectedVicariate}</span>
      </div>
    </div>
  );
}