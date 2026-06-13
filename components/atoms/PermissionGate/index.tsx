/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import type { ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types';
import { canAccess, canAccessAny, type PortalFeature } from '@/lib/permissions';

interface PermissionGateProps {
  children: ReactNode;
  /** Fallback content when access is denied */
  fallback?: ReactNode;
}

interface RoleBasedProps extends PermissionGateProps {
  /** Roles that can see this content */
  roles: UserRole[];
  feature?: never;
  features?: never;
}

interface FeatureBasedProps extends PermissionGateProps {
  /** Feature required to see this content */
  feature: PortalFeature;
  roles?: never;
  features?: never;
}

interface FeaturesBasedProps extends PermissionGateProps {
  /** Any of these features grants access */
  features: PortalFeature[];
  roles?: never;
  feature?: never;
}

type Props = RoleBasedProps | FeatureBasedProps | FeaturesBasedProps;

/**
 * Conditionally render content based on user role or feature access.
 *
 * @example
 * // By roles
 * <PermissionGate roles={['SUPER_ADMIN', 'ADMIN']}>
 *   <AdminPanel />
 * </PermissionGate>
 *
 * @example
 * // By feature
 * <PermissionGate feature="user_management">
 *   <UserManagementSection />
 * </PermissionGate>
 *
 * @example
 * // By any of multiple features
 * <PermissionGate features={['analytics', 'own_analytics']}>
 *   <AnalyticsWidget />
 * </PermissionGate>
 */
export function PermissionGate({ children, fallback = null, ...props }: Props) {
  const userRole = useAuthStore((s) => s.user?.role ?? null);

  let hasAccess = false;

  if ('roles' in props && props.roles) {
    hasAccess = userRole !== null && props.roles.includes(userRole);
  } else if ('feature' in props && props.feature) {
    hasAccess = canAccess(userRole, props.feature);
  } else if ('features' in props && props.features) {
    hasAccess = canAccessAny(userRole, props.features);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
