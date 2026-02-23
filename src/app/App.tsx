import { useEffect, useState } from "react";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultsCard } from "./components/ResultsCard";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";
import { CalculationResult } from "./types/calculator";
import { calculateCostBasis } from "./utils/mockApi";
import { BatchUpload } from "./components/BatchUpload";

type AppState = "idle" | "loading" | "success" | "error";

export default function App() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>("");

  // Wake up the backend (e.g., Render free instance) on app mount
  useEffect(() => {
    let mounted = true;

    const wakeBackend = async () => {
      try {
        await fetch("https://myacbserver.onrender.com/health", {
          method: "GET",
        });
        if (mounted) console.debug("ACB backend wakeup requested");
      } catch (err) {
        // Swallow errors - this is a best-effort wakeup
        if (mounted) console.warn("ACB backend wakeup failed", err);
      }
    };

    wakeBackend();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCalculate = async (
    ticker: string,
    shares: number,
    arrivalDate: string,
  ) => {
    setState("loading");
    setError("");
    setResult(null);

    try {
      // In production, this would call: await fetch('/api/calculate', { ... })
      const calculationResult = await calculateCostBasis(
        ticker,
        shares,
        arrivalDate,
      );
      setResult(calculationResult);
      setState("success");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setError("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        {state !== "idle" && (
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Canada Arrival Cost Basis Calculator
            </h1>
            <p className="text-slate-600">
              Tax step-up calculation for new Canadian residents
            </p>
          </div>
        )}

        {/* Main Content */}

        <div className="space-y-6">
          <CalculatorForm onSubmit={handleCalculate} isLoading={false} />
          <BatchUpload />
        </div>

        {state === "loading" && <LoadingSpinner />}

        {state === "success" && result && (
          <div className="space-y-4">
            <ResultsCard result={result} />
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="text-sm text-slate-600 hover:text-slate-900 underline"
              >
                Calculate Another
              </button>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-4">
            <ErrorMessage error={error} onReset={handleReset} />
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
          <p className="text-xs text-amber-900 text-center">
            <strong>Disclaimer:</strong> This calculator is for informational
            purposes only and does not constitute tax, legal, or financial
            advice. Please consult with a qualified tax professional for your
            specific situation. Weekend dates are automatically adjusted to the
            previous weekday.
          </p>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-900 text-center">
            <strong>Demo Mode:</strong> This frontend demo uses mock stock
            prices and exchange rates. In production, this would integrate with
            Yahoo Finance API via a secure backend endpoint at{" "}
            <code className="bg-blue-100 px-1 rounded">/api/calculate</code>
            to fetch real historical closing prices and currency exchange rates.
          </p>
        </div>
      </div>
    </div>
  );
}
