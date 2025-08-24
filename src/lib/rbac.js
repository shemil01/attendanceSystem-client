export const ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE'
};

export function hasPermission(userRole, requiredRole) {
  if (requiredRole === ROLES.ADMIN) {
    return userRole === ROLES.ADMIN;
  }
  return true; // EMPLOYEE can access both EMPLOYEE and ADMIN content if explicitly allowed
}

export function canAccess(userRole, allowedRoles) {
  return allowedRoles.includes(userRole);
}

// Component wrapper for role-based rendering
export function withRole(Component, allowedRoles) {
  return function WithRoleComponent(props) {
    const { data: session } = useSession();
    
    if (!session || !canAccess(session.user.role, allowedRoles)) {
      return null;
    }
    
    return <Component {...props} />;
  };
}