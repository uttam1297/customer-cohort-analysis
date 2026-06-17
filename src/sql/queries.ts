export const KPI_QUERY = `
SELECT
  COUNT(*) AS total_customers,
  ROUND(AVG(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END)*100, 1) AS churn_rate_pct,
  ROUND(AVG(MonthlyCharges), 2) AS avg_monthly_revenue,
  ROUND(AVG(CAST(TotalCharges AS DOUBLE) / NULLIF(tenure, 0)), 2) AS avg_revenue_per_month,
  ROUND(AVG(CAST(TotalCharges AS DOUBLE)), 2) AS avg_lifetime_value
FROM customers
`;

export const COHORT_RETENTION_QUERY = `
WITH cohorts AS (
  SELECT
    customerID,
    CASE
      WHEN tenure <= 3 THEN '0-3 months'
      WHEN tenure <= 6 THEN '3-6 months'
      WHEN tenure <= 12 THEN '6-12 months'
      WHEN tenure <= 24 THEN '12-24 months'
      ELSE '24+ months'
    END AS tenure_cohort,
    CASE
      WHEN tenure <= 3 THEN 1
      WHEN tenure <= 6 THEN 2
      WHEN tenure <= 12 THEN 3
      WHEN tenure <= 24 THEN 4
      ELSE 5
    END AS cohort_order,
    Churn
  FROM customers
)
SELECT
  tenure_cohort,
  cohort_order,
  COUNT(*) AS customers,
  SUM(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END) AS churned,
  ROUND(AVG(CASE WHEN Churn='No' THEN 1 ELSE 0 END)*100, 1) AS retention_pct
FROM cohorts
GROUP BY tenure_cohort, cohort_order
ORDER BY cohort_order
`;

export const CLV_SEGMENT_QUERY = `
WITH clv AS (
  SELECT
    customerID,
    Contract,
    MonthlyCharges,
    tenure,
    CAST(TotalCharges AS DOUBLE) AS lifetime_value,
    Churn,
    NTILE(3) OVER (ORDER BY CAST(TotalCharges AS DOUBLE)) AS value_tier
  FROM customers
  WHERE tenure > 0
)
SELECT
  CASE value_tier
    WHEN 1 THEN 'Low Value'
    WHEN 2 THEN 'Mid Value'
    WHEN 3 THEN 'High Value'
  END AS segment,
  COUNT(*) AS customers,
  ROUND(AVG(lifetime_value), 2) AS avg_clv,
  ROUND(AVG(MonthlyCharges), 2) AS avg_monthly,
  ROUND(AVG(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END)*100, 1) AS churn_pct
FROM clv
GROUP BY value_tier
ORDER BY value_tier
`;

export const CHURN_HEATMAP_QUERY = `
SELECT
  Contract,
  PaymentMethod,
  COUNT(*) AS customers,
  ROUND(AVG(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END)*100, 1) AS churn_pct
FROM customers
GROUP BY Contract, PaymentMethod
ORDER BY churn_pct DESC
`;

export const SEGMENT_RECOMMENDATIONS_QUERY = `
WITH segments AS (
  SELECT
    customerID,
    Contract,
    tenure,
    MonthlyCharges,
    CAST(TotalCharges AS DOUBLE) AS lifetime_value,
    Churn,
    CASE
      WHEN tenure <= 6 AND Churn='No' THEN 'New and Vulnerable'
      WHEN CAST(TotalCharges AS DOUBLE) > 3000 AND Churn='No' THEN 'Loyal High Value'
      WHEN CAST(TotalCharges AS DOUBLE) > 3000 AND Churn='Yes' THEN 'High Value at Risk'
      WHEN Contract='Month-to-month' AND Churn='No' THEN 'Flexible and Uncommitted'
      ELSE 'General Base'
    END AS segment_name
  FROM customers
  WHERE tenure > 0
)
SELECT
  segment_name,
  COUNT(*) AS customers,
  ROUND(AVG(lifetime_value), 2) AS avg_clv,
  ROUND(AVG(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END)*100, 1) AS churn_pct,
  ROUND(AVG(MonthlyCharges), 2) AS avg_monthly
FROM segments
GROUP BY segment_name
ORDER BY churn_pct DESC
`;
