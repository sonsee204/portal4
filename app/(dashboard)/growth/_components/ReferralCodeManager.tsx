'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Input } from '@/components/atoms/Input';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import {
  GET_REFERRAL_CODES,
  CREATE_REFERRAL_CODE,
  TOGGLE_REFERRAL_CODE,
} from '@/graphql/queries/referral';
import type { ReferralCode } from '@/types';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface CreateFormState {
  code: string;
  ownerId: string;
  ownerName: string;
  ownerRole: string;
  maxUses: string;
}

const INITIAL_FORM: CreateFormState = {
  code: '',
  ownerId: '',
  ownerName: '',
  ownerRole: '',
  maxUses: '',
};

/* ------------------------------------------------------------------ */
/* Column definitions                                                  */
/* ------------------------------------------------------------------ */

const columns: DataTableColumn[] = [
  { key: 'code', label: 'Mã giới thiệu' },
  { key: 'owner', label: 'Chủ sở hữu' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'usage', label: 'Sử dụng', align: 'right' },
  { key: 'signups', label: 'Đăng ký', align: 'right' },
  { key: 'revenue', label: 'Doanh thu', align: 'right' },
  { key: 'actions', label: '', align: 'center' },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ReferralCodeManager() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState<CreateFormState>(INITIAL_FORM);

  // Queries
  const { data, loading, refetch } = useQuery<{
    getReferralCodes: ReferralCode[];
  }>(GET_REFERRAL_CODES, {
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [createCode, { loading: creating }] = useMutation(
    CREATE_REFERRAL_CODE,
    {
      onCompleted: () => {
        toast.success('Tạo mã giới thiệu thành công');
        setForm(INITIAL_FORM);
        setShowCreateForm(false);
        void refetch();
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể tạo mã giới thiệu');
      },
    }
  );

  const [toggleCode] = useMutation(TOGGLE_REFERRAL_CODE, {
    onCompleted: () => {
      toast.success('Cập nhật trạng thái thành công');
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Không thể cập nhật trạng thái');
    },
  });

  const handleCreate = useCallback(() => {
    if (!form.code || !form.ownerId || !form.ownerName) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    void createCode({
      variables: {
        input: {
          code: form.code.toUpperCase(),
          ownerId: form.ownerId,
          ownerName: form.ownerName,
          ownerRole: form.ownerRole || undefined,
          maxUses: form.maxUses ? parseInt(form.maxUses, 10) : undefined,
        },
      },
    });
  }, [form, createCode]);

  const handleToggle = useCallback(
    (id: string, isActive: boolean) => {
      void toggleCode({
        variables: { id, isActive: !isActive },
      });
    },
    [toggleCode]
  );

  const handleCopyCode = useCallback((code: string) => {
    void navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã: ${code}`);
  }, []);

  const handleCopyLink = useCallback((code: string) => {
    const link = `https://aotrinh.vn/download?ref=${code}`;
    void navigator.clipboard.writeText(link);
    toast.success('Đã sao chép link giới thiệu');
  }, []);

  const codes = data?.getReferralCodes ?? [];

  const renderRow = (code: ReferralCode) => (
    <tr key={code._id} className="hover:bg-surface-hover transition-colors">
      {/* Code */}
      <td className="px-4 py-3">
        <code className="bg-surface-hover border-surface-border rounded border px-2 py-1 font-mono text-xs font-semibold">
          {code.code}
        </code>
      </td>

      {/* Owner */}
      <td className="px-4 py-3">
        <div>
          <p className="text-heading text-sm font-medium">{code.ownerName}</p>
          {code.ownerRole && (
            <p className="text-faint text-xs">{code.ownerRole}</p>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <Badge variant={code.isActive ? 'success' : 'danger'}>
          {code.isActive ? 'Hoạt động' : 'Tắt'}
        </Badge>
      </td>

      {/* Usage */}
      <td className="text-heading px-4 py-3 text-right text-sm">
        {code.currentUses}
        {code.maxUses ? ` / ${code.maxUses}` : ''}
      </td>

      {/* Signups */}
      <td className="text-heading px-4 py-3 text-right text-sm font-medium">
        {code.totalSignups.toLocaleString()}
      </td>

      {/* Revenue */}
      <td className="text-heading px-4 py-3 text-right text-sm">
        {code.totalRevenue > 0
          ? code.totalRevenue.toLocaleString('vi-VN')
          : '-'}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => handleCopyCode(code.code)}
            className="text-muted hover:text-heading rounded p-1.5 transition-colors"
            title="Sao chép mã"
          >
            <IonIcon name="copy-outline" size="sm" />
          </button>
          <button
            type="button"
            onClick={() => handleCopyLink(code.code)}
            className="text-muted hover:text-heading rounded p-1.5 transition-colors"
            title="Sao chép link"
          >
            <IonIcon name="link-outline" size="sm" />
          </button>
          <button
            type="button"
            onClick={() => handleToggle(code._id, code.isActive)}
            className={`rounded p-1.5 transition-colors ${
              code.isActive
                ? 'text-red-400 hover:text-red-500'
                : 'text-emerald-400 hover:text-emerald-500'
            }`}
            title={code.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            <IonIcon
              name={
                code.isActive
                  ? 'close-circle-outline'
                  : 'checkmark-circle-outline'
              }
              size="sm"
            />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-heading text-lg font-semibold">
          Quản lý mã giới thiệu
        </h3>
        <Button
          variant="primary"
          size="sm"
          iconLeft={showCreateForm ? 'close-outline' : 'add-outline'}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Đóng' : 'Tạo mã mới'}
        </Button>
      </div>

      {/* Create Form (inline panel) */}
      {showCreateForm && (
        <div className="bg-surface border-surface-border rounded-xl border p-5 shadow-sm">
          <h4 className="text-heading mb-4 font-semibold">
            Tạo mã giới thiệu mới
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Mã giới thiệu"
              placeholder="VD: CEOVIP"
              value={form.code}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  code: e.target.value.toUpperCase(),
                }))
              }
              required
            />
            <Input
              label="ID chủ sở hữu"
              placeholder="ObjectId của user"
              value={form.ownerId}
              onChange={(e) =>
                setForm((f) => ({ ...f, ownerId: e.target.value }))
              }
              required
            />
            <Input
              label="Tên chủ sở hữu"
              placeholder="Nguyen Van A"
              value={form.ownerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, ownerName: e.target.value }))
              }
              required
            />
            <Input
              label="Vai trò"
              placeholder="VD: Đối tác, CEO"
              value={form.ownerRole}
              onChange={(e) =>
                setForm((f) => ({ ...f, ownerRole: e.target.value }))
              }
            />
            <Input
              label="Giới hạn sử dụng"
              placeholder="Không giới hạn"
              type="number"
              value={form.maxUses}
              onChange={(e) =>
                setForm((f) => ({ ...f, maxUses: e.target.value }))
              }
            />
            <div className="flex items-end">
              <Button
                variant="primary"
                size="md"
                iconLeft="checkmark-outline"
                onClick={handleCreate}
                disabled={creating}
                className="w-full"
              >
                {creating ? 'Đang tạo...' : 'Tạo mã'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Codes Table */}
      <div className="bg-surface border-surface-border overflow-hidden rounded-xl border shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-hover h-12 animate-pulse rounded"
              />
            ))}
          </div>
        ) : (
          <DataTable<ReferralCode>
            columns={columns}
            data={codes}
            renderRow={renderRow}
            emptyTitle="Chưa có mã giới thiệu nào"
            emptyDescription="Tạo mã giới thiệu đầu tiên để bắt đầu theo dõi đối tác"
          />
        )}

        {/* Footer */}
        <div className="border-surface-border text-faint border-t px-6 py-3 text-xs">
          Tổng cộng {codes.length} mã giới thiệu
        </div>
      </div>
    </div>
  );
}
