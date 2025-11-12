import { useQuery } from 'urql';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { GET_ADMIN_INVOICES } from '../../graphql/admin';

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [invoicesResult] = useQuery({
    query: GET_ADMIN_INVOICES,
    variables: { q: search, page, perPage: 20 },
  });

  const invoices = invoicesResult.data?.adminInvoices?.data || [];
  const paginatorInfo = invoicesResult.data?.adminInvoices?.paginatorInfo;
  const loading = invoicesResult.fetching;

  const gotoPage = (p: number) => {
    if (!paginatorInfo) return;
    const target = Math.max(1, Math.min(p, paginatorInfo.lastPage));
    setPage(target);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <Input
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {loading && <p>Loading invoices...</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-3">Invoice #</th>
                <th className="p-3">Order #</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice: any) => (
                <tr key={invoice.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">{invoice.invoiceNumber}</td>
                  <td className="p-3">{invoice.order?.orderNumber}</td>
                  <td className="p-3">{invoice.grandTotal} {invoice.currency}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline">View</Button>
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
