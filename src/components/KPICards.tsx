"use client";

interface KPI {
  label: string;
  value: string | number;
  unit?: string;
}

interface KPICardsProps {
  data: KPI[];
}

export default function KPICards({ data }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((kpi) => (
        <div
          key={kpi.label}
          className="kpi-card rounded-xl p-6 border border-[#B7E4C7] shadow-sm"
        >
          <p className="text-sm font-medium text-[#40916C] uppercase tracking-wide">
            {kpi.label}
          </p>
          <p className="mt-2 text-3xl font-bold text-[#1B4332]">
            {kpi.value}
            {kpi.unit && (
              <span className="text-lg font-normal text-[#52B788] ml-1">
                {kpi.unit}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
