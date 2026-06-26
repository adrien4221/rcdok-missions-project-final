'use client';

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, LineChart, Line,
} from 'recharts';

export function VicariateMembershipChart({
  data,
}: {
  data: { name: string; members: number }[];
}) {
  if (!data.length) return <EmptyState />;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="members"
            name="Members"
            fill="#0060AF"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ParishMembershipChart({
  data,
}: {
  data: { name: string; members: number }[];
}) {
  if (!data.length) return <EmptyState />;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="members"
            name="Members"
            fill="#2dd4bf"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MembershipTrendChart({
  data,
}: {
  data: {
    month: string;
    members: number;
  }[];
}) {
  if (data.length === 0) return <EmptyState />;

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="members"
            stroke="#0060AF"
            strokeWidth={3}
            name="BEC Members"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      No membership data available yet.
    </div>
  );
}