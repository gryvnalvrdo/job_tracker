"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface MonthlyChartProps {
  data: { month: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-2 border border-border-hover rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-text-muted text-xs mb-1">{label}</p>
        <p className="font-semibold text-text">{payload[0].value} lamaran</p>
      </div>
    );
  }
  return null;
};

export function MonthlyChart({ data }: MonthlyChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={24}>
        <XAxis
          dataKey="month"
          tick={{ fill: "#8892a4", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "#8892a4", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell
              key={idx}
              fill={entry.count === max ? "#6366f1" : "#a5b4fc"}
              fillOpacity={entry.count === max ? 1 : 0.4}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
