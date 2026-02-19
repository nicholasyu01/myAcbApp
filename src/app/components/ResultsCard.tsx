import { CalculationResult } from '../types/calculator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, TrendingUp } from 'lucide-react';

interface ResultsCardProps {
  result: CalculationResult;
}

export function ResultsCard({ result }: ResultsCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-CA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(num);
  };

  return (
    <Card className="w-full max-w-lg shadow-lg border-green-200 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-green-600" />
          <CardTitle className="text-xl text-green-900">Calculation Results</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-600">Ticker Symbol</p>
            <p className="text-lg font-semibold">{result.ticker}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">Pricing Date Used</p>
            <p className="text-lg font-semibold">{result.pricingDateUsed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">Closing Price</p>
            <p className="text-lg font-semibold">{formatCurrency(result.closingPrice, result.currency)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">Number of Shares</p>
            <p className="text-lg font-semibold">{formatNumber(result.shares)}</p>
          </div>
        </div>

        {/* Calculation Formula */}
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-600 mb-2">Calculation Formula:</p>
          <p className="text-sm font-mono text-slate-800">
            {formatCurrency(result.closingPrice, result.currency)} × {formatNumber(result.shares)} shares = {formatCurrency(result.totalValue, result.currency)}
          </p>
        </div>

        {/* Primary Result */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm opacity-90">Total Deemed Acquisition Value</p>
              <p className="text-3xl font-bold tracking-tight">
                {formatCurrency(result.totalValue, result.currency)}
              </p>
              <p className="text-xs opacity-75">{result.currency}</p>
            </div>
            <TrendingUp className="size-8 opacity-75" />
          </div>
        </div>

        {/* CAD Conversion (if USD stock) */}
        {result.cadTotalValue && result.usdCadRate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 mb-3 font-medium">CAD Conversion</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">USD/CAD Rate:</span>
                <span className="font-semibold text-blue-900">{result.usdCadRate.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">CAD Value:</span>
                <span className="font-semibold text-blue-900">{formatCurrency(result.cadTotalValue, 'CAD')}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
