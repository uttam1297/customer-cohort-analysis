"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";

interface UseDuckDBReturn {
  runQuery: (sql: string) => Promise<Record<string, unknown>[]>;
  loading: boolean;
  error: string | null;
  ready: boolean;
}

export function useDuckDB(): UseDuckDBReturn {
  const dbRef = useRef<duckdb.AsyncDuckDB | null>(null);
  const connRef = useRef<duckdb.AsyncDuckDBConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const DUCKDB_CDN = "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.33.1-dev45.0/dist";
        const DUCKDB_BUNDLES = await duckdb.selectBundle({
          mvp: {
            mainModule: `${DUCKDB_CDN}/duckdb-mvp.wasm`,
            mainWorker: `${DUCKDB_CDN}/duckdb-browser-mvp.worker.js`,
          },
          eh: {
            mainModule: `${DUCKDB_CDN}/duckdb-eh.wasm`,
            mainWorker: `${DUCKDB_CDN}/duckdb-browser-eh.worker.js`,
          },
        });

        // Cross-origin workers need blob URL workaround
        const workerScript = await fetch(DUCKDB_BUNDLES.mainWorker!).then(r => r.text());
        const workerBlob = new Blob([workerScript], { type: "application/javascript" });
        const workerUrl = URL.createObjectURL(workerBlob);
        const worker = new Worker(workerUrl);
        const logger = new duckdb.ConsoleLogger();
        const db = new duckdb.AsyncDuckDB(logger, worker);
        await db.instantiate(DUCKDB_BUNDLES.mainModule);

        if (cancelled) return;

        const conn = await db.connect();

        const res = await fetch("/data/telco_churn.csv");
        const csvText = await res.text();

        await db.registerFileText("telco_churn.csv", csvText);
        await conn.query(`
          CREATE TABLE customers AS
          SELECT * FROM read_csv_auto('telco_churn.csv')
        `);

        dbRef.current = db;
        connRef.current = conn;

        if (!cancelled) {
          setReady(true);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      connRef.current?.close();
      dbRef.current?.terminate();
    };
  }, []);

  const runQuery = useCallback(
    async (sql: string): Promise<Record<string, unknown>[]> => {
      if (!connRef.current) throw new Error("DuckDB not initialized");
      const result = await connRef.current.query(sql);
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

  return { runQuery, loading, error, ready };
}
