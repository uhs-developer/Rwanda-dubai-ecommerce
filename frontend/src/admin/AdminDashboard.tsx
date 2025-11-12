import { useEffect } from "react";
import { useProducts } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function AdminDashboard() {
  const { fetchProducts, fetchCategories, fetchBrands, totalProducts } = useProducts();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts({ per_page: 8 });
    fetchCategories();
    fetchBrands();
  }, [fetchProducts, fetchCategories, fetchBrands]);

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalProducts}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{user ? user.roles.length : 0}</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <button className="rounded-md border px-3 py-2 text-left hover:bg-muted">Create Product</button>
            <button className="rounded-md border px-3 py-2 text-left hover:bg-muted">Manage Categories</button>
            <button className="rounded-md border px-3 py-2 text-left hover:bg-muted">View Orders</button>
            <button className="rounded-md border px-3 py-2 text-left hover:bg-muted">Invite User</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

