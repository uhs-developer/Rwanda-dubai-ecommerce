import { User } from '../services/auth';

export interface RoleBasedRoute {
  path: string;
  label: string;
  description: string;
  icon?: string;
}

export const ROLE_ROUTES = {
  'super-admin': {
    defaultPath: '/super-admin',
    routes: [
      { path: '/super-admin', label: 'Super Admin Dashboard', description: 'System administration and management' },
      { path: '/account', label: 'Account Settings', description: 'Personal account management' },
    ]
  },
  'admin': {
    defaultPath: '/admin-dashboard',
    routes: [
      { path: '/admin-dashboard', label: 'Admin Dashboard', description: 'Administrative tools and management' },
      { path: '/account', label: 'Account Settings', description: 'Personal account management' },
    ]
  },
  'editor': {
    defaultPath: '/admin-dashboard',
    routes: [
      { path: '/admin-dashboard', label: 'Editor Dashboard', description: 'Content management and editing' },
      { path: '/account', label: 'Account Settings', description: 'Personal account management' },
    ]
  },
  'manager': {
    defaultPath: '/admin-dashboard',
    routes: [
      { path: '/admin-dashboard', label: 'Manager Dashboard', description: 'Team and project management' },
      { path: '/account', label: 'Account Settings', description: 'Personal account management' },
    ]
  },
  'user': {
    defaultPath: '/account',
    routes: [
      { path: '/account', label: 'Customer Dashboard', description: 'Order history and account management' },
      { path: '/orders', label: 'My Orders', description: 'View and track orders' },
      { path: '/wishlist', label: 'Wishlist', description: 'Saved items and favorites' },
    ]
  }
};

/**
 * Get the appropriate redirect path based on user roles
 */
export function getRoleBasedRedirectPath(user: User | null): string {
  if (!user || !user.roles || user.roles.length === 0) {
    return '/account'; // Default to customer dashboard
  }

  // Check for super-admin first (highest priority)
  if (user.roles.some(role => role.slug === 'super-admin')) {
    return ROLE_ROUTES['super-admin'].defaultPath;
  }

  // Check for admin, editor, or manager (all go to admin dashboard)
  if (user.roles.some(role => ['admin', 'editor', 'manager'].includes(role.slug))) {
    return ROLE_ROUTES['admin'].defaultPath;
  }

  // Default to customer dashboard
  return ROLE_ROUTES['user'].defaultPath;
}

/**
 * Get available routes for a user based on their roles
 */
export function getAvailableRoutes(user: User | null): RoleBasedRoute[] {
  if (!user || !user.roles || user.roles.length === 0) {
    return ROLE_ROUTES['user'].routes;
  }

  // Super admin gets access to everything
  if (user.roles.some(role => role.slug === 'super-admin')) {
    return [
      ...ROLE_ROUTES['super-admin'].routes,
      ...ROLE_ROUTES['admin'].routes,
      ...ROLE_ROUTES['editor'].routes,
      ...ROLE_ROUTES['manager'].routes,
      ...ROLE_ROUTES['user'].routes,
    ];
  }

  // Admin gets access to admin and user routes
  if (user.roles.some(role => role.slug === 'admin')) {
    return [
      ...ROLE_ROUTES['admin'].routes,
      ...ROLE_ROUTES['user'].routes,
    ];
  }

  // Editor gets access to editor and user routes
  if (user.roles.some(role => role.slug === 'editor')) {
    return [
      ...ROLE_ROUTES['editor'].routes,
      ...ROLE_ROUTES['user'].routes,
    ];
  }

  // Manager gets access to manager and user routes
  if (user.roles.some(role => role.slug === 'manager')) {
    return [
      ...ROLE_ROUTES['manager'].routes,
      ...ROLE_ROUTES['user'].routes,
    ];
  }

  // Regular users get customer routes
  return ROLE_ROUTES['user'].routes;
}

/**
 * Check if a user can access a specific path
 */
export function canAccessPath(user: User | null, path: string): boolean {
  const availableRoutes = getAvailableRoutes(user);
  return availableRoutes.some(route => route.path === path);
}

/**
 * Get the user's primary role for display purposes
 */
export function getPrimaryRole(user: User | null): string {
  if (!user || !user.roles || user.roles.length === 0) {
    return 'Customer';
  }

  const rolePriority = ['super-admin', 'admin', 'editor', 'manager', 'user'];
  
  for (const roleSlug of rolePriority) {
    if (user.roles.some(role => role.slug === roleSlug)) {
      return roleSlug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }

  return 'Customer';
}

/**
 * Get the user's primary role slug for logic purposes
 */
export function getPrimaryRoleSlug(user: User | null): string {
  if (!user || !user.roles || user.roles.length === 0) {
    return 'user';
  }

  const rolePriority = ['super-admin', 'admin', 'editor', 'manager', 'user'];
  
  for (const roleSlug of rolePriority) {
    if (user.roles.some(role => role.slug === roleSlug)) {
      return roleSlug;
    }
  }

  return 'user';
}

/**
 * Check if user has any admin-level roles
 */
export function hasAdminAccess(user: User | null): boolean {
  if (!user || !user.roles || user.roles.length === 0) {
    return false;
  }

  return user.roles.some(role => 
    ['super-admin', 'admin', 'editor', 'manager'].includes(role.slug)
  );
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user: User | null): boolean {
  if (!user || !user.roles || user.roles.length === 0) {
    return false;
  }

  return user.roles.some(role => role.slug === 'super-admin');
}
