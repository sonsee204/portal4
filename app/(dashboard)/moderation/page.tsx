'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { SearchInput } from '@/components/molecules/SearchInput';
import { Badge } from '@/components/atoms/Badge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ReportListItem } from './_components/ReportListItem';
import { ReportDetail } from './_components/ReportDetail';
import { mockReports } from '@/lib/mock-data';

const filterChips = [
  { label: 'Tất cả', value: 'all', count: 3 },
  { label: 'Ngôn từ thù địch', value: 'hate_speech', count: 1 },
  { label: 'Spam', value: 'spam', count: 1 },
  { label: 'Lừa đảo', value: 'scam', count: 1 },
];

export default function ModerationPage() {
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string>(
    mockReports[0]?._id ?? ''
  );

  const filtered = mockReports.filter(
    (r) => filter === 'all' || r.category === filter
  );
  const selectedReport = mockReports.find((r) => r._id === selectedId);

  return (
    <>
      <PageHeader
        title="Kiểm duyệt nội dung"
        description="Xem xét và xử lý các báo cáo từ cộng đồng."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left panel: list */}
        <GlassPanel card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Báo cáo chờ xử lý</h3>
            <Badge variant="danger">{filtered.length}</Badge>
          </div>
          <SearchInput placeholder="Tìm kiếm..." />
          <FilterChips
            chips={filterChips}
            active={filter}
            onChange={setFilter}
          />
          <div className="space-y-2">
            {filtered.map((r) => (
              <ReportListItem
                key={r._id}
                report={r}
                active={r._id === selectedId}
                onClick={() => setSelectedId(r._id)}
              />
            ))}
            {filtered.length === 0 && (
              <EmptyState
                icon="checkmark-circle-outline"
                title="Không có báo cáo"
                description="Tất cả đã được xử lý."
              />
            )}
          </div>
        </GlassPanel>

        {/* Right panel: detail */}
        <div>
          {selectedReport ? (
            <ReportDetail report={selectedReport} />
          ) : (
            <GlassPanel card>
              <EmptyState
                icon="document-text-outline"
                title="Chọn báo cáo"
                description="Chọn một báo cáo từ danh sách bên trái để xem chi tiết."
              />
            </GlassPanel>
          )}
        </div>
      </div>
    </>
  );
}
