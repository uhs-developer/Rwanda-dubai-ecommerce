import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  User as UserIcon, 
  Package, 
  Settings, 
  LogOut,
  ChevronDown,
  Shield
} from "lucide-react";
import { User } from "../services/auth";
import { 
  isSuperAdmin, 
  hasAdminAccess, 
  getPrimaryRole,
  canAccessAdminDashboard,
  canAccessSuperAdminDashboard
} from "../utils/roleBasedRouting";

interface UserAccountDropdownProps {
  user: User;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
}

export function UserAccountDropdown({ user, onLogout, onNavigate }: UserAccountDropdownProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userRole = getPrimaryRole(user);
  const isUserSuperAdmin = canAccessSuperAdminDashboard(user);
  const hasUserAdminAccess = canAccessAdminDashboard(user);
  const isUserEditor = user.roles?.some(role => role.slug === 'editor') || false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{userRole}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* User Info Header */}
        <div className="flex items-center gap-3 p-3 bg-muted/50">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <span className="text-xs text-blue-600 font-medium">{userRole}</span>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Menu Items */}
        <DropdownMenuItem onClick={() => onNavigate?.('account-dashboard')}>
          <UserIcon className="h-4 w-4 mr-3" />
          Customer Dashboard
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onNavigate?.('order-history')}>
          <Package className="h-4 w-4 mr-3" />
          Order History
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </DropdownMenuItem>
        
        {/* Editor Dashboard Link - Show for editors */}
        {isUserEditor && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate?.('editor-dashboard')}>
              <Shield className="h-4 w-4 mr-3" />
              Editor Dashboard
            </DropdownMenuItem>
          </>
        )}

        {/* Super Admin Link - Only show for super admins */}
        {isUserSuperAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate?.('super-admin')}>
              <Shield className="h-4 w-4 mr-3" />
              Super Admin Dashboard
            </DropdownMenuItem>
          </>
        )}

        {/* Admin Dashboard Link - Show for admins and managers (but not editors or super admins) */}
        {hasUserAdminAccess && !isUserSuperAdmin && !isUserEditor && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate?.('admin-dashboard')}>
              <Shield className="h-4 w-4 mr-3" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
