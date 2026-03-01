'use client';

import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
}

const variantConfig = {
  danger: {
    iconName: 'warning-outline' as const,
    iconClass: 'text-red-400',
    bgClass: 'bg-red-500/10',
    confirmClass: 'bg-red-500 hover:bg-red-600 text-white',
  },
  warning: {
    iconName: 'alert-circle-outline' as const,
    iconClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    confirmClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  default: {
    iconName: 'help-circle-outline' as const,
    iconClass: 'text-primary',
    bgClass: 'bg-primary/10',
    confirmClass: '',
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Huỷ bỏ',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  const cfg = variantConfig[variant];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${cfg.confirmClass || 'bg-primary hover:bg-primary/90 text-white'}`}
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cfg.bgClass}`}
        >
          <IonIcon name={cfg.iconName} size="lg" className={cfg.iconClass} />
        </div>
        <div>
          <h3 className="text-heading text-base font-bold">{title}</h3>
          <p className="text-muted mt-1.5 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
}
