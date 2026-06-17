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
}

const RECOMMENDATIONS: Record<string, string> = {
  "High Value at Risk":
    "Assign dedicated account manager. Offer loyalty discount or contract upgrade incentive.",
  "Flexible and Uncommitted":
    "Target with annual plan discounts. Bundle add-on services to increase switching cost.",
  "New and Vulnerable":
    "Trigger onboarding drip campaign within first 30 days. Offer first-month discount on upgrade.",
  "Loyal High Value":
    "Recognize with loyalty perks. Cross-sell premium add-ons. Avoid disrupting their experience.",
  "General Base":
    "Monitor for early churn signals. Segment further by usage patterns for targeted offers.",
};

export default function SegmentTable({ data }: SegmentTableProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#1B4332] mb-4">
        Actionable segments with recommended interventions
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-[#2D6A4F]">
              {["Segment", "Customers", "Avg CLV", "Churn %", "Avg Monthly", "Recommendation"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left p-3 text-[#1B4332] font-semibold"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.segment_name}
                className="border-b border-[#E8E8E8] hover:bg-[#D8F3DC]/30"
              >
                <td className="p-3 font-medium text-[#1B4332]">
                  {row.segment_name}
                </td>
                <td className="p-3">{row.customers.toLocaleString()}</td>
                <td className="p-3">${row.avg_clv.toLocaleString()}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      row.churn_pct >= 30
                        ? "bg-red-100 text-red-800"
                        : row.churn_pct >= 15
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {row.churn_pct}%
                  </span>
                </td>
                <td className="p-3">${row.avg_monthly}</td>
                <td className="p-3 text-xs text-gray-600 max-w-xs">
                  {RECOMMENDATIONS[row.segment_name] ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
