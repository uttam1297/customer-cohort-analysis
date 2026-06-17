import sys
import duckdb
import pandas as pd

CSV = "public/data/telco_churn.csv"
df = pd.read_csv(CSV)
df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce").fillna(0)

con = duckdb.connect()
con.register("customers", df)

checks = []

# KPI query
kpi = con.execute("""
    SELECT
      COUNT(*) AS total_customers,
      ROUND(AVG(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END)*100, 1) AS churn_rate_pct,
      ROUND(AVG(MonthlyCharges), 2) AS avg_monthly_revenue,
      ROUND(AVG(TotalCharges), 2) AS avg_lifetime_value
    FROM customers
""").fetchdf()
checks.append(("KPI returns 1 row", len(kpi) == 1, ""))
checks.append(("Churn rate 0-100",
                0 <= kpi["churn_rate_pct"].iloc[0] <= 100, ""))

# Cohort query
cohorts = con.execute("""
    WITH cohorts AS (
      SELECT customerID,
        CASE WHEN tenure<=3 THEN '0-3m' WHEN tenure<=6 THEN '3-6m'
             WHEN tenure<=12 THEN '6-12m' WHEN tenure<=24 THEN '12-24m'
             ELSE '24m+' END AS cohort,
        Churn
      FROM customers
    )
    SELECT cohort, COUNT(*) AS n,
      SUM(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END) AS churned
    FROM cohorts GROUP BY cohort
""").fetchdf()
checks.append(("Cohort returns 5 groups", len(cohorts) == 5, f"Got {len(cohorts)}"))
checks.append(("No empty cohorts", (cohorts["n"] > 0).all(), ""))

# CLV query
clv = con.execute("""
    WITH clv AS (
      SELECT TotalCharges AS lv, NTILE(3) OVER (ORDER BY TotalCharges) AS tier
      FROM customers WHERE tenure > 0
    )
    SELECT tier, ROUND(AVG(lv),2) AS avg_clv FROM clv GROUP BY tier
""").fetchdf()
checks.append(("No negative CLV", (clv["avg_clv"] >= 0).all(), ""))

# Heatmap query
heatmap = con.execute("""
    SELECT Contract, PaymentMethod, COUNT(*) AS n,
      ROUND(AVG(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END)*100,1) AS churn_pct
    FROM customers GROUP BY Contract, PaymentMethod
""").fetchdf()
checks.append(("Heatmap has >= 6 rows", len(heatmap) >= 6, f"Got {len(heatmap)}"))

# Segment query
segs = con.execute("""
    WITH s AS (
      SELECT CASE
        WHEN tenure<=6 AND Churn='No' THEN 'New'
        WHEN TotalCharges>3000 AND Churn='Yes' THEN 'HVR'
        WHEN TotalCharges>3000 AND Churn='No' THEN 'LHV'
        WHEN Contract='Month-to-month' AND Churn='No' THEN 'FU'
        ELSE 'GB' END AS seg
      FROM customers WHERE tenure > 0
    )
    SELECT seg, COUNT(*) AS n FROM s GROUP BY seg
""").fetchdf()
checks.append(("Segments query runs", len(segs) > 0, ""))

failed = False
for name, passed, detail in checks:
    status = "PASS" if passed else "FAIL"
    suffix = f" ({detail})" if detail else ""
    print(f"[{status}] {name}{suffix}")
    if not passed:
        failed = True

sys.exit(1 if failed else 0)
