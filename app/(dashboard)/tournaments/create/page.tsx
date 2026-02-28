'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { TournamentFormWizard } from '../_form/TournamentFormWizard';

export default function CreateTournamentPage() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Tạo giải đấu mới"
        description="Thiết lập thông tin giải đấu từ đầu."
      >
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={() => router.push('/tournaments')}
        >
          Quay lại
        </Button>
      </PageHeader>

      <div className="mt-6">
        <TournamentFormWizard />
      </div>
    </>
  );
}
