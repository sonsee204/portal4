'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { BracketView } from './_components/BracketView';
import { mockBracketMatches } from '@/lib/mock-data';

export default function TournamentsPage() {
  return (
    <>
      <PageHeader
        title="Quản lý Giải đấu"
        description="Xem nhánh thi đấu và quản lý giải."
      >
        <div className="flex items-center gap-3">
          <Select
            options={[
              { label: 'Badminton Pro Open', value: 't3' },
              { label: 'Cyber League Winter', value: 't1' },
              { label: 'Pickleball City Cup', value: 't4' },
            ]}
            className="w-56"
          />
          <Link href="/tournaments/create">
            <Button size="sm" iconLeft="add-outline">
              Tạo giải đấu mới
            </Button>
          </Link>
        </div>
      </PageHeader>

      <GlassPanel card className="mt-6">
        <BracketView rounds={mockBracketMatches} />
      </GlassPanel>
    </>
  );
}
