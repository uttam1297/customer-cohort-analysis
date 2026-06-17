"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CohortData {
  tenure_cohort: string;
  retention_pct: number;
  customers: number;
  churned: number;
}

interface CohortChartProps {
  data: CohortData[];
  title?: string;
}

const GREENS = ["#95D5B2", "#74C69D", "#52B788", "#40916C", "#2D6A4F"];

export default function CohortChart({
  data,
  title = "Customers in their first 3 months churn 3× faster",
}: CohortChartProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#1B4332] mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
          <XAxis
            dataKey="tenure_cohort"
            tick={{ fontSize: 12, fill: "#1B4332" }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#1B4332" }}
            label={{
              value: "Retention %",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "#1B4332" },
            }}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Retention"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #B7E4C7",
            }}
          />
          <Bar dataKey="retention_pct" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={GREENS[i % GREENS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
