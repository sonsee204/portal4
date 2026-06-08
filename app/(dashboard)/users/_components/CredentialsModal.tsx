'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { USERS, COMMON } from '@/lib/strings';

export interface CredentialField {
  label: string;
  value: string;
}

interface CredentialsModalProps {
  open: boolean;
  title: string;
  hint?: string;
  fields: CredentialField[];
  instructions?: string;
  warning?: string;
  onClose: () => void;
}

export function CredentialsModal({
  open,
  title,
  hint,
  fields,
  instructions,
  warning,
  onClose,
}: CredentialsModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = fields.map((f) => `${f.label}: ${f.value}`).join('\n');
    const withInstructions = instructions ? `${text}\n\n${instructions}` : text;
    try {
      await navigator.clipboard.writeText(withInstructions);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [fields, instructions]);

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="glass-card border-surface-border relative z-10 w-full max-w-lg rounded-2xl border p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-heading text-lg font-semibold">{title}</h2>
            {hint && <p className="text-muted mt-1 text-sm">{hint}</p>}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted hover:text-heading transition-colors"
          >
            <IonIcon name="close-outline" size="md" />
          </button>
        </div>

        <div className="bg-surface-hover/50 space-y-3 rounded-xl p-4">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-muted text-xs font-medium tracking-wide uppercase">
                {field.label}
              </p>
              <p className="text-heading mt-0.5 font-mono text-sm break-all">
                {field.value}
              </p>
            </div>
          ))}
        </div>

        {instructions && (
          <p className="text-muted mt-4 text-sm leading-relaxed">
            {instructions}
          </p>
        )}

        {warning && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm">
            <IonIcon
              name="warning-outline"
              size="sm"
              className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
            />
            <p className="leading-relaxed text-amber-800 dark:text-amber-200">
              {warning}
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={handleClose}
          >
            {COMMON.CLOSE}
          </Button>
          <Button
            type="button"
            className="flex-1"
            iconLeft={copied ? 'checkmark-outline' : 'copy-outline'}
            onClick={() => void handleCopy()}
          >
            {copied ? USERS.PROVISION.COPIED : USERS.PROVISION.COPY_CREDENTIALS}
          </Button>
        </div>
      </div>
    </div>
  );
}
