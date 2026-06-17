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

const PURPLES = ["#A78BFA", "#8B5CF6", "#7C3AED", "#6D28D9", "#4C1D95"];

export default function CohortChart({ data, loading }: CohortChartProps) {
  if (loading) {
    return <div className="h-[400px] bg-[#F5F3FF] animate-pulse rounded-xl" />;
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-[#3B0764] mb-4">
        Early-tenure customers are 3x more likely to leave
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="tenure_cohort"
            tick={{ fontSize: 12, fill: "#3B0764" }}
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
              border: "1px solid #DDD6FE",
              fontSize: 13,
            }}
          />
          <Bar dataKey="retention_pct" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={PURPLES[i % PURPLES.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
