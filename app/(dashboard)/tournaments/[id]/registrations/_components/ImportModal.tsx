'use client';

import { useState, useCallback } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Stepper } from '@/components/molecules/Stepper';
import { TOURNAMENT } from '@/lib/strings';
import { validateRows, toImportItems } from '@/lib/utils/registration-import';
import { useBulkImportRegistrations } from '@/hooks/tournament';
import { ImportStepUpload } from './ImportStepUpload';
import { ImportStepPreview } from './ImportStepPreview';
import { ImportStepResult } from './ImportStepResult';
import type { ParsedRow, ValidatedRow } from '@/lib/utils/registration-import';
import type { BulkImportResult, TournamentCategory } from '@/graphql/generated';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  categories: Pick<TournamentCategory, '_id' | 'title'>[];
  onSuccess?: () => void;
}

const STEPS = [
  { label: TOURNAMENT.IMPORT_STEP_UPLOAD },
  { label: TOURNAMENT.IMPORT_STEP_PREVIEW },
  { label: TOURNAMENT.IMPORT_STEP_RESULT },
];

type Step = 0 | 1 | 2;

export function ImportModal({
  open,
  onClose,
  tournamentId,
  categories,
  onSuccess,
}: ImportModalProps) {
  const [step, setStep] = useState<Step>(0);
  const [validatedRows, setValidatedRows] = useState<ValidatedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(
    null
  );

  const { bulkImport, loading: importing } =
    useBulkImportRegistrations(tournamentId);

  const resetState = useCallback(() => {
    setStep(0);
    setValidatedRows([]);
    setParseError(null);
    setImportResult(null);
  }, []);

  const handleClose = useCallback(() => {
    if (step === 2 && importResult?.successCount) {
      onSuccess?.();
    }
    resetState();
    onClose();
  }, [step, importResult, onSuccess, resetState, onClose]);

  const handleParsed = useCallback(
    (rows: ParsedRow[]) => {
      setParseError(null);
      const validated = validateRows(rows, categories);
      setValidatedRows(validated);
      setStep(1);
    },
    [categories]
  );

  const handleParseError = useCallback((msg: string) => {
    setParseError(msg);
  }, []);

  const handleBack = useCallback(() => {
    setStep(0);
    setValidatedRows([]);
    setParseError(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    const items = toImportItems(validatedRows);
    if (items.length === 0) return;
    const result = await bulkImport(items);
    if (result) {
      setImportResult(result);
      setStep(2);
    }
  }, [validatedRows, bulkImport]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={TOURNAMENT.IMPORT_TITLE}
      size="xl"
    >
      <div className="space-y-6">
        {/* Stepper */}
        <Stepper steps={STEPS} currentStep={step} />

        {/* Parse error */}
        {parseError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <span className="mt-0.5 shrink-0">⚠</span>
            {parseError}
          </div>
        )}

        {/* Step content */}
        {step === 0 && (
          <ImportStepUpload
            onParsed={handleParsed}
            onError={handleParseError}
          />
        )}

        {step === 1 && (
          <ImportStepPreview
            rows={validatedRows}
            onBack={handleBack}
            onConfirm={() => void handleConfirm()}
            importing={importing}
          />
        )}

        {step === 2 && importResult && (
          <ImportStepResult result={importResult} onClose={handleClose} />
        )}
      </div>
    </Modal>
  );
}
