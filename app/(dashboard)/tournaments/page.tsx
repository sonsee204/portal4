'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { BracketView } from './_components/BracketView';
import { mockBracketMatches } from '@/lib/mock-data';

export default function TournamentsPage() {
  return (
    <>
      <PageHeader
        title="Winter Championship 2023"
        description="Main Bracket &bull; Single Elimination"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            iconLeft="funnel-outline"
            iconRight="chevron-down-outline"
          >
            Lọc bộ môn: Tennis
          </Button>
          <Link href="/tournaments/create">
            <Button size="sm" iconLeft="add-outline">
              Tạo Giải Đấu Mới
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* Bracket container — scrollable area matching the static HTML */}
      <div className="no-scrollbar relative mt-6 flex-1 cursor-grab overflow-x-auto overflow-y-auto rounded-xl px-8 pb-8 active:cursor-grabbing">
        <BracketView rounds={mockBracketMatches} />

        {/* Floating zoom controls */}
        <div className="sticky bottom-4 float-right flex flex-col gap-2">
          <IconButton
            icon="add-outline"
            variant="outline"
            size="md"
            tooltip="Zoom In"
            className="bg-surface-dark hover:border-primary/50 border-white/10 shadow-lg"
          />
          <IconButton
            icon="remove-outline"
            variant="outline"
            size="md"
            tooltip="Zoom Out"
            className="bg-surface-dark hover:border-primary/50 border-white/10 shadow-lg"
          />
          <IconButton
            icon="grid-outline"
            variant="outline"
            size="md"
            tooltip="Reset View"
            className="bg-surface-dark hover:border-primary/50 border-white/10 shadow-lg"
          />
        </div>
      </div>
    </>
  );
}
