'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Stepper } from '@/components/molecules/Stepper';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import { SportRadioCard } from './_components/SportRadioCard';

const steps = [
  { label: 'Thông tin chung' },
  { label: 'Thể thức' },
  { label: 'Giải thưởng' },
];

export default function CreateTournamentPage() {
  const [step, setStep] = useState(0);
  const [sport, setSport] = useState('badminton');
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

      <div className="mx-auto mt-6 max-w-3xl">
        <Stepper
          steps={steps}
          currentStep={step}
          className="mb-8 justify-center"
        />

        <GlassPanel card>
          {step === 0 && (
            <div className="space-y-5">
              <Input
                label="Tên giải đấu"
                placeholder="VD: Giải Cầu lông Mùa Đông 2024"
                leftIcon="trophy-outline"
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Môn thể thao
                </label>
                <SportRadioCard selected={sport} onChange={setSport} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Ngày bắt đầu"
                  type="date"
                  leftIcon="calendar-outline"
                />
                <Input
                  label="Ngày kết thúc"
                  type="date"
                  leftIcon="calendar-outline"
                />
              </div>
              <Input
                label="Địa điểm"
                placeholder="VD: HITRI Center A, Quận 7"
                leftIcon="location-outline"
              />
              <Textarea
                label="Mô tả"
                placeholder="Thông tin thêm về giải đấu..."
                rows={3}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <Select
                label="Thể thức thi đấu"
                options={[
                  {
                    label: 'Loại trực tiếp (Single Elimination)',
                    value: 'single_elim',
                  },
                  { label: 'Vòng tròn (Round Robin)', value: 'round_robin' },
                  { label: 'Thụy Sĩ (Swiss)', value: 'swiss' },
                ]}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Số người tối đa"
                  type="number"
                  placeholder="32"
                  leftIcon="people-outline"
                />
                <Input
                  label="Số set mỗi trận"
                  type="number"
                  placeholder="3"
                  leftIcon="layers-outline"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <Input
                label="Tổng giải thưởng"
                placeholder="10,000,000 ₫"
                leftIcon="cash-outline"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Hạng nhất" placeholder="5,000,000 ₫" />
                <Input label="Hạng nhì" placeholder="3,000,000 ₫" />
                <Input label="Hạng ba" placeholder="2,000,000 ₫" />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              iconLeft="arrow-back-outline"
            >
              Quay lại
            </Button>
            {step < steps.length - 1 ? (
              <Button
                size="sm"
                onClick={() =>
                  setStep((s) => Math.min(steps.length - 1, s + 1))
                }
                iconRight="arrow-forward-outline"
              >
                Tiếp theo
              </Button>
            ) : (
              <Button size="sm" iconLeft="checkmark-outline">
                Tạo giải đấu
              </Button>
            )}
          </div>
        </GlassPanel>
      </div>
    </>
  );
}
