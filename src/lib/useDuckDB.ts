"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";

interface UseDuckDBReturn {
  db: duckdb.AsyncDuckDB | null;
  runQuery: (sql: string) => Promise<Record<string, unknown>[]>;
  loading: boolean;
  error: string | null;
}

let singletonDb: duckdb.AsyncDuckDB | null = null;
let singletonConn: duckdb.AsyncDuckDBConnection | null = null;
let initPromise: Promise<void> | null = null;

async function initDuckDB() {
  if (singletonDb) return;

  const DUCKDB_CDN =
    "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.33.1-dev45.0/dist";
  const bundles = await duckdb.selectBundle({
    mvp: {
      mainModule: `${DUCKDB_CDN}/duckdb-mvp.wasm`,
      mainWorker: `${DUCKDB_CDN}/duckdb-browser-mvp.worker.js`,
    },
    eh: {
      mainModule: `${DUCKDB_CDN}/duckdb-eh.wasm`,
      mainWorker: `${DUCKDB_CDN}/duckdb-browser-eh.worker.js`,
    },
  });

  const workerScript = await fetch(bundles.mainWorker!).then((r) => r.text());
  const workerBlob = new Blob([workerScript], {
    type: "application/javascript",
  });
  const worker = new Worker(URL.createObjectURL(workerBlob));
  const logger = new duckdb.ConsoleLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundles.mainModule);

  const conn = await db.connect();

  const res = await fetch("/data/telco_churn.csv");
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
  const csvText = await res.text();

  await db.registerFileText("telco_churn.csv", csvText);
  await conn.query(`
    CREATE TABLE customers AS
    SELECT * FROM read_csv_auto('telco_churn.csv')
  `);

  singletonDb = db;
  singletonConn = conn;
}

export function useDuckDB(): UseDuckDBReturn {
  const [loading, setLoading] = useState(!singletonDb);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (singletonDb) {
      setLoading(false);
      return;
    }

    if (!initPromise) {
      initPromise = initDuckDB().catch((err) => {
        initPromise = null;
        throw err;
      });
    }

    initPromise
      .then(() => {
        if (mounted.current) setLoading(false);
      })
      .catch((err) => {
        if (mounted.current) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });

    return () => {
      mounted.current = false;
    };
  }, []);

  const runQuery = useCallback(
    async (sql: string): Promise<Record<string, unknown>[]> => {
      if (!singletonConn) throw new Error("DuckDB not initialized");
      const result = await singletonConn.query(sql);
      return result.toArray().map((row) => {
        const obj: Record<string, unknown> = {};
        for (const field of result.schema.fields) {
          obj[field.name] = row[field.name];
        }
        return obj;
      });
    },
    []
  );

  return { db: singletonDb, runQuery, loading, error };
}
