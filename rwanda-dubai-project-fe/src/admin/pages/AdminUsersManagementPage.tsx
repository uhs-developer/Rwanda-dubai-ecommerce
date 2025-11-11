import { useQuery, useMutation } from 'urql';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { GET_ADMIN_USERS, GET_ADMIN_ROLES, DELETE_ADMIN_USER } from '../../graphql/admin';

export default function AdminUsersManagementPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [usersResult, reexecuteUsersQuery] = useQuery({
    query: GET_ADMIN_USERS,
    variables: { q: search, page, perPage: 20 },
  });

  const [rolesResult] = useQuery({ query: GET_ADMIN_ROLES });

  const [, deleteUserMutation] = useMutation(DELETE_ADMIN_USER);

  const users = usersResult.data?.adminUsers?.data || [];
  const paginatorInfo = usersResult.data?.adminUsers?.paginatorInfo;
  const roles = rolesResult.data?.adminRoles || [];
  const loading = usersResult.fetching;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin user?')) return;
    
    const result = await deleteUserMutation({ id });
    if (result.error) {
      toast.error(result.error.message || 'Failed to delete user');
    } else {
      toast.success('Admin user deleted successfully');
      reexecuteUsersQuery({ requestPolicy: 'network-only' });
    }
  };

  const gotoPage = (p: number) => {
    if (!paginatorInfo) return;
    const target = Math.max(1, Math.min(p, paginatorInfo.lastPage));
    setPage(target);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Admin Users & Roles</h2>
        
        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Search admin users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button>Create Admin User</Button>
        </div>

        {loading && <p>Loading users...</p>}

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
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      {user.roles?.map((role: any) => (
                        <span key={role.id} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                          {role.name}
                        </span>
                      ))}
                    </td>
                    <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {paginatorInfo && paginatorInfo.lastPage > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
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

      <div>
        <h3 className="text-xl font-semibold mb-4">Available Roles</h3>
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role: any) => (
              <div key={role.id} className="border rounded p-3">
                <h4 className="font-semibold">{role.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {role.permissions?.length || 0} permissions
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
