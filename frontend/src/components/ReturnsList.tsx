import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ReturnsService, ProductReturn } from '../services/returns';

interface Props {
  onClose: () => void;
}

const statusColor = (status: ProductReturn['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const ReturnsList: React.FC<Props> = ({ onClose }) => {
  const [items, setItems] = useState<ProductReturn[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await ReturnsService.list();
      setItems(res.data.data);
    } catch (e) {
      console.error('Failed to load returns', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (id: number, type: 'approve' | 'reject' | 'complete') => {
    try {
      if (type === 'approve') await ReturnsService.approve(id);
      if (type === 'reject') await ReturnsService.reject(id);
      if (type === 'complete') await ReturnsService.complete(id);
      await load();
    } catch (e) {
      console.error('Action failed', e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">Manage customer return requests</div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
      {loading ? (
        <div className="text-sm text-gray-600">Loading...</div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {items.map((it) => (
            <div key={it.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">{it.return_number} · Product #{it.product_id}</div>
                <Badge className={statusColor(it.status)}>{it.status}</Badge>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Reason: {it.reason} · Qty: {it.quantity} · Requested: {new Date(it.requested_at).toLocaleDateString()}
              </div>
              {it.description && (
                <div className="text-xs text-gray-700 mt-1">{it.description}</div>
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => act(it.id, 'approve')}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => act(it.id, 'reject')}>Reject</Button>
                <Button size="sm" onClick={() => act(it.id, 'complete')}>Mark Completed</Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-sm text-gray-600">No returns found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnsList;



