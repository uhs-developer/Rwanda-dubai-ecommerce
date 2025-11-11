import { Card } from "../../components/ui/card";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Orders</h2>
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">
          Orders listing is being migrated to GraphQL. Backend resolver and API will be connected next.
        </div>
      </Card>
    </div>
  );
}


