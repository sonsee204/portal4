'use client';

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TimelineItem } from '@/components/molecules/TimelineItem';
import type { Report } from '@/types/mock';

const historyItems = [
  {
    icon: 'flag-outline',
    iconColor: 'text-red-400 bg-red-500/20 border-red-500/30',
    title: 'Báo cáo mới được tạo',
    time: '12 phút trước',
  },
  {
    icon: 'person-outline',
    iconColor: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    title: '3 người dùng báo cáo thêm',
    time: '8 phút trước',
  },
  {
    icon: 'alert-outline',
    iconColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    title: 'Tự động đánh dấu ưu tiên',
    time: '5 phút trước',
  },
];

export function ReportDetail({ report }: { report: Report }) {
  return (
    <div className="space-y-6">
      {/* Post card */}
      <GlassPanel card>
        <div className="border-surface-border flex items-center gap-3 border-b pb-3">
          <Avatar fallback={report.authorName[0].toUpperCase()} />
          <div>
            <p className="text-sm font-medium text-heading">
              @{report.authorName}
            </p>
            <p className="text-xs text-faint">{report.createdAt}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-body">
          {report.content}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-faint">
          <span className="flex items-center gap-1">
            <IonIcon name="flag-outline" size="xs" className="text-red-400" />
            {report.reporterCount} báo cáo
          </span>
          <Badge variant="danger" className="text-[10px]">
            {report.category.replace('_', ' ')}
          </Badge>
        </div>
      </GlassPanel>

      {/* Violation history */}
      <GlassPanel card>
        <h4 className="mb-3 text-sm font-bold text-heading">Lịch sử vi phạm</h4>
        {historyItems.map((h, i) => (
          <TimelineItem
            key={i}
            icon={h.icon}
            iconColor={h.iconColor}
            title={h.title}
            time={h.time}
            isLast={i === historyItems.length - 1}
          />
        ))}
      </GlassPanel>

      {/* Community reports */}
      <GlassPanel card>
        <h4 className="mb-3 text-sm font-bold text-heading">Báo cáo cộng đồng</h4>
        <p className="text-xs text-muted">
          {report.reporterCount} người dùng đã báo cáo nội dung này. Nội dung
          được tự động đánh dấu khi có 3+ báo cáo.
        </p>
      </GlassPanel>

      {/* Action bar */}
      <div className="border-surface-border bg-surface/95 sticky bottom-0 flex items-center gap-3 rounded-xl border p-4 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          iconLeft="play-skip-forward-outline"
          className="flex-1"
        >
          Bỏ qua
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="checkmark-outline"
          className="flex-1 text-emerald-400 hover:bg-emerald-500/10"
        >
          Giữ lại
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="trash-outline"
          className="flex-1 text-red-400 hover:bg-red-500/10"
        >
          Xoá
        </Button>
        <Button
          size="sm"
          iconLeft="lock-closed-outline"
          className="flex-1 bg-red-500 hover:bg-red-600"
        >
          Khoá TK
        </Button>
      </div>
    </div>
  );
}
