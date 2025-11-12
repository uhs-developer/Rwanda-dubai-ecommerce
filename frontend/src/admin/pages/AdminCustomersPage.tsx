import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { apiRequest } from "../../services/api";
import { toast } from "sonner";

type Role = { name: string };
type Customer = { id: number; name: string; email: string; roles?: Role[] };

export default function AdminCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Reuse existing /users endpoint (permission-protected)
        const res = await apiRequest<Customer[]>("GET", "/users");
        if (mounted && res?.success) setCustomers(res.data || []);
      } catch {
        toast.error("Failed to load customers");
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
        <h2 className="text-xl font-semibold">Customers</h2>
        <Button variant="outline" disabled title="Add customer coming soon">Add Customer</Button>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Roles</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6 text-center text-muted-foreground" colSpan={4}>Loading…</td></tr>
              ) : customers.length === 0 ? (
                <tr><td className="px-4 py-6 text-center text-muted-foreground" colSpan={4}>No customers</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-2">{c.id}</td>
                    <td className="px-4 py-2">{c.name}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2">{(c.roles || []).map(r => r.name).join(", ") || "—"}</td>
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


