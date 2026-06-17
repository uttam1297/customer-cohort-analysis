"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CLVData {
  segment: string;
  avg_clv: number;
  churn_pct: number;
  customers: number;
}

interface CLVSegmentProps {
  data: CLVData[];
  loading: boolean;
}

export default function CLVSegment({ data, loading }: CLVSegmentProps) {
  if (loading) {
    return <div className="h-[400px] bg-[#F5F3FF] animate-pulse rounded-xl" />;
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-[#3B0764] mb-4">
        High-value customers churn less but cost more to lose
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="segment"
            tick={{ fontSize: 12, fill: "#3B0764" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Avg CLV ($)",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "#6B7280" },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 50]}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Churn %",
              angle: 90,
              position: "insideRight",
              style: { fontSize: 12, fill: "#6B7280" },
            }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #DDD6FE",
              fontSize: 13,
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="avg_clv"
            name="Avg CLV ($)"
            fill="#7C3AED"
            radius={[6, 6, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="churn_pct"
            name="Churn Rate (%)"
            stroke="#E63946"
            strokeWidth={2}
            dot={{ r: 5, fill: "#E63946" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
