/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { organizerSidebarNav, withProfileSection } from '@/config/navigation';
import { WorkspaceDashboardShell } from '@/components/templates/WorkspaceDashboardShell';

const organizerNavWithProfile = withProfileSection(organizerSidebarNav);

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceDashboardShell workspace="organizer" nav={organizerNavWithProfile}>
      {children}
    </WorkspaceDashboardShell>
  );
}
