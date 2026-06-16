/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import type { VenueExpenseNode } from '@/hooks/owner';
import {
  EXPENSE_CATEGORY_OPTIONS,
  PAYMENT_METHOD_FILTER_OPTIONS,
} from '../_hooks/owner-finance-page.constants';
import type { OwnerFinancePageActions } from '../_hooks/useOwnerFinancePageActions';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';
import {
  CreateVenueExpenseInput,
  ExpenseCategory,
  PaymentMethod,
  UpdateVenueExpenseInput,
} from '@/graphql/generated';

interface ExpenseFormModalProps {
  data: OwnerFinancePageData;
  actions: OwnerFinancePageActions;
}

function ExpenseFormModalContent({
  data,
  actions,
  editingExpense,
  defaultDate,
}: {
  data: OwnerFinancePageData;
  actions: OwnerFinancePageActions;
  editingExpense: VenueExpenseNode | null;
  defaultDate: string;
}) {
  const [category, setCategory] = useState<ExpenseCategory>(
    () => editingExpense?.category ?? ExpenseCategory.Rent,
  );
  const [amount, setAmount] = useState(() =>
    editingExpense ? String(editingExpense.amount) : '',
  );
  const [date, setDate] = useState(() => editingExpense?.date ?? defaultDate);
  const [note, setNote] = useState(() => editingExpense?.note ?? '');
  const [paymentMethod, setPaymentMethod] = useState(
    () => editingExpense?.paymentMethod ?? '',
  );

  const handleSubmit = async () => {
    if (!data.selectedVenueId) return;
    const parsedAmount = Number.parseInt(amount, 10);
    if (!parsedAmount || parsedAmount <= 0) return;

    const payload: CreateVenueExpenseInput | UpdateVenueExpenseInput =
      editingExpense
        ? {
            expenseId: editingExpense._id,
            category,
            amount: parsedAmount,
            date,
            note: note || undefined,
            ...(paymentMethod
              ? { paymentMethod: paymentMethod as PaymentMethod }
              : {}),
          }
        : {
            venueId: data.selectedVenueId,
            category,
            amount: parsedAmount,
            date,
            note: note || undefined,
            ...(paymentMethod
              ? { paymentMethod: paymentMethod as PaymentMethod }
              : {}),
          };

    await actions.handleSaveExpense(payload);
  };

  return (
    <Modal
      open
      onClose={actions.closeExpenseModal}
      title={editingExpense ? 'Sửa chi phí' : 'Thêm chi phí'}
    >
      <div className="space-y-4">
        <Select
          label="Nhóm chi phí"
          options={EXPENSE_CATEGORY_OPTIONS}
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as ExpenseCategory)
          }
        />
        <Input
          label="Số tiền (VND)"
          type="number"
          min={0}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <Input
          label="Ngày (YYYY-MM-DD)"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <Select
          label="Phương thức thanh toán"
          options={[
            { label: 'Không chọn', value: '' },
            ...PAYMENT_METHOD_FILTER_OPTIONS.filter((option) => option.value),
          ]}
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value)}
        />
        <Textarea
          label="Ghi chú"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={actions.closeExpenseModal}>
            Huỷ
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={actions.savingExpense}
          >
            {editingExpense ? 'Cập nhật' : 'Thêm chi phí'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function ExpenseFormModal({ data, actions }: ExpenseFormModalProps) {
  if (!actions.expenseModalOpen) return null;

  const formKey = actions.editingExpense?._id ?? 'new-expense';

  return (
    <ExpenseFormModalContent
      key={formKey}
      data={data}
      actions={actions}
      editingExpense={actions.editingExpense}
      defaultDate={data.dateRange.to}
    />
  );
}
