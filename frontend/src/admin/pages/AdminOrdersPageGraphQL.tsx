import { useQuery } from 'urql';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { GET_ADMIN_ORDERS } from '../../graphql/admin';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../services/product';

export default function AdminOrdersPageGraphQL() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [currency, setCurrency] = useState('');
  const [minTotal, setMinTotal] = useState('');
  const [maxTotal, setMaxTotal] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [page, setPage] = useState(1);

  const [ordersResult] = useQuery({
    query: GET_ADMIN_ORDERS,
    variables: {
      q: search || undefined,
      status: status || undefined,
      paymentStatus: paymentStatus || undefined,
      paymentMethod: paymentMethod || undefined,
      shippingMethod: shippingMethod || undefined,
      currency: currency || undefined,
      minTotal: minTotal ? parseFloat(minTotal) : undefined,
      maxTotal: maxTotal ? parseFloat(maxTotal) : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      customerEmail: customerEmail || undefined,
      customerName: customerName || undefined,
      page,
      perPage: 20,
    },
  });

  const orders = ordersResult.data?.adminOrders?.data || [];
  const paginatorInfo = ordersResult.data?.adminOrders?.paginatorInfo;
  const loading = ordersResult.fetching;

  const gotoPage = (p: number) => {
    if (!paginatorInfo) return;
    const target = Math.max(1, Math.min(p, paginatorInfo.lastPage));
    setPage(target);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setPaymentStatus('');
    setPaymentMethod('');
    setShippingMethod('');
    setCurrency('');
    setMinTotal('');
    setMaxTotal('');
    setDateFrom('');
    setDateTo('');
    setCustomerEmail('');
    setCustomerName('');
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-40" />
          <Input placeholder="Customer email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-40" />
          <Input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-36" />
          <select className="h-9 border rounded px-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="h-9 border rounded px-2 text-sm" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <Input placeholder="Payment method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-36" />
          <Input placeholder="Shipping method" value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} className="w-36" />
          <Input placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-24" />
          <Input placeholder="Min total" type="number" value={minTotal} onChange={(e) => setMinTotal(e.target.value)} className="w-28" />
          <Input placeholder="Max total" type="number" value={maxTotal} onChange={(e) => setMaxTotal(e.target.value)} className="w-28" />
          <Input placeholder="From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36" />
          <Input placeholder="To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-36" />
          <Button variant="outline" size="sm" onClick={clearFilters}>Clear</Button>
        </div>
      </div>

      {loading && <p>Loading orders...</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">{order.orderNumber}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{order.customer?.name}</div>
                      <div className="text-sm text-muted-foreground">{order.customer?.email}</div>
                    </div>
                  </td>
                  <td className="p-3">{formatPrice(order.grandTotal, order.currency)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                      View
                    </Button>
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
