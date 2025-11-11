import { useQuery, useMutation } from 'urql';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import {
  GET_SHIPPING_ROUTES,
  CREATE_SHIPPING_ROUTE,
  UPDATE_SHIPPING_ROUTE,
  DELETE_SHIPPING_ROUTE,
} from '../../graphql/admin';

export default function AdminShippingRoutesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    originCountry: '',
    originCity: '',
    destinationCountry: '',
    destinationCity: '',
    transitPoints: [] as string[],
    transitPointsInput: '',
    description: '',
    isActive: true,
    sortOrder: 0,
  });

  // Query
  const [routesResult, reexecuteQuery] = useQuery({
    query: GET_SHIPPING_ROUTES,
    variables: {},
  });

  // Mutations
  const [, createMutation] = useMutation(CREATE_SHIPPING_ROUTE);
  const [, updateMutation] = useMutation(UPDATE_SHIPPING_ROUTE);
  const [, deleteMutation] = useMutation(DELETE_SHIPPING_ROUTE);

  const routes = routesResult.data?.shippingRoutes || [];
  const loading = routesResult.fetching;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse transit points from comma-separated string
    const transitPoints = formData.transitPointsInput
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p);

    const input = {
      name: formData.name,
      code: formData.code,
      originCountry: formData.originCountry,
      originCity: formData.originCity || undefined,
      destinationCountry: formData.destinationCountry,
      destinationCity: formData.destinationCity || undefined,
      transitPoints: transitPoints.length > 0 ? transitPoints : undefined,
      description: formData.description || undefined,
      isActive: formData.isActive,
      sortOrder: formData.sortOrder,
    };

    if (editingId) {
      const result = await updateMutation({ id: editingId, input });

      if (result.error) {
        toast.error(result.error.message || 'Failed to update shipping route');
      } else {
        toast.success('Shipping route updated successfully');
        handleCancel();
        reexecuteQuery({ requestPolicy: 'network-only' });
      }
    } else {
      const result = await createMutation({ input });

      if (result.error) {
        toast.error(result.error.message || 'Failed to create shipping route');
      } else {
        toast.success('Shipping route created successfully');
        handleCancel();
        reexecuteQuery({ requestPolicy: 'network-only' });
      }
    }
  };

  const handleEdit = (route: any) => {
    setEditingId(route.id);
    setFormData({
      name: route.name,
      code: route.code,
      originCountry: route.originCountry,
      originCity: route.originCity || '',
      destinationCountry: route.destinationCountry,
      destinationCity: route.destinationCity || '',
      transitPoints: route.transitPoints || [],
      transitPointsInput: (route.transitPoints || []).join(', '),
      description: route.description || '',
      isActive: route.isActive,
      sortOrder: route.sortOrder,
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipping route?')) return;

    const result = await deleteMutation({ id });
    if (result.error) {
      toast.error(result.error.message || 'Failed to delete shipping route');
    } else {
      toast.success('Shipping route deleted successfully');
      reexecuteQuery({ requestPolicy: 'network-only' });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      name: '',
      code: '',
      originCountry: '',
      originCity: '',
      destinationCountry: '',
      destinationCity: '',
      transitPoints: [],
      transitPointsInput: '',
      description: '',
      isActive: true,
      sortOrder: 0,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shipping Routes</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>Add Shipping Route</Button>
        )}
      </div>

      {isCreating && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dubai to Kigali via Mombasa"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code *</label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., dubai_mombasa_kigali"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Origin Country (Code) *
                </label>
                <Input
                  value={formData.originCountry}
                  onChange={(e) =>
                    setFormData({ ...formData, originCountry: e.target.value })
                  }
                  placeholder="e.g., AE (for UAE)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Origin City</label>
                <Input
                  value={formData.originCity}
                  onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
                  placeholder="e.g., Dubai"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Destination Country (Code) *
                </label>
                <Input
                  value={formData.destinationCountry}
                  onChange={(e) =>
                    setFormData({ ...formData, destinationCountry: e.target.value })
                  }
                  placeholder="e.g., RW (for Rwanda)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Destination City</label>
                <Input
                  value={formData.destinationCity}
                  onChange={(e) =>
                    setFormData({ ...formData, destinationCity: e.target.value })
                  }
                  placeholder="e.g., Kigali"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Transit Points (comma-separated)
              </label>
              <Input
                value={formData.transitPointsInput}
                onChange={(e) =>
                  setFormData({ ...formData, transitPointsInput: e.target.value })
                }
                placeholder="e.g., Mombasa, Kampala"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter city names separated by commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full h-20 border rounded px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this route"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                id="isActive"
              />
              <label htmlFor="isActive" className="text-sm">
                Active
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading && <p>Loading shipping routes...</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Route</th>
                <th className="p-3">Transit Points</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route: any) => (
                <tr key={route.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">{route.id}</td>
                  <td className="p-3 font-medium">{route.name}</td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div>
                        {route.originCity || route.originCountry} →{' '}
                        {route.destinationCity || route.destinationCountry}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {route.originCountry} → {route.destinationCountry}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {route.transitPoints && route.transitPoints.length > 0
                      ? route.transitPoints.join(', ')
                      : '-'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        route.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {route.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(route)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(route.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
