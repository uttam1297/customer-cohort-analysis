[![Data Validation](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/data-validation.yml/badge.svg)](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/data-validation.yml)
[![SQL Tests](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/sql-tests.yml/badge.svg)](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/sql-tests.yml)
[![Build](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/build.yml/badge.svg)](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/build.yml)

# Customer Cohort & Lifetime Value Analysis

Live dashboard: [customer-cohort-analysis.vercel.app](https://customer-cohort-analysis.vercel.app)

A browser-based dashboard that analyzes customer churn using SQL queries on real telecom data. Everything runs client-side with DuckDB-WASM, so there is no backend, no API, and no server to maintain.

## Why this project

Subscription businesses all face the same core questions: where in the customer lifecycle do we lose people, which customers are worth the most, and what can we actually do about it. This project answers those questions on telecom churn data, but the approach (cohort retention, CLV segmentation, churn risk profiling) applies directly to energy retail, SaaS, and any recurring-revenue model.

## What the dashboard shows

- **KPI overview**: total customers, churn rate, average monthly revenue, average lifetime value
- **Cohort retention**: customers grouped by tenure (0-3m, 3-6m, 6-12m, 12-24m, 24m+), showing how retention changes over time
- **CLV segments**: customers split into Low/Mid/High value tiers using NTILE, with churn rate overlaid
- **Churn heatmap**: contract type crossed with payment method, color-coded by churn percentage
- **Segment recommendations**: named business segments (New and Vulnerable, High Value at Risk, Loyal High Value, Flexible Uncommitted) with suggested actions

Every chart has a "Show SQL" toggle so you can see the exact query behind it.

## Project structure

```
public/data/           Telco churn CSV (7,043 rows, 21 columns)
src/lib/               DuckDB-WASM hook (singleton, CDN bundles)
src/sql/               All analytical queries as named constants
src/components/        KPICards, CohortChart, CLVSegment, ChurnHeatmap, SegmentTable, SQLViewer
src/app/               Next.js App Router (single page dashboard)
scripts/               Python validation and query test scripts
.github/workflows/     CI: data validation, SQL tests, Next.js build
```

## How to run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. DuckDB-WASM initializes in a few seconds, then all charts load.

## Tech stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16, TypeScript, Tailwind CSS |
| Data engine | DuckDB-WASM (runs SQL in the browser) |
| Charts | Recharts |
| CI/CD | GitHub Actions, Vercel |
| Data | IBM Telco Customer Churn (Kaggle), 7,043 customers |

## Data source

IBM Telco Customer Churn dataset from Kaggle. 7,043 customer records with 21 features including tenure, monthly charges, contract type, payment method, and churn status. TotalCharges blanks were pre-cleaned to 0.

## Author

Uttam Darekar · [GitHub](https://github.com/uttam1297) · [LinkedIn](https://linkedin.com/in/uttamdarekar)
