import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import ProductService, { Category } from "../../services/product";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await ProductService.getCategories();
        if (mounted && res?.success) setCategories(res.data || []);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button variant="outline" disabled title="Add category coming soon">Add Category</Button>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Slug</th>
                <th className="text-left px-4 py-2">Active</th>
                <th className="text-right px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6 text-center text-muted-foreground" colSpan={4}>Loading…</td></tr>
              ) : categories.length === 0 ? (
                <tr><td className="px-4 py-6 text-center text-muted-foreground" colSpan={4}>No categories</td></tr>
              ) : (
                categories.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-2">{c.name}</td>
                    <td className="px-4 py-2">{c.slug}</td>
                    <td className="px-4 py-2">{c.is_active ? "Yes" : "No"}</td>
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


