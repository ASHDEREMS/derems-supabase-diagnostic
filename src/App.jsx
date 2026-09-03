import React, { useEffect, useState } from "react";
import { runSupabaseDiagnostic } from "./supabaseClient";

export default function App() {
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  async function test() {
    setRunning(true);
    setResult(null);
    const data = await runSupabaseDiagnostic();
    console.log("DEREMS SUPABASE DIAGNOSTIC:", data);
    setResult(data);
    setRunning(false);
  }

  useEffect(() => {
    test();
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      margin: 0,
      padding: "32px 20px",
      background: "#010310",
      color: "#f5f7fb",
      fontFamily: "Inter, Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: 28,
        border: "1px solid rgba(35,169,189,.25)",
        borderRadius: 18,
        background: "rgba(255,255,255,.035)"
      }}>
        <div style={{
          color: "#23a9bd",
          fontWeight: 900,
          letterSpacing: ".14em",
          fontSize: 12
        }}>
          DEREMS QUIZBUILDER
        </div>

        <h1 style={{ marginBottom: 8 }}>Supabase Diagnostic</h1>
        <p style={{ color: "#aebbc5", lineHeight: 1.6 }}>
          This temporary page checks the production connection without displaying
          your Supabase key.
        </p>

        {!result && <p>Testing connection…</p>}

        {result && (
          <div style={{ display: "grid", gap: 10 }}>
            <Check label="Supabase URL loaded" ok={result.urlLoaded} />
            <Check label="Publishable key loaded" ok={result.keyLoaded} />
            <Check label="URL format looks correct" ok={result.urlLooksCorrect} />
            <Check label="Supabase API reachable" ok={result.apiReachable}
              extra={result.status ? `HTTP ${result.status}` : ""} />
            <Check label="Subjects table readable" ok={result.subjectsReadable}
              extra={result.subjectCount !== null ? `${result.subjectCount} subjects returned` : ""} />

            {result.error && (
              <pre style={{
                whiteSpace: "pre-wrap",
                padding: 14,
                borderRadius: 10,
                background: "#080d1c",
                color: "#ffb4b4",
                overflowX: "auto"
              }}>
                {result.error}
              </pre>
            )}

            <button
              onClick={test}
              disabled={running}
              style={{
                marginTop: 8,
                padding: "12px 16px",
                border: 0,
                borderRadius: 10,
                background: "#23a9bd",
                color: "#010310",
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              {running ? "Testing…" : "Run Test Again"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function Check({ label, ok, extra = "" }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: 14,
      borderRadius: 10,
      background: "rgba(255,255,255,.035)"
    }}>
      <span>{label}</span>
      <strong style={{ color: ok ? "#23a9bd" : "#ff8c8c" }}>
        {ok ? "✓ PASS" : "✕ FAIL"} {extra}
      </strong>
    </div>
  );
}
