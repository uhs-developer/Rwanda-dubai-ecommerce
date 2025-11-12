import { useQuery, useMutation } from 'urql';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { GET_EXCHANGE_RATES, CREATE_EXCHANGE_RATE, UPDATE_EXCHANGE_RATE } from '../../graphql/admin';
import { useState, useEffect } from 'react';
import { Skeleton } from '../../components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

export default function AdminCurrencyPage() {
  const [ratesResult, reexecRates] = useQuery({ query: GET_EXCHANGE_RATES });
  const [, createRate] = useMutation(CREATE_EXCHANGE_RATE);
  const [, updateRate] = useMutation(UPDATE_EXCHANGE_RATE);

  const rates = ratesResult.data?.adminExchangeRates || [];
  const loading = ratesResult.fetching;
  const [editing, setEditing] = useState<Record<string, string>>({});

  // Reset editing state when rates change (after successful update)
  useEffect(() => {
    if (!loading && rates.length > 0) {
      setEditing({});
    }
  }, [rates, loading]);

  const handleRateChange = (key: string, val: string) => {
    setEditing(prev => ({ ...prev, [key]: val }));
  };

  const save = async (id: string | undefined, codeFrom: string, codeTo: string) => {
    const key = `${codeFrom}-${codeTo}`;
    const newVal = parseFloat(editing[key] || '0');
    const existing = rates.find((r: any) => r.codeFrom === codeFrom && r.codeTo === codeTo);
    const currentRate = existing?.rate ? parseFloat(existing.rate) : 0;

    if (!newVal || newVal <= 0) {
      toast.error('Rate must be greater than 0');
      return;
    }

    // Check if trying to update with the same value
    if (id && newVal === currentRate) {
      toast.info(`Rate for ${codeFrom} → ${codeTo} is already ${newVal}`);
      setEditing(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      return;
    }

    if (id) {
      const res = await updateRate({ id, input: { codeFrom, codeTo, rate: newVal } });
      if (res.error) {
        toast.error(res.error.message || 'Failed to update');
        return;
      }
      toast.success(`Updated ${codeFrom} → ${codeTo} to ${newVal}`);
    } else {
      const res = await createRate({ input: { codeFrom, codeTo, rate: newVal } });
      if (res.error) {
        toast.error(res.error.message || 'Failed to create');
        return;
      }
      toast.success(`Created ${codeFrom} → ${codeTo} with rate ${newVal}`);
    }

    // Clear editing state and refresh
    setEditing(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    reexecRates({ requestPolicy: 'network-only' });
  };

  const presetPairs = [
    ['USD', 'RWF'],
    ['AED', 'RWF'],
    ['JPY', 'RWF'],
    ['CNY', 'RWF'],
    ['KRW', 'RWF'],
    ['EUR', 'RWF'],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Currency Exchange Rates</h2>
        <p className="text-muted-foreground mt-1">
          Manage exchange rates for currency conversion across the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Exchange Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-48" />
                  <Skeleton className="h-10 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {presetPairs.map(([from, to]) => {
                const existing = rates.find((r: any) => r.codeFrom === from && r.codeTo === to);
                const key = `${from}-${to}`;
                const currentRate = existing?.rate ?? '';
                const editedValue = editing[key];
                const displayValue = editedValue !== undefined ? editedValue : currentRate;
                const hasChanges = editedValue !== undefined && parseFloat(editedValue) !== parseFloat(currentRate || '0');

                return (
                  <div className="flex items-center gap-3" key={key}>
                    <div className="w-32 text-sm font-medium">{from} → {to}</div>
                    <Input
                      className="w-48"
                      type="number"
                      step="0.000001"
                      placeholder="Enter rate"
                      value={String(displayValue)}
                      onChange={e => handleRateChange(key, e.target.value)}
                    />
                    {hasChanges && (
                      <Button 
                        size="sm" 
                        onClick={() => save(existing?.id, from, to)}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

