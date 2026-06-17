import sys
import pandas as pd

CSV = "public/data/telco_churn.csv"
df = pd.read_csv(CSV)

checks = []

EXPECTED = [
    "customerID", "gender", "SeniorCitizen", "Partner", "Dependents",
    "tenure", "PhoneService", "MultipleLines", "InternetService",
    "OnlineSecurity", "OnlineBackup", "DeviceProtection", "TechSupport",
    "StreamingTV", "StreamingMovies", "Contract", "PaperlessBilling",
    "PaymentMethod", "MonthlyCharges", "TotalCharges", "Churn",
]

missing = set(EXPECTED) - set(df.columns)
checks.append(("All expected columns exist", len(missing) == 0,
               f"Missing: {missing}" if missing else ""))

checks.append(("No null customerIDs", df["customerID"].notna().all(), ""))

dupes = df["customerID"].duplicated().sum()
checks.append(("No duplicate customerIDs", dupes == 0,
               f"{dupes} duplicates" if dupes else ""))

bad_churn = set(df["Churn"].unique()) - {"Yes", "No"}
checks.append(("Churn values only Yes/No", len(bad_churn) == 0,
               f"Unexpected: {bad_churn}" if bad_churn else ""))

checks.append(("Tenure non-negative", (df["tenure"] >= 0).all(), ""))

checks.append(("MonthlyCharges positive", (df["MonthlyCharges"] > 0).all(), ""))

failed = False
for name, passed, detail in checks:
    status = "PASS" if passed else "FAIL"
    suffix = f" ({detail})" if detail else ""
    print(f"[{status}] {name}{suffix}")
    if not passed:
        failed = True

sys.exit(1 if failed else 0)
