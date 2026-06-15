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

import { use, useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TabGroup } from '@/components/molecules/TabGroup';
import { Select } from '@/components/atoms/Select';
import { QueryState } from '@/components/molecules/QueryState';
import { useTournamentRoutes } from '@/hooks/tournament/useTournamentRoutes';
import { masterScheduleToExcelRows } from '@/lib/tournament/print';
import { TOURNAMENT } from '@/lib/strings';
import { useTournamentPrintPageData } from './_hooks/useTournamentPrintPageData';
import { PrintPreviewFrame } from './_components/PrintPreviewFrame';
import { PRINT_IFRAME_PAGE_STYLE } from './_components/print-page-style';
import { MasterScheduleDocument } from './_components/documents/MasterScheduleDocument';
import {
  AllBracketsDocument,
  BracketDocument,
} from './_components/documents/BracketDocument';
import './_components/print-styles.css';

const PRINT_TABS = [
  { label: TOURNAMENT.LABEL_MASTER_SCHEDULE, value: 'schedule' },
  { label: TOURNAMENT.LABEL_BRACKET_SHEET, value: 'bracket' },
];

const ZOOM_OPTIONS = [
  { label: '75%', value: '0.75' },
  { label: '100%', value: '1' },
  { label: '125%', value: '1.25' },
];

type PrintScope = 'current' | 'all-brackets';

export default function TournamentPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  return <TournamentPrintPageInner tournamentId={tournamentId} />;
}

function TournamentPrintPageInner({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const routes = useTournamentRoutes();
  const printRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState('1');
  const [printScope, setPrintScope] = useState<PrintScope>('current');
  const data = useTournamentPrintPageData(tournamentId);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${data.tournament?.title ?? 'giai-dau'}-tai-lieu`,
    pageStyle: PRINT_IFRAME_PAGE_STYLE,
    onAfterPrint: () => setPrintScope('current'),
  });

  const handleExportExcel = useCallback(() => {
    if (!data.masterScheduleDoc) return;
    const rows = masterScheduleToExcelRows(data.masterScheduleDoc);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lịch thi đấu');
    const slug = (data.tournament?.title ?? 'giai-dau')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const date = new Date().toISOString().split('T')[0]!;
    XLSX.writeFile(wb, TOURNAMENT.EXPORT_SCHEDULE_FILENAME(slug, date));
  }, [data.masterScheduleDoc, data.tournament?.title]);

  const categoryOptions = data.categories.map((c) => ({
    label: data.readiness.drawnCategoryIds.includes(c._id)
      ? c.title
      : `${c.title} (chưa bốc thăm)`,
    value: c._id,
  }));

  const allBracketDocs = data.drawnBracketDocs.map((x) => x.doc);
  const tournamentTitle = data.tournament?.title ?? '';

  const previewContent =
    data.activeTab === 'schedule' && data.masterScheduleDoc ? (
      <MasterScheduleDocument doc={data.masterScheduleDoc} />
    ) : data.activeTab === 'bracket' && data.activeBracketDoc ? (
      <BracketDocument
        doc={data.activeBracketDoc}
        tournamentTitle={tournamentTitle}
      />
    ) : null;

  const printContent =
    printScope === 'all-brackets' && allBracketDocs.length > 0 ? (
      <AllBracketsDocument
        docs={allBracketDocs}
        tournamentTitle={tournamentTitle}
      />
    ) : (
      previewContent
    );

  const canPrintCurrent =
    data.activeTab === 'schedule'
      ? Boolean(data.masterScheduleDoc?.sections.length)
      : Boolean(data.activeBracketDoc);

  const triggerPrint = (scope: PrintScope) => {
    flushSync(() => setPrintScope(scope));
    handlePrint();
  };

  return (
    <>
      <PageHeader
        title={TOURNAMENT.LABEL_PRINT_DOCUMENTS}
        description="Xem trước, in hoặc xuất lịch thi đấu và sơ đồ thi đấu."
      >
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={() => router.push(routes.detail(tournamentId))}
        >
          Quay lại
        </Button>
      </PageHeader>

      <QueryState
        loading={data.loading && !data.tournament}
        error={data.error}
        empty={!data.tournament}
        emptyMessage="Không tìm thấy giải đấu."
      >
        <div className="no-print mt-4 space-y-4">
          <TabGroup
            tabs={PRINT_TABS}
            active={data.activeTab}
            onChange={(v) => data.setActiveTab(v as 'schedule' | 'bracket')}
          />

          {data.readiness.unscheduledCount > 0 ? (
            <GlassPanel card className="border-amber-500/30 bg-amber-500/5">
              <p className="text-heading text-sm">
                {TOURNAMENT.PRINT_UNSCHEDULED_WARNING(
                  data.readiness.unscheduledCount,
                )}{' '}
                <button
                  type="button"
                  className="text-primary font-medium underline"
                  onClick={() => router.push(routes.schedule(tournamentId))}
                >
                  Xếp lịch
                </button>
              </p>
            </GlassPanel>
          ) : null}

          <GlassPanel card className="flex flex-wrap items-end gap-3">
            {data.activeTab === 'bracket' ? (
              <div className="min-w-[200px] flex-1">
                <Select
                  label="Nội dung"
                  value={data.selectedCategoryId}
                  onChange={(e) => data.setSelectedCategoryId(e.target.value)}
                  options={categoryOptions}
                />
              </div>
            ) : null}

            <div className="min-w-[120px]">
              <Select
                label="Thu phóng"
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                options={ZOOM_OPTIONS}
              />
            </div>

            <div className="flex flex-wrap gap-2 pb-1">
              <Button
                size="sm"
                iconLeft="print-outline"
                onClick={() => triggerPrint('current')}
                disabled={!canPrintCurrent}
              >
                In
              </Button>
              {data.activeTab === 'schedule' ? (
                <Button
                  size="sm"
                  variant="outline"
                  iconLeft="download-outline"
                  onClick={handleExportExcel}
                  disabled={!data.masterScheduleDoc?.sections.length}
                >
                  Tải Excel
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  iconLeft="print-outline"
                  onClick={() => triggerPrint('all-brackets')}
                  disabled={allBracketDocs.length === 0}
                >
                  In tất cả nội dung
                </Button>
              )}
            </div>
          </GlassPanel>
        </div>

        <div className="mt-4">
          {printContent ? (
            <PrintPreviewFrame zoom={Number(zoom)} printRef={printRef}>
              {printContent}
            </PrintPreviewFrame>
          ) : data.activeTab === 'bracket' ? (
            <GlassPanel card className="no-print">
              <p className="text-muted py-8 text-center text-sm">
                {TOURNAMENT.PRINT_UNDRAWN_CATEGORY}
              </p>
            </GlassPanel>
          ) : null}
        </div>
      </QueryState>
    </>
  );
}
