import { Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function LoadingSpinner() {
  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loader2 className="size-12 animate-spin text-slate-600 mb-4" />
        <p className="text-slate-600">Fetching historical price data...</p>
        <p className="text-sm text-slate-500 mt-2">Adjusting for weekends if needed</p>
      </CardContent>
    </Card>
  );
}
