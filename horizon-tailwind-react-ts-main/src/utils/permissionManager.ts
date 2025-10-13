// Permission management system
import { RouteConfig } from '../routes/routeConfig';

export type Permission = {
  module: string;
  resource?: string;
  action?: 'read' | 'write' | 'delete' | 'manage';
};

export type UserPermissions = {
  roles: string[];
  permissions: Permission[];
};

class PermissionManager {
  private static instance: PermissionManager;
  private userPermissions: UserPermissions | null = null;

  private constructor() {}

  static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager();
    }
    return PermissionManager.instance;
  }

  setUserPermissions(permissions: UserPermissions) {
    this.userPermissions = permissions;
  }

  clearPermissions() {
    this.userPermissions = null;
  }

  hasPermission(requiredPermission: Permission): boolean {
    if (!this.userPermissions) return false;

    // Super admin has all permissions
    if (this.userPermissions.roles.includes('SUPER_ADMIN')) {
      return true;
    }

    return this.userPermissions.permissions.some(permission => 
      this.matchPermission(permission, requiredPermission)
    );
  }

  hasRouteAccess(route: RouteConfig): boolean {
    // Public routes
    if (!route.permission && !route.roles) {
      return true;
    }

    // Check role-based access
    if (route.roles && this.userPermissions?.roles) {
      const hasRole = route.roles.some(role => 
        this.userPermissions?.roles.includes(role)
      );
      if (hasRole) return true;
    }

    // Check permission-based access
    if (route.permission) {
      return this.hasPermission(route.permission);
    }

    return false;
  }

  private matchPermission(userPerm: Permission, requiredPerm: Permission): boolean {
    // Module must match
    if (userPerm.module !== requiredPerm.module) {
      return false;
    }

    // If required permission specifies a resource, user must have it
    if (requiredPerm.resource && userPerm.resource !== requiredPerm.resource) {
      return false;
    }

    // If required permission specifies an action, user must have it or 'manage'
    if (requiredPerm.action) {
      return userPerm.action === 'manage' || userPerm.action === requiredPerm.action;
    }

    return true;
  }

  // Helper method to check multiple permissions at once
  hasPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Get filtered routes based on user permissions
  getAuthorizedRoutes(routes: RouteConfig[]): RouteConfig[] {
    return routes.filter(route => this.hasRouteAccess(route));
  }
}

export const permissionManager = PermissionManager.getInstance();

// Hook for permission checks in components
export function usePermission() {
  return {
    hasPermission: (permission: Permission) => permissionManager.hasPermission(permission),
    hasPermissions: (permissions: Permission[]) => permissionManager.hasPermissions(permissions),
    hasRouteAccess: (route: RouteConfig) => permissionManager.hasRouteAccess(route)
  };
}

export default permissionManager;