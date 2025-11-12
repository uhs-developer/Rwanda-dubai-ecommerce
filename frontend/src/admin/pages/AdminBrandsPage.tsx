import { useQuery, useMutation } from 'urql';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { GET_ADMIN_BRANDS, CREATE_BRAND, UPDATE_BRAND, DELETE_BRAND } from '../../graphql/admin';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

export default function AdminBrandsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [slugEdited, setSlugEdited] = useState(false);

  // Query
  const [brandsResult, reexecuteQuery] = useQuery({
    query: GET_ADMIN_BRANDS,
    variables: { q: search, page, perPage: 20 },
  });

  // Mutations
  const [, createBrandMutation] = useMutation(CREATE_BRAND);
  const [, updateBrandMutation] = useMutation(UPDATE_BRAND);
  const [, deleteBrandMutation] = useMutation(DELETE_BRAND);

  const brands = brandsResult.data?.adminBrands?.data || [];
  const paginatorInfo = brandsResult.data?.adminBrands?.paginatorInfo;
  const loading = brandsResult.fetching;

  // Auto-generate slug from name when creating/editing if user hasn't edited slug
  useEffect(() => {
    if (!formData.name) return;
    if (slugEdited) return;
    const auto = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug: auto }));
  }, [formData.name, slugEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const result = await updateBrandMutation({
        id: editingId,
        input: {
          name: formData.name,
          slug: formData.slug || undefined,
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'Failed to update brand');
      } else {
        toast.success('Brand updated successfully');
        setEditingId(null);
        setFormData({ name: '', slug: '' });
        setIsCreating(false);
        setSlugEdited(false);
        reexecuteQuery({ requestPolicy: 'network-only' });
      }
    } else {
      const result = await createBrandMutation({
        input: {
          name: formData.name,
          slug: formData.slug || undefined,
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'Failed to create brand');
      } else {
        toast.success('Brand created successfully');
        setIsCreating(false);
        setFormData({ name: '', slug: '' });
        setSlugEdited(false);
        reexecuteQuery({ requestPolicy: 'network-only' });
      }
    }
  };

  const handleEdit = (brand: any) => {
    setEditingId(brand.id);
    setFormData({
      name: brand.name,
      slug: brand.slug,
    });
    setSlugEdited(true);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand? This action cannot be undone.')) return;

    const result = await deleteBrandMutation({ id });
    if (result.error) {
      toast.error(result.error.message || 'Failed to delete brand');
    } else {
      toast.success('Brand deleted successfully');
      reexecuteQuery({ requestPolicy: 'network-only' });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '', slug: '' });
    setSlugEdited(false);
  };

  const gotoPage = (p: number) => {
    if (!paginatorInfo) return;
    const target = Math.max(1, Math.min(p, paginatorInfo.lastPage));
    setPage(target);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Brands</h1>
          <p className="text-muted-foreground">
            Manage product brands
          </p>
        </div>

        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Brand' : 'Create New Brand'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Apple, Samsung"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setSlugEdited(true);
                  }}
                  placeholder="auto-generated-slug"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to auto-generate from name
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit">
                {editingId ? 'Update Brand' : 'Create Brand'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brands..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1"
          />
        </div>
      </Card>

      {/* Brands List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Slug</th>
                <th className="text-left p-4 font-medium">Created</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && brands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Loading brands...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No brands found. Create your first brand to get started.
                  </td>
                </tr>
              ) : (
                brands.map((brand: any) => (
                  <tr key={brand.id} className="border-t hover:bg-muted/30">
                    <td className="p-4 text-sm text-muted-foreground">{brand.id}</td>
                    <td className="p-4 font-medium">{brand.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{brand.slug}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(brand)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(brand.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginatorInfo && paginatorInfo.lastPage > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {paginatorInfo.currentPage} of {paginatorInfo.lastPage} ({paginatorInfo.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => gotoPage(paginatorInfo.currentPage - 1)}
                disabled={paginatorInfo.currentPage === 1}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => gotoPage(paginatorInfo.currentPage + 1)}
                disabled={paginatorInfo.currentPage === paginatorInfo.lastPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
