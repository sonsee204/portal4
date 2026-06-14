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

import { useUsersPageActions } from './_hooks/useUsersPageActions';
import { useUsersPageData } from './_hooks/useUsersPageData';
import { UsersDialogsSection } from './_sections/UsersDialogsSection';
import { UsersHeaderSection } from './_sections/UsersHeaderSection';
import { UsersTableSection } from './_sections/UsersTableSection';

export default function UsersPage() {
  const data = useUsersPageData();
  const actions = useUsersPageActions(data);

  return (
    <>
      <UsersHeaderSection data={data} actions={actions} />
      <UsersTableSection data={data} />
      <UsersDialogsSection data={data} actions={actions} />
    </>
  );
}
