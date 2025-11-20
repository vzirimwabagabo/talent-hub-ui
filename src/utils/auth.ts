// src/utils/auth.ts

import { AuthUser } from '@/types/auth';

/**
 * Check if user has required role(s)
 * @param user The authenticated user object
 * @param requiredRole Required role (string) or roles (string[])
 */
export const hasRequiredRole = (
  user: AuthUser | null,
  requiredRole?: string | string[]
): boolean => {
  if (!user || !requiredRole) return true; // No role required = OK

  if (typeof requiredRole === 'string') {
    return user.role === requiredRole;
  }

  // Array of allowed roles
  return Array.isArray(requiredRole) && requiredRole.includes(user.role as string);
};