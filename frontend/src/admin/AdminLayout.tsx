import { ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { 
  LayoutDashboard, Package, Tags, Users, FileText, BarChart2, Settings, LogOut, ChevronDown,
  ShoppingCart, Truck, FileCheck, Receipt, Tag, UserCircle, Megaphone, Store, RefreshCw, Shield
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = "Dashboard" }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem('admin_sidebar_collapsed') === '1');
  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex ${collapsed ? 'justify-center px-2' : 'items-center gap-3 px-3'} rounded-md py-2 text-left hover:bg-transparent hover:border hover:border-slate-700`}
    >
      <Icon className="h-4 w-4" />
      <span className={`text-sm ${collapsed ? 'hidden' : ''}`}>{label}</span>
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
    icon: Icon,
    children,
    defaultOpen = false,
    activeMatch,
  }: {
    label: string;
    icon?: any;
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
          className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-left hover:bg-transparent hover:border hover:border-slate-700 ${isActive ? "bg-slate-800 border border-slate-700" : ""}`}
        >
          <span className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span className={`text-sm font-medium ${collapsed ? "hidden" : ""}`}>{label}</span>
          </span>
          {!collapsed && <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />}
        </button>
        {open && <div className={`${collapsed ? 'pl-0' : 'pl-2'} mt-1 space-y-1`}>{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={`grid ${collapsed ? 'grid-cols-[72px_1fr]' : 'grid-cols-[260px_1fr]'}`}>
        {/* Sidebar */}
        <aside className="border-r min-h-screen p-4 bg-slate-900 text-slate-100">
          <div className="mb-6 flex items-center justify-between">
            <div className={`${collapsed ? 'hidden' : ''}`}>
              <div className="text-lg font-semibold">Admin Console</div>
              <div className="text-xs opacity-70">{user?.name}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? '»' : '«'}
            </Button>
          </div>

          <nav className={`space-y-2 ${collapsed ? 'overflow-hidden' : ''}`}>
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/admin" />

            <Group icon={ShoppingCart} label="Sales" activeMatch={/^\/admin\/(orders|invoices|credit-memos)/}>
              <NavItem icon={ShoppingCart} label="Orders" path="/admin/orders" />
              <NavItem icon={FileCheck} label="Invoices" path="/admin/invoices" />
              <NavItem icon={Receipt} label="Credit Memos" path="/admin/credit-memos" />
            </Group>

            <Group icon={Package} label="Catalog" activeMatch={/^\/admin\/(products|categories|attributes)/}>
              <NavItem icon={Package} label="Products" path="/admin/products" />
              <NavItem icon={Tags} label="Categories" path="/admin/categories" />
              <NavItem icon={Tag} label="Attributes" path="/admin/attributes" />
            </Group>

            <Group icon={Users} label="Customers" activeMatch={/^\/admin\/(customers|customer-groups)/}>
              <NavItem icon={Users} label="All Customers" path="/admin/customers" />
              <NavItem icon={UserCircle} label="Customer Groups" path="/admin/customer-groups" />
            </Group>

            <Group icon={Truck} label="Shipping" activeMatch={/^\/admin\/(shipping-methods|shipping-routes|shipping-pricing)/}>
              <NavItem icon={Truck} label="Shipping Methods" path="/admin/shipping-methods" />
              <NavItem icon={Truck} label="Shipping Routes" path="/admin/shipping-routes" />
              <NavItem icon={Tag} label="Pricing Config" path="/admin/shipping-pricing" />
            </Group>

            <Group icon={Megaphone} label="Marketing" activeMatch={/^\/admin\/promotions/}>
              <NavItem icon={Megaphone} label="Promotions" path="/admin/promotions" />
            </Group>

            <Group icon={FileText} label="Content" activeMatch={/^\/admin\/(pages|blocks|content)/}>
              <NavItem icon={FileText} label="Page Content" path="/admin/content" />
              <NavItem icon={FileText} label="Pages" path="/admin/pages" />
              <NavItem icon={FileText} label="Blocks" path="/admin/blocks" />
            </Group>

            <Group icon={Store} label="Stores" activeMatch={/^\/admin\/(configuration|currency)/}>
              <NavItem icon={Store} label="Configuration" path="/admin/configuration" />
              <NavItem icon={Store} label="Currency" path="/admin/currency" />
            </Group>

            <Group icon={Settings} label="System" activeMatch={/^\/admin\/(cache|admin-users)/}>
              <NavItem icon={RefreshCw} label="Cache Management" path="/admin/cache" />
              <NavItem icon={Shield} label="Admin Users" path="/admin/admin-users" />
            </Group>

            <Group icon={Settings} label="Account" activeMatch={/^\/admin\/profile/}>
              <NavItem icon={Settings} label="Profile" path="/admin/profile" />
            </Group>
          </nav>

          <div className="mt-6">
            <Button 
              variant="outline" 
              className={`w-full flex items-center gap-2 border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 ${collapsed ? 'justify-center px-2' : ''}`}
              onClick={() => logout().then(() => navigate('/'))}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign out</span>}
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

