import { ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { 
  LayoutDashboard, Package, Tags, Users, FileText, BarChart2, Settings, LogOut, ChevronDown 
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = "Dashboard" }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => (
    <button
      onClick={() => navigate(path)}
      className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted text-left"
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </button>
  );

  const usePersistedOpen = (key: string, initial: boolean) => {
    const [open, setOpen] = useState<boolean>(() => {
      const saved = localStorage.getItem(key);
      return saved === null ? initial : saved === "1";
    });
    useEffect(() => {
      localStorage.setItem(key, open ? "1" : "0");
    }, [key, open]);
    return [open, setOpen] as const;
  };

  const Group = ({
    label,
    children,
    defaultOpen = false,
    activeMatch,
  }: {
    label: string;
    children: ReactNode;
    defaultOpen?: boolean;
    activeMatch?: RegExp;
  }) => {
    const storageKey = `admin_nav_open_${label.toLowerCase().replace(/\\s+/g, "_")}`;
    const derivedDefault = useMemo(() => {
      if (activeMatch) {
        return activeMatch.test(location.pathname) || defaultOpen;
      }
      return defaultOpen;
    }, [activeMatch, defaultOpen, location.pathname]);
    const [open, setOpen] = usePersistedOpen(storageKey, derivedDefault);
    const isActive = activeMatch ? activeMatch.test(location.pathname) : false;
    return (
      <div className="rounded-md">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted text-left ${isActive ? "bg-muted" : ""}`}
        >
          <span className="text-sm font-medium">{label}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && <div className="pl-2 mt-1 space-y-1">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="border-r min-h-screen p-4">
          <div className="mb-6">
            <div className="text-lg font-semibold">Admin Console</div>
            <div className="text-xs text-muted-foreground">{user?.name}</div>
          </div>

          <nav className="space-y-2">
            <NavItem icon={LayoutDashboard} label="Overview" path="/admin" />

            <Group label="Catalog" activeMatch={/^\/admin\/(products|categories)/}>
              <NavItem icon={Package} label="Products" path="/admin/products" />
              <NavItem icon={Tags} label="Categories" path="/admin/categories" />
            </Group>

            <Group label="Sales" activeMatch={/^\/admin\/orders/}>
              <NavItem icon={FileText} label="Orders" path="/admin/orders" />
            </Group>

            <Group label="Content" activeMatch={/^\/admin\/(pages|blocks)/}>
              <NavItem icon={FileText} label="Pages" path="/admin/pages" />
              <NavItem icon={FileText} label="Blocks" path="/admin/blocks" />
            </Group>

            <Group label="Customers" activeMatch={/^\/admin\/users/}>
              <NavItem icon={Users} label="Users" path="/admin/users" />
            </Group>

            <Group label="Analytics" activeMatch={/^\/admin\/analytics/} defaultOpen={false}>
              <NavItem icon={BarChart2} label="Analytics" path="/admin/analytics" />
            </Group>

            <Group label="System" activeMatch={/^\/admin\/(cache)/} defaultOpen={false}>
              <NavItem icon={Settings} label="Cache Management" path="/admin/cache" />
            </Group>

            <Group label="Users & Access" activeMatch={/^\/admin\/(admin-users)/} defaultOpen={false}>
              <NavItem icon={Users} label="Admin Users" path="/admin/admin-users" />
            </Group>

            <Group label="Account" activeMatch={/^\/admin\/(profile|settings)/} defaultOpen={false}>
              <NavItem icon={Settings} label="Profile & Settings" path="/admin/profile" />
            </Group>

            <Group label="Settings" activeMatch={/^\/admin\/settings/} defaultOpen={false}>
              <NavItem icon={Settings} label="Settings" path="/admin/settings" />
            </Group>
          </nav>

          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={() => logout().then(() => navigate('/'))}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        {/* Content */}
        <section className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
            <Button variant="outline" onClick={() => navigate('/')}>View Storefront</Button>
          </div>
          <Card className="p-4">
            {children}
          </Card>
        </section>
      </div>
    </div>
  );
}

