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
    <div className="animate-pulse rounded-xl bg-[#F0FFF4] border border-[#D8F3DC] p-6 shadow-sm">
      <div className="h-3 w-20 bg-[#D8F3DC] rounded mb-3" />
      <div className="h-8 w-28 bg-[#D8F3DC] rounded" />
    </div>
  );
}

const cards: { key: keyof KPIData; label: string; format: (v: number) => string }[] = [
  { key: "total_customers", label: "TOTAL CUSTOMERS", format: (v) => v.toLocaleString() },
  { key: "churn_rate_pct", label: "CHURN RATE", format: (v) => `${v}%` },
  { key: "avg_monthly_revenue", label: "AVG MONTHLY REVENUE", format: (v) => `$${v.toFixed(2)}` },
  { key: "avg_lifetime_value", label: "AVG LIFETIME VALUE", format: (v) => `$${v.toLocaleString()}` },
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
          className="rounded-xl bg-[#F0FFF4] border border-[#D8F3DC] p-6 shadow-sm"
        >
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {c.label}
          </p>
          <p className="mt-2 text-2xl font-bold text-[#1B4332]">
            {c.format(Number(data[c.key]))}
          </p>
        </div>
      ))}
    </div>
  );
}
