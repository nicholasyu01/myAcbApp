import { CalculationResult, ApiError } from '../types/calculator';
import { adjustToWeekday, formatDateForApi, formatDateForDisplay } from './dateUtils';

/**
 * Mock stock price data
 * In production, this would call Yahoo Finance API
 */
const MOCK_STOCK_DATA: Record<string, { price: number; currency: string }> = {
  'AAPL': { price: 178.25, currency: 'USD' },
  'GOOGL': { price: 142.50, currency: 'USD' },
  'MSFT': { price: 415.30, currency: 'USD' },
  'TSLA': { price: 195.75, currency: 'USD' },
  'SHOP': { price: 65.80, currency: 'CAD' },
  'TD': { price: 74.25, currency: 'CAD' },
  'RY': { price: 125.40, currency: 'CAD' },
  'BMO': { price: 112.15, currency: 'CAD' },
};

/**
 * Mock USD/CAD exchange rate
 * In production, this would fetch from a forex API
 */
const MOCK_USD_CAD_RATE = 1.38;

/**
 * Simulates API delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API call to calculate cost basis
 * In production, this would be a server-side endpoint that:
 * 1. Validates inputs
 * 2. Adjusts date if weekend
 * 3. Fetches historical closing price from Yahoo Finance
 * 4. Fetches USD/CAD rate if needed
 * 5. Returns calculation results
 */
export async function calculateCostBasis(
  ticker: string,
  shares: number,
  arrivalDate: string
): Promise<CalculationResult> {
  // Simulate network delay
  await delay(1000);

  // Validate inputs
  if (!ticker || ticker.trim().length === 0) {
    throw new Error('Invalid ticker symbol');
  }

  if (shares <= 0) {
    throw new Error('Number of shares must be greater than 0');
  }

  const tickerUpper = ticker.toUpperCase().trim();
  
  // Check if we have mock data for this ticker
  const stockData = MOCK_STOCK_DATA[tickerUpper];
  if (!stockData) {
    throw new Error(`No historical data found for ticker ${tickerUpper}. In production, this would fetch from Yahoo Finance.`);
  }

  // Adjust date if weekend
  const date = new Date(arrivalDate);
  const adjustedDate = adjustToWeekday(date);
  const pricingDateUsed = formatDateForDisplay(adjustedDate);

  // Calculate total value in original currency
  const totalValue = stockData.price * shares;

  // Prepare result
  const result: CalculationResult = {
    ticker: tickerUpper,
    pricingDateUsed,
    closingPrice: stockData.price,
    shares,
    totalValue,
    currency: stockData.currency,
  };

  // If USD stock, add CAD conversion
  if (stockData.currency === 'USD') {
    result.cadTotalValue = totalValue * MOCK_USD_CAD_RATE;
    result.usdCadRate = MOCK_USD_CAD_RATE;
  }

  return result;
}
