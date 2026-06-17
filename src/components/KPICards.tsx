"use client";

interface KPIData {
  total_customers: number;
  churn_rate_pct: number;
  avg_monthly_revenue: number;
  avg_lifetime_value: number;
}

interface KPICardsProps {
  data: KPIData | null;
  loading: boolean;
}

function Skeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] p-6 shadow-sm">
      <div className="h-3 w-20 bg-[#DDD6FE] rounded mb-3" />
      <div className="h-8 w-28 bg-[#DDD6FE] rounded" />
    </div>
  );
}

const cards: { key: keyof KPIData; label: string; format: (v: number) => string; sub?: string }[] = [
  { key: "total_customers", label: "Total Customers", format: (v) => v.toLocaleString() },
  { key: "churn_rate_pct", label: "Churn Rate", format: (v) => `${v}%` },
  { key: "avg_monthly_revenue", label: "Avg Monthly Revenue", format: (v) => `$${v.toFixed(2)}`, sub: "per customer / month" },
  { key: "avg_lifetime_value", label: "Avg Lifetime Value", format: (v) => `$${Number(v.toFixed(0)).toLocaleString()}`, sub: "total spend per customer" },
];

export default function KPICards({ data, loading }: KPICardsProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.key}
          className="rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] p-6 shadow-sm"
        >
          <p className="text-xs font-medium text-[#7C3AED] uppercase tracking-wide">
            {c.label}
          </p>
          <p className="mt-2 text-2xl font-bold text-[#3B0764]">
            {c.format(Number(data[c.key]))}
          </p>
          {c.sub && (
            <p className="mt-1 text-xs text-gray-400">{c.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
