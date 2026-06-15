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

import { useModerationPageActions } from './_hooks/useModerationPageActions';
import { useModerationPageData } from './_hooks/useModerationPageData';
import { MessageReportsTabSection } from './_sections/MessageReportsTabSection';
import {
  ModerationHeaderSection,
  ModerationStatsSection,
  ModerationTabsSection,
} from './_sections/ModerationOverviewSection';
import { PostReportsTabSection } from './_sections/PostReportsTabSection';
import { UserReportsTabSection } from './_sections/UserReportsTabSection';

export default function ModerationPage() {
  const data = useModerationPageData();
  const actions = useModerationPageActions(data);

  return (
    <>
      <ModerationHeaderSection />
      <ModerationStatsSection data={data} />
      <ModerationTabsSection data={data} />

      {data.activeTab === 'posts' && (
        <PostReportsTabSection data={data} actions={actions} />
      )}
      {data.activeTab === 'users' && (
        <UserReportsTabSection data={data} actions={actions} />
      )}
      {data.activeTab === 'messages' && (
        <MessageReportsTabSection data={data} actions={actions} />
      )}
    </>
  );
}
