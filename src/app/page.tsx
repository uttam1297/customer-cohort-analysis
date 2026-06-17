"use client";

import { useEffect, useState } from "react";
import { useDuckDB } from "@/hooks/useDuckDB";
import {
  KPI_QUERY,
  COHORT_RETENTION_QUERY,
  CLV_SEGMENT_QUERY,
  CHURN_HEATMAP_QUERY,
  SEGMENT_RECOMMENDATIONS_QUERY,
} from "@/sql/queries";
import KPICards from "@/components/KPICards";
import CohortChart from "@/components/CohortChart";
import CLVSegment from "@/components/CLVSegment";
import ChurnHeatmap from "@/components/ChurnHeatmap";
import SegmentTable from "@/components/SegmentTable";
import SQLViewer from "@/components/SQLViewer";

export default function Home() {
  const { runQuery, loading, error, ready } = useDuckDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [kpis, setKpis] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cohorts, setCohorts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clvData, setClvData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [heatmap, setHeatmap] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [segments, setSegments] = useState<any[]>([]);

  useEffect(() => {
    if (!ready) return;

    async function loadAll() {
      const [kpiRes, cohortRes, clvRes, heatRes, segRes] = await Promise.all([
        runQuery(KPI_QUERY),
        runQuery(COHORT_RETENTION_QUERY),
        runQuery(CLV_SEGMENT_QUERY),
        runQuery(CHURN_HEATMAP_QUERY),
        runQuery(SEGMENT_RECOMMENDATIONS_QUERY),
      ]);
      setKpis(kpiRes);
      setCohorts(cohortRes);
      setClvData(clvRes);
      setHeatmap(heatRes);
      setSegments(segRes);
    }

    loadAll();
  }, [ready, runQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#52B788] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#40916C] font-medium">
            Initializing DuckDB and loading data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="font-semibold text-lg">Error loading data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const kpiCards = kpis.length
    ? [
        {
          label: "Total Customers",
          value: Number(kpis[0].total_customers).toLocaleString(),
        },
        {
          label: "Churn Rate",
          value: `${kpis[0].churn_rate_pct}`,
          unit: "%",
        },
        {
          label: "Avg Monthly Revenue",
          value: `$${kpis[0].avg_monthly_revenue}`,
        },
        {
          label: "Avg Lifetime Value",
          value: `$${Number(kpis[0].avg_lifetime_value).toLocaleString()}`,
        },
      ]
    : [];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[#1B4332]">
          Customer Cohort & Lifetime Value Analysis
        </h1>
        <p className="mt-2 text-[#40916C]">
          Subscription churn analysis on telecom data. Approach directly
          applicable to energy retail (tariff plans, billing cycles, add-on
          products).
        </p>
      </header>

      {/* KPIs */}
      <section className="mb-10">
        <KPICards data={kpiCards} />
        <SQLViewer sql={KPI_QUERY} />
      </section>

      {/* Cohort Retention */}
      <section className="section-card mb-8">
        <h2 className="text-xl font-bold text-[#1B4332] mb-2">
          Where do we lose customers?
        </h2>
        <CohortChart
          data={cohorts.map((c) => ({
            tenure_cohort: String(c.tenure_cohort),
            retention_pct: Number(c.retention_pct),
            customers: Number(c.customers),
            churned: Number(c.churned),
          }))}
        />
        <SQLViewer sql={COHORT_RETENTION_QUERY} />
      </section>

      {/* CLV Segments */}
      <section className="section-card mb-8">
        <h2 className="text-xl font-bold text-[#1B4332] mb-2">
          Which customers are worth the most?
        </h2>
        <CLVSegment
          data={clvData.map((d) => ({
            segment: String(d.segment),
            customers: Number(d.customers),
            avg_clv: Number(d.avg_clv),
            avg_monthly: Number(d.avg_monthly),
            churn_pct: Number(d.churn_pct),
          }))}
        />
        <SQLViewer sql={CLV_SEGMENT_QUERY} />
      </section>

      {/* Churn Heatmap */}
      <section className="section-card mb-8">
        <h2 className="text-xl font-bold text-[#1B4332] mb-2">
          Where does churn concentrate?
        </h2>
        <ChurnHeatmap
          data={heatmap.map((d) => ({
            Contract: String(d.Contract),
            PaymentMethod: String(d.PaymentMethod),
            customers: Number(d.customers),
            churn_pct: Number(d.churn_pct),
          }))}
        />
        <SQLViewer sql={CHURN_HEATMAP_QUERY} />
      </section>

      {/* Segment Recommendations */}
      <section className="section-card mb-8">
        <h2 className="text-xl font-bold text-[#1B4332] mb-2">
          Segment recommendations
        </h2>
        <SegmentTable
          data={segments.map((d) => ({
            segment_name: String(d.segment_name),
            customers: Number(d.customers),
            avg_clv: Number(d.avg_clv),
            churn_pct: Number(d.churn_pct),
            avg_monthly: Number(d.avg_monthly),
          }))}
        />
        <SQLViewer sql={SEGMENT_RECOMMENDATIONS_QUERY} />
      </section>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-[#B7E4C7] text-center text-sm text-[#40916C]">
        Built by Uttam Darekar | SQL, DuckDB-WASM, Next.js, Recharts, Tailwind
        CSS
        {" · "}
        <a
          href="https://github.com/uttam1297/customer-cohort-analysis"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#1B4332]"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
