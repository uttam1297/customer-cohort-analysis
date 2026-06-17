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
        const DUCKDB_BUNDLES = await duckdb.selectBundle({
          mvp: {
            mainModule: new URL(
              "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm",
              import.meta.url
            ).href,
            mainWorker: new URL(
              "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js",
              import.meta.url
            ).href,
          },
          eh: {
            mainModule: new URL(
              "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm",
              import.meta.url
            ).href,
            mainWorker: new URL(
              "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js",
              import.meta.url
            ).href,
          },
        });

        const worker = new Worker(DUCKDB_BUNDLES.mainWorker!);
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
