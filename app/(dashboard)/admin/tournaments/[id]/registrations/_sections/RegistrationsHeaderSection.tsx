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

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { TOURNAMENT } from '@/lib/strings';
import { ExportButton } from '../_components/ExportButton';
import type { RegistrationsPageData } from '../_hooks/useRegistrationsPageData';

interface RegistrationsHeaderSectionProps {
  data: RegistrationsPageData;
}

export function RegistrationsHeaderSection({
  data,
}: RegistrationsHeaderSectionProps) {
  const router = useRouter();
  const {
    tournamentId,
    total,
    totalPages,
    currentPage,
    canImport,
    isSuperAdmin,
    setImportOpen,
    setLateEntryOpen,
  } = data;

  return (
    <PageHeader
      title="Quản lý đăng ký"
      description={`${total} đăng ký${totalPages > 1 ? ` • Trang ${currentPage}/${totalPages}` : ''}`}
    >
      <ExportButton tournamentId={tournamentId} />
      <Button
        variant="outline"
        size="sm"
        iconLeft="cloud-upload-outline"
        disabled={!canImport}
        title={!canImport ? TOURNAMENT.IMPORT_DISABLED_REASON : undefined}
        onClick={() => canImport && setImportOpen(true)}
      >
        Import VĐV
      </Button>
      {isSuperAdmin && (
        <Button
          variant="outline"
          size="sm"
          iconLeft="person-add-outline"
          onClick={() => setLateEntryOpen(true)}
        >
          {TOURNAMENT.LATE_ENTRY_BUTTON}
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        iconLeft="arrow-back-outline"
        onClick={() => router.push('/admin/tournaments')}
      >
        Quay lại
      </Button>
    </PageHeader>
  );
}
