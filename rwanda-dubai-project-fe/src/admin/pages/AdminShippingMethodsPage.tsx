import { useQuery, useMutation } from 'urql';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import {
  GET_SHIPPING_METHODS,
  CREATE_SHIPPING_METHOD,
  UPDATE_SHIPPING_METHOD,
  DELETE_SHIPPING_METHOD,
} from '../../graphql/admin';

export default function AdminShippingMethodsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [codeEdited, setCodeEdited] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    carrier: '',
    type: 'land' as 'air' | 'sea' | 'land' | 'express',
    basePrice: 0,
    estimatedDaysMin: 0,
    estimatedDaysMax: 0,
    isActive: true,
    sortOrder: 0,
  });

  // Auto-generate code from name
  useEffect(() => {
    if (!formData.name || codeEdited) return;
    const autoCode = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    setFormData(prev => ({ ...prev, code: autoCode }));
  }, [formData.name, codeEdited]);

  // Query
  const [methodsResult, reexecuteQuery] = useQuery({
    query: GET_SHIPPING_METHODS,
    variables: { isActive: undefined },
  });

  // Mutations
  const [, createMutation] = useMutation(CREATE_SHIPPING_METHOD);
  const [, updateMutation] = useMutation(UPDATE_SHIPPING_METHOD);
  const [, deleteMutation] = useMutation(DELETE_SHIPPING_METHOD);

  const methods = methodsResult.data?.shippingMethods || [];
  const loading = methodsResult.fetching;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const result = await updateMutation({
        id: editingId,
        input: formData,
      });

      if (result.error) {
        let errorMsg = result.error.graphQLErrors?.[0]?.message || result.error.message || 'Failed to update shipping method';

        // Extract more specific error from debugMessage if available
        const debugMsg = result.error.graphQLErrors?.[0]?.extensions?.debugMessage;
        if (debugMsg) {
          if (debugMsg.includes('Duplicate entry') && debugMsg.includes('code_unique')) {
            errorMsg = `A shipping method with this code already exists. Please use a different code.`;
          } else if (debugMsg.includes('Duplicate entry')) {
            errorMsg = `This record already exists. Please use different values.`;
          } else if (debugMsg.includes('SQLSTATE')) {
            errorMsg = debugMsg.split('\n')[0].replace(/SQLSTATE\[\w+\]:\s*/, '');
          }
        }

        toast.error(errorMsg);
        console.error('Update error:', result.error);
      } else {
        toast.success('Shipping method updated successfully');
        handleCancel();
        reexecuteQuery({ requestPolicy: 'network-only' });
      }
    } else {
      const result = await createMutation({
        input: formData,
      });

      if (result.error) {
        let errorMsg = result.error.graphQLErrors?.[0]?.message || result.error.message || 'Failed to create shipping method';

        // Extract more specific error from debugMessage if available
        const debugMsg = result.error.graphQLErrors?.[0]?.extensions?.debugMessage;
        if (debugMsg) {
          if (debugMsg.includes('Duplicate entry') && debugMsg.includes('code_unique')) {
            errorMsg = `A shipping method with this code already exists. Please use a different code.`;
          } else if (debugMsg.includes('Duplicate entry')) {
            errorMsg = `This record already exists. Please use different values.`;
          } else if (debugMsg.includes('SQLSTATE')) {
            // Show first line of SQL error which is usually most descriptive
            errorMsg = debugMsg.split('\n')[0].replace(/SQLSTATE\[\w+\]:\s*/, '');
          }
        }

        toast.error(errorMsg);
        console.error('Create error:', result.error);
      } else {
        toast.success('Shipping method created successfully');
        handleCancel();
        reexecuteQuery({ requestPolicy: 'network-only' });
      }
    }
  };

  const handleEdit = (method: any) => {
    setEditingId(method.id);
    setFormData({
      name: method.name,
      code: method.code,
      description: method.description || '',
      carrier: method.carrier || '',
      type: method.type,
      basePrice: method.basePrice,
      estimatedDaysMin: method.estimatedDaysMin || 0,
      estimatedDaysMax: method.estimatedDaysMax || 0,
      isActive: method.isActive,
      sortOrder: method.sortOrder,
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipping method?')) return;

    const result = await deleteMutation({ id });
    if (result.error) {
      toast.error(result.error.message || 'Failed to delete shipping method');
    } else {
      toast.success('Shipping method deleted successfully');
      reexecuteQuery({ requestPolicy: 'network-only' });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setCodeEdited(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      carrier: '',
      type: 'land',
      basePrice: 0,
      estimatedDaysMin: 0,
      estimatedDaysMax: 0,
      isActive: true,
      sortOrder: 0,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shipping Methods</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>Add Shipping Method</Button>
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
                  placeholder="e.g., Air Cargo Express"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code *</label>
                <Input
                  value={formData.code}
                  onChange={(e) => {
                    setCodeEdited(true);
                    setFormData({ ...formData, code: e.target.value });
                  }}
                  placeholder="auto-generated from name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full h-20 border rounded px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this shipping method"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Carrier</label>
                <Input
                  value={formData.carrier}
                  onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                  placeholder="e.g., DHL, FedEx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  className="w-full h-9 border rounded px-2 text-sm"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  required
                >
                  <option value="air">Air</option>
                  <option value="sea">Sea</option>
                  <option value="land">Land</option>
                  <option value="express">Express</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Base Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Min Delivery Days
                </label>
                <Input
                  type="number"
                  value={formData.estimatedDaysMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDaysMin: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Delivery Days
                </label>
                <Input
                  type="number"
                  value={formData.estimatedDaysMax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDaysMax: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="5"
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
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
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

      {!isCreating && loading && <p>Loading shipping methods...</p>}

      {!isCreating && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Carrier</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3">Delivery Days</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((method: any) => (
                  <tr key={method.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{method.id}</td>
                    <td className="p-3 font-medium">{method.name}</td>
                    <td className="p-3 font-mono text-xs">{method.code}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 capitalize">
                        {method.type}
                      </span>
                    </td>
                    <td className="p-3">{method.carrier || '-'}</td>
                    <td className="p-3">${method.basePrice}</td>
                    <td className="p-3">
                      {method.estimatedDaysMin}-{method.estimatedDaysMax} days
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          method.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {method.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(method)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(method.id)}
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
      )}
    </div>
  );
}
