"use client";

interface HeatmapData {
  Contract: string;
  PaymentMethod: string;
  churn_pct: number;
  customers: number;
}

interface ChurnHeatmapProps {
  data: HeatmapData[];
  loading: boolean;
}

function interpolateColor(pct: number, min: number, max: number): string {
  const t = max === min ? 0.5 : (pct - min) / (max - min);
  // purple (low churn) → red (high churn)
  const r = Math.round(167 + (230 - 167) * t);
  const g = Math.round(139 + (57 - 139) * t);
  const b = Math.round(250 + (70 - 250) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function ChurnHeatmap({ data, loading }: ChurnHeatmapProps) {
  if (loading) {
    return <div className="h-[300px] bg-[#F5F3FF] animate-pulse rounded-xl" />;
  }

  const contracts = ["Month-to-month", "One year", "Two year"];
  const methods = [...new Set(data.map((d) => d.PaymentMethod))];
  const lookup = new Map(data.map((d) => [`${d.Contract}|${d.PaymentMethod}`, d]));
  const allPcts = data.map((d) => d.churn_pct);
  const min = Math.min(...allPcts);
  const max = Math.max(...allPcts);

  return (
    <div>
      <h3 className="text-base font-semibold text-[#3B0764] mb-4">
        Month-to-month contracts with electronic check payments are the highest risk
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr>
              <th className="text-left p-3 text-[#3B0764] font-semibold bg-[#F5F3FF]">
                Contract
              </th>
              {methods.map((m) => (
                <th key={m} className="text-center p-3 text-[#3B0764] font-semibold bg-[#F5F3FF] text-xs">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c}>
                <td className="p-3 font-medium text-[#3B0764] border-t border-gray-100">
                  {c}
                </td>
                {methods.map((m) => {
                  const cell = lookup.get(`${c}|${m}`);
                  const pct = cell?.churn_pct ?? 0;
                  return (
                    <td
                      key={m}
                      className="p-3 text-center border-t border-gray-100"
                      style={{ backgroundColor: interpolateColor(pct, min, max) }}
                    >
                      <span className="font-bold text-white text-sm drop-shadow-sm">
                        {pct}%
                      </span>
                      <span className="block text-[10px] text-white/80 mt-0.5">
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
