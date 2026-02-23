import { CalculationResult } from "../types/calculator";
import {
  adjustToWeekday,
  formatDateForApi,
  formatDateForDisplay,
} from "./dateUtils";

/**
 * calculateCostBasis now calls the ACB server to retrieve adjusted close and cost basis.
 * Endpoint: POST https://myacbserver.onrender.com/price
 * Payload: { ticker, arrivalDate, shares }
 * Expected response includes: adjustedClose, adjustedCostBasis, tradedDate, etc.
 */
export async function calculateCostBasis(
  ticker: string,
  shares: number,
  arrivalDate: string,
): Promise<CalculationResult> {
  // Basic validation
  if (!ticker || ticker.trim().length === 0) {
    throw new Error("Invalid ticker symbol");
  }

  if (shares <= 0) {
    throw new Error("Number of shares must be greater than 0");
  }

  const tickerUpper = ticker.toUpperCase().trim();

  // Adjust weekend dates to previous weekday (keeps previous behaviour)
  const date = new Date(arrivalDate);
  const adjustedDate = adjustToWeekday(date);
  const arrivalForApi = formatDateForApi(adjustedDate);

  const payload = {
    ticker: tickerUpper,
    arrivalDate: arrivalForApi,
    shares,
  };

  const resp = await fetch("https://myacbserver.onrender.com/price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new Error(`ACB API error ${resp.status}: ${text}`);
  }

  const data = await resp.json().catch(() => null);

  if (
    !data ||
    typeof data.adjustedClose !== "number" ||
    typeof data.adjustedCostBasis !== "number"
  ) {
    throw new Error("Invalid response from ACB API");
  }

  const pricingDateRaw = data.tradedDate || data.arrivalDate || arrivalForApi;
  const pricingDateUsed = formatDateForDisplay(new Date(pricingDateRaw));

  const result: CalculationResult = {
    ticker: data.ticker || tickerUpper,
    pricingDateUsed,
    closingPrice: data.adjustedClose,
    shares: typeof data.shares === "number" ? data.shares : shares,
    totalValue: data.adjustedCostBasis,
    // Server doesn't currently return currency in example; default to USD
    currency: (data.currency as string) || "USD",
  };

  return result;
}
