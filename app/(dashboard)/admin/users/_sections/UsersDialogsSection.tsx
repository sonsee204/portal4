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

import { CreateUserDialog } from '../_components/CreateUserDialog';
import { ProvisionPlayerDialog } from '../_components/ProvisionPlayerDialog';
import type { UsersPageActions } from '../_hooks/useUsersPageActions';
import type { UsersPageData } from '../_hooks/useUsersPageData';

interface UsersDialogsSectionProps {
  data: UsersPageData;
  actions: UsersPageActions;
}

export function UsersDialogsSection({
  data,
  actions,
}: UsersDialogsSectionProps) {
  const {
    showCreateDialog,
    setShowCreateDialog,
    showProvisionDialog,
    setShowProvisionDialog,
  } = data;

  return (
    <>
      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={actions.handleCreateSuccess}
      />

      <ProvisionPlayerDialog
        open={showProvisionDialog}
        onClose={() => setShowProvisionDialog(false)}
        onSuccess={actions.handleCreateSuccess}
      />
    </>
  );
}
