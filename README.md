# Customer Cohort & Lifetime Value Analysis

A browser-based dashboard that digs into customer churn using telecom subscription data. No backend, no server. DuckDB-WASM runs all the SQL queries client-side.

## What it does

- Loads 7,000+ telecom customer records and queries them with SQL, all in the browser
- Shows the big numbers up front: churn rate, average revenue, customer lifetime value
- Groups customers by how long they've been around and plots retention over time
- Breaks customers into value segments (spend x tenure) to see where churn hurts most
- Maps churn rates across contract types and payment methods in a heatmap
- Suggests what to do about each segment, based on what the numbers say

## Key findings

- New customers (first 3 months) churn about 3x faster than long-tenure ones
- Month-to-month contracts paid by electronic check are the worst churn pocket
- Losing a high-value customer costs a lot more, even though they churn less often
- Getting customers onto annual contracts early makes a real difference in retention

## How to run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). DuckDB takes a few seconds to initialize, then everything loads.

## Built with

Next.js · TypeScript · Tailwind CSS · DuckDB-WASM · Recharts · Telco Customer Churn dataset (IBM)

## Author

Uttam Darekar · [GitHub](https://github.com/uttam1297)
