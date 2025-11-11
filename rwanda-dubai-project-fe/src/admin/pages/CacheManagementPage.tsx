import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { toast } from "sonner";

export default function CacheManagementPage() {
  const [clearing, setClearing] = useState(false);

  const clearFrontendCache = async () => {
    setClearing(true);
    try {
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Frontend cache cleared");
    } catch {
      toast.error("Failed to clear cache");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cache Management</h2>
      <Card className="p-4 space-y-3">
        <div className="text-sm text-muted-foreground">
          Manage cache for faster performance. Frontend cache clears local storage and session data. Backend cache integration will be added next.
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={clearFrontendCache} disabled={clearing}>
            {clearing ? "Clearing…" : "Clear Frontend Cache"}
          </Button>
          <Button variant="outline" disabled title="Clear Backend Cache (coming soon)">
            Clear Backend Cache
          </Button>
          <Button variant="outline" disabled title="Reindex (coming soon)">
            Reindex
          </Button>
        </div>
      </Card>
    </div>
  );
}


