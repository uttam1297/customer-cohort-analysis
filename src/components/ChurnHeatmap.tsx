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
  const r = Math.round(149 + (230 - 149) * t);
  const g = Math.round(213 + (57 - 213) * t);
  const b = Math.round(178 + (70 - 178) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function ChurnHeatmap({ data, loading }: ChurnHeatmapProps) {
  if (loading) {
    return <div className="h-[300px] bg-[#F0FFF4] animate-pulse rounded-xl" />;
  }

  const contracts = ["Month-to-month", "One year", "Two year"];
  const methods = [...new Set(data.map((d) => d.PaymentMethod))];
  const lookup = new Map(data.map((d) => [`${d.Contract}|${d.PaymentMethod}`, d]));
  const allPcts = data.map((d) => d.churn_pct);
  const min = Math.min(...allPcts);
  const max = Math.max(...allPcts);

  return (
    <div>
      <h3 className="text-base font-semibold text-[#1B4332] mb-4">
        Month-to-month contracts with electronic check payments are the highest risk
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr>
              <th className="text-left p-3 text-[#1B4332] font-semibold bg-[#F0FFF4]">
                Contract
              </th>
              {methods.map((m) => (
                <th
                  key={m}
                  className="text-center p-3 text-[#1B4332] font-semibold bg-[#F0FFF4] text-xs"
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c}>
                <td className="p-3 font-medium text-[#1B4332] border-t border-gray-100">
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
