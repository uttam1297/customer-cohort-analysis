[![Data Validation](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/data-validation.yml/badge.svg)](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/data-validation.yml)
[![SQL Tests](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/sql-tests.yml/badge.svg)](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/sql-tests.yml)
[![Build](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/build.yml/badge.svg)](https://github.com/uttam1297/customer-cohort-analysis/actions/workflows/build.yml)

# Customer Cohort & Lifetime Value Analysis

Live dashboard: https://customer-cohort-analysis.vercel.app

## Why this project

Every subscription business asks the same questions: where do we lose customers, who is worth the most, and what should we do about it. This project answers them with SQL on real telecom churn data. The same cohort and CLV approach applies directly to energy retail, where tariff plans, billing cycles, and add-on products follow identical patterns.

## Approach

SQL-first analysis running entirely in the browser via DuckDB-WASM. No backend, no API calls. Tenure-based cohort retention, CLV segmentation using NTILE, churn risk profiling across contract and payment dimensions, and actionable segment recommendations.

## Tools

Next.js, TypeScript, DuckDB-WASM, Recharts, Tailwind CSS, GitHub Actions, Vercel

## Data

IBM Telco Customer Churn dataset, 7,043 customers, 21 features. Source: Kaggle.
