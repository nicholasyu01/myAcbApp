import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ErrorMessageProps {
  error: string;
  onReset: () => void;
}

export function ErrorMessage({ error, onReset }: ErrorMessageProps) {
  return (
    <Card className="w-full max-w-lg shadow-lg border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-5 text-red-600" />
          <CardTitle className="text-xl text-red-900">Error</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-red-800">{error}</p>
        <Button onClick={onReset} variant="outline" className="w-full">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
