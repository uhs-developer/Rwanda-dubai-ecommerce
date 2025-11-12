import { useQuery, useMutation } from 'urql';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { GET_EXCHANGE_RATES, CREATE_EXCHANGE_RATE, UPDATE_EXCHANGE_RATE, DELETE_EXCHANGE_RATE } from '../../graphql/admin';
import { useState } from 'react';

export default function AdminCurrencyPage() {
  const [ratesResult, reexecRates] = useQuery({ query: GET_EXCHANGE_RATES });
  const [, createRate] = useMutation(CREATE_EXCHANGE_RATE);
  const [, updateRate] = useMutation(UPDATE_EXCHANGE_RATE);
  const [, deleteRate] = useMutation(DELETE_EXCHANGE_RATE);

  const rates = ratesResult.data?.adminExchangeRates || [];
  const [editing, setEditing] = useState<Record<string, string>>({});

  const setEditingRate = (key: string, val: string) => {
    setEditing(prev => ({ ...prev, [key]: val }));
  };

  const save = async (id?: string, codeFrom?: string, codeTo?: string) => {
    const key = `${codeFrom}-${codeTo}`;
    const val = parseFloat(editing[key] || '0');
    if (!val || val <= 0) {
      toast.error('Rate must be > 0');
      return;
    }
    if (id) {
      const res = await updateRate({ id, input: { codeFrom, codeTo, rate: val } });
      if (res.error) return toast.error(res.error.message || 'Failed to update');
    } else {
      const res = await createRate({ input: { codeFrom, codeTo, rate: val } });
      if (res.error) return toast.error(res.error.message || 'Failed to create');
    }
    toast.success('Saved');
    setEditing(prev => ({ ...prev, [key]: '' }));
    reexecRates({ requestPolicy: 'network-only' });
  };

  const remove = async (id: string) => {
    const res = await deleteRate({ id });
    if (res.error) return toast.error(res.error.message || 'Failed to delete');
    toast.success('Deleted');
    reexecRates({ requestPolicy: 'network-only' });
  };

  const presetPairs = [
    ['USD', 'RWF'],
    ['AED', 'RWF'],
    ['JPY', 'RWF'],
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Currency Exchange Rates</h2>
      <Card className="p-4">
        <div className="grid gap-3">
          {presetPairs.map(([from, to]) => {
            const existing = rates.find((r: any) => r.codeFrom === from && r.codeTo === to);
            const key = `${from}-${to}`;
            const display = editing[key] ?? (existing?.rate ?? '');
            return (
              <div className="flex items-center gap-3" key={key}>
                <div className="w-32 text-sm font-medium">{from} → {to}</div>
                <Input
                  className="w-40"
                  type="number"
                  step="0.000001"
                  placeholder="Rate"
                  value={String(display)}
                  onChange={e => setEditingRate(key, e.target.value)}
                />
                <Button size="sm" onClick={() => save(existing?.id, from, to)}>{existing ? 'Update' : 'Create'}</Button>
                {existing && <Button size="sm" variant="destructive" onClick={() => remove(existing.id)}>Delete</Button>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}


