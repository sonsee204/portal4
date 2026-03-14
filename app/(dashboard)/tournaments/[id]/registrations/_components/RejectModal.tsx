'use client';

import { useState, useCallback } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';

interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  athleteName?: string;
  loading?: boolean;
}

export function RejectModal({
  open,
  onClose,
  onConfirm,
  athleteName,
  loading = false,
}: RejectModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = useCallback(() => {
    onConfirm(reason.trim() || undefined);
    setReason('');
    // Parent will close modal via state
  }, [reason, onConfirm]);

  const handleClose = useCallback(() => {
    setReason('');
    onClose();
  }, [onClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Từ chối đăng ký"
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            Huỷ
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400/30 border-t-red-400" />
            ) : (
              'Từ chối'
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {athleteName && (
          <p className="text-secondary text-sm">
            Bạn đang từ chối đăng ký của{' '}
            <strong className="text-heading">{athleteName}</strong>.
          </p>
        )}
        <div>
          <label className="text-secondary mb-1.5 block text-sm font-medium">
            Lý do từ chối (tùy chọn)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            rows={3}
            className="text-heading placeholder:text-muted focus:border-primary focus:ring-primary w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:ring-1 focus:outline-none"
            disabled={loading}
          />
        </div>
      </div>
    </Modal>
  );
}
