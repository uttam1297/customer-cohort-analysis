"use client";

import { useEffect, useState } from "react";
import { useDuckDB } from "@/lib/useDuckDB";
import {
  KPI_QUERY,
  COHORT_QUERY,
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
  const { runQuery, loading, error } = useDuckDB();

  const [kpi, setKpi] = useState<Record<string, unknown> | null>(null);
  const [cohorts, setCohorts] = useState<Record<string, unknown>[]>([]);
  const [clv, setClv] = useState<Record<string, unknown>[]>([]);
  const [heatmap, setHeatmap] = useState<Record<string, unknown>[]>([]);
  const [segments, setSegments] = useState<Record<string, unknown>[]>([]);
  const [queryLoading, setQueryLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (error) {
      setQueryLoading(false);
      return;
    }

    Promise.all([
      runQuery(KPI_QUERY),
      runQuery(COHORT_QUERY),
      runQuery(CLV_SEGMENT_QUERY),
      runQuery(CHURN_HEATMAP_QUERY),
      runQuery(SEGMENT_RECOMMENDATIONS_QUERY),
    ]).then(([kpiRes, cohortRes, clvRes, heatRes, segRes]) => {
      setKpi(kpiRes[0] ?? null);
      setCohorts(cohortRes);
      setClv(clvRes);
      setHeatmap(heatRes);
      setSegments(segRes);
      setQueryLoading(false);
    });
  }, [loading, error, runQuery]);

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

  const isLoading = loading || queryLoading;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-[#3B0764]">
          Customer Cohort & Lifetime Value Analysis
        </h1>
        <p className="mt-2 text-gray-500">
          Subscription churn analysis on customer data. Approach directly
          applicable to energy retail — tariff plans, billing cycles, add-on
          products.
        </p>
        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
          SQL runs in your browser via DuckDB-WASM
        </span>
      </header>

      <section className="mb-16">
        <KPICards
          data={
            kpi
              ? {
                  total_customers: Number(kpi.total_customers),
                  churn_rate_pct: Number(kpi.churn_rate_pct),
                  avg_monthly_revenue: Number(kpi.avg_monthly_revenue),
                  avg_lifetime_value: Number(kpi.avg_lifetime_value),
                }
              : null
          }
          loading={isLoading}
        />
        <SQLViewer sql={KPI_QUERY} />
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-[#3B0764] mb-4">
          Where in the lifecycle do we lose customers?
        </h2>
        <CohortChart
          data={cohorts.map((c) => ({
            tenure_cohort: String(c.tenure_cohort),
            retention_pct: Number(c.retention_pct),
            customers: Number(c.customers),
          }))}
          loading={isLoading}
        />
        <SQLViewer sql={COHORT_QUERY} />
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-[#3B0764] mb-4">
          Which customers are worth the most?
        </h2>
        <CLVSegment
          data={clv.map((d) => ({
            segment: String(d.segment),
            avg_clv: Number(d.avg_clv),
            churn_pct: Number(d.churn_pct),
            customers: Number(d.customers),
          }))}
          loading={isLoading}
        />
        <SQLViewer sql={CLV_SEGMENT_QUERY} />
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-[#3B0764] mb-4">
          Where does churn concentrate?
        </h2>
        <ChurnHeatmap
          data={heatmap.map((d) => ({
            Contract: String(d.Contract),
            PaymentMethod: String(d.PaymentMethod),
            churn_pct: Number(d.churn_pct),
            customers: Number(d.customers),
          }))}
          loading={isLoading}
        />
        <SQLViewer sql={CHURN_HEATMAP_QUERY} />
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold text-[#3B0764] mb-4">
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
          loading={isLoading}
        />
        <SQLViewer sql={SEGMENT_RECOMMENDATIONS_QUERY} />
      </section>

      <footer className="pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
        <p>
          Built by Uttam Darekar{" "}
          <a
            href="https://github.com/uttam1297/customer-cohort-analysis"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#3B0764]"
          >
            GitHub
          </a>
          {" · "}
          <a
            href="https://linkedin.com/in/uttamdarekar"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#3B0764]"
          >
            LinkedIn
          </a>
        </p>
        <p className="mt-1">Data: IBM Telco Customer Churn (Kaggle)</p>
      </footer>
    </div>
  );
}
