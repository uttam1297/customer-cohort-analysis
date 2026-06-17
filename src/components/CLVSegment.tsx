"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CLVData {
  segment: string;
  customers: number;
  avg_clv: number;
  avg_monthly: number;
  churn_pct: number;
}

interface CLVSegmentProps {
  data: CLVData[];
}

export default function CLVSegment({ data }: CLVSegmentProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#1B4332] mb-4">
        High-value customers churn less — but cost more to lose
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
          <XAxis dataKey="segment" tick={{ fontSize: 12, fill: "#1B4332" }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: "#1B4332" }}
            label={{
              value: "Avg CLV ($)",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "#1B4332" },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 50]}
            tick={{ fontSize: 12, fill: "#1B4332" }}
            label={{
              value: "Churn %",
              angle: 90,
              position: "insideRight",
              style: { fontSize: 12, fill: "#1B4332" },
            }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #B7E4C7",
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="avg_clv"
            name="Avg CLV ($)"
            fill="#2D6A4F"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="churn_pct"
            name="Churn Rate (%)"
            fill="#D4A373"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
