'use client';

import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// --- horizontal bar chart (Primary Reasons) ---
export function PrimaryReasonBarChart({ data }: { data: { name: string; count: number }[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12 }} width={120} />
          <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Bar dataKey="count" name="Cases" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- donut chart (Risk Levels) ---
export function RiskLevelDonutChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={data} 
            cx="50%" cy="50%" 
            innerRadius={65} 
            outerRadius={90} 
            paddingAngle={5} 
            dataKey="value"
          >
            {data.map((entry, index) => {
              // Clinical Color Coding: High=Red, Moderate=Yellow, Low=Green
              const color = entry.name === 'High' ? '#ef4444' : entry.name === 'Moderate' ? '#f59e0b' : '#10b981';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      No clinical data available yet.
    </div>
  );
}