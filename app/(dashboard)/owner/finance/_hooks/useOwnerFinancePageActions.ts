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

import { useCallback, useState } from 'react';
import { useExpenseMutations, type VenueExpenseNode } from '@/hooks/owner';
import { showSuccess } from '@/lib/toast';
import type {
  CreateVenueExpenseInput,
  ExpenseCategory,
  UpdateVenueExpenseInput,
} from '@/graphql/generated';
import type { OwnerFinancePageData } from './useOwnerFinancePageData';

export function useOwnerFinancePageActions(data: OwnerFinancePageData) {
  const { createExpense, updateExpense, deleteExpense, creating, updating, deleting } =
    useExpenseMutations();

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<VenueExpenseNode | null>(
    null,
  );

  const openCreateExpense = useCallback(() => {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  }, []);

  const openEditExpense = useCallback((expense: VenueExpenseNode) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  }, []);

  const closeExpenseModal = useCallback(() => {
    setExpenseModalOpen(false);
    setEditingExpense(null);
  }, []);

  const handleSaveExpense = useCallback(
    async (input: CreateVenueExpenseInput | UpdateVenueExpenseInput) => {
      try {
        if ('expenseId' in input) {
          await updateExpense(input);
          showSuccess('Đã cập nhật chi phí');
        } else {
          await createExpense(input);
          showSuccess('Đã thêm chi phí');
        }
        closeExpenseModal();
        await data.refetchExpenses();
        await data.refetchReport();
        return true;
      } catch {
        return false;
      }
    },
    [closeExpenseModal, createExpense, data, updateExpense],
  );

  const handleDeleteExpense = useCallback(
    async (expenseId: string) => {
      try {
        await deleteExpense(expenseId);
        showSuccess('Đã xoá chi phí');
        await data.refetchExpenses();
        await data.refetchReport();
        return true;
      } catch {
        return false;
      }
    },
    [data, deleteExpense],
  );

  const handleRetryAll = useCallback(() => {
    void data.refetchReport();
    void data.refetchPortfolio();
    void data.refetchOperations();
    void data.refetchTransactions();
    void data.refetchExpenses();
  }, [data]);

  return {
    expenseModalOpen,
    editingExpense,
    openCreateExpense,
    openEditExpense,
    closeExpenseModal,
    handleSaveExpense,
    handleDeleteExpense,
    handleRetryAll,
    savingExpense: creating || updating,
    deletingExpense: deleting,
  };
}

export type OwnerFinancePageActions = ReturnType<
  typeof useOwnerFinancePageActions
>;

export type { ExpenseCategory };
