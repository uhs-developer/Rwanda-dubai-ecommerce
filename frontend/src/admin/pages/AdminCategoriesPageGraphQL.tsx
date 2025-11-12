import { useQuery, useMutation } from 'urql';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import { GET_ADMIN_CATEGORIES, CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '../../graphql/admin';

export default function AdminCategoriesPageGraphQL() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', parentId: '', image: '', isActive: true });
  const [slugEdited, setSlugEdited] = useState(false);

  // Query
  const [categoriesResult, reexecuteQuery] = useQuery({
    query: GET_ADMIN_CATEGORIES,
    variables: { q: search, page, perPage: 20 },
  });

  // Mutations
  const [, createCategoryMutation] = useMutation(CREATE_CATEGORY);
  const [, updateCategoryMutation] = useMutation(UPDATE_CATEGORY);
  const [, deleteCategoryMutation] = useMutation(DELETE_CATEGORY);

  const categories = categoriesResult.data?.adminCategories?.data || [];
  const paginatorInfo = categoriesResult.data?.adminCategories?.paginatorInfo;
  const loading = categoriesResult.fetching;

  // Group categories by parent for display, but use all for parent selection
  const topLevelCategories = useMemo(() => {
    return categories.filter((cat: any) => !cat.parentId);
  }, [categories]);

  const categoriesByParent = useMemo(() => {
    const map = new Map<string, any[]>();
    categories.forEach((cat: any) => {
      if (cat.parentId) {
        if (!map.has(cat.parentId)) {
          map.set(cat.parentId, []);
        }
        map.get(cat.parentId)!.push(cat);
      }
    });
    return map;
  }, [categories]);

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
      const result = await updateCategoryMutation({
        id: editingId,
        input: {
          name: formData.name,
          slug: formData.slug || undefined,
          parentId: formData.parentId || undefined,
          image: formData.image || undefined,
          isActive: formData.isActive,
        },
      });
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to update category');
      } else {
        toast.success('Category updated successfully');
        setEditingId(null);
        setFormData({ name: '', slug: '', parentId: '', image: '', isActive: true });
        setIsCreating(false);
        reexecuteQuery({ requestPolicy: 'network-only' });
      }
    } else {
      const result = await createCategoryMutation({
        input: {
          name: formData.name,
          slug: formData.slug || undefined,
          parentId: formData.parentId || undefined,
          image: formData.image || undefined,
          isActive: formData.isActive,
        },
      });
      
      if (result.error) {
        toast.error(result.error.message || 'Failed to create category');
      } else {
        toast.success('Category created successfully');
        setIsCreating(false);
        setFormData({ name: '', slug: '', parentId: '', image: '', isActive: true });
        reexecuteQuery({ requestPolicy: 'network-only' });
      }
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId || '',
      image: category.image || '',
      isActive: category.isActive,
    });
    setSlugEdited(true);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    const result = await deleteCategoryMutation({ id });
    if (result.error) {
      toast.error(result.error.message || 'Failed to delete category');
    } else {
      toast.success('Category deleted successfully');
      reexecuteQuery({ requestPolicy: 'network-only' });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '', slug: '', parentId: '', image: '', isActive: true });
    setSlugEdited(false);
  };

  const gotoPage = (p: number) => {
    if (!paginatorInfo) return;
    const target = Math.max(1, Math.min(p, paginatorInfo.lastPage));
    setPage(target);
  };

  // Recursive function to render nested categories
  const renderChildren = (parentId: string, level: number): JSX.Element[] => {
    const children = categoriesByParent.get(parentId) || [];
    const indent = level * 4;
    const arrow = '→ '.repeat(level);

    return children.flatMap((child: any) => [
      <tr key={child.id} className="border-b hover:bg-muted/50">
        <td className="p-3" style={{ paddingLeft: `${12 + indent * 4}px` }}>{arrow}{child.id}</td>
        <td className="p-3" style={{ paddingLeft: `${12 + indent * 4}px` }}>{child.name}</td>
        <td className="p-3" style={{ paddingLeft: `${12 + indent * 4}px` }}>{child.slug}</td>
        <td className="p-3">{child.parent?.name || '-'}</td>
        <td className="p-3">
          <span className={`px-2 py-1 rounded text-xs ${child.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {child.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="p-3">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleEdit(child)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(child.id)}>Delete</Button>
          </div>
        </td>
      </tr>,
      ...renderChildren(child.id, level + 1)
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Categories</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>Add Category</Button>
          )}
        </div>
      </div>

      {isCreating && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => { setSlugEdited(true); setFormData({ ...formData, slug: e.target.value }); }}
                placeholder="category-slug"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Direct link to category image (shown in Shop by Category section)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Parent Category</label>
              <select
                className="h-9 border rounded px-2 text-sm w-full font-mono"
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              >
                <option value="">None (Top Level)</option>
                {categories
                  .filter((c: any) => c.id !== editingId) // Prevent selecting self as parent
                  .map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.parent ? `  ↳ ${c.name} (under ${c.parent.name})` : c.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Select ONE parent category. Child categories show their location in parentheses.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                id="isActive"
              />
              <label htmlFor="isActive" className="text-sm">Active</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {loading && <p>Loading categories...</p>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Parent</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topLevelCategories.map((category: any) => (
                <>
                  <tr key={category.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{category.id}</td>
                    <td className="p-3 font-medium">{category.name}</td>
                    <td className="p-3">{category.slug}</td>
                    <td className="p-3">-</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                  {renderChildren(category.id, 1)}
                </>
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
