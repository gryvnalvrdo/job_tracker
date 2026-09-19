"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ApplicationStatus } from "@/generated/prisma/client";
import { STATUS_CONFIG } from "@/lib/constants";

interface StatusChartProps {
  data: { status: ApplicationStatus; count: number }[];
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  SAVED: "#0ea5e9",
  APPLIED: "#6366f1",
  SCREENING: "#8b5cf6",
  INTERVIEW: "#f59e0b",
  OFFER: "#10b981",
  REJECTED: "#ef4444",
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#22263a] border border-[#3d4465] rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="font-semibold text-[#e2e8f0]">{payload[0].name}</p>
        <p className="text-[#8892a4]">{payload[0].value} lamaran</p>
      </div>
    );
  }
  return null;
};

export function StatusChart({ data }: StatusChartProps) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="flex items-center justify-center h-40 text-[#8892a4] text-sm">
        Belum ada data
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: STATUS_CONFIG[d.status].label,
    value: d.count,
    status: d.status,
  }));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={STATUS_COLORS[entry.status]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1">
        {chartData.map((entry) => (
          <div key={entry.status} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: STATUS_COLORS[entry.status] }}
              />
              <span className="text-sm text-[#c4cad8]">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold text-[#e2e8f0]">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
