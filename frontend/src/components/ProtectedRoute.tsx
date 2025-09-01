import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, Lock, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallbackPath?: string;
  showUnauthorized?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath = '/auth',
  showUnauthorized = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasAnyRole, hasAnyPermission } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role requirements
  if (isAuthenticated && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    if (!showUnauthorized) {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have the required role to access this page.
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Required roles:</p>
              <p className="text-sm text-muted-foreground">
                {requiredRoles.join(', ')}
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Your roles:</p>
              <p className="text-sm text-muted-foreground">
                {user?.roles?.map(role => role.name).join(', ') || 'None'}
              </p>
            </div>
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="w-full"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permission requirements
  if (isAuthenticated && requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
    if (!showUnauthorized) {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Insufficient Permissions</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have the required permissions to access this page.
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Required permissions:</p>
              <p className="text-sm text-muted-foreground">
                {requiredPermissions.join(', ')}
              </p>
            </div>
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="w-full"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

// Convenience components for common protection patterns
export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute {...props} requiredRoles={['super-admin', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function SuperAdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute {...props} requiredRoles={['super-admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function EditorRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'>) {
  return (
    <ProtectedRoute {...props} requiredRoles={['editor']}>
      {children}
    </ProtectedRoute>
  );
}

export default ProtectedRoute;
