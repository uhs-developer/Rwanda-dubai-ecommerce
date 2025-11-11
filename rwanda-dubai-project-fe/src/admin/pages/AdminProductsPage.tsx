import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import ProductService, { Product } from "../../services/product";
import { Input } from "../../components/ui/input";
import { formatPrice } from "../../services/product";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");

  const load = async (query = "") => {
    setLoading(true);
    try {
      const res = query
        ? await ProductService.searchProducts(query)
        : await ProductService.getProducts({ per_page: 50 });
      if (res?.success) setProducts(res.data || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
          <Button variant="outline" onClick={() => load(q)}>Search</Button>
          <Button variant="outline" disabled title="Add product coming soon">Add Product</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Brand</th>
                <th className="text-left px-4 py-2">Category</th>
                <th className="text-right px-4 py-2">Price</th>
                <th className="text-right px-4 py-2">Stock</th>
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
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.brand?.name}</td>
                    <td className="px-4 py-2">{p.category?.name}</td>
                    <td className="px-4 py-2 text-right">{formatPrice(p.price)}</td>
                    <td className="px-4 py-2 text-right">{p.in_stock ? "In stock" : "Out"}</td>
                    <td className="px-4 py-2 text-right">
                      <Button size="sm" variant="ghost" disabled title="Edit coming soon">Edit</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


