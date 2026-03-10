'use client';

import type { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Badge } from '@/components/atoms/Badge';
import {
  ReviewSection,
  ReviewField,
  ReviewList,
} from '../_parts/ReviewSection';
import {
  SPORT_OPTIONS,
  type TournamentFormData,
} from '@/types/tournament-form';
import { formatCurrency } from '@/lib/utils';
import { useTournamentCategories } from '@/hooks/tournament';

function displayVND(raw: string): string {
  const n = Number(raw.replace(/\D/g, ''));
  return n > 0 ? formatCurrency(n) : '—';
}

const matchTypeLabels: Record<string, string> = {
  single: 'Đơn',
  double: 'Đôi',
  mixed: 'Đôi nam nữ',
  SINGLES: 'Đơn',
  DOUBLES: 'Đôi',
  TEAM: 'Đồng đội',
};

const formatLabels: Record<string, string> = {
  single_elim: 'Loại trực tiếp',
  round_robin: 'Vòng tròn',
  swiss: 'Thụy Sĩ',
};

const courtStatusLabels: Record<string, string> = {
  available: 'Sẵn sàng',
  maintenance: 'Bảo trì',
  reserved: 'Đặt trước',
};

interface StepReviewProps {
  form: UseFormReturn<TournamentFormData>;
  onGoToStep: (step: number) => void;
  tournamentId?: string;
}

export function StepReview({
  form,
  onGoToStep,
  tournamentId,
}: StepReviewProps) {
  const data = form.getValues();
  const sportLabel =
    SPORT_OPTIONS.find((s) => s.value === data.sport)?.label ?? data.sport;

  const { categories: apiCategories } = useTournamentCategories(
    tournamentId ?? '',
    !tournamentId
  );

  return (
    <div className="space-y-5">
      <div className="mb-2 text-center">
        <div className="bg-primary/15 text-primary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl">
          <IonIcon name="checkmark-circle-outline" size="lg" />
        </div>
        <h2 className="text-heading text-lg font-bold">Xem lại thông tin</h2>
        <p className="text-muted mt-1 text-sm">
          Kiểm tra lại toàn bộ thông tin trước khi lưu
        </p>
      </div>

      {/* Basic Info */}
      <ReviewSection
        icon="information-circle-outline"
        title="Thông tin chung"
        stepIndex={0}
        onEdit={onGoToStep}
      >
        <ReviewField label="Tên giải" value={data.name} />
        {data.organizerName && (
          <ReviewField label="Đơn vị ban tổ chức" value={data.organizerName} />
        )}
        <ReviewField label="Môn" value={sportLabel} />
        <ReviewField
          label="Ngày"
          value={
            data.startDate && data.endDate
              ? `${data.startDate} → ${data.endDate}`
              : undefined
          }
        />
        <ReviewField label="Địa điểm" value={data.locationName} />
        <ReviewField label="Địa chỉ" value={data.locationAddress} />
        {data.description && (
          <p className="text-muted mt-1 line-clamp-3 text-xs">
            {data.description}
          </p>
        )}
        {data.introduction && (
          <p className="text-muted mt-1 line-clamp-3 text-xs">
            {data.introduction}
          </p>
        )}
        {data.highlights.filter(Boolean).length > 0 && (
          <div className="mt-2">
            <span className="text-muted text-xs font-medium">
              Điểm nổi bật:
            </span>
            <ReviewList items={data.highlights} />
          </div>
        )}
      </ReviewSection>

      {/* Categories */}
      <ReviewSection
        icon="list-outline"
        title="Nội dung thi đấu"
        stepIndex={1}
        onEdit={onGoToStep}
      >
        <div className="flex flex-wrap gap-2">
          {tournamentId
            ? apiCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="border-surface-border bg-overlay-faint inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5"
                >
                  <IonIcon
                    name="trophy-outline"
                    size="xs"
                    className="text-primary"
                  />
                  <span className="text-heading text-xs font-medium">
                    {cat.title}
                  </span>
                  {cat.ageLabel && (
                    <Badge variant="neutral">{cat.ageLabel}</Badge>
                  )}
                  <span className="text-muted text-xs">
                    {matchTypeLabels[cat.matchType] ?? cat.matchType}
                  </span>
                </div>
              ))
            : data.categories.map((cat, i) => (
                <div
                  key={i}
                  className="border-surface-border bg-overlay-faint inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5"
                >
                  <IonIcon name={cat.icon} size="xs" className="text-primary" />
                  <span className="text-heading text-xs font-medium">
                    {cat.title || `Nội dung ${i + 1}`}
                  </span>
                  <Badge variant="neutral">{cat.ageLabel || '—'}</Badge>
                  <span className="text-muted text-xs">
                    {matchTypeLabels[cat.matchType]}
                  </span>
                </div>
              ))}
        </div>
      </ReviewSection>

      {/* Schedule & Venue */}
      <ReviewSection
        icon="calendar-outline"
        title="Lịch trình & Địa điểm"
        stepIndex={2}
        onEdit={onGoToStep}
      >
        <ReviewField
          label="Thể thức"
          value={formatLabels[data.format] ?? data.format}
        />
        <ReviewField label="Số slot" value={data.totalSlots} />
        {data.schedule.length > 0 && (
          <div className="mt-2">
            <span className="text-muted text-xs font-medium">Lịch trình:</span>
            <div className="mt-1 space-y-1">
              {data.schedule.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                  <span className="text-heading font-medium">{s.label}</span>
                  <span className="text-muted">
                    {s.date}
                    {s.startTime || s.endTime
                      ? ` • ${s.startTime || '—'} - ${s.endTime || '—'}`
                      : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <ReviewField label="Nhà thi đấu" value={data.venueName} />
        {data.facilities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.facilities.map((f, i) => (
              <span
                key={i}
                className="bg-overlay-faint text-muted inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
              >
                <IonIcon name={f.icon} size="xs" />
                {f.label}
              </span>
            ))}
          </div>
        )}
        {data.courts.length > 0 && (
          <div className="mt-2">
            <span className="text-muted text-xs font-medium">Sân:</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {data.courts.map((c, i) => (
                <Badge
                  key={i}
                  variant={
                    c.status === 'available'
                      ? 'success'
                      : c.status === 'maintenance'
                        ? 'warning'
                        : 'neutral'
                  }
                >
                  {c.name} ({courtStatusLabels[c.status]})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </ReviewSection>

      {/* Rules & Prizes */}
      <ReviewSection
        icon="book-outline"
        title="Thể lệ & Giải thưởng"
        stepIndex={3}
        onEdit={onGoToStep}
      >
        {data.rules.length > 0 && (
          <div>
            <span className="text-muted text-xs font-medium">
              Thể lệ ({data.rules.length}):
            </span>
            <div className="mt-1 space-y-1">
              {data.rules.map((r, i) => (
                <div key={i} className="text-xs">
                  <span className="text-heading font-medium">{r.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {(() => {
          const categoriesWithPrizes = tournamentId
            ? (apiCategories ?? []).filter((c) => (c.prizes?.length ?? 0) > 0)
            : (data.categories ?? []).filter(
                (c) => (c.prizes?.length ?? 0) > 0
              );
          if (categoriesWithPrizes.length === 0) return null;
          return (
            <div className="mt-3 space-y-4">
              {categoriesWithPrizes.map((cat, ci) => (
                <div key={(cat as { _id?: string })._id ?? `cat-${ci}`}>
                  <span className="text-muted mb-2 block text-xs font-medium">
                    {(cat as { title?: string }).title}
                  </span>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      (
                        cat as {
                          prizes?: {
                            rank: string;
                            title: string;
                            amount?: string;
                          }[];
                        }
                      ).prizes ?? []
                    ).map((p, i) => {
                      const icon =
                        p.rank === 'gold'
                          ? 'trophy-outline'
                          : p.rank === 'silver'
                            ? 'medal-outline'
                            : p.rank === 'bronze'
                              ? 'ribbon-outline'
                              : 'star-outline';
                      const color =
                        p.rank === 'gold'
                          ? 'text-amber-500'
                          : p.rank === 'silver'
                            ? 'text-slate-400'
                            : p.rank === 'bronze'
                              ? 'text-orange-400'
                              : 'text-slate-500';
                      return (
                        <div
                          key={`${p.rank}-${i}`}
                          className="border-surface-border bg-overlay-faint rounded-lg border p-3 text-center"
                        >
                          <IonIcon name={icon} size="md" className={color} />
                          <p className="text-heading mt-1 text-xs font-bold">
                            {p.title}
                          </p>
                          <p className="text-primary text-sm font-semibold">
                            {p.amount ? displayVND(p.amount) : '—'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </ReviewSection>

      {/* Registration */}
      <ReviewSection
        icon="person-add-outline"
        title="Đăng ký"
        stepIndex={4}
        onEdit={onGoToStep}
      >
        <ReviewField label="Hạn đăng ký" value={data.registrationDeadline} />
        {data.fees.length > 0 && (
          <div className="mt-2">
            <span className="text-muted text-xs font-medium">Lệ phí:</span>
            <div className="mt-1 space-y-0.5">
              {data.fees.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-body">{f.label || '—'}</span>
                  <span className="text-heading font-medium">
                    {f.amount ? displayVND(f.amount) : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.contacts.length > 0 && (
          <div className="mt-2">
            <span className="text-muted text-xs font-medium">Liên hệ:</span>
            <div className="mt-1 space-y-0.5">
              {data.contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <IonIcon name={c.icon} size="xs" className="text-primary" />
                  <span className="text-muted">{c.label}:</span>
                  <span className="text-heading font-medium">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.paymentBank && (
          <div className="border-surface-border bg-overlay-faint mt-2 rounded-lg border p-3">
            <span className="text-muted text-xs font-medium">Thanh toán:</span>
            <ReviewField label="Ngân hàng" value={data.paymentBank} />
            <ReviewField label="STK" value={data.paymentAccountNumber} />
            <ReviewField label="Chủ TK" value={data.paymentAccountName} />
            {data.paymentQrImage && (
              <div className="mt-2">
                <span className="text-muted text-xs font-medium">QR Code:</span>
                <Image
                  src={data.paymentQrImage}
                  alt="QR Code"
                  width={96}
                  height={96}
                  className="border-surface-border mt-1 h-24 w-24 rounded-lg border object-contain"
                />
              </div>
            )}
          </div>
        )}
      </ReviewSection>
    </div>
  );
}
