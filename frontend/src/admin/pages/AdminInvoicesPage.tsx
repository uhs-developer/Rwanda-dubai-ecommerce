import { useQuery } from 'urql';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { GET_ADMIN_INVOICES } from '../../graphql/admin';

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [currency, setCurrency] = useState('');
  const [minTotal, setMinTotal] = useState('');
  const [maxTotal, setMaxTotal] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const [invoicesResult] = useQuery({
    query: GET_ADMIN_INVOICES,
    variables: {
      q: search || undefined,
      status: status || undefined,
      currency: currency || undefined,
      minTotal: minTotal ? parseFloat(minTotal) : undefined,
      maxTotal: maxTotal ? parseFloat(maxTotal) : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      perPage: 20,
    },
  });

  const invoices = invoicesResult.data?.adminInvoices?.data || [];
  const paginatorInfo = invoicesResult.data?.adminInvoices?.paginatorInfo;
  const loading = invoicesResult.fetching;

  const gotoPage = (p: number) => {
    if (!paginatorInfo) return;
    const target = Math.max(1, Math.min(p, paginatorInfo.lastPage));
    setPage(target);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setCurrency('');
    setMinTotal('');
    setMaxTotal('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          <select className="h-9 border rounded px-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="void">Void</option>
          </select>
          <Input placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-24" />
          <Input placeholder="Min total" type="number" value={minTotal} onChange={(e) => setMinTotal(e.target.value)} className="w-28" />
          <Input placeholder="Max total" type="number" value={maxTotal} onChange={(e) => setMaxTotal(e.target.value)} className="w-28" />
          <Input placeholder="From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36" />
          <Input placeholder="To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-36" />
          <Button variant="outline" size="sm" onClick={clearFilters}>Clear</Button>
        </div>
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
