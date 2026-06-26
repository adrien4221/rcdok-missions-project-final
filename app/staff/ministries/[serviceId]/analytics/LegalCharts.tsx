'use client';

import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// --- pie chart (Problem Types) ---
const PIE_COLORS = ['#0060AF', '#2dd4bf', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

export function ProblemTypePieChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- bar chart (Priority Levels) ---
export function PriorityBarChart({ data }: { data: { name: string; count: number }[] }) {
  if (data.length === 0) return <EmptyState />;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} allowDecimals={false} />
          <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          {/* We dynamically color the bars based on priority! */}
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => {
              const color = entry.name === 'High' ? '#ef4444' : entry.name === 'Medium' ? '#f59e0b' : '#3b82f6';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// helper component when no data is available
function EmptyState() {
  return (
    <div className="h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      No case data available yet.
    </div>
  );
}