'use client';

import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type ChartData = {
  name: string;
  kidsFed: number;
};

export default function BeneficiariesChart({ 
  parishData, 
  vicariateData 
}: { 
  parishData: ChartData[], 
  vicariateData: ChartData[] 
}) {
  const [view, setView] = useState<'parish' | 'vicariate'>('parish');

  const activeData = view === 'parish' ? parishData : vicariateData;

  if (parishData.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        No activity data available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setView('parish')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            view === 'parish' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          By Parish
        </button>
        <button
          onClick={() => setView('vicariate')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            view === 'vicariate' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          By Vicariate
        </button>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="kidsFed" fill="#0060AF" radius={[4, 4, 0, 0]} name="Kids Fed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}