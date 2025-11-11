import { useQuery, useMutation } from 'urql';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { GET_ADMIN_CUSTOMERS, DELETE_CUSTOMER } from '../../graphql/admin';
import { useNavigate } from 'react-router-dom';

export default function AdminCustomersPageGraphQL() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [customersResult, reexecuteQuery] = useQuery({
    query: GET_ADMIN_CUSTOMERS,
    variables: { q: search, page, perPage: 20 },
  });

  const [, deleteCustomerMutation] = useMutation(DELETE_CUSTOMER);

  const customers = customersResult.data?.adminCustomers?.data || [];
  const paginatorInfo = customersResult.data?.adminCustomers?.paginatorInfo;
  const loading = customersResult.fetching;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    const result = await deleteCustomerMutation({ id });
    if (result.error) {
      toast.error(result.error.message || 'Failed to delete customer');
    } else {
      toast.success('Customer deleted successfully');
      reexecuteQuery({ requestPolicy: 'network-only' });
    }
  };

  const gotoPage = (p: number) => {
    if (!paginatorInfo) return;
    const target = Math.max(1, Math.min(p, paginatorInfo.lastPage));
    setPage(target);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Customers</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {loading && <p>Loading customers...</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Roles</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: any) => (
                <tr key={customer.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">{customer.id}</td>
                  <td className="p-3">{customer.name}</td>
                  <td className="p-3">{customer.email}</td>
                  <td className="p-3">
                    {customer.roles?.map((role: any) => (
                      <span key={role.name} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                        {role.name}
                      </span>
                    ))}
                  </td>
                  <td className="p-3">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/customers/${customer.id}`)}>View</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(customer.id)}>Delete</Button>
                    </div>
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
