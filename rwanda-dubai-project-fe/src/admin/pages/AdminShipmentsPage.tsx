import { useQuery } from 'urql';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { GET_ADMIN_SHIPMENTS } from '../../graphql/admin';

export default function AdminShipmentsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [shipmentsResult] = useQuery({
    query: GET_ADMIN_SHIPMENTS,
    variables: { q: search, page, perPage: 20 },
  });

  const shipments = shipmentsResult.data?.adminShipments?.data || [];
  const paginatorInfo = shipmentsResult.data?.adminShipments?.paginatorInfo;
  const loading = shipmentsResult.fetching;

  const gotoPage = (p: number) => {
    if (!paginatorInfo) return;
    const target = Math.max(1, Math.min(p, paginatorInfo.lastPage));
    setPage(target);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shipments</h2>
        <Input
          placeholder="Search shipments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {loading && <p>Loading shipments...</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-3">Tracking #</th>
                <th className="p-3">Order #</th>
                <th className="p-3">Carrier</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment: any) => (
                <tr key={shipment.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">{shipment.trackingNumber}</td>
                  <td className="p-3">{shipment.order?.orderNumber}</td>
                  <td className="p-3">{shipment.carrier}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(shipment.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline">Track</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {paginatorInfo && paginatorInfo.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => gotoPage(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm">
            Page {paginatorInfo.currentPage} of {paginatorInfo.lastPage}
          </span>
          <Button size="sm" variant="outline" onClick={() => gotoPage(page + 1)} disabled={page === paginatorInfo.lastPage}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
