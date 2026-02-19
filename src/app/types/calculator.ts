export interface CalculationRequest {
  ticker: string;
  shares: number;
  arrivalDate: string;
}

export interface CalculationResult {
  ticker: string;
  pricingDateUsed: string;
  closingPrice: number;
  shares: number;
  totalValue: number;
  currency: string;
  cadTotalValue?: number;
  usdCadRate?: number;
}

export interface ApiError {
  error: string;
  details?: string;
}
