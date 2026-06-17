"use client";

interface SegmentData {
  segment_name: string;
  customers: number;
  avg_clv: number;
  churn_pct: number;
  avg_monthly: number;
}

interface SegmentTableProps {
  data: SegmentData[];
  loading: boolean;
}

const ACTIONS: Record<string, string> = {
  "New and Vulnerable": "Onboarding nurture sequence, early engagement triggers",
  "High Value at Risk": "Retention offer, dedicated account review",
  "Loyal High Value": "Upsell add-on services, loyalty program",
  "Flexible Uncommitted": "Contract upgrade incentive, value demonstration",
  "General Base": "Standard engagement, monitor for signals",
};

function churnBadge(pct: number): string {
  if (pct > 30) return "bg-red-100 text-red-800";
  if (pct > 20) return "bg-orange-100 text-orange-800";
  return "bg-purple-100 text-purple-800";
}

export default function SegmentTable({ data, loading }: SegmentTableProps) {
  if (loading) {
    return <div className="h-[250px] bg-[#F5F3FF] animate-pulse rounded-xl" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#3B0764] text-white">
            {["Segment", "Customers", "Avg CLV", "Churn %", "Avg Monthly", "Recommended Action"].map(
              (h) => (
                <th key={h} className="text-left p-3 font-semibold text-xs uppercase tracking-wide">
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.segment_name} className={i % 2 === 0 ? "bg-white" : "bg-[#F5F3FF]"}>
              <td className="p-3 font-medium text-[#3B0764]">{row.segment_name}</td>
              <td className="p-3">{row.customers.toLocaleString()}</td>
              <td className="p-3">${Number(row.avg_clv.toFixed(0)).toLocaleString()}</td>
              <td className="p-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${churnBadge(row.churn_pct)}`}>
                  {row.churn_pct}%
                </span>
              </td>
              <td className="p-3">${row.avg_monthly}/mo</td>
              <td className="p-3 text-xs text-gray-500 max-w-[220px]">
                {ACTIONS[row.segment_name] ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
