'use client';

import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';

export default function MaintenancePage() {
  return (
    <div className="bg-bg relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-primary/10 absolute animate-ping rounded-full border"
            style={{
              width: `${i * 200}px`,
              height: `${i * 200}px`,
              animationDuration: `${i * 3}s`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/15 absolute -top-40 -right-40 h-96 w-96 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-6 text-center">
        {/* Icon */}
        <div className="bg-primary/20 text-primary mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
          <IonIcon name="construct-outline" className="!h-12 !w-12" />
        </div>

        <h1 className="text-3xl font-bold text-heading md:text-4xl">
          <span className="neon-text">Hệ thống đang nâng cấp</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          Chúng tôi đang cải thiện hiệu năng và bổ sung tính năng mới. Hệ thống
          sẽ trở lại hoạt động trong thời gian sớm nhất.
        </p>

        {/* Progress */}
        <div className="mx-auto mt-8 max-w-xs">
          <ProgressBar value={75} variant="primary" />
          <p className="mt-2 text-xs text-faint">Tiến độ: 75% hoàn thành</p>
        </div>

        {/* Notify form */}
        <div className="mx-auto mt-8 max-w-sm">
          <p className="mb-3 text-sm text-muted">
            Nhận thông báo khi hoàn tất:
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="email@example.com"
              leftIcon="mail-outline"
              className="flex-1"
            />
            <Button iconLeft="notifications-outline">Thông báo</Button>
          </div>
        </div>

        {/* Status info */}
        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-faint">
          <span className="flex items-center gap-1.5">
            <IonIcon name="time-outline" size="xs" />
            Dự kiến: 2 giờ
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Đang bảo trì
          </span>
        </div>
      </div>
    </div>
  );
}
