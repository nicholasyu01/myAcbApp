import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calculator } from "lucide-react";

interface CalculatorFormProps {
  onSubmit: (ticker: string, shares: number, arrivalDate: string) => void;
  isLoading: boolean;
}

export function CalculatorForm({ onSubmit, isLoading }: CalculatorFormProps) {
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sharesNum = parseFloat(shares);
    if (
      !ticker ||
      !shares ||
      !arrivalDate ||
      isNaN(sharesNum) ||
      sharesNum <= 0
    ) {
      return;
    }

    onSubmit(ticker, sharesNum, arrivalDate);
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Calculator className="size-5 text-slate-600" />
          <CardTitle className="text-2xl">
            Canada Arrival Cost Basis Calculator
          </CardTitle>
        </div>
        <CardDescription>
          Calculate the deemed acquisition cost (step-up) for securities when
          becoming a Canadian tax resident
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticker">Ticker Symbol</Label>
            <Input
              id="ticker"
              type="text"
              placeholder="e.g., AAPL, SHOP, TD"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              disabled={isLoading}
              required
              className="uppercase"
            />
            <p className="text-sm text-slate-500">
              Try: AAPL, GOOGL, MSFT, TSLA
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shares">Number of Shares</Label>
            <Input
              id="shares"
              type="number"
              step="0.01"
              placeholder="e.g., 100.5"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              disabled={isLoading}
              required
              min="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrivalDate">Date of Arrival in Canada</Label>
            <Input
              id="arrivalDate"
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              disabled={isLoading}
              required
              max={new Date().toISOString().split("T")[0]}
            />
            <p className="text-sm text-slate-500">
              Weekend dates will be adjusted to the previous weekday
            </p>
          </div>

          <Button
            type="submit"
            className="hover:cursor-pointer w-full"
            disabled={isLoading || !ticker || !shares || !arrivalDate}
          >
            {isLoading ? "Calculating..." : "Calculate Step-Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
