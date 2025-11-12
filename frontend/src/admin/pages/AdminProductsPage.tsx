import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import ProductService, { Product, getProductImageUrl } from "../../services/product";
import { Input } from "../../components/ui/input";
import { formatPrice } from "../../services/product";
import { toast } from "sonner";
import { apiRequest } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<{ current_page: number; last_page: number; per_page: number } | null>(null);
  const [page, setPage] = useState<number>(1);

  const loadFilters = async () => {
    try {
      const res = await ProductService.getFilterOptions();
      if (res?.success) {
        setCategories(res.data?.categories || []);
        setBrands(res.data?.brands || []);
      }
    } catch {
      // no-op
    }
  };

  const load = async (query = "", toPage = page) => {
    setLoading(true);
    try {
      const baseFilters: any = {
        per_page: 20,
        page: toPage,
      };
      if (categoryId) baseFilters.category_id = Number(categoryId);
      if (brandId) baseFilters.brand_id = Number(brandId);
      if (status) baseFilters.status = status; // backend reads 'enabled'/'disabled'
      const res = query
        ? await ProductService.searchProducts(query, baseFilters)
        : await ProductService.getProducts(baseFilters);
      if (res?.success) {
        setProducts(res.data || []);
        if ((res as any).pagination) {
          setPagination((res as any).pagination);
          setPage((res as any).pagination.current_page);
        }
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilters().finally(load);
  }, []);

  // Auto-apply filters with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      load(q, 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [q, categoryId, brandId, status]);

  const gotoPage = (p: number) => {
    if (!pagination) return;
    const target = Math.max(1, Math.min(p, pagination.last_page));
    load(q, target);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await apiRequest('DELETE', `/products/${id}`);
      if (res?.success) {
        toast.success("Product deleted");
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error(res?.message || "Failed to delete");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search products…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-9"
          />
          <select className="h-9 border rounded px-2 text-sm" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="h-9 border rounded px-2 text-sm" value={brandId} onChange={e => setBrandId(e.target.value)}>
            <option value="">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select className="h-9 border rounded px-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          <Button variant="outline" onClick={() => navigate('/admin/products/new')}>Add Product</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2">Image</th>
                <th className="text-left px-4 py-2">SKU</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Brand</th>
                <th className="text-left px-4 py-2">Category</th>
                <th className="text-right px-4 py-2">Price</th>
                <th className="text-right px-4 py-2">Qty</th>
                <th className="text-right px-4 py-2">Status</th>
                <th className="text-right px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6 text-center text-muted-foreground" colSpan={7}>Loading…</td></tr>
              ) : products.length === 0 ? (
                <tr><td className="px-4 py-6 text-center text-muted-foreground" colSpan={7}>No products</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">
                      <img
                        src={getProductImageUrl(p)}
                        alt={p.name}
                        className="h-10 w-10 rounded object-cover border"
                      />
                    </td>
                    <td className="px-4 py-2"><code>{(p as any).sku || p.slug}</code></td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <strong className="font-medium">{p.name}</strong>
                        {p.brand?.name && <small className="text-muted-foreground">{p.brand.name}</small>}
                      </div>
                    </td>
                    <td className="px-4 py-2">{p.brand?.name}</td>
                    <td className="px-4 py-2">{p.category?.name}</td>
                    <td className="px-4 py-2 text-right">{formatPrice(p.price)}</td>
                    <td className="px-4 py-2 text-right">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                        ((p as any).stock_quantity ?? 0) > 10 ? 'bg-green-100 text-green-700' :
                        ((p as any).stock_quantity ?? 0) > 0 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {(p as any).stock_quantity ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                        p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/products/${p.slug}/edit`)} title="Edit">Edit</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} title="Delete">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.current_page} of {pagination.last_page}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => gotoPage(page - 1)} disabled={page <= 1}>Prev</Button>
            <Button variant="outline" size="sm" onClick={() => gotoPage(page + 1)} disabled={page >= pagination.last_page}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}


