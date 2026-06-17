# Data flow: how charts get their data

This document shows how data moves from a static CSV file to interactive charts, all inside the browser.

## High-level flow

```mermaid
flowchart LR
    A[telco_churn.csv\n7,043 rows] -->|fetch /data/| B[DuckDB-WASM\nin-browser SQL engine]
    B -->|CREATE TABLE customers| C[(customers table\nin memory)]
    C -->|SQL queries| D[Query results\narray of objects]
    D -->|props| E[React components\ncharts + tables]
```

## Detailed step-by-step

```mermaid
sequenceDiagram
    participant Browser
    participant useDuckDB
    participant DuckDB
    participant CSV as /data/telco_churn.csv
    participant Page as page.tsx
    participant Charts

    Browser->>useDuckDB: mount component
    useDuckDB->>useDuckDB: check singleton (only init once)
    useDuckDB->>DuckDB: load WASM from CDN
    DuckDB-->>useDuckDB: engine ready
    useDuckDB->>CSV: fetch CSV file
    CSV-->>useDuckDB: raw CSV text
    useDuckDB->>DuckDB: register file + CREATE TABLE
    DuckDB-->>useDuckDB: table ready
    useDuckDB-->>Page: { runQuery, loading: false }

    Page->>DuckDB: run 5 SQL queries in parallel
    DuckDB-->>Page: query results (arrays of objects)
    Page->>Charts: pass data as props
    Charts-->>Browser: render charts + tables
```

## What each layer does

```mermaid
flowchart TB
    subgraph Data["Data layer"]
        CSV[public/data/telco_churn.csv]
    end

    subgraph Engine["SQL engine (src/lib/useDuckDB.ts)"]
        WASM[DuckDB-WASM\nloaded from CDN]
        TABLE[(customers table\nin-memory)]
        WASM --> TABLE
    end

    subgraph Queries["Query layer (src/sql/queries.ts)"]
        Q1[KPI_QUERY\n1 row: totals and averages]
        Q2[COHORT_QUERY\n5 rows: tenure buckets]
        Q3[CLV_SEGMENT_QUERY\n3 rows: Low/Mid/High]
        Q4[CHURN_HEATMAP_QUERY\n12 rows: contract x payment]
        Q5[SEGMENT_RECOMMENDATIONS_QUERY\n5 rows: named segments]
    end

    subgraph UI["UI layer (src/components/)"]
        C1[KPICards\n4 metric cards]
        C2[CohortChart\nrecharts BarChart]
        C3[CLVSegment\nrecharts ComposedChart]
        C4[ChurnHeatmap\ncolor-coded table]
        C5[SegmentTable\ntable with actions]
    end

    CSV -->|fetch| Engine
    TABLE -->|SQL| Queries
    Q1 --> C1
    Q2 --> C2
    Q3 --> C3
    Q4 --> C4
    Q5 --> C5
```

## Query-to-chart mapping

| Query | Returns | Component | Visual |
|-------|---------|-----------|--------|
| KPI_QUERY | 1 row, 4 metrics | KPICards | 4 number cards |
| COHORT_QUERY | 5 rows, one per tenure bucket | CohortChart | Bar chart, green gradient |
| CLV_SEGMENT_QUERY | 3 rows (Low/Mid/High) | CLVSegment | Bars (CLV) + line (churn %) |
| CHURN_HEATMAP_QUERY | 12 rows (3 contracts x 4 payments) | ChurnHeatmap | Color table, green to red |
| SEGMENT_RECOMMENDATIONS_QUERY | 5 named segments | SegmentTable | Table with action column |

## Key design decisions

1. **Singleton DuckDB**: the hook initializes once and shares the connection across re-renders. No duplicate WASM loads.
2. **CDN bundles**: WASM and worker files come from jsDelivr, not bundled with Next.js. Avoids webpack/turbopack issues with .wasm files.
3. **Blob worker**: the Web Worker script is fetched as text and loaded via a Blob URL to bypass cross-origin restrictions.
4. **Parallel queries**: all 5 queries run with `Promise.all` after DuckDB is ready. No waterfall.
5. **Pre-cleaned CSV**: TotalCharges blanks were replaced with "0" before commit, so DuckDB reads them as DOUBLE without runtime casting.
