import { useState } from "react";
import { formatDateForApi } from "../utils/dateUtils";

interface BatchEntry {
  ticker: string;
  shares: number;
  tradedDate: string;
  close: number;
  adjustedCostBasis: number;
  provider?: string;
}

interface BatchResponse {
  arrivalDate: string;
  results: BatchEntry[];
}

export function BatchUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [arrivalDate, setArrivalDate] = useState<string>(() =>
    formatDateForApi(new Date()),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<BatchEntry[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFile(f);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setResults(null);

    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("arrivalDate", arrivalDate);
      form.append("file", file, file.name);

      const resp = await fetch("https://myacbserver.onrender.com/batch", {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => resp.statusText);
        throw new Error(`Batch API error ${resp.status}: ${text}`);
      }

      const data = (await resp.json()) as BatchResponse;
      if (!data || !Array.isArray(data.results)) {
        throw new Error("Invalid response from batch API");
      }

      setResults(data.results);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Batch upload failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const lines = ["AAPL,2", "MSFT,1", "GOOG,0.5"];
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(n);

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200">
      <h2 className="text-lg font-semibold mb-3">Batch CSV Upload</h2>

      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={downloadTemplate}
          className="text-sm bg-slate-100 border border-slate-200 px-3 py-1 rounded-md hover:bg-slate-200"
        >
          Download CSV Template
        </button>
        <p className="text-xs text-slate-500">
          Template: `ticker,shares` per line
        </p>
      </div>

      <form onSubmit={handleSubmit} className=" space-y-3">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm w-full sm:w-auto"
            />

            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="rounded-md border px-3 py-2 text-sm mt-2 sm:mt-0 w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-60 sm:w-full"
          >
            {loading ? "Uploading..." : "Upload & Calculate"}
          </button>
        </div>
      </form>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {results && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="px-2 py-2">Ticker</th>
                <th className="px-2 py-2">Shares</th>
                <th className="px-2 py-2">Traded Date</th>
                <th className="px-2 py-2">Adj Close</th>
                <th className="px-2 py-2">Adj Cost Basis</th>
                <th className="px-2 py-2">Provider</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={`${r.ticker}-${r.tradedDate}`} className="border-t">
                  <td className="px-2 py-2 font-medium">{r.ticker}</td>
                  <td className="px-2 py-2">{r.shares}</td>
                  <td className="px-2 py-2">{r.tradedDate}</td>
                  <td className="px-2 py-2">{fmtCurrency(r.close)}</td>
                  <td className="px-2 py-2">
                    {fmtCurrency(r.adjustedCostBasis)}
                  </td>
                  <td className="px-2 py-2">{r.provider || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BatchUpload;
