"use client";

interface HeatmapData {
  Contract: string;
  PaymentMethod: string;
  customers: number;
  churn_pct: number;
}

interface ChurnHeatmapProps {
  data: HeatmapData[];
}

function churnColor(pct: number): string {
  if (pct >= 40) return "bg-red-200 text-red-900";
  if (pct >= 30) return "bg-orange-100 text-orange-900";
  if (pct >= 20) return "bg-yellow-100 text-yellow-900";
  return "bg-green-100 text-green-900";
}

export default function ChurnHeatmap({ data }: ChurnHeatmapProps) {
  const contracts = [...new Set(data.map((d) => d.Contract))];
  const methods = [...new Set(data.map((d) => d.PaymentMethod))];

  const lookup = new Map(
    data.map((d) => [`${d.Contract}|${d.PaymentMethod}`, d])
  );

  return (
    <div>
      <h3 className="text-lg font-semibold text-[#1B4332] mb-4">
        Month-to-month + electronic check = highest churn pocket
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 text-[#1B4332] font-semibold border-b border-[#B7E4C7]">
                Contract
              </th>
              {methods.map((m) => (
                <th
                  key={m}
                  className="text-center p-3 text-[#1B4332] font-semibold border-b border-[#B7E4C7] text-xs"
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c}>
                <td className="p-3 font-medium text-[#1B4332] border-b border-[#E8E8E8]">
                  {c}
                </td>
                {methods.map((m) => {
                  const cell = lookup.get(`${c}|${m}`);
                  const pct = cell?.churn_pct ?? 0;
                  return (
                    <td
                      key={m}
                      className={`p-3 text-center font-semibold border-b border-[#E8E8E8] rounded ${churnColor(pct)}`}
                    >
                      {pct}%
                      <span className="block text-xs font-normal opacity-70">
                        n={cell?.customers ?? 0}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
