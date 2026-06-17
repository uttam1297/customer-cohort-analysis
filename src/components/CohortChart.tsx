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

interface CohortData {
  tenure_cohort: string;
  retention_pct: number;
  customers: number;
}

interface CohortChartProps {
  data: CohortData[];
  loading: boolean;
}

function barColor(retention: number): string {
  if (retention >= 80) return "#1B4332";
  if (retention >= 70) return "#2D6A4F";
  if (retention >= 60) return "#40916C";
  if (retention >= 50) return "#52B788";
  return "#95D5B2";
}

export default function CohortChart({ data, loading }: CohortChartProps) {
  if (loading) {
    return <div className="h-[400px] bg-[#F0FFF4] animate-pulse rounded-xl" />;
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-[#1B4332] mb-4">
        Early-tenure customers are 3x more likely to leave
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="tenure_cohort"
            tick={{ fontSize: 12, fill: "#1B4332" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Retention %",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "#6B7280" },
            }}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Retention"]}
            labelFormatter={(label) => String(label)}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #D8F3DC",
              fontSize: 13,
            }}
          />
          <Bar dataKey="retention_pct" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={barColor(entry.retention_pct)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
